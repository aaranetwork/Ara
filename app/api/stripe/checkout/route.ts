import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getPricing, detectRegionFromHeaders } from "@/lib/getPricing";
import { db as adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const { userId, email, plan, region } = await req.json();
    if (!userId || !email || (plan !== "plus" && plan !== "pro")) {
      return NextResponse.json({ error: "Missing userId/email or invalid plan" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const detectedRegion = (region as any) || detectRegionFromHeaders(req.headers);
    const pricing = getPricing(detectedRegion);
    const priceId = (pricing.plans as any)[plan].priceId;
    if (!priceId) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    const userRef = (adminDb as any).collection("users").doc(userId);
    const snap = await userRef.get();
    const user = snap.data() || {} as any;

    const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: user.customerId || undefined,
      customer_email: user.customerId ? undefined : email,
      line_items: [{ price: priceId as string, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId, plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}


