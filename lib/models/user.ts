export type AaraPlan = "trial_plus" | "trial_pro" | "plus" | "pro";

export interface AaraUserProfile {
  displayName?: string;
  occupation?: string;
  interests?: string[];
  notes?: string[];
  lastSeen?: number; // ms epoch
}

export interface AaraUser {
  name: string;
  email: string;
  plan: AaraPlan;
  planExpiry: number; // ms epoch
  trialExpiry: number; // ms epoch
  createdAt: number; // ms epoch
  trialTier?: "plus" | "pro";
  customerId?: string; // Stripe customer
  subscriptionId?: string; // Stripe subscription id
  // AARA profile data
  profile?: AaraUserProfile;
}
