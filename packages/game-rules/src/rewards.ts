import { CURRENT_GAME_RULES } from "./rules.js";

export interface RewardCalculationInput {
  categoryId: string;
  difficultyBand?: "easy" | "medium" | "hard";
  metric?: "duration" | "distance" | "count" | "pages" | "completion" | "amount";
  value?: number;
  unit?: string;
  currentStreak?: number;
}

export interface CalculatedReward {
  xp: number;
  gold: number;
  gem: number;
  attributeEffects: Record<string, number>;
  ruleVersion: string;
}

/**
 * Calculates authoritative rewards deterministically from activity facts.
 */
export function calculateRewards(input: RewardCalculationInput): CalculatedReward {
  const categoryKey = (input.categoryId || "life").toLowerCase();
  const categoryConfig = CURRENT_GAME_RULES.categories[categoryKey] ?? CURRENT_GAME_RULES.categories["life"]!;

  const difficulty = input.difficultyBand ?? "medium";
  const diffMultiplier = CURRENT_GAME_RULES.xp.difficultyMultiplier[difficulty] ?? 1.0;

  let unitScale = 1.0;
  if (input.metric === "duration" && input.value && input.value > 0) {
    // Value in minutes: 30 min = 0.8, 60 min = 1.0, 120 min = 1.5, max 2.5
    const mins = input.value;
    unitScale = Math.min(2.5, Math.max(0.5, mins / 60));
  } else if (input.metric === "distance" && input.value && input.value > 0) {
    // Value in km: 5km = 1.2, max 2.5
    const km = input.value;
    unitScale = Math.min(2.5, Math.max(0.5, km / 4));
  } else if (input.metric === "count" && input.value && input.value > 0) {
    unitScale = Math.min(2.0, Math.max(0.5, Math.log2(input.value + 1) / 2));
  }

  // Calculate base XP
  let xp = Math.round(categoryConfig.baseXp * diffMultiplier * unitScale);

  // Apply streak bonus
  const streak = Math.max(0, input.currentStreak ?? 0);
  const streakBonusPct = Math.min(
    CURRENT_GAME_RULES.streak.maxBonusPercent,
    streak * CURRENT_GAME_RULES.streak.bonusPercentPerDay
  );
  xp = Math.round(xp * (1 + streakBonusPct / 100));

  // Minimum floor & maximum safety ceiling
  xp = Math.max(10, Math.min(xp, 500));

  // Gold calculation
  let gold = Math.max(5, Math.round(xp * CURRENT_GAME_RULES.economy.goldPerXpRatio));

  // Check gem milestones
  let gem = 0;
  if (streak > 0 && CURRENT_GAME_RULES.economy.gemMilestones.includes(streak)) {
    gem = 1;
  }

  // Attribute calculations (smaller than XP)
  const primaryGain = Math.max(1, Math.round(xp / 10));
  const secondaryGain = Math.max(1, Math.round(xp / 25));

  const attributeEffects: Record<string, number> = {
    [categoryConfig.primaryAttribute]: primaryGain,
    [categoryConfig.secondaryAttribute]: secondaryGain,
  };

  return {
    xp,
    gold,
    gem,
    attributeEffects,
    ruleVersion: CURRENT_GAME_RULES.version,
  };
}
