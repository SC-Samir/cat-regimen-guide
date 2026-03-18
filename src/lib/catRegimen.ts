// ─── Types ───────────────────────────────────────────────────────────────────

export type LifeStage = "kitten" | "junior" | "adult" | "mature" | "senior";
export type FoodType = "dry" | "wet" | "home" | "mixed-dry-wet" | "mixed-dry-home" | "mixed-wet-home";
export type BreedSize = "small" | "medium" | "large";

export interface CatProfile {
  name: string;
  ageYears: number;
  ageMonths: number;
  breed: string;
  weightKg: number;
  foodType: FoodType;
  isNeutered: boolean;
}

export interface FoodPortion {
  type: string;
  amount: string;
  unit: string;
  icon: string;
  color: string;
}

export interface MealSchedule {
  time: string;
  description: string;
}

export interface HomeRecipe {
  name: string;
  ingredients: string[];
  note: string;
}

export interface CatRegimen {
  lifeStage: LifeStage;
  lifeStageLabel: string;
  lifeStageColor: string;
  dailyCalories: number;
  portions: FoodPortion[];
  mealsPerDay: number;
  mealSchedule: MealSchedule[];
  proteinPercent: number;
  fatPercent: number;
  hydrationTip: string;
  keyNutrients: string[];
  breedSpecificTips: string[];
  generalTips: string[];
  homeRecipes?: HomeRecipe[];
  warnings: string[];
}

// ─── Breed Data ───────────────────────────────────────────────────────────────

export interface BreedInfo {
  name: string;
  size: BreedSize;
  avgWeightKg: { min: number; max: number };
  tips: string[];
}

export const BREEDS: BreedInfo[] = [
  {
    name: "Maine Coon",
    size: "large",
    avgWeightKg: { min: 5, max: 9 },
    tips: [
      "Maine Coons are slow-maturing — treat as kitten until 18 months.",
      "They need higher protein intake due to their muscle mass.",
      "Joint health supplements (glucosamine) are beneficial from age 5.",
    ],
  },
  {
    name: "Persian",
    size: "medium",
    avgWeightKg: { min: 3.5, max: 6 },
    tips: [
      "Persians are prone to obesity — monitor portions closely.",
      "Flat-faced anatomy may cause issues with large kibble; use flat, wide bowls.",
      "High-quality protein helps maintain their long coat.",
    ],
  },
  {
    name: "Siamese",
    size: "medium",
    avgWeightKg: { min: 3, max: 5.5 },
    tips: [
      "Siamese are very active and vocal about hunger — stick to a schedule.",
      "They may be prone to amyloidosis; avoid high-purine foods.",
      "Lean protein is ideal to maintain their athletic build.",
    ],
  },
  {
    name: "British Shorthair",
    size: "medium",
    avgWeightKg: { min: 4, max: 8 },
    tips: [
      "British Shorthairs tend to gain weight easily — portion control is key.",
      "They are predisposed to HCM; omega-3 rich foods support heart health.",
      "Prefer slow-feeder bowls to avoid bloating.",
    ],
  },
  {
    name: "Bengal",
    size: "medium",
    avgWeightKg: { min: 4, max: 7 },
    tips: [
      "Bengals are highly active and need more calories than sedentary cats.",
      "High animal-protein diet mimics their wild diet best.",
      "Raw or wet food is especially well-suited for Bengals.",
    ],
  },
  {
    name: "Ragdoll",
    size: "large",
    avgWeightKg: { min: 5, max: 9 },
    tips: [
      "Ragdolls are slow-maturing like Maine Coons — kitten feeding until 2 years.",
      "Heart-healthy diets with taurine are critical for Ragdolls.",
      "They may overeat; use puzzle feeders to slow meals.",
    ],
  },
  {
    name: "Abyssinian",
    size: "small",
    avgWeightKg: { min: 3, max: 5 },
    tips: [
      "Abyssinians are lean and very active — they burn calories quickly.",
      "Higher frequency of small meals suits their high metabolism.",
      "Dental health is important; dry kibble helps clean teeth.",
    ],
  },
  {
    name: "Scottish Fold",
    size: "medium",
    avgWeightKg: { min: 3, max: 6 },
    tips: [
      "Scottish Folds are prone to joint issues; omega-3s and chondroitin are helpful.",
      "They tend to be sedentary; watch calories carefully.",
      "Wet food helps with hydration which supports kidney health.",
    ],
  },
  {
    name: "Domestic Shorthair",
    size: "medium",
    avgWeightKg: { min: 3.5, max: 6.5 },
    tips: [
      "Mixed-breed cats are generally robust but benefit from balanced nutrition.",
      "Monitor weight regularly; adjust portions as activity level changes.",
      "Variety in diet keeps them engaged and nutritionally covered.",
    ],
  },
  {
    name: "Sphynx",
    size: "medium",
    avgWeightKg: { min: 3.5, max: 5.5 },
    tips: [
      "Sphynx have high metabolisms due to lack of fur — they need more calories to stay warm.",
      "Frequent meals (3–4x/day) are recommended.",
      "They are prone to heart disease; ensure adequate taurine.",
    ],
  },
];

