import { db as adminDb } from "@/lib/firebaseAdmin";

type RequiredPlan = "plus" | "pro";

export async function verifyPlan(userId: string, requiredPlan: RequiredPlan): Promise<boolean> {
  if (!adminDb) return false;
  const doc = await (adminDb as any).collection("users").doc(userId).get();
  if (!doc.exists) return false;
  const data = doc.data() || {} as any;

  const now = Date.now();

  // Trial access logic: allow if trial not expired
  if (typeof data.trialExpiry === "number" && data.trialExpiry > now) {
    // trial_plus or trial_pro both count as at least plus; trial_pro also for pro
    if (requiredPlan === "plus") return true;
    if (requiredPlan === "pro") return data.plan === "trial_pro";
  }

  // Paid plan check
  const isValid = typeof data.planExpiry === "number" && data.planExpiry > now;
  if (!isValid) return false;

  if (requiredPlan === "plus") {
    return ["plus", "pro"].includes(data.plan);
  }
  if (requiredPlan === "pro") {
    return data.plan === "pro";
  }
  return false;
}


