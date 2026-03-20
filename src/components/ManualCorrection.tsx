"use client";

import { useState } from "react";
import type { ParsedSupplement, ParsedIngredient } from "@/lib/scoring-engine";

export function ManualCorrection({
  parsed, onConfirm, onBack,
}: {
  parsed: ParsedSupplement;
  onConfirm: (corrected: ParsedSupplement) => void;
  onBack: () => void;
}) {
  const [ingredients, setIngredients] = useState<ParsedIngredient[]>(parsed.ingredients);
  const [otherIngredients, setOtherIngredients] = useState(parsed.other_ingredients.join(", "));
  const [productName, setProductName] = useState(parsed.product_name || "");

  function updateIngredient(index: number, field: keyof ParsedIngredient, value: string | number | boolean | null) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { name: "", dose: 0, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null }]);
  }

  function handleConfirm() {
    onConfirm({
      ...parsed,
      product_name: productName || null,
      ingredients,
      other_ingredients: otherIngredients.split(",").map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-text">Review Extracted Data</h2>
        <button onClick={onBack} className="text-sm text-text-muted hover:text-dog transition-colors">Back</button>
      </div>

      <div className="rounded-xl border border-dog/20 bg-dog/5 p-4">
        <p className="text-sm text-text-secondary">
          Our AI parsed your supplement label. Review the data below and correct any errors before scoring.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Product Name</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
          className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white text-text focus:outline-none focus:ring-2 focus:ring-dog/30"
          placeholder="e.g., AG1 Athletic Greens"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-text-secondary">Active Ingredients</label>
          <button onClick={addIngredient} className="text-xs text-dog font-semibold hover:text-dog-bright transition-colors">+ Add ingredient</button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-center border border-border rounded-xl bg-white p-3">
              <input type="text" value={ing.name} onChange={(e) => updateIngredient(i, "name", e.target.value)}
                className="flex-1 text-sm px-3 py-2 border border-border-light rounded-lg bg-cream-light text-text focus:outline-none focus:ring-1 focus:ring-dog/30" placeholder="Ingredient name"
              />
              <input type="number" value={ing.dose || ""} onChange={(e) => updateIngredient(i, "dose", parseFloat(e.target.value) || 0)}
                className="w-24 text-sm px-3 py-2 border border-border-light rounded-lg bg-cream-light text-text focus:outline-none focus:ring-1 focus:ring-dog/30" placeholder="Dose"
              />
              <select value={ing.unit || "mg"} onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                className="text-sm px-3 py-2 border border-border-light rounded-lg bg-cream-light text-text focus:outline-none"
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="g">g</option>
                <option value="IU">IU</option>
              </select>
              <input type="text" value={ing.form || ""} onChange={(e) => updateIngredient(i, "form", e.target.value || null)}
                className="w-36 text-sm px-3 py-2 border border-border-light rounded-lg bg-cream-light text-text focus:outline-none focus:ring-1 focus:ring-dog/30" placeholder="Form (optional)"
              />
              <button onClick={() => removeIngredient(i)} className="text-red-400 hover:text-red-600 text-lg px-2 transition-colors">x</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Other / Inactive Ingredients</label>
        <textarea value={otherIngredients} onChange={(e) => setOtherIngredients(e.target.value)}
          className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white text-text focus:outline-none focus:ring-2 focus:ring-dog/30"
          rows={2} placeholder="Comma-separated: silicon dioxide, natural flavors, ..."
        />
      </div>

      <button onClick={handleConfirm} className="w-full bg-dog text-white font-bold py-4 rounded-full hover:bg-dog-bright transition-colors">
        Score This Supplement
      </button>
    </div>
  );
}
