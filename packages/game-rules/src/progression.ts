import { getLevelTitle } from "./titles.js";

/**
 * Cumulative XP required to reach a given level L.
 * Level 1 starts at 0 XP.
 * For Level L >= 2, XP_required(L) = round(100 * L^1.65).
 */
export function getXpRequiredForLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel === 1) return 0;
  return Math.round(100 * Math.pow(safeLevel, 1.65));
}

/**
 * Calculates current level from total accumulated XP.
 */
export function getLevelFromTotalXp(totalXp: number): number {
  const safeXp = Math.max(0, Math.floor(totalXp));
  if (safeXp === 0) return 1;

  let level = 1;
  while (getXpRequiredForLevel(level + 1) <= safeXp) {
    level++;
    // Sanity safety guard
    if (level > 1000) break;
  }
  return level;
}

/**
 * Calculates XP accumulated within the current level.
 */
export function getXpIntoCurrentLevel(totalXp: number): number {
  const safeXp = Math.max(0, Math.floor(totalXp));
  const currentLevel = getLevelFromTotalXp(safeXp);
  const currentLevelFloor = getXpRequiredForLevel(currentLevel);
  return safeXp - currentLevelFloor;
}

/**
 * Calculates total XP span needed to graduate from the current level to next level.
 */
export function getXpToNextLevel(totalXp: number): number {
  const safeXp = Math.max(0, Math.floor(totalXp));
  const currentLevel = getLevelFromTotalXp(safeXp);
  const currentLevelFloor = getXpRequiredForLevel(currentLevel);
  const nextLevelFloor = getXpRequiredForLevel(currentLevel + 1);
  return nextLevelFloor - currentLevelFloor;
}

export interface PlayerProgressionSummary {
  level: number;
  levelTitle: string;
  totalXp: number;
  xpIntoCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progressPercent: number;
}

export function getProgressionSummary(totalXp: number): PlayerProgressionSummary {
  const safeXp = Math.max(0, Math.floor(totalXp));
  const level = getLevelFromTotalXp(safeXp);
  const levelTitle = getLevelTitle(level);
  const xpIntoCurrentLevel = getXpIntoCurrentLevel(safeXp);
  const xpRequiredForNextLevel = getXpToNextLevel(safeXp);
  const progressPercent =
    xpRequiredForNextLevel > 0
      ? Math.min(100, Math.max(0, Math.round((xpIntoCurrentLevel / xpRequiredForNextLevel) * 100)))
      : 100;

  return {
    level,
    levelTitle,
    totalXp: safeXp,
    xpIntoCurrentLevel,
    xpRequiredForNextLevel,
    progressPercent,
  };
}
