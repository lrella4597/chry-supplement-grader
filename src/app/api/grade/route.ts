import { NextRequest } from "next/server";
import { corsOptions, corsJson } from "@/lib/cors";
import { gradeSupplement } from "@/lib/scoring-engine";
import type { ParsedSupplement } from "@/lib/scoring-engine";

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(request: NextRequest) {
  try {
    const body: ParsedSupplement = await request.json();

    if (!body.ingredients || !Array.isArray(body.ingredients)) {
      return corsJson({ error: "Invalid supplement data" }, { status: 400 });
    }

    const result = gradeSupplement(body);
    return corsJson(result);
  } catch (error: unknown) {
    console.error("Grade error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to grade supplement";
    return corsJson({ error: message }, { status: 500 });
  }
}
