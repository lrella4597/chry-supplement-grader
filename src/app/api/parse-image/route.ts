import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a supplement facts panel parser. Extract all ingredients, their doses, units, and forms from this Supplement Facts image. Return ONLY valid JSON with no other text. Format:

{
  "product_name": "string or null if not visible",
  "serving_size": "string",
  "servings_per_container": "number or null",
  "ingredients": [
    {
      "name": "exact name as printed",
      "dose": number,
      "unit": "mg" or "mcg" or "g" or "IU",
      "form": "specific form if listed (e.g., 'as magnesium glycinate') or null",
      "is_proprietary_blend": false,
      "proprietary_blend_name": null
    }
  ],
  "other_ingredients": ["list of inactive/other ingredients as printed"],
  "contains_proprietary_blend": false
}

If a proprietary blend is present, list the blend total weight and each ingredient within it. Mark is_proprietary_blend: true for ingredients inside blends where individual doses are hidden.

Be precise with numbers. If a dose says "500 mg" extract 500 with unit "mg". If it says "5g" extract 5000 with unit "mg" for consistency.

For magnesium, if the label says something like "Magnesium (as Magnesium Glycinate) 200mg", extract dose: 200, unit: "mg", form: "magnesium glycinate". The 200mg likely refers to elemental magnesium in this case.`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const mediaType = file.type as
      | "image/jpeg"
      | "image/png"
      | "image/gif"
      | "image/webp";

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: "Parse this supplement facts panel and return the structured JSON.",
            },
          ],
        },
      ],
      system: SYSTEM_PROMPT,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from AI" },
        { status: 500 }
      );
    }

    // Extract JSON from the response (handle markdown code blocks or mixed text)
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
      return NextResponse.json(
        { error: "Could not read the supplement label. Try a clearer photo with the full Supplement Facts panel visible." },
        { status: 400 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Parse image error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to parse image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
