"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { ParsedSupplement, GradeResult } from "@/lib/scoring-engine";
import { ManualCorrection } from "@/components/ManualCorrection";
import { ResultsDisplay } from "@/components/ResultsDisplay";

export default function GradePageWrapper() {
  return (
    <Suspense>
      <GradePage />
    </Suspense>
  );
}

type Step = "input" | "loading" | "review" | "results";

const LOADING_MESSAGES = [
  "Reading your label...",
  "Identifying ingredients and doses...",
  "Checking against clinical research...",
  "Evaluating form quality...",
  "Looking for red flags...",
  "Calculating synergies...",
  "Generating your grade...",
];

function GradePage() {
  const [step, setStep] = useState<Step>("input");
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedSupplement | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [url, setUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const searchParams = useSearchParams();

  // Auto-submit if ?url= param is present (from Chrome extension)
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !autoSubmitted) {
      setAutoSubmitted(true);
      setUrl(urlParam);
      // Trigger the URL submit flow
      (async () => {
        setStep("loading");
        setError(null);
        let idx = 0;
        const interval = setInterval(() => {
          idx = (idx + 1) % LOADING_MESSAGES.length;
          setLoadingMsg(LOADING_MESSAGES[idx]);
        }, 1800);
        try {
          const res = await fetch("/api/parse-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: urlParam }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to parse URL");
          setParsed(data);
          setStep("review");
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Something went wrong");
          setStep("input");
        } finally {
          clearInterval(interval);
        }
      })();
    }
  }, [searchParams, autoSubmitted]);

  const rotateLoadingMessages = useCallback(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[idx]);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  async function handleImageUpload(file: File) {
    setStep("loading");
    setError(null);
    const stopRotation = rotateLoadingMessages();
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/parse-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to parse image");
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
      if (!res.ok) throw new Error(data.error || "Failed to parse URL");
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
      if (!res.ok) throw new Error(data.error || "Failed to grade");
      setResult(data);
      setStep("results");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("review");
    }
  }

  function handleReset() {
    setStep("input");
    setError(null);
    setParsed(null);
    setResult(null);
    setUrl("");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleImageUpload(file);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {step === "input" && (
        <div className="space-y-6 animate-fade-up">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-3">
              <span className="text-text">Grade Your </span>
              <span className="text-dog">Supplement</span>
            </h1>
            <p className="text-text-muted">Upload a label photo or paste a product URL. We&apos;ll do the rest.</p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}

          {/* Photo upload */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-dog/8 flex items-center justify-center">
                <svg className="w-4 h-4 text-dog" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-text">Scan Your Label</h3>
                <p className="text-xs text-text-muted">Upload a photo of your Supplement Facts panel</p>
              </div>
            </div>
            <label
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input type="file" accept="image/*" capture="environment" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file); }} className="hidden" />
              <div className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragActive ? "border-dog bg-dog/5" : "border-border hover:border-dog/30"}`}>
                <svg className="w-8 h-8 mx-auto mb-3 text-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm text-text-muted mb-1">Drag & drop your label image, or tap to upload</p>
                <p className="text-xs text-text-dim">Supports JPG, PNG, HEIC</p>
              </div>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border-light" />
            <span className="text-xs text-text-dim uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border-light" />
          </div>

          {/* URL input */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-dog/8 flex items-center justify-center">
                <svg className="w-4 h-4 text-dog" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-text">Paste a URL</h3>
                <p className="text-xs text-text-muted">Amazon product page or brand website</p>
              </div>
            </div>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://amazon.com/dp/..."
                className="flex-1 border border-border rounded-xl px-4 py-3 text-sm bg-cream-light text-text focus:outline-none focus:ring-2 focus:ring-dog/30 placeholder:text-text-dim"
              />
              <button type="submit" className="bg-dog text-white font-semibold px-6 py-3 rounded-xl hover:bg-dog-bright transition-colors text-sm">Grade</button>
            </form>
          </div>

          <div className="text-center pt-4">
            <a href="/supplements" className="text-dog font-semibold text-sm hover:text-dog-bright transition-colors">Browse Popular Supplements</a>
          </div>
        </div>
      )}

      {step === "loading" && (
        <div className="text-center py-24 space-y-8 animate-fade-up">
          <div className="w-16 h-16 mx-auto rounded-full border-2 border-cream-dark border-t-dog animate-spin" />
          <div>
            <p className="text-lg text-text font-medium">{loadingMsg}</p>
            <p className="text-xs text-text-dim mt-2">This usually takes 5-10 seconds</p>
          </div>
        </div>
      )}

      {step === "review" && parsed && (
        <ManualCorrection parsed={parsed} onConfirm={handleScore} onBack={handleReset} />
      )}

      {step === "results" && result && (
        <div className="space-y-4 animate-fade-up">
          <button onClick={handleReset} className="text-sm text-text-muted hover:text-dog transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Grade another supplement
          </button>
          <ResultsDisplay result={result} />
        </div>
      )}
    </div>
  );
}