// ─── Life Stage Logic ─────────────────────────────────────────────────────────

export function getLifeStage(ageYears: number, ageMonths: number): LifeStage {
  const totalMonths = ageYears * 12 + ageMonths;
  if (totalMonths < 12) return "kitten";
  if (totalMonths < 24) return "junior";
  if (totalMonths < 84) return "adult";
  if (totalMonths < 132) return "mature";
  return "senior";
}

function lifeStageLabel(stage: LifeStage): string {
  return {
    kitten: "Kitten (0–12 months)",
    junior: "Junior (1–2 years)",
    adult: "Adult (2–7 years)",
    mature: "Mature Adult (7–11 years)",
    senior: "Senior (11+ years)",
  }[stage];
}

function lifeStageColor(stage: LifeStage): string {
  return {
    kitten: "hsl(var(--kitten))",
    junior: "hsl(var(--junior))",
    adult: "hsl(var(--adult))",
    mature: "hsl(var(--mature))",
    senior: "hsl(var(--senior))",
  }[stage];
}

// ─── Calorie Calculation ──────────────────────────────────────────────────────

function calculateDailyCalories(
  weightKg: number,
  stage: LifeStage,
  isNeutered: boolean,
  size: BreedSize
): number {
  // RER (Resting Energy Requirement) = 70 × (weight_kg)^0.75
  const rer = 70 * Math.pow(weightKg, 0.75);

  const multipliers: Record<LifeStage, number> = {
    kitten: 2.5,
    junior: 1.8,
    adult: isNeutered ? 1.2 : 1.4,
    mature: isNeutered ? 1.1 : 1.2,
    senior: 1.1,
  };

  const sizeBonus = size === "large" ? 1.05 : size === "small" ? 0.95 : 1;
  return Math.round(rer * multipliers[stage] * sizeBonus);
}

// ─── Food Portions ────────────────────────────────────────────────────────────

function getDryPortions(calories: number): FoodPortion {
  // Average dry food = ~350 kcal/100g
  const grams = Math.round((calories / 350) * 100);
  return {
    type: "Dry Food (Kibble)",
    amount: `${grams}`,
    unit: "g / day",
    icon: "🫙",
    color: "hsl(38 82% 60%)",
  };
}

function getWetPortions(calories: number): FoodPortion {
  // Average wet food = ~90 kcal/100g
  const grams = Math.round((calories / 90) * 100);
  return {
    type: "Wet Food (Pâté/Chunks)",
    amount: `${grams}`,
    unit: "g / day",
    icon: "🥫",
    color: "hsl(16 68% 52%)",
  };
}

function getMixedDryWetPortions(calories: number): FoodPortion[] {
  const dryCalories = calories * 0.5;
  const wetCalories = calories * 0.5;
  return [
    { ...getDryPortions(dryCalories), type: "Dry Food (50%)" },
    { ...getWetPortions(wetCalories), type: "Wet Food (50%)" },
  ];
}

function getMixedDryHomePortions(calories: number): FoodPortion[] {
  return [
    { ...getDryPortions(calories * 0.4), type: "Dry Food (40%)" },
    {
      type: "Home Recipe (60%)",
      amount: `${Math.round((calories * 0.6) / 1.5)}`,
      unit: "g / day",
      icon: "🍳",
      color: "hsl(152 60% 48%)",
    },
  ];
}

function getMixedWetHomePortions(calories: number): FoodPortion[] {
  return [
    { ...getWetPortions(calories * 0.5), type: "Wet Food (50%)" },
    {
      type: "Home Recipe (50%)",
      amount: `${Math.round((calories * 0.5) / 1.5)}`,
      unit: "g / day",
      icon: "🍳",
      color: "hsl(152 60% 48%)",
    },
  ];
}

