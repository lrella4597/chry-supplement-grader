import {
  ingredients,
  magnesiumConversionFactors,
  type Ingredient,
} from "@/data/ingredients";

// ─── Exported Types ──────────────────────────────────────────────────────────

export type { Ingredient };

export interface ParsedIngredient {
  name: string;
  dose: number;
  unit: string; // "mg", "mcg", "g", "IU"
  form: string | null;
  is_proprietary_blend: boolean;
  proprietary_blend_name: string | null;
}

export interface ParsedSupplement {
  product_name: string | null;
  serving_size: string;
  servings_per_container: number | null;
  ingredients: ParsedIngredient[];
  other_ingredients: string[];
  contains_proprietary_blend: boolean;
}

export interface IngredientScore {
  ingredient_name: string;
  database_match: Ingredient | null;
  dose_mg: number;
  clinical_optimal_mg: number;
  dose_percentage: number; // 0-100, how close to optimal
  score: number; // 0-100 after all adjustments
  evidence_weight: number;
  form_quality: "preferred" | "acceptable" | "inferior" | "unknown";
  form_penalty_applied: boolean;
  flags: string[];
  notes: string[];
}

export interface CategoryScores {
  clinical_dosing: { score: number; max: 50; details: IngredientScore[] };
  transparency: { score: number; max: 20; details: string[] };
  clean_label: {
    score: number;
    max: 20;
    penalties: Array<{ ingredient: string; penalty: number; reason: string }>;
  };
  formula_intelligence: {
    score: number;
    max: 10;
    bonuses: string[];
    penalties: string[];
  };
}

