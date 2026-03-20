/**
 * Pre-loaded supplement product profiles with researched ingredient data.
 * Each profile matches the ParsedSupplement interface from scoring-engine.ts.
 */

import type { ParsedSupplement } from "@/lib/scoring-engine";

export interface SupplementProfile {
  id: string;
  product_name: string;
  brand: string;
  category:
    | "sleep"
    | "greens"
    | "preworkout"
    | "protein"
    | "multivitamin"
    | "creatine"
    | "individual"
    | "competitor";
  data: ParsedSupplement;
}

export const preloadedSupplements: SupplementProfile[] = [
  // ============================================================
  // GREENS / SUPERFOODS
  // ============================================================
  {
    id: "ag1-athletic-greens",
    product_name: "AG1",
    brand: "Athletic Greens",
    category: "greens",
    data: {
      product_name: "AG1 (Athletic Greens)",
      serving_size: "1 scoop (12g)",
      servings_per_container: 30,
      ingredients: [
        { name: "Vitamin C", dose: 500, unit: "mg", form: "ascorbic acid", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin E", dose: 83, unit: "mg", form: "d-alpha tocopherol", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Niacin", dose: 20, unit: "mg", form: "niacinamide", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Biotin", dose: 150, unit: "mcg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Folate", dose: 340, unit: "mcg DFE", form: "5-MTHF", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin B12", dose: 20, unit: "mcg", form: "methylcobalamin", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Zinc", dose: 2, unit: "mg", form: "zinc citrate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Selenium", dose: 11, unit: "mcg", form: "selenomethionine", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Copper", dose: 0.5, unit: "mg", form: "copper gluconate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Chromium", dose: 20, unit: "mcg", form: "chromium picolinate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Raw Superfood Complex", dose: 4800, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Raw Superfood Complex" },
        { name: "Nutrient Dense Extracts, Herbs & Antioxidants", dose: 1800, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Nutrient Dense Extracts, Herbs & Antioxidants" },
        { name: "Digestive Enzyme & Super Mushroom Complex", dose: 154, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Digestive Enzyme & Super Mushroom Complex" },
        { name: "Dairy-Free Probiotics", dose: 7200000000, unit: "CFU", form: null, is_proprietary_blend: true, proprietary_blend_name: "Dairy-Free Probiotics" },
      ],
      other_ingredients: ["natural flavors", "citric acid"],
      contains_proprietary_blend: true,
    },
  },
  {
    id: "bloom-greens",
    product_name: "Bloom Greens",
    brand: "Bloom",
    category: "greens",
    data: {
      product_name: "Bloom Greens & Superfoods",
      serving_size: "1 scoop (5.9g)",
      servings_per_container: 30,
      ingredients: [
        { name: "Greens Blend", dose: 2500, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Greens Blend" },
        { name: "Beauty & Gut Health Blend", dose: 1500, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Beauty & Gut Health Blend" },
        { name: "Probiotic Blend", dose: 500, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Probiotic Blend" },
        { name: "Spirulina", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Greens Blend" },
        { name: "Chlorella", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Greens Blend" },
        { name: "Green Tea Extract", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Greens Blend" },
        { name: "Digestive Enzymes", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Beauty & Gut Health Blend" },
      ],
      other_ingredients: ["natural flavors", "stevia leaf extract", "citric acid", "silicon dioxide"],
      contains_proprietary_blend: true,
    },
  },
  {
    id: "organifi-green-juice",
    product_name: "Organifi Green Juice",
    brand: "Organifi",
    category: "greens",
    data: {
      product_name: "Organifi Green Juice",
      serving_size: "1 scoop (9.5g)",
      servings_per_container: 30,
      ingredients: [
        { name: "Organic Greens Blend", dose: 5100, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Chlorella", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Moringa", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Spirulina", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Wheatgrass", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Ashwagandha", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Matcha Green Tea", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Coconut Water", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Beets", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Turmeric", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Lemon", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
        { name: "Mint", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Organic Greens Blend" },
      ],
      other_ingredients: ["monk fruit extract"],
      contains_proprietary_blend: true,
    },
  },
  {
    id: "amazing-grass-green-superfood",
    product_name: "Amazing Grass Green Superfood",
    brand: "Amazing Grass",
    category: "greens",
    data: {
      product_name: "Amazing Grass Green Superfood",
      serving_size: "1 scoop (8g)",
      servings_per_container: 30,
      ingredients: [
        { name: "Green Food Blend", dose: 5260, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Green Food Blend" },
        { name: "Wheat Grass", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Green Food Blend" },
        { name: "Alfalfa", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Green Food Blend" },
        { name: "Spinach", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Green Food Blend" },
        { name: "Chlorella", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Green Food Blend" },
        { name: "Broccoli", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Green Food Blend" },
        { name: "Spirulina", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Green Food Blend" },
        { name: "Antioxidant Blend", dose: 730, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Antioxidant Blend" },
        { name: "Fiber Blend", dose: 3330, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Fiber Blend" },
        { name: "EFA Fiber Blend", dose: 280, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "EFA Fiber Blend" },
        { name: "Digestive Enzyme & Probiotic Blend", dose: 596, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Digestive Enzyme & Probiotic Blend" },
      ],
      other_ingredients: ["natural flavors", "stevia leaf extract"],
      contains_proprietary_blend: true,
    },
  },

  // ============================================================
  // SLEEP / RECOVERY
  // ============================================================
  {
    id: "beam-dream-powder",
    product_name: "Beam Dream Powder",
    brand: "Beam",
    category: "sleep",
    data: {
      product_name: "Beam Dream Powder",
      serving_size: "1 scoop (6.4g)",
      servings_per_container: 20,
      ingredients: [
        { name: "Magnesium", dose: 350, unit: "mg", form: "magnesium glycinate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Reishi Mushroom Extract", dose: 500, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Nano Hemp Extract", dose: 300, unit: "mg", form: "nano-emulsified", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "L-Theanine", dose: 200, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "GABA", dose: 100, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Apigenin", dose: 75, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Melatonin", dose: 3, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["natural flavors", "monk fruit extract", "silicon dioxide", "sea salt"],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "momentous-huberman-sleep-pack",
    product_name: "Momentous Huberman Sleep Pack",
    brand: "Momentous",
    category: "sleep",
    data: {
      product_name: "Momentous Huberman Sleep Pack",
      serving_size: "3 capsules",
      servings_per_container: 30,
      ingredients: [
        { name: "Magnesium", dose: 160, unit: "mg", form: "magnesium L-threonate (Magtein)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "L-Theanine", dose: 100, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Apigenin", dose: 50, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["hypromellose capsule", "microcrystalline cellulose"],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "moon-juice-magnesi-om",
    product_name: "Magnesi-Om",
    brand: "Moon Juice",
    category: "sleep",
    data: {
      product_name: "Moon Juice Magnesi-Om",
      serving_size: "1 scoop (4.4g)",
      servings_per_container: 28,
      ingredients: [
        { name: "Magnesium", dose: 310, unit: "mg", form: "magnesium gluconate, magnesium acetyl taurinate, magnesium citrate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "L-Theanine", dose: 200, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["citric acid", "natural berry flavor", "stevia leaf extract"],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "natural-vitality-calm",
    product_name: "Natural Vitality Calm",
    brand: "Natural Vitality",
    category: "sleep",
    data: {
      product_name: "Natural Vitality Calm",
      serving_size: "2 tsp (4.5g)",
      servings_per_container: 30,
      ingredients: [
        { name: "Magnesium", dose: 325, unit: "mg", form: "magnesium citrate (from magnesium carbonate and citric acid)", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["organic flavors", "organic stevia leaf extract"],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "olly-sleep-gummies",
    product_name: "Olly Sleep Gummies",
    brand: "Olly",
    category: "sleep",
    data: {
      product_name: "Olly Sleep Gummies",
      serving_size: "2 gummies",
      servings_per_container: 25,
      ingredients: [
        { name: "L-Theanine", dose: 100, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Passionflower Extract", dose: 50, unit: "mg", form: "Passiflora incarnata (aerial parts)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Chamomile Extract", dose: 20, unit: "mg", form: "Matricaria recutita (flower)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Melatonin", dose: 3, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "glucose syrup",
        "sugar",
        "gelatin",
        "citric acid",
        "natural flavors",
        "coconut oil",
        "carnauba wax",
        "FD&C Blue 1",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "now-zma",
    product_name: "ZMA",
    brand: "NOW Sports",
    category: "sleep",
    data: {
      product_name: "NOW Sports ZMA",
      serving_size: "3 capsules",
      servings_per_container: 30,
      ingredients: [
        { name: "Magnesium", dose: 450, unit: "mg", form: "magnesium aspartate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Zinc", dose: 30, unit: "mg", form: "zinc mono-L-methionine sulfate (OptiZinc)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin B6", dose: 10.5, unit: "mg", form: "pyridoxine HCl", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["rice flour", "hypromellose capsule", "stearic acid"],
      contains_proprietary_blend: false,
    },
  },

  // ============================================================
  // PRE-WORKOUT
  // ============================================================
  {
    id: "ghost-legend",
    product_name: "Ghost Legend",
    brand: "Ghost",
    category: "preworkout",
    data: {
      product_name: "Ghost Legend",
      serving_size: "1 scoop (14.6g)",
      servings_per_container: 25,
      ingredients: [
        { name: "L-Citrulline", dose: 4000, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Beta-Alanine", dose: 3200, unit: "mg", form: "CarnoSyn", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Taurine", dose: 1000, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Alpha-GPC", dose: 150, unit: "mg", form: "50% alpha-glyceryl phosphoryl choline", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Caffeine", dose: 250, unit: "mg", form: "caffeine anhydrous", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Smart Energy Blend", dose: 600, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Smart Energy Blend" },
      ],
      other_ingredients: [
        "natural and artificial flavors",
        "silicon dioxide",
        "sucralose",
        "acesulfame potassium",
        "citric acid",
        "malic acid",
      ],
      contains_proprietary_blend: true,
    },
  },
  {
    id: "gorilla-mode",
    product_name: "Gorilla Mode",
    brand: "Gorilla Mind",
    category: "preworkout",
    data: {
      product_name: "Gorilla Mode Pre-Workout",
      serving_size: "1 scoop (15.3g)",
      servings_per_container: 40,
      ingredients: [
        { name: "L-Citrulline", dose: 9000, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Creatine Monohydrate", dose: 5000, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "GlycerPump", dose: 3000, unit: "mg", form: "65% glycerol powder", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Betaine Anhydrous", dose: 2500, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "L-Tyrosine", dose: 1500, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Agmatine Sulfate", dose: 1000, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Kanna", dose: 500, unit: "mg", form: "Sceletium tortuosum extract", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Caffeine Anhydrous", dose: 350, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "N-Phenethyl Dimethylamine Citrate", dose: 350, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Bioperine", dose: 10, unit: "mg", form: "black pepper extract", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "natural flavors",
        "silicon dioxide",
        "sucralose",
        "acesulfame potassium",
        "citric acid",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "transparent-labs-bulk",
    product_name: "Transparent Labs Bulk",
    brand: "Transparent Labs",
    category: "preworkout",
    data: {
      product_name: "Transparent Labs BULK Pre-Workout",
      serving_size: "1 scoop (21.2g)",
      servings_per_container: 30,
      ingredients: [
        { name: "Citrulline Malate", dose: 8000, unit: "mg", form: "2:1 citrulline malate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Beta-Alanine", dose: 4000, unit: "mg", form: "CarnoSyn", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "BCAAs", dose: 4000, unit: "mg", form: "2:1:1 instantized (fermented)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Betaine Anhydrous", dose: 2500, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Taurine", dose: 1300, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "N-Acetyl L-Tyrosine", dose: 1000, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Caffeine Anhydrous", dose: 200, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "L-Theanine", dose: 200, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Bioperine", dose: 5, unit: "mg", form: "black pepper fruit extract", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "natural flavors",
        "stevia leaf extract",
        "silicon dioxide",
        "calcium silicate",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "c4-original",
    product_name: "C4 Original",
    brand: "Cellucor",
    category: "preworkout",
    data: {
      product_name: "Cellucor C4 Original",
      serving_size: "1 scoop (6.5g)",
      servings_per_container: 30,
      ingredients: [
        { name: "Beta-Alanine", dose: 1600, unit: "mg", form: "CarnoSyn", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Creatine Nitrate", dose: 1000, unit: "mg", form: "NO3-T", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Arginine AKG", dose: 1000, unit: "mg", form: "arginine alpha-ketoglutarate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Explosive Energy Blend", dose: 425, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Explosive Energy Blend" },
        { name: "Caffeine Anhydrous", dose: 150, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Explosive Energy Blend" },
        { name: "N-Acetyl-L-Tyrosine", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Explosive Energy Blend" },
        { name: "Velvet Bean Seed Extract", dose: 0, unit: "mg", form: null, is_proprietary_blend: true, proprietary_blend_name: "Explosive Energy Blend" },
        { name: "TeaCrine", dose: 0, unit: "mg", form: "theacrine", is_proprietary_blend: true, proprietary_blend_name: "Explosive Energy Blend" },
      ],
      other_ingredients: [
        "natural and artificial flavors",
        "citric acid",
        "silicon dioxide",
        "sucralose",
        "acesulfame potassium",
        "FD&C Red 40",
        "calcium silicate",
      ],
      contains_proprietary_blend: true,
    },
  },

  // ============================================================
  // PROTEIN
  // ============================================================
  {
    id: "on-gold-standard-whey",
    product_name: "Gold Standard 100% Whey",
    brand: "Optimum Nutrition",
    category: "protein",
    data: {
      product_name: "Optimum Nutrition Gold Standard 100% Whey",
      serving_size: "1 scoop (30.4g)",
      servings_per_container: 74,
      ingredients: [
        { name: "Protein", dose: 24, unit: "g", form: "whey protein isolate, whey protein concentrate, whey peptides", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Total Carbohydrates", dose: 3, unit: "g", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Sugars", dose: 1, unit: "g", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Cholesterol", dose: 35, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Sodium", dose: 130, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "lecithin",
        "natural and artificial flavors",
        "acesulfame potassium",
        "sucralose",
        "aminogen (patented digestive enzyme)",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "orgain-organic-protein",
    product_name: "Organic Protein",
    brand: "Orgain",
    category: "protein",
    data: {
      product_name: "Orgain Organic Protein Powder",
      serving_size: "2 scoops (46g)",
      servings_per_container: 20,
      ingredients: [
        { name: "Protein", dose: 21, unit: "g", form: "organic pea protein, organic brown rice protein, organic chia seed", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Total Carbohydrates", dose: 15, unit: "g", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Dietary Fiber", dose: 2, unit: "g", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Iron", dose: 6, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Sodium", dose: 290, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "organic erythritol",
        "organic acacia gum",
        "organic natural flavors",
        "organic rice dextrin",
        "organic guar gum",
        "xanthan gum",
        "organic stevia leaf extract",
        "sea salt",
      ],
      contains_proprietary_blend: false,
    },
  },

  // ============================================================
  // MULTIVITAMINS
  // ============================================================
  {
    id: "ritual-essential-for-women",
    product_name: "Essential for Women 18+",
    brand: "Ritual",
    category: "multivitamin",
    data: {
      product_name: "Ritual Essential for Women 18+",
      serving_size: "2 capsules",
      servings_per_container: 30,
      ingredients: [
        { name: "Vitamin D3", dose: 50, unit: "mcg", form: "cholecalciferol (vegan, lichen-sourced)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Omega-3 DHA", dose: 330, unit: "mg", form: "microalgae oil", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin K2", dose: 90, unit: "mcg", form: "MK-7 (menaquinone-7)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Folate", dose: 1000, unit: "mcg DFE", form: "methylfolate (5-MTHF)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin B12", dose: 8, unit: "mcg", form: "methylcobalamin", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Iron", dose: 8, unit: "mg", form: "ferrous bisglycinate chelate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin E", dose: 6.7, unit: "mg", form: "d-alpha tocopherol", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Boron", dose: 0.7, unit: "mg", form: "boron citrate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Magnesium", dose: 30, unit: "mg", form: "magnesium citrate", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "hydroxypropyl methylcellulose capsule",
        "organic extra virgin olive oil",
        "citrus extract",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "centrum-adults",
    product_name: "Centrum Adults",
    brand: "Centrum",
    category: "multivitamin",
    data: {
      product_name: "Centrum Adults Multivitamin/Multimineral Supplement",
      serving_size: "1 tablet",
      servings_per_container: 200,
      ingredients: [
        { name: "Vitamin A", dose: 900, unit: "mcg RAE", form: "beta-carotene and retinyl acetate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin C", dose: 90, unit: "mg", form: "ascorbic acid", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin D3", dose: 25, unit: "mcg", form: "cholecalciferol", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin E", dose: 15, unit: "mg", form: "dl-alpha tocopheryl acetate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin K", dose: 25, unit: "mcg", form: "phytonadione", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Thiamin", dose: 1.5, unit: "mg", form: "thiamine mononitrate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Riboflavin", dose: 1.7, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Niacin", dose: 20, unit: "mg", form: "niacinamide", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin B6", dose: 2.5, unit: "mg", form: "pyridoxine HCl", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Folate", dose: 665, unit: "mcg DFE", form: "folic acid", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin B12", dose: 25, unit: "mcg", form: "cyanocobalamin", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Biotin", dose: 40, unit: "mcg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Calcium", dose: 220, unit: "mg", form: "calcium carbonate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Iron", dose: 8, unit: "mg", form: "ferrous fumarate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Phosphorus", dose: 20, unit: "mg", form: "calcium phosphate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Iodine", dose: 150, unit: "mcg", form: "potassium iodide", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Magnesium", dose: 50, unit: "mg", form: "magnesium oxide", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Zinc", dose: 11, unit: "mg", form: "zinc oxide", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Selenium", dose: 55, unit: "mcg", form: "sodium selenite", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Copper", dose: 0.9, unit: "mg", form: "cupric sulfate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Manganese", dose: 2.3, unit: "mg", form: "manganese sulfate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Chromium", dose: 35, unit: "mcg", form: "chromium chloride", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Molybdenum", dose: 45, unit: "mcg", form: "sodium molybdate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Lutein", dose: 1, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Lycopene", dose: 600, unit: "mcg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "BHT",
        "FD&C Blue 2 Aluminum Lake",
        "FD&C Red 40 Aluminum Lake",
        "FD&C Yellow 6 Aluminum Lake",
        "gelatin",
        "maltodextrin",
        "modified food starch",
        "silicon dioxide",
        "sodium benzoate",
        "starch",
        "sucrose",
        "titanium dioxide",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "nature-made-multi-complete",
    product_name: "Multi Complete",
    brand: "Nature Made",
    category: "multivitamin",
    data: {
      product_name: "Nature Made Multi Complete",
      serving_size: "1 tablet",
      servings_per_container: 130,
      ingredients: [
        { name: "Vitamin A", dose: 750, unit: "mcg RAE", form: "retinyl acetate and beta-carotene", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin C", dose: 60, unit: "mg", form: "ascorbic acid", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin D3", dose: 25, unit: "mcg", form: "cholecalciferol", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin E", dose: 30, unit: "mg", form: "dl-alpha tocopheryl acetate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin K", dose: 25, unit: "mcg", form: "phytonadione", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin B6", dose: 2, unit: "mg", form: "pyridoxine HCl", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Folate", dose: 400, unit: "mcg DFE", form: "folic acid", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Vitamin B12", dose: 6, unit: "mcg", form: "cyanocobalamin", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Calcium", dose: 200, unit: "mg", form: "calcium carbonate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Iron", dose: 18, unit: "mg", form: "ferrous fumarate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Magnesium", dose: 50, unit: "mg", form: "magnesium oxide", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Zinc", dose: 15, unit: "mg", form: "zinc oxide", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Selenium", dose: 20, unit: "mcg", form: "sodium selenite", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "cellulose gel",
        "croscarmellose sodium",
        "stearic acid",
        "hypromellose",
        "magnesium stearate",
      ],
      contains_proprietary_blend: false,
    },
  },

  // ============================================================
  // CREATINE
  // ============================================================
  {
    id: "thorne-creatine",
    product_name: "Creatine",
    brand: "Thorne",
    category: "creatine",
    data: {
      product_name: "Thorne Creatine",
      serving_size: "1 scoop (5g)",
      servings_per_container: 90,
      ingredients: [
        { name: "Creatine Monohydrate", dose: 5000, unit: "mg", form: "Creapure creatine monohydrate", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "momentous-creatine",
    product_name: "Creatine",
    brand: "Momentous",
    category: "creatine",
    data: {
      product_name: "Momentous Creatine",
      serving_size: "1 scoop (5g)",
      servings_per_container: 60,
      ingredients: [
        { name: "Creatine Monohydrate", dose: 5000, unit: "mg", form: "Creapure", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "create-creatine-gummies",
    product_name: "Creatine Monohydrate Gummies",
    brand: "Create",
    category: "creatine",
    data: {
      product_name: "Create Creatine Monohydrate Gummies",
      serving_size: "4 gummies",
      servings_per_container: 30,
      ingredients: [
        { name: "Creatine Monohydrate", dose: 1500, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "sugar",
        "tapioca syrup",
        "water",
        "pectin",
        "citric acid",
        "natural flavors",
        "coconut oil",
      ],
      contains_proprietary_blend: false,
    },
  },

  // ============================================================
  // INDIVIDUAL SUPPLEMENTS
  // ============================================================
  {
    id: "thorne-magnesium-bisglycinate",
    product_name: "Magnesium Bisglycinate",
    brand: "Thorne",
    category: "individual",
    data: {
      product_name: "Thorne Magnesium Bisglycinate",
      serving_size: "2 capsules",
      servings_per_container: 30,
      ingredients: [
        { name: "Magnesium", dose: 200, unit: "mg", form: "magnesium bisglycinate chelate", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["hypromellose capsule", "leucine"],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "sports-research-magnesium-glycinate",
    product_name: "Magnesium Glycinate",
    brand: "Sports Research",
    category: "individual",
    data: {
      product_name: "Sports Research Magnesium Glycinate",
      serving_size: "2 softgels",
      servings_per_container: 60,
      ingredients: [
        { name: "Magnesium", dose: 200, unit: "mg", form: "magnesium glycinate", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "organic coconut oil",
        "beeswax",
        "sunflower lecithin",
        "gelatin capsule",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "now-l-theanine-200",
    product_name: "L-Theanine 200mg",
    brand: "NOW",
    category: "individual",
    data: {
      product_name: "NOW L-Theanine 200mg",
      serving_size: "1 capsule",
      servings_per_container: 120,
      ingredients: [
        { name: "L-Theanine", dose: 200, unit: "mg", form: "Suntheanine", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["rice flour", "hypromellose capsule", "stearic acid"],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "jarrow-ashwagandha",
    product_name: "Ashwagandha KSM-66",
    brand: "Jarrow Formulas",
    category: "individual",
    data: {
      product_name: "Jarrow Formulas Ashwagandha",
      serving_size: "1 capsule",
      servings_per_container: 120,
      ingredients: [
        { name: "Ashwagandha", dose: 300, unit: "mg", form: "KSM-66 root extract (Withania somnifera)", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "microcrystalline cellulose",
        "hydroxypropylmethylcellulose capsule",
        "magnesium stearate",
        "silicon dioxide",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "nordic-naturals-ultimate-omega",
    product_name: "Ultimate Omega",
    brand: "Nordic Naturals",
    category: "individual",
    data: {
      product_name: "Nordic Naturals Ultimate Omega",
      serving_size: "2 softgels",
      servings_per_container: 60,
      ingredients: [
        { name: "EPA", dose: 650, unit: "mg", form: "triglyceride form", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "DHA", dose: 450, unit: "mg", form: "triglyceride form", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "softgel (gelatin, glycerin, water)",
        "vitamin E (d-alpha tocopherol)",
        "rosemary extract",
      ],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "nature-made-vitamin-d3-2000",
    product_name: "Vitamin D3 2000 IU",
    brand: "Nature Made",
    category: "individual",
    data: {
      product_name: "Nature Made Vitamin D3 2000 IU (50 mcg)",
      serving_size: "1 softgel",
      servings_per_container: 250,
      ingredients: [
        { name: "Vitamin D3", dose: 50, unit: "mcg", form: "cholecalciferol", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "soybean oil",
        "gelatin",
        "glycerin",
        "corn oil",
        "water",
      ],
      contains_proprietary_blend: false,
    },
  },

  // ============================================================
  // COMPETITORS (CHRY comparables)
  // ============================================================
  {
    id: "beam-dream-competitor",
    product_name: "Beam Dream Powder",
    brand: "Beam",
    category: "competitor",
    data: {
      product_name: "Beam Dream Powder",
      serving_size: "1 scoop (6.4g)",
      servings_per_container: 20,
      ingredients: [
        { name: "Magnesium", dose: 350, unit: "mg", form: "magnesium glycinate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Reishi Mushroom Extract", dose: 500, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Nano Hemp Extract", dose: 300, unit: "mg", form: "nano-emulsified", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "L-Theanine", dose: 200, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "GABA", dose: 100, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Apigenin", dose: 75, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Melatonin", dose: 3, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["natural flavors", "monk fruit extract", "silicon dioxide", "sea salt"],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "naked-nutrition-sleep-aid",
    product_name: "Naked Sleep Aid",
    brand: "Naked Nutrition",
    category: "competitor",
    data: {
      product_name: "Naked Nutrition Sleep Aid",
      serving_size: "2 capsules",
      servings_per_container: 30,
      ingredients: [
        { name: "Magnesium", dose: 200, unit: "mg", form: "magnesium glycinate", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "L-Theanine", dose: 200, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "5-HTP", dose: 100, unit: "mg", form: "5-hydroxytryptophan (from Griffonia simplicifolia seed extract)", is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "GABA", dose: 100, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
        { name: "Melatonin", dose: 3, unit: "mg", form: null, is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: ["hypromellose capsule"],
      contains_proprietary_blend: false,
    },
  },
  {
    id: "sports-research-tart-cherry",
    product_name: "Tart Cherry Concentrate",
    brand: "Sports Research",
    category: "competitor",
    data: {
      product_name: "Sports Research Tart Cherry Concentrate",
      serving_size: "1 softgel",
      servings_per_container: 60,
      ingredients: [
        { name: "Tart Cherry", dose: 480, unit: "mg", form: "CherryPURE Montmorency tart cherry (Prunus cerasus) skin extract", is_proprietary_blend: false, proprietary_blend_name: null },
      ],
      other_ingredients: [
        "organic coconut oil",
        "beeswax",
        "gelatin capsule",
      ],
      contains_proprietary_blend: false,
    },
  },
];
