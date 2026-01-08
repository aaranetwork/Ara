"use client";
import { useState } from "react";

type Props = { userId: string; email: string; region?: "IN" | "US" | "EU"; prices: { plus: { displayPrice: string }; pro: { displayPrice: string } } };

export default function PricingTable({ userId, email, region, prices }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const upgrade = async (plan: "plus" | "pro") => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, plan, region }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border p-5">
        <h4 className="text-lg font-semibold">Trial</h4>
        <p className="mt-1 text-sm text-gray-600">3-Day AARA Care</p>
        <ul className="mt-3 text-sm text-gray-700 space-y-1">
          <li>✅ AARA AI Chat</li>
          <li>✅ Voice Mode</li>
          <li>✅ Journals & Mood</li>
          <li>✅ Discover Feed</li>
          <li>✅ Emotional Insights</li>
          <li>❌ Therapist Booking</li>
          <li>Support: Standard</li>
        </ul>
        <div className="mt-4 text-sm font-medium">Free (3-Day Trial)</div>
      </div>

      <div className="rounded-xl border p-5">
        <h4 className="text-lg font-semibold">Plus</h4>
        <p className="mt-1 text-sm text-gray-600">Essential AARA Care</p>
        <ul className="mt-3 text-sm text-gray-700 space-y-1">
          <li>✅ AARA AI Chat</li>
          <li>✅ Voice Mode</li>
          <li>✅ Journals & Mood</li>
          <li>✅ Discover Feed</li>
          <li>✅ Emotional Insights</li>
          <li>✅ Therapist Booking</li>
          <li>Support: Premium</li>
        </ul>
        <div className="mt-4 text-sm font-medium">{prices.plus.displayPrice}</div>
        <button onClick={() => upgrade("plus")} disabled={!!loading}
          className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">{loading === "plus" ? "Redirecting..." : "Upgrade to Plus"}</button>
      </div>

      <div className="rounded-xl border p-5">
        <h4 className="text-lg font-semibold">Pro</h4>
        <p className="mt-1 text-sm text-gray-600">Advanced AARA Insight</p>
        <ul className="mt-3 text-sm text-gray-700 space-y-1">
          <li>✅ AARA AI Chat (deeper)</li>
          <li>✅ Voice Mode (HD)</li>
          <li>✅ Journals & Mood (Advanced)</li>
          <li>✅ Discover Feed</li>
          <li>✅ Emotional Insights (Advanced)</li>
          <li>✅ Therapist Booking (priority)</li>
          <li>Support: Priority 24/7</li>
        </ul>
        <div className="mt-4 text-sm font-medium">{prices.pro.displayPrice}</div>
        <button onClick={() => upgrade("pro")} disabled={!!loading}
          className="mt-3 w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">{loading === "pro" ? "Redirecting..." : "Upgrade to Pro"}</button>
      </div>
    </div>
  );
}


