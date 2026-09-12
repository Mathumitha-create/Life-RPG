export const LEVEL_TITLES: Record<number, string> = {
  1: "Wanderer",
  2: "Scout",
  3: "Pathfinder",
  4: "Apprentice",
  5: "Adventurer",
  6: "Trailblazer",
  7: "Challenger",
  8: "Vanguard",
  9: "Champion",
  10: "Hero",
  11: "Veteran",
  12: "Elite",
  13: "Guardian",
  14: "Master",
  15: "Ascendant",
  16: "Legend",
  17: "Mythic",
  18: "Paragon",
  19: "Eternal",
  20: "Living Legend",
};

export function getLevelTitle(level: number): string {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel <= 20) {
    return LEVEL_TITLES[safeLevel] ?? "Wanderer";
  }
  const prestigeTier = safeLevel - 20;
  return `Living Legend (Prestige ${prestigeTier})`;
}
