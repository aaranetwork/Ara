import { NextResponse } from "next/server";
import { db as adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, tier } = await req.json();
    if (!userId || (tier !== "plus" && tier !== "pro")) {
      return NextResponse.json({ error: "Missing userId or invalid tier" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const userRef = (adminDb as any).collection("users").doc(userId);
    const snap = await userRef.get();
    const now = Date.now();

    if (!snap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = snap.data() || {};
    if (data.trialExpiry && data.trialExpiry > now) {
      return NextResponse.json({ success: true, trialEnds: data.trialExpiry });
    }

    const trialEnds = now + 3 * 24 * 60 * 60 * 1000;
    const plan = tier === "plus" ? "trial_plus" : "trial_pro";

    await userRef.set({
      plan,
      trialExpiry: trialEnds,
      trialTier: tier,
    }, { merge: true });

    return NextResponse.json({ success: true, trialEnds });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}


