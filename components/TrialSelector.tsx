"use client";
import { useState } from "react";

type Props = { userId: string; open: boolean; onClose?: () => void; onStarted?: (trialEnds: number) => void };

export default function TrialSelector({ userId, open, onClose, onStarted }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  if (!open) return null;

  const start = async (tier: "plus" | "pro") => {
    try {
      setLoading(tier);
      const res = await fetch("/api/auth/startTrial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tier }),
      });
      const data = await res.json();
      if (res.ok) {
        onStarted?.(data.trialEnds);
        onClose?.();
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-xl font-semibold">Start your 3-day AARA Care trial</h3>
        <p className="mb-4 text-sm text-gray-600">Choose your tier. You can upgrade later.</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => start("plus")}
            disabled={loading !== null}
            className="rounded-lg border border-gray-300 px-4 py-3 text-left hover:border-gray-400"
          >
            <div className="font-medium">Plus</div>
            <div className="text-sm text-gray-600">GPT-5 mini, Haiku, Gemini Flash</div>
          </button>
          <button
            onClick={() => start("pro")}
            disabled={loading !== null}
            className="rounded-lg border border-indigo-500 px-4 py-3 text-left hover:border-indigo-600"
          >
            <div className="font-medium">Pro</div>
            <div className="text-sm text-gray-600">GPT-5, Opus, Gemini Pro</div>
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-800">Not now</button>
        </div>
      </div>
    </div>
  );
}