function getHomePortions(calories: number): FoodPortion {
  // Home food avg ~150 kcal/100g
  const grams = Math.round((calories / 150) * 100);
  return {
    type: "Home-Cooked Recipe",
    amount: `${grams}`,
    unit: "g / day",
    icon: "🍳",
    color: "hsl(152 60% 48%)",
  };
}

// ─── Meal Schedules ───────────────────────────────────────────────────────────

function getMealSchedule(mealsPerDay: number): MealSchedule[] {
  const schedules: Record<number, MealSchedule[]> = {
    2: [
      { time: "7:00 AM", description: "Morning meal — main feeding" },
      { time: "6:00 PM", description: "Evening meal — main feeding" },
    ],
    3: [
      { time: "7:00 AM", description: "Morning meal — larger portion" },
      { time: "12:00 PM", description: "Midday snack — smaller portion" },
      { time: "6:00 PM", description: "Evening meal — larger portion" },
    ],
    4: [
      { time: "7:00 AM", description: "Morning meal" },
      { time: "11:00 AM", description: "Late morning snack" },
      { time: "3:00 PM", description: "Afternoon meal" },
      { time: "7:00 PM", description: "Evening meal" },
    ],
  };
  return schedules[mealsPerDay] ?? schedules[2];
}

// ─── Home Recipes ─────────────────────────────────────────────────────────────

const HOME_RECIPES: HomeRecipe[] = [
  {
    name: "Chicken & Rice Bowl",
    ingredients: [
      "150g boneless chicken breast (cooked, no seasoning)",
      "50g cooked white rice",
      "30g steamed carrots (mashed)",
      "1 tsp fish oil (omega-3)",
    ],
    note: "High protein, easily digestible. Ideal for adults and juniors.",
  },
  {
    name: "Salmon & Sweet Potato",
    ingredients: [
      "120g cooked salmon (deboned)",
      "40g mashed sweet potato",
      "20g steamed green beans",
      "½ tsp taurine supplement",
    ],
    note: "Rich in omega-3, great for coat and skin health.",
  },
  {
    name: "Turkey & Oats Senior Mix",
    ingredients: [
      "130g ground turkey (cooked)",
      "40g cooked rolled oats",
      "1 tbsp pumpkin purée",
      "½ tsp calcium supplement",
    ],
    note: "Gentle on the digestive system, suitable for mature and senior cats.",
  },
];

// ─── Nutrition Macros ─────────────────────────────────────────────────────────

function getMacros(stage: LifeStage, foodType: FoodType): { protein: number; fat: number } {
  const base: Record<LifeStage, { protein: number; fat: number }> = {
    kitten: { protein: 35, fat: 20 },
    junior: { protein: 33, fat: 18 },
    adult: { protein: 30, fat: 15 },
    mature: { protein: 32, fat: 13 },
    senior: { protein: 34, fat: 12 },
  };
  const macro = base[stage];
  if (foodType === "wet" || foodType === "mixed-dry-wet") macro.protein += 2;
  return macro;
}

// ─── Key Nutrients ────────────────────────────────────────────────────────────

function getKeyNutrients(stage: LifeStage): string[] {
  const shared = ["Taurine", "Arachidonic acid", "Vitamin A", "Niacin"];
  const extras: Record<LifeStage, string[]> = {
    kitten: ["DHA (brain development)", "Calcium & Phosphorus (bone growth)", "High-quality animal protein"],
    junior: ["Lean protein", "Omega-3 fatty acids", "L-carnitine"],
    adult: ["Balanced minerals", "Fiber (digestive health)", "Antioxidants"],
    mature: ["Omega-3 (joint & heart)", "Phosphorus-controlled diet", "Vitamin E"],
    senior: ["Easily digestible protein", "B-vitamins", "Antioxidants", "Joint support (glucosamine)"],
  };
  return [...shared, ...extras[stage]];
}

// ─── Tips ─────────────────────────────────────────────────────────────────────

function getHydrationTip(foodType: FoodType): string {
  if (foodType === "wet") return "Wet food provides up to 80% of water needs — keep a fresh water bowl as a supplement.";
  if (foodType === "dry") return "Dry food has only 10% moisture. Always provide fresh water in multiple spots; consider a pet fountain.";
  if (foodType === "home") return "Home recipes vary in moisture. Add a small amount of low-sodium broth to meals if your cat drinks little water.";
  return "With a mixed diet, monitor water intake. Wet components count toward daily hydration needs.";
}

