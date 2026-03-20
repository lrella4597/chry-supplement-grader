import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a supplement facts parser. Given the text content of a supplement product webpage, find and extract the Supplement Facts panel data. Return ONLY valid JSON with no other text. Format:

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

Be precise with numbers. Convert grams to mg (multiply by 1000). If no supplement facts data is found on the page, return: {"error": "No supplement facts found on this page"}`;

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Only allow http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "Invalid URL protocol" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Fetch the page content
    const pageResponse = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SupplementGrader/1.0; +https://drinkchry.com)",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!pageResponse.ok) {
      return NextResponse.json(
        { error: `Could not fetch URL (status ${pageResponse.status})` },
        { status: 400 }
      );
    }

    const html = await pageResponse.text();

    // Strip HTML tags to get text content, keep it under ~8000 chars for efficiency
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Extract the supplement facts from this product page text:\n\n${textContent}`,
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

    let jsonStr = textBlock.text.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("Parse URL error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to parse URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
