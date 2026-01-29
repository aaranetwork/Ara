import PricingTable from "@/components/PricingTable";
import TrialSelector from "@/components/TrialSelector";
import { detectRegionFromHeaders, getPricing } from "@/lib/getPricing";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export const dynamic = "force-dynamic";

export default async function PricingPage({ searchParams }: { searchParams: { userId?: string; email?: string } }) {
  const region = detectRegionFromHeaders(headers());
  const pricing = getPricing(region);
  const userId = searchParams.userId || "";
  const email = searchParams.email || "";

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 bg-[#030305]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2 opacity-50">
            <Image src="/aara-logo.png" alt="AARA Prep" width={24} height={24} className="rounded-md" />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-4">Invest in your Mind</h1>
          <p className="text-white/50">Geo-localized pricing applied for {region}.</p>
        </div>

        {userId && email ? (
          <PricingTable userId={userId} email={email} region={region} prices={{ plus: { displayPrice: pricing.plans.plus.displayPrice }, pro: { displayPrice: pricing.plans.pro.displayPrice } }} />
        ) : (
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-6 text-sm text-indigo-300 max-w-2xl mx-auto text-center backdrop-blur-md">
            <p className="font-semibold mb-2">Sign in Required</p>
            To view personalized upgrades, please sign in. For testing: pass <code>?userId=...&email=...</code> in the URL.
          </div>
        )}

        {/* Trial selection */}
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
