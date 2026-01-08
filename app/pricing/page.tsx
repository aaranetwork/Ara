import PricingTable from "@/components/PricingTable";
import TrialSelector from "@/components/TrialSelector";
import { detectRegionFromHeaders, getPricing } from "@/lib/getPricing";

export const dynamic = "force-dynamic";

export default async function PricingPage({ searchParams }: { searchParams: { userId?: string; email?: string } }) {
  const region = detectRegionFromHeaders(headers());
  const pricing = getPricing(region);
  const userId = searchParams.userId || "";
  const email = searchParams.email || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0C10] to-[#1C1E24]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-bold text-white">Choose your AARA Care plan</h1>
        <p className="mb-6 text-gray-300">Geo pricing applied automatically.</p>

      {userId && email ? (
        <PricingTable userId={userId} email={email} region={region} prices={{ plus: { displayPrice: pricing.plans.plus.displayPrice }, pro: { displayPrice: pricing.plans.pro.displayPrice } }} />
      ) : (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Sign in to upgrade. For testing, pass <code>?userId=...&email=...</code> in the URL.
        </div>
      )}

      {/* Trial selection can also be shown here for first-time users */}
      {userId && (
        <div className="mt-10">
          <TrialSelector userId={userId} open={false} />
        </div>
      )}
      </div>
    </div>
  );
}

function headers() {
  return (global as any).headers?.() || new Headers();
}


