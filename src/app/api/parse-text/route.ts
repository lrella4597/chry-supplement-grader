import { NextRequest } from "next/server";
import { corsOptions, corsJson } from "@/lib/cors";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a supplement facts parser. Given the visible text content of a supplement product webpage, find and extract the Supplement Facts panel data. Return ONLY valid JSON with no other text. Format:

{
  "product_name": "string or null",
  "serving_size": "string",
  "servings_per_container": "number or null",
  "ingredients": [
    {
      "name": "exact name as printed",
      "dose": number,
      "unit": "mg" or "mcg" or "g" or "IU",
      "form": "specific form if listed or null",
      "is_proprietary_blend": false,
      "proprietary_blend_name": null
    }
  ],
  "other_ingredients": ["list of inactive/other ingredients"],
  "contains_proprietary_blend": false
}

Be precise with numbers. Convert grams to mg (multiply by 1000). If a dose says "500mcg" extract dose: 0.5, unit: "mg" OR dose: 500, unit: "mcg".
For magnesium, if the label says something like "Magnesium (as Magnesium Glycinate) 200mg", extract dose: 200, unit: "mg", form: "magnesium glycinate".
If no supplement facts data is found, return: {"error": "No supplement facts found"}`;

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return corsJson(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return corsJson(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Trim to reasonable size
    const trimmedText = text.slice(0, 12000);

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Extract the supplement facts from this page text:\n\n${trimmedText}`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return corsJson(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    let jsonStr = textBlock.text.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    } else {
      const braceMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        jsonStr = braceMatch[0];
      }
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      return corsJson(
        { error: "Could not extract supplement facts from the page text." },
        { status: 400 }
      );
    }

    if (parsed.error) {
      return corsJson({ error: parsed.error }, { status: 400 });
    }

    return corsJson(parsed);
  } catch (error: unknown) {
    console.error("Parse text error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to parse text";
    return corsJson({ error: message }, { status: 500 });
  }
}
