import { NextRequest, NextResponse } from "next/server";
import { gradeSupplement } from "@/lib/scoring-engine";
import type { ParsedSupplement } from "@/lib/scoring-engine";

export async function POST(request: NextRequest) {
  try {
    const body: ParsedSupplement = await request.json();

    if (!body.ingredients || !Array.isArray(body.ingredients)) {
      return NextResponse.json(
        { error: "Invalid supplement data" },
        { status: 400 }
      );
    }

    const result = gradeSupplement(body);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Grade error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to grade supplement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
