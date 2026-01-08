import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db as adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  if (!adminDb) {
    return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = (session.metadata as any)?.userId;
        const plan = (session.metadata as any)?.plan as "plus" | "pro";
        const customerId = (session.customer as string) || session.customer?.toString();
        const subscriptionId = (session.subscription as string) || session.subscription?.toString();
        if (userId && plan) {
          const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
          await (adminDb as any).collection("users").doc(userId).set({
            plan,
            planExpiry: expiry,
            customerId: customerId,
            subscriptionId: subscriptionId,
          }, { merge: true });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const priceId = (sub.items.data[0]?.price?.id) as string | undefined;
        const plan = matchPlanFromPriceId(priceId);
        const periodEnd = (sub.current_period_end || 0) * 1000;
        const userId = await findUserIdByCustomer(customerId);
        if (userId) {
          await (adminDb as any).collection("users").doc(userId).set({
            plan: plan || (sub.items.data.length > 0 ? undefined : undefined),
            planExpiry: periodEnd || Date.now(),
            customerId,
            subscriptionId: sub.id,
          }, { merge: true });
        }
        break;
      }
      case "invoice.payment_failed": {
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Handler error" }, { status: 500 });
  }
}

function matchPlanFromPriceId(priceId?: string): "plus" | "pro" | undefined {
  if (!priceId) return undefined;
  const envMap: Record<string, "plus" | "pro"> = {};
  const pairs: Array<[string | undefined, "plus" | "pro"]> = [
    [process.env.STRIPE_PRICE_PLUS_USD, "plus"],
    [process.env.STRIPE_PRICE_PRO_USD, "pro"],
    [process.env.STRIPE_PRICE_PLUS_INR, "plus"],
    [process.env.STRIPE_PRICE_PRO_INR, "pro"],
    [process.env.STRIPE_PRICE_PLUS_EUR, "plus"],
    [process.env.STRIPE_PRICE_PRO_EUR, "pro"],
  ];
  for (const [pid, label] of pairs) {
    if (pid) envMap[pid] = label;
  }
  return envMap[priceId];
}

async function findUserIdByCustomer(customerId: string): Promise<string | undefined> {
  const q = await (adminDb as any).collection("users").where("customerId", "==", customerId).limit(1).get();
  if (q.empty) return undefined;
  return q.docs[0].id;
}


