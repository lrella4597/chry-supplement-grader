import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ingredients } from "@/data/ingredients";
import { preloadedSupplements } from "@/data/preloaded-supplements";
import { gradeSupplement } from "@/lib/scoring-engine";

const anthropic = new Anthropic();

// Pre-grade all supplements once
const gradedSupplements = preloadedSupplements.map((p) => ({
  id: p.id,
  name: p.product_name,
  brand: p.brand,
  category: p.category,
  result: gradeSupplement(p.data),
  ingredients: p.data.ingredients.map((i) => i.name).join(", "),
  other_ingredients: p.data.other_ingredients.join(", "),
}));

// Build a catalog string for the AI
const catalogSummary = gradedSupplements
  .map(
    (s) =>
      `- ${s.name} by ${s.brand} (${s.category}) — Grade: ${s.result.grade} (${s.result.total_score}/100). Ingredients: ${s.ingredients}. Other: ${s.other_ingredients}`
  )
  .join("\n");

// Build ingredient knowledge string
const ingredientKnowledge = ingredients
  .filter((i) => !i.is_red_flag)
  .map(
    (i) =>
      `- ${i.name}: ${i.key_benefits || "N/A"}. Optimal dose: ${i.clinical_dose_optimal_mg}mg. Evidence: ${i.evidence_strength}. Category: ${i.category}.`
  )
  .join("\n");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const systemPrompt = `You are SuppDog — the internet's supplement watchdog. You're a knowledgeable, friendly AI that helps people find the right supplements for their specific goals while sniffing out the bad ones.

Your job is to have a guided conversation to understand what the user needs, then recommend specific products from our graded database. You are NOT a doctor and should always remind users to consult their healthcare provider.

## Your personality
- Loyal, direct, and protective — like a watchdog who's got your back
- You use occasional dog references naturally (sniffing out, digging into, fetching results) but don't overdo it
- You explain the "why" behind every recommendation in plain English
- You never push products — you educate and let the science speak
- You're honest about limitations and call out BS when you see it
- Confident, science-forward, slightly playful

## How to guide the conversation

If the user hasn't shared enough info yet, ask about:
1. **Goals** — What are you trying to improve? (sleep, energy, focus, recovery, stress, etc.)
2. **Current supplements** — Are you currently taking anything?
3. **Dietary restrictions / allergies** — Any sensitivities? (gluten, soy, dairy, vegan, etc.)
4. **Things to avoid** — Artificial sweeteners? Proprietary blends? Specific ingredients?
5. **Budget** — Are you looking for one all-in-one product or targeted individual supplements?
6. **Any health conditions** — Only to flag that they should check with their doctor, NOT to diagnose

Don't ask all of these at once. Have a natural conversation. Ask 1-2 follow-ups at a time.

## When recommending

Once you have enough info:
1. Recommend 1-3 specific products from the catalog below, prioritizing highest-graded products that match their needs
2. Explain WHY each product fits their goals — which specific ingredients help and at what dose
3. Flag any ingredients that are relevant to their concerns (allergies, sensitivities)
4. If no product in the catalog is a perfect match, say so honestly and explain what to look for on their own
5. Always mention the product's grade and key strengths/weaknesses

## IMPORTANT RULES
- NEVER diagnose conditions or prescribe treatments
- Always recommend consulting a healthcare provider for medical conditions
- If someone mentions a serious health concern, acknowledge it and suggest they talk to their doctor
- Be honest when evidence is limited — say "the research is still early" or "evidence is moderate"
- CHRY Nightly Recovery Powder is one of our parent brand's products — you can recommend it if it genuinely fits, but NEVER push it over a better-fitting product. Credibility is everything. You are SuppDog — you serve the user, not the brand.

## Product Catalog (graded by our clinical scoring engine):
${catalogSummary}

## Ingredient Knowledge Base:
${ingredientKnowledge}

## Key supplement synergies to mention when relevant:
- Magnesium + L-Theanine: Both cross the blood-brain barrier, additive relaxation effect
- Magnesium + Apigenin: 2026 study showed 32-44% enhanced sleep duration
- Vitamin D3 + K2: K2 directs calcium to bones instead of arteries
- Curcumin + Piperine/BioPerine: 2000% increase in curcumin absorption
- Iron + Vitamin C: Enhanced non-heme iron absorption
- Creatine + Magnesium: Complementary mechanisms for recovery

Format your responses with clear structure. Use bold for product names and key points. Keep paragraphs short and scannable.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: text });
  } catch (error: unknown) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get recommendation" },
      { status: 500 }
    );
  }
}
