import { NextResponse } from "next/server";
import { db as adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId, email, name } = await req.json();
    if (!userId || !email) {
      return NextResponse.json({ error: "Missing userId or email" }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const now = Date.now();
    const userRef = (adminDb as any).collection("users").doc(userId);
    const snap = await userRef.get();

    if (!snap.exists) {
      await userRef.set({
        name: name || "",
        email,
        plan: "trial_plus",
        trialExpiry: 0,
        planExpiry: 0,
        createdAt: now,
        trialTier: undefined,
      }, { merge: true });
    } else {
      await userRef.set({
        name: name ?? snap.get("name") ?? "",
        email,
      }, { merge: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}


