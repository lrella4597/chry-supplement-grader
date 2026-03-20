"use client";

import { useState } from "react";
import type { ParsedSupplement, ParsedIngredient } from "@/lib/scoring-engine";

export function ManualCorrection({
  parsed,
  onConfirm,
  onBack,
}: {
  parsed: ParsedSupplement;
  onConfirm: (corrected: ParsedSupplement) => void;
  onBack: () => void;
}) {
  const [ingredients, setIngredients] = useState<ParsedIngredient[]>(
    parsed.ingredients
  );
  const [otherIngredients, setOtherIngredients] = useState(
    parsed.other_ingredients.join(", ")
  );
  const [productName, setProductName] = useState(parsed.product_name || "");

  function updateIngredient(
    index: number,
    field: keyof ParsedIngredient,
    value: string | number | boolean | null
  ) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function addIngredient() {
    setIngredients((prev) => [
      ...prev,
      {
        name: "",
        dose: 0,
        unit: "mg",
        form: null,
        is_proprietary_blend: false,
        proprietary_blend_name: null,
      },
    ]);
  }

  function handleConfirm() {
    const corrected: ParsedSupplement = {
      ...parsed,
      product_name: productName || null,
      ingredients,
      other_ingredients: otherIngredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onConfirm(corrected);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">Review Extracted Data</h2>
        <button
          onClick={onBack}
          className="text-sm text-navy/50 hover:text-cherry"
        >
          ← Back
        </button>
      </div>

      <p className="text-sm text-navy/50">
        We parsed your supplement label. Please review and correct any errors
        before scoring.
      </p>

      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cherry/30"
          placeholder="e.g., AG1 Athletic Greens"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Active Ingredients</label>
          <button
            onClick={addIngredient}
            className="text-xs text-cherry font-semibold hover:underline"
          >
            + Add ingredient
          </button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div
              key={i}
              className="flex gap-2 items-center bg-white border border-cream-dark rounded-lg p-2"
            >
              <input
                type="text"
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
                className="flex-1 text-sm px-2 py-1 border border-cream-dark rounded focus:outline-none focus:ring-1 focus:ring-cherry/30"
                placeholder="Ingredient name"
              />
              <input
                type="number"
                value={ing.dose || ""}
                onChange={(e) =>
                  updateIngredient(i, "dose", parseFloat(e.target.value) || 0)
                }
                className="w-20 text-sm px-2 py-1 border border-cream-dark rounded focus:outline-none focus:ring-1 focus:ring-cherry/30"
                placeholder="Dose"
              />
              <select
                value={ing.unit}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                className="text-sm px-2 py-1 border border-cream-dark rounded bg-white focus:outline-none"
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="g">g</option>
                <option value="IU">IU</option>
              </select>
              <input
                type="text"
                value={ing.form || ""}
                onChange={(e) =>
                  updateIngredient(i, "form", e.target.value || null)
                }
                className="w-32 text-sm px-2 py-1 border border-cream-dark rounded focus:outline-none focus:ring-1 focus:ring-cherry/30"
                placeholder="Form (optional)"
              />
              <button
                onClick={() => removeIngredient(i)}
                className="text-red-400 hover:text-red-600 text-sm px-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Other / Inactive Ingredients
        </label>
        <textarea
          value={otherIngredients}
          onChange={(e) => setOtherIngredients(e.target.value)}
          className="w-full border border-cream-dark rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cherry/30"
          rows={2}
          placeholder="Comma-separated: silicon dioxide, natural flavors, ..."
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleConfirm}
          className="flex-1 bg-cherry text-white font-semibold py-3 rounded-full hover:bg-cherry-dark transition-colors"
        >
          Score This Supplement
        </button>
      </div>
    </div>
  );
}
