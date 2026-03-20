"use client";

import { useState, useCallback } from "react";
import type { ParsedSupplement, GradeResult } from "@/lib/scoring-engine";
import { ManualCorrection } from "@/components/ManualCorrection";
import { ResultsDisplay } from "@/components/ResultsDisplay";

type Step = "input" | "loading" | "review" | "results";
type Method = "photo" | "url" | null;

const LOADING_MESSAGES = [
  "Reading your label...",
  "Checking clinical doses...",
  "Looking for red flags...",
  "Calculating your grade...",
];

export default function GradePage() {
  const [step, setStep] = useState<Step>("input");
  const [method, setMethod] = useState<Method>(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedSupplement | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);

  // URL input state
  const [url, setUrl] = useState("");

  const rotateLoadingMessages = useCallback(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[idx]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMethod("photo");
    setStep("loading");
    setError(null);
    const stopRotation = rotateLoadingMessages();

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/parse-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse image");
      }

      setParsed(data);
      setStep("review");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    } finally {
      stopRotation();
    }
  }

  async function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setMethod("url");
    setStep("loading");
    setError(null);
    const stopRotation = rotateLoadingMessages();

    try {
      const res = await fetch("/api/parse-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to parse URL");
      }

      setParsed(data);
      setStep("review");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    } finally {
      stopRotation();
    }
  }

  async function handleScore(corrected: ParsedSupplement) {
    setStep("loading");
    setLoadingMsg("Calculating your grade...");

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corrected),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to grade");
      }

      setResult(data);
      setStep("results");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("review");
    }
  }

  function handleReset() {
    setStep("input");
    setMethod(null);
    setError(null);
    setParsed(null);
    setResult(null);
    setUrl("");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {step === "input" && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Grade Your Supplement
            </h1>
            <p className="text-navy/60">
              Find out if your supplement is clinically dosed or{" "}
              <span className="text-cherry font-semibold">fairy dusted</span>.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Photo upload */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-1 flex items-center gap-2">
              <span className="text-xl">📸</span> Scan Your Label
            </h3>
            <p className="text-sm text-navy/50 mb-4">
              Upload a photo of your Supplement Facts panel
            </p>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-cream-dark rounded-xl p-8 text-center cursor-pointer hover:border-cherry/30 transition-colors">
                <p className="text-sm text-navy/50">
                  Tap to upload or take a photo
                </p>
              </div>
            </label>
          </div>

          {/* URL input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold mb-1 flex items-center gap-2">
              <span className="text-xl">🔗</span> Paste a URL
            </h3>
            <p className="text-sm text-navy/50 mb-4">
              Enter an Amazon or brand website link
            </p>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://amazon.com/dp/..."
                className="flex-1 border border-cream-dark rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cherry/30"
              />
              <button
                type="submit"
                className="bg-cherry text-white font-semibold px-6 py-2 rounded-lg hover:bg-cherry-dark transition-colors text-sm"
              >
                Grade
              </button>
            </form>
          </div>

          {/* Popular supplements link */}
          <div className="text-center">
            <a
              href="/supplements"
              className="text-cherry font-semibold text-sm hover:underline"
            >
              🔍 Browse Popular Supplements →
            </a>
          </div>

          <p className="text-xs text-navy/40 text-center max-w-md mx-auto">
            Scoring criteria developed with clinical research from Examine.com,
            NIH, and PubMed — reviewed by a board-certified physician.
          </p>
        </div>
      )}

      {step === "loading" && (
        <div className="text-center py-20 space-y-6">
          <div className="inline-block animate-spin text-4xl">🍒</div>
          <p className="text-lg text-navy/60 animate-pulse">{loadingMsg}</p>
        </div>
      )}

      {step === "review" && parsed && (
        <ManualCorrection
          parsed={parsed}
          onConfirm={handleScore}
          onBack={handleReset}
        />
      )}

      {step === "results" && result && (
        <div className="space-y-4">
          <button
            onClick={handleReset}
            className="text-sm text-navy/50 hover:text-cherry"
          >
            ← Grade another supplement
          </button>
          <ResultsDisplay result={result} />
        </div>
      )}
    </div>
  );
}
