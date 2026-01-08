"use client";
import { useState } from "react";

type Props = { userId: string; email: string; region?: "IN" | "US" | "EU"; open: boolean; onClose?: () => void };

export default function PaywallModal({ userId, email, region, open, onClose }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-xl font-semibold">Your AARA trial has ended</h3>
        <p className="mb-5 text-sm text-gray-600">Unlock AARA Care to continue your therapy and progress journey.</p>
        <div className="flex gap-3">
          <button onClick={() => upgrade("plus")} disabled={!!loading}
            className="flex-1 rounded-lg border border-indigo-500 px-4 py-2 font-medium text-indigo-700 hover:bg-indigo-50">
            {loading === "plus" ? "Redirecting..." : "Upgrade to Plus"}
          </button>
          <button onClick={() => upgrade("pro")} disabled={!!loading}
            className="flex-1 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700">
            {loading === "pro" ? "Redirecting..." : "Upgrade to Pro"}
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">Maybe later</button>
        </div>
      </div>
    </div>
  );
}