export interface GradeResult {
  product_name: string | null;
  total_score: number;
  grade: string;
  grade_color: string;
  grade_label: string;
  category_scores: CategoryScores;
  recognized_ingredients: IngredientScore[];
  unrecognized_ingredients: string[];
  red_flags: Array<{ name: string; penalty_type: string; reason: string }>;
  synergies: string[];
  summary: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EVIDENCE_WEIGHTS: Record<string, number> = {
  very_strong: 1.0,
  strong: 0.85,
  moderate: 0.7,
  weak: 0.5,
};

const CLEAN_LABEL_PENALTIES: Array<{
  pattern: RegExp;
  penalty: number;
  reason: string;
}> = [
  { pattern: /\bsucralose\b/i, penalty: 25, reason: "Artificial sweetener (sucralose)" },
  {
    pattern: /\bacesulfame\s*potassium\b/i,
    penalty: 25,
    reason: "Artificial sweetener (acesulfame potassium)",
  },
  { pattern: /\baspartame\b/i, penalty: 25, reason: "Artificial sweetener (aspartame)" },
  { pattern: /\bfd&c\b|fd&c|artificial\s*color/i, penalty: 20, reason: "Artificial color (FD&C)" },
  { pattern: /\btitanium\s*dioxide\b/i, penalty: 20, reason: "Titanium dioxide" },
  { pattern: /\bmaltodextrin\b/i, penalty: 15, reason: "Maltodextrin (filler)" },
  { pattern: /\bsilicon\s*dioxide\b/i, penalty: 5, reason: "Silicon dioxide (anti-caking agent)" },
  { pattern: /\bnatural\s*flavors?\b/i, penalty: 5, reason: "Natural flavors (undisclosed)" },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ─── 1. normalizeDose ────────────────────────────────────────────────────────

export function normalizeDose(dose: number, unit: string): number {
  const u = unit.toLowerCase().trim();
  switch (u) {
    case "g":
      return dose * 1000;
    case "mcg":
    case "ug":
    case "\u00b5g": // µg
      return dose * 0.001;
    case "iu":
      return dose; // keep as-is for vitamin D, etc.
    case "mg":
    default:
      return dose;
  }
}

// ─── 2. matchIngredient ──────────────────────────────────────────────────────

export function matchIngredient(
  name: string,
  form: string | null
): { ingredient: Ingredient | null; matchedAlias: string | null } {
  const input = name.toLowerCase().trim();

  if (!input) return { ingredient: null, matchedAlias: null };

  // 1) Exact match on ingredient name
  for (const ing of ingredients) {
    if (ing.name.toLowerCase() === input) {
      return { ingredient: ing, matchedAlias: null };
    }
  }

  // 2) Exact match on any alias
  for (const ing of ingredients) {
    for (const alias of ing.aliases) {
      if (alias.toLowerCase() === input) {
        return { ingredient: ing, matchedAlias: alias };
      }
    }
  }

  // 3) Partial / includes match (input contains or is contained in name/alias)
  for (const ing of ingredients) {
    const ingName = ing.name.toLowerCase();
    if (input.includes(ingName) || ingName.includes(input)) {
      return { ingredient: ing, matchedAlias: null };
    }
    for (const alias of ing.aliases) {
      const aliasLower = alias.toLowerCase();
      if (input.includes(aliasLower) || aliasLower.includes(input)) {
        return { ingredient: ing, matchedAlias: alias };
      }
    }
  }

  // 4) Special magnesium handling: detect form from name string
  if (input.includes("magnesium")) {
    for (const ing of ingredients) {
      if (ing.name.toLowerCase().includes("magnesium")) {
        return { ingredient: ing, matchedAlias: null };
      }
    }
  }

  return { ingredient: null, matchedAlias: null };
}

// ─── Determine form quality ──────────────────────────────────────────────────

function detectFormFromName(name: string): string | null {
  const lower = name.toLowerCase();
  // Try to extract form words after "as" or after the main ingredient name
  const asMatch = lower.match(/\bas\s+(.+)\)/);
  if (asMatch) return asMatch[1].trim();

  // Common forms to detect
  const formKeywords = [
    "glycinate",
    "bisglycinate",
    "citrate",
    "oxide",
    "threonate",
    "taurate",
    "malate",
    "orotate",
    "l-threonate",
    "chelate",
    "picolinate",
    "methyl",
    "methylcobalamin",
    "cyanocobalamin",
    "hydroxocobalamin",
    "methylfolate",
    "folic acid",
    "d3",
    "cholecalciferol",
    "d2",
    "ergocalciferol",
    "k2",
    "mk-7",
    "mk-4",
    "menaquinone",
    "bioperine",
    "piperine",
  ];
  for (const kw of formKeywords) {
    if (lower.includes(kw)) return kw;
  }
  return null;
}

function classifyForm(
  ingredient: Ingredient,
  form: string | null,
  parsedName: string
): "preferred" | "acceptable" | "inferior" | "unknown" {
  // Resolve the actual form string
  const resolvedForm = form ?? detectFormFromName(parsedName);
  if (!resolvedForm) return "unknown";

  const formLower = resolvedForm.toLowerCase().trim();

  const preferred = ingredient.preferred_forms ?? [];
  const inferior = ingredient.inferior_forms ?? [];

  for (const p of preferred) {
    if (formLower.includes(p.toLowerCase()) || p.toLowerCase().includes(formLower)) {
      return "preferred";
    }
  }
  for (const inf of inferior) {
    if (formLower.includes(inf.toLowerCase()) || inf.toLowerCase().includes(formLower)) {
      return "inferior";
    }
  }

  return "unknown";
}

// ─── Magnesium elemental conversion ──────────────────────────────────────────

function isMagnesiumCompoundWeight(parsedIngredient: ParsedIngredient): boolean {
  // If the label says "Magnesium (as Magnesium Glycinate) 200mg", the 200mg IS
  // the elemental amount. But "Magnesium Glycinate 1000mg" without "(as)" is
  // compound weight needing conversion.
  const lower = parsedIngredient.name.toLowerCase();
  if (!lower.includes("magnesium")) return false;

  // If "(as" pattern is present, it's already elemental
  if (/\(as\s+/i.test(parsedIngredient.name)) return false;

  // If the form is baked into the name (e.g., "Magnesium Glycinate"), it's compound
  const formInName = detectFormFromName(lower);
  if (formInName) return true;

  // If form is explicitly provided but name is just "Magnesium", it's elemental
  return false;
}

function convertMagnesiumToElemental(
  doseMg: number,
  parsedIngredient: ParsedIngredient
): number {
  if (!isMagnesiumCompoundWeight(parsedIngredient)) return doseMg;

  const formStr =
    parsedIngredient.form ?? detectFormFromName(parsedIngredient.name);
  if (!formStr) return doseMg;

  const formLower = formStr.toLowerCase().trim();
  // Find matching conversion factor
  for (const [key, factor] of Object.entries(magnesiumConversionFactors)) {
    if (
      formLower.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(formLower)
    ) {
      return doseMg * factor;
    }
  }
  return doseMg;
}

// ─── 3. scoreClinicalDosing ──────────────────────────────────────────────────

export function scoreClinicalDosing(
  parsedIngredients: ParsedIngredient[]
): { score: number; details: IngredientScore[] } {
  const details: IngredientScore[] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const pi of parsedIngredients) {
    const { ingredient } = matchIngredient(pi.name, pi.form);
    if (!ingredient) continue;

    let doseMg = normalizeDose(pi.dose, pi.unit);

    // Magnesium compound-to-elemental conversion
    if (ingredient.name.toLowerCase().includes("magnesium")) {
      doseMg = convertMagnesiumToElemental(doseMg, pi);
    }

    const optimalMg = ingredient.clinical_dose_optimal_mg ?? 0;
    const evidenceStr = ingredient.evidence_strength ?? "moderate";
    const evidenceWeight = EVIDENCE_WEIGHTS[evidenceStr] ?? 0.7;

    // Dose percentage
    const dosePercentage =
      optimalMg > 0 ? clamp((doseMg / optimalMg) * 100, 0, 100) : 0;

    // Raw score based on dose percentage tiers
    let rawScore: number;
    const flags: string[] = [];
    const notes: string[] = [];

    if (dosePercentage >= 100) {
      rawScore = 100;
    } else if (dosePercentage >= 75) {
      rawScore = 80;
    } else if (dosePercentage >= 50) {
      rawScore = 50;
      flags.push("underdosed");
      notes.push(
        `${pi.name} is at ${Math.round(dosePercentage)}% of clinical dose (${doseMg}mg vs ${optimalMg}mg optimal)`
      );
    } else if (dosePercentage >= 25) {
      rawScore = 20;
      flags.push("significantly_underdosed");
      notes.push(
        `${pi.name} is significantly underdosed at ${Math.round(dosePercentage)}% of clinical dose`
      );
    } else {
      rawScore = 0;
      flags.push("fairy_dusted");
      notes.push(
        `${pi.name} is fairy dusted at only ${Math.round(dosePercentage)}% of clinical dose`
      );
    }

    // Form quality check
    const formQuality = classifyForm(ingredient, pi.form, pi.name);
    let formPenaltyApplied = false;
    if (formQuality === "inferior") {
      rawScore = rawScore * 0.7; // 30% penalty
      formPenaltyApplied = true;
      flags.push("inferior_form");
      notes.push(`${pi.name} uses an inferior form`);
    }

    // Weight by evidence
    const weightedScore = rawScore * evidenceWeight;
    totalWeightedScore += weightedScore;
    totalWeight += evidenceWeight;

    details.push({
      ingredient_name: pi.name,
      database_match: ingredient,
      dose_mg: doseMg,
      clinical_optimal_mg: optimalMg,
      dose_percentage: Math.round(dosePercentage * 100) / 100,
      score: Math.round(rawScore * 100) / 100,
      evidence_weight: evidenceWeight,
      form_quality: formQuality,
      form_penalty_applied: formPenaltyApplied,
      flags,
      notes,
    });
  }

  // Weighted average, scaled to 50 points
  const avgScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  const scaledScore = Math.round((avgScore / 100) * 50 * 100) / 100;

  return { score: clamp(scaledScore, 0, 50), details };
}

// ─── 4. scoreTransparency ────────────────────────────────────────────────────

export function scoreTransparency(
  parsed: ParsedSupplement
): { score: number; details: string[] } {
  const details: string[] = [];
  let pct: number;

  // Determine base transparency
  const totalIngredients = parsed.ingredients.length;
  const proprietaryCount = parsed.ingredients.filter(
    (i) => i.is_proprietary_blend
  ).length;

  if (totalIngredients === 0) {
    pct = 0;
    details.push("No ingredients found");
  } else if (parsed.contains_proprietary_blend && proprietaryCount === totalIngredients) {
    pct = 0;
    details.push("Entire formula is a proprietary blend (0%)");
  } else if (parsed.contains_proprietary_blend) {
    pct = 30;
    details.push("Contains proprietary blend hiding some doses (30%)");
  } else {
    pct = 100;
    details.push("All individual doses listed (100%)");
  }

  // Form specification bonus
  const ingredientsWithForm = parsed.ingredients.filter(
    (i) => i.form !== null && i.form.trim() !== ""
  ).length;
  if (totalIngredients > 0 && ingredientsWithForm === totalIngredients) {
    pct += 10;
    details.push("Form specified for each ingredient (+10%)");
  }

  // Other ingredients count adjustments
  const otherCount = parsed.other_ingredients.length;
  if (otherCount < 5) {
    pct += 5;
    details.push(`Clean other ingredients list (${otherCount} items, +5%)`);
  } else if (otherCount >= 10) {
    pct -= 10;
    details.push(`Excessive other ingredients (${otherCount} items, -10%)`);
  }

  pct = clamp(pct, 0, 100);
  const scaledScore = Math.round((pct / 100) * 20 * 100) / 100;

  return { score: clamp(scaledScore, 0, 20), details };
}

// ─── 5. scoreCleanLabel ──────────────────────────────────────────────────────

export function scoreCleanLabel(
  parsed: ParsedSupplement
): {
  score: number;
  penalties: Array<{ ingredient: string; penalty: number; reason: string }>;
} {
  const penalties: Array<{ ingredient: string; penalty: number; reason: string }> = [];
  let pct = 100;

  // Combine all ingredient text to scan
  const allTexts: string[] = [
    ...parsed.other_ingredients,
    ...parsed.ingredients.map((i) => i.name),
    ...parsed.ingredients.map((i) => i.form ?? ""),
  ];

  const matched = new Set<string>();

  for (const text of allTexts) {
    if (!text) continue;
    for (const rule of CLEAN_LABEL_PENALTIES) {
      const key = rule.reason;
      if (matched.has(key)) continue; // Don't double-penalize same rule
      if (rule.pattern.test(text)) {
        pct -= rule.penalty;
        matched.add(key);
        penalties.push({
          ingredient: text,
          penalty: rule.penalty,
          reason: rule.reason,
        });
      }
    }
  }

  // Also match against red_flags from the ingredient database
  for (const text of allTexts) {
    if (!text) continue;
    const textLower = text.toLowerCase().trim();
    for (const ing of ingredients) {
      if (!ing.is_red_flag) continue;
      const penaltyType = ing.penalty_type ?? "minor";
      const redFlagPenalty = penaltyType === "major" ? 20 : 5;
      const redFlagReason = ing.reason ?? `Red flag ingredient: ${ing.name}`;

      const ingNameLower = ing.name.toLowerCase();
      const aliases = ing.aliases;

      let isMatch = false;
      if (textLower.includes(ingNameLower) || ingNameLower.includes(textLower)) {
        isMatch = true;
      }
      if (!isMatch) {
        for (const alias of aliases) {
          if (
            textLower.includes(alias.toLowerCase()) ||
            alias.toLowerCase().includes(textLower)
          ) {
            isMatch = true;
            break;
          }
        }
      }

      if (isMatch) {
        const key = `db:${ing.name}`;
        if (!matched.has(key)) {
          const penalty = redFlagPenalty ?? 10;
          pct -= penalty;
          matched.add(key);
          penalties.push({
            ingredient: text,
            penalty,
            reason: redFlagReason ?? `Red flag ingredient: ${ing.name}`,
          });
        }
      }
    }
  }

  pct = clamp(pct, 0, 100);
  const scaledScore = Math.round((pct / 100) * 20 * 100) / 100;

  return { score: clamp(scaledScore, 0, 20), penalties };
}

// ─── 6. scoreFormulaIntelligence ─────────────────────────────────────────────

interface SynergyRule {
  ingredients: [string, string];
  bonus: number;
  reason: string;
}

interface AntagonistRule {
  ingredients: [string, string];
  penalty: number;
  reason: string;
}

const SYNERGY_RULES: SynergyRule[] = [
  {
    ingredients: ["magnesium", "apigenin"],
    bonus: 10,
    reason: "Enhanced sleep duration (2026 synergy study)",
  },
  {
    ingredients: ["magnesium", "l-theanine"],
    bonus: 10,
    reason: "Additive relaxation \u2014 both cross blood-brain barrier",
  },
  {
    ingredients: ["magnesium", "creatine"],
    bonus: 10,
    reason: "Complementary mechanisms",
  },
  {
    ingredients: ["vitamin d3", "vitamin k2"],
    bonus: 10,
    reason: "K2 directs calcium to bones, not arteries",
  },
  {
    ingredients: ["curcumin", "piperine"],
    bonus: 10,
    reason: "2000% bioavailability increase",
  },
  {
    ingredients: ["curcumin", "bioperine"],
    bonus: 10,
    reason: "2000% bioavailability increase",
  },
  {
    ingredients: ["iron", "vitamin c"],
    bonus: 10,
    reason: "Enhanced non-heme iron absorption",
  },
  {
    ingredients: ["zinc", "copper"],
    bonus: 5,
    reason: "Balanced zinc-copper ratio",
  },
];

const ANTAGONIST_RULES: AntagonistRule[] = [
  {
    ingredients: ["calcium", "iron"],
    penalty: 10,
    reason: "Known antagonists",
  },
  {
    ingredients: ["zinc", "calcium"],
    penalty: 10,
    reason: "Known antagonists",
  },
];

function ingredientListContains(
  parsedIngredients: ParsedIngredient[],
  matchedIngredients: IngredientScore[],
  keyword: string
): boolean {
  const kw = keyword.toLowerCase();
  // Check parsed ingredient names
  for (const pi of parsedIngredients) {
    const lower = pi.name.toLowerCase();
    if (lower.includes(kw)) return true;
    if (pi.form && pi.form.toLowerCase().includes(kw)) return true;
  }
  // Check matched database names
  for (const mi of matchedIngredients) {
    if (mi.database_match) {
      if (mi.database_match.name.toLowerCase().includes(kw)) return true;
      for (const a of mi.database_match.aliases) {
        if (a.toLowerCase().includes(kw)) return true;
      }
    }
  }
  return false;
}

export function scoreFormulaIntelligence(
  parsedIngredients: ParsedIngredient[],
  matchedIngredients: IngredientScore[]
): { score: number; bonuses: string[]; penalties: string[] } {
  let pct = 50;
  const bonuses: string[] = [];
  const penalties: string[] = [];

  // Check synergies
  for (const rule of SYNERGY_RULES) {
    const [a, b] = rule.ingredients;
    if (
      ingredientListContains(parsedIngredients, matchedIngredients, a) &&
      ingredientListContains(parsedIngredients, matchedIngredients, b)
    ) {
      pct += rule.bonus;
      bonuses.push(`${a} + ${b}: ${rule.reason} (+${rule.bonus}%)`);
    }
  }

  // Check antagonists
  for (const rule of ANTAGONIST_RULES) {
    const [a, b] = rule.ingredients;
    if (
      ingredientListContains(parsedIngredients, matchedIngredients, a) &&
      ingredientListContains(parsedIngredients, matchedIngredients, b)
    ) {
      pct -= rule.penalty;
      penalties.push(`${a} + ${b}: ${rule.reason} (-${rule.penalty}%)`);
    }
  }

  // Total ingredient count penalties
  const totalCount = parsedIngredients.length;
  if (totalCount > 35) {
    pct -= 25;
    penalties.push(`Kitchen sink formula (${totalCount} ingredients, -25%)`);
  } else if (totalCount > 25) {
    pct -= 15;
    penalties.push(`Excessive ingredient count (${totalCount} ingredients, -15%)`);
  }

  pct = clamp(pct, 0, 100);
  const scaledScore = Math.round((pct / 100) * 10 * 100) / 100;

  return { score: clamp(scaledScore, 0, 10), bonuses, penalties };
}

// ─── 7. getGrade ─────────────────────────────────────────────────────────────

export function getGrade(score: number): {
  grade: string;
  color: string;
  label: string;
} {
  if (score >= 90) return { grade: "A", color: "#2E7D32", label: "Clinically dosed, clean, transparent" };
  if (score >= 80) return { grade: "A-", color: "#388E3C", label: "Strong formula with minor issues" };
  if (score >= 75) return { grade: "B+", color: "#558B2F", label: "Well above average" };
  if (score >= 70) return { grade: "B", color: "#689F38", label: "Above average, some room to improve" };
  if (score >= 65) return { grade: "B-", color: "#9E9D24", label: "Decent but noticeable gaps" };
  if (score >= 60) return { grade: "C+", color: "#F9A825", label: "Average, multiple issues" };
  if (score >= 55) return { grade: "C", color: "#FF8F00", label: "Below average, consider switching" };
  if (score >= 50) return { grade: "C-", color: "#EF6C00", label: "Significantly underdosed or unclean" };
  if (score >= 40) return { grade: "D", color: "#D84315", label: "Poor \u2014 fairy dusted or heavily processed" };
  return { grade: "F", color: "#B71C1C", label: "Failing \u2014 proprietary blends, artificial, underdosed" };
}

// ─── 8. generateSummary ──────────────────────────────────────────────────────

export function generateSummary(
  productName: string | null,
  grade: string,
  categoryScores: CategoryScores
): string {
  const name = productName ?? "This supplement";
  const dosingPct = (categoryScores.clinical_dosing.score / 50) * 100;
  const cleanPct = (categoryScores.clean_label.score / 20) * 100;
  const transparencyPct = (categoryScores.transparency.score / 20) * 100;

  // Build qualifier based on weakest areas
  const issues: string[] = [];
  const strengths: string[] = [];

  if (dosingPct >= 80) strengths.push("clinically dosed");
  else if (dosingPct >= 50) issues.push("some ingredients are underdosed");
  else issues.push("most ingredients are significantly underdosed");

  if (cleanPct >= 80) strengths.push("clean formula");
  else if (cleanPct < 50) issues.push("contains concerning additives");

  if (transparencyPct >= 80) strengths.push("fully transparent");
  else if (transparencyPct < 50) issues.push("lacks transparency");

  if (categoryScores.formula_intelligence.bonuses.length > 0) {
    strengths.push("includes smart synergies");
  }

  let detail: string;
  if (strengths.length > 0 && issues.length > 0) {
    detail = `${capitalize(strengths.join(" and "))} but ${issues.join(" and ")}.`;
  } else if (strengths.length > 0) {
    detail = `${capitalize(strengths.join(", "))}.`;
  } else if (issues.length > 0) {
    detail = `${capitalize(issues.join(" and "))}.`;
  } else {
    detail = "Average formula overall.";
  }

  return `${name} scored ${aOrAn(grade)} ${grade}. ${detail}`;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function aOrAn(grade: string): string {
  const vowels = ["A", "A-", "F"];
  return vowels.includes(grade) ? "an" : "a";
}

// ─── 9. gradeSupplement (main entry point) ───────────────────────────────────

export function gradeSupplement(parsed: ParsedSupplement): GradeResult {
  // 1. Match all ingredients against database
  const recognizedIngredients: IngredientScore[] = [];
  const unrecognizedIngredients: string[] = [];

  for (const pi of parsed.ingredients) {
    const { ingredient } = matchIngredient(pi.name, pi.form);
    if (ingredient) {
      // We'll fill in details via scoreClinicalDosing
    } else {
      unrecognizedIngredients.push(pi.name);
    }
  }

  // 2. Score clinical dosing (50 points)
  const clinicalResult = scoreClinicalDosing(parsed.ingredients);

  // Populate recognized list from clinical details
  for (const detail of clinicalResult.details) {
    recognizedIngredients.push(detail);
  }

  // 3. Score transparency (20 points)
  const transparencyResult = scoreTransparency(parsed);

  // 4. Score clean label (20 points)
  const cleanLabelResult = scoreCleanLabel(parsed);

  // 5. Score formula intelligence (10 points)
  const formulaResult = scoreFormulaIntelligence(
    parsed.ingredients,
    clinicalResult.details
  );

  // 6. Sum total score
  const totalScore = Math.round(
    (clinicalResult.score +
      transparencyResult.score +
      cleanLabelResult.score +
      formulaResult.score) *
      100
  ) / 100;

  // 7. Get grade
  const { grade, color, label } = getGrade(totalScore);

  // Build category scores object
  const categoryScores: CategoryScores = {
    clinical_dosing: {
      score: clinicalResult.score,
      max: 50 as const,
      details: clinicalResult.details,
    },
    transparency: {
      score: transparencyResult.score,
      max: 20 as const,
      details: transparencyResult.details,
    },
    clean_label: {
      score: cleanLabelResult.score,
      max: 20 as const,
      penalties: cleanLabelResult.penalties,
    },
    formula_intelligence: {
      score: formulaResult.score,
      max: 10 as const,
      bonuses: formulaResult.bonuses,
      penalties: formulaResult.penalties,
    },
  };

  // Collect red flags from clean label penalties and fairy-dusted ingredients
  const redFlags: Array<{ name: string; penalty_type: string; reason: string }> = [];
  for (const p of cleanLabelResult.penalties) {
    redFlags.push({
      name: p.ingredient,
      penalty_type: "clean_label",
      reason: p.reason,
    });
  }
  for (const detail of clinicalResult.details) {
    if (detail.flags.includes("fairy_dusted")) {
      redFlags.push({
        name: detail.ingredient_name,
        penalty_type: "fairy_dusted",
        reason: `${detail.ingredient_name} is at only ${Math.round(detail.dose_percentage)}% of clinical dose`,
      });
    }
  }

  // Collect synergies
  const synergies = formulaResult.bonuses;

  // 8. Generate summary
  const summary = generateSummary(parsed.product_name, grade, categoryScores);

  // 9. Return complete result
  return {
    product_name: parsed.product_name,
    total_score: clamp(totalScore, 0, 100),
    grade,
    grade_color: color,
    grade_label: label,
    category_scores: categoryScores,
    recognized_ingredients: recognizedIngredients,
    unrecognized_ingredients: unrecognizedIngredients,
    red_flags: redFlags,
    synergies,
    summary,
  };
}