function getGeneralTips(stage: LifeStage, isNeutered: boolean): string[] {
  const stageTips: Record<LifeStage, string[]> = {
    kitten: [
      "Feed kitten-specific food — adult food lacks the nutrients needed for growth.",
      "Never feed cow's milk — most cats are lactose intolerant.",
      "Let kittens eat freely (free-feeding) until 6 months, then transition to scheduled meals.",
    ],
    junior: [
      "Gradually transition from kitten to adult food between 10–14 months.",
      "Continue high protein to support muscle development.",
      "Establish a consistent feeding schedule to regulate weight.",
    ],
    adult: [
      "Two meals a day is ideal for maintaining healthy weight and digestion.",
      "Avoid human food with onions, garlic, grapes, or chocolate — all toxic to cats.",
      "Regular vet weight checks every 6 months.",
    ],
    mature: [
      "Begin transitioning to mature/senior formulas at age 7.",
      "Watch for weight changes — both loss and gain can signal health issues.",
      "Phosphorus-restricted diets may help protect kidney function.",
    ],
    senior: [
      "Senior cats may need smaller, more frequent meals if appetite decreases.",
      "Warm up wet food slightly to enhance aroma and palatability.",
      "Dental disease is common — discuss dental-friendly food with your vet.",
      "Consider annual blood panels to monitor kidney and thyroid function.",
    ],
  };
  const tips = [...stageTips[stage]];
  if (isNeutered) tips.push("Neutered cats have ~20–30% lower calorie needs — watch portions carefully to prevent obesity.");
  return tips;
}

// ─── Main Generator ───────────────────────────────────────────────────────────

export function generateRegimen(profile: CatProfile): CatRegimen {
  const breedInfo = BREEDS.find(b => b.name === profile.breed) ?? BREEDS.find(b => b.name === "Domestic Shorthair")!;
  const stage = getLifeStage(profile.ageYears, profile.ageMonths);
  const calories = calculateDailyCalories(profile.weightKg, stage, profile.isNeutered, breedInfo.size);
  const macros = getMacros(stage, profile.foodType);

  const mealsPerDay =
    stage === "kitten" ? 4 :
    stage === "junior" ? 3 :
    profile.foodType === "home" ? 3 :
    2;

  let portions: FoodPortion[] = [];
  switch (profile.foodType) {
    case "dry": portions = [getDryPortions(calories)]; break;
    case "wet": portions = [getWetPortions(calories)]; break;
    case "home": portions = [getHomePortions(calories)]; break;
    case "mixed-dry-wet": portions = getMixedDryWetPortions(calories); break;
    case "mixed-dry-home": portions = getMixedDryHomePortions(calories); break;
    case "mixed-wet-home": portions = getMixedWetHomePortions(calories); break;
  }

  const warnings: string[] = [];
  if (profile.weightKg > breedInfo.avgWeightKg.max * 1.15) {
    warnings.push(`${profile.name} appears overweight for their breed. Consider a weight-management formula and reduce portions by 10–15%. Consult your vet.`);
  }
  if (profile.weightKg < breedInfo.avgWeightKg.min * 0.85) {
    warnings.push(`${profile.name} appears underweight. Consider increasing portions gradually and consult your vet to rule out underlying conditions.`);
  }
  if (stage === "kitten" && profile.foodType === "dry") {
    warnings.push("Dry food alone is not ideal for kittens — consider adding wet food or soaking kibble for easier eating and better hydration.");
  }
  if (stage === "senior" && profile.foodType === "dry") {
    warnings.push("Senior cats benefit greatly from added moisture. Consider mixing in wet food or adding a water fountain.");
  }

  const homeRecipes = profile.foodType.includes("home") ? HOME_RECIPES : undefined;

  return {
    lifeStage: stage,
    lifeStageLabel: lifeStageLabel(stage),
    lifeStageColor: lifeStageColor(stage),
    dailyCalories: calories,
    portions,
    mealsPerDay,
    mealSchedule: getMealSchedule(mealsPerDay),
    proteinPercent: macros.protein,
    fatPercent: macros.fat,
    hydrationTip: getHydrationTip(profile.foodType),
    keyNutrients: getKeyNutrients(stage),
    breedSpecificTips: breedInfo.tips,
    generalTips: getGeneralTips(stage, profile.isNeutered),
    homeRecipes,
    warnings,
  };
}
