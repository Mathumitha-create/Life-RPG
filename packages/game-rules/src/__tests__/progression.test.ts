import { describe, it, expect } from "vitest";
import {
  getXpRequiredForLevel,
  getLevelFromTotalXp,
  getXpIntoCurrentLevel,
  getXpToNextLevel,
  getProgressionSummary,
} from "../progression.js";
import { getLevelTitle } from "../titles.js";
import { calculateRewards } from "../rewards.js";

describe("Progression Math & XP Curve", () => {
  it("Level 1 starts at 0 XP", () => {
    expect(getXpRequiredForLevel(1)).toBe(0);
    expect(getLevelFromTotalXp(0)).toBe(1);
    expect(getLevelTitle(1)).toBe("Wanderer");
  });

  it("calculates cumulative XP thresholds monotonically", () => {
    let previousThreshold = -1;
    for (let level = 1; level <= 30; level++) {
      const threshold = getXpRequiredForLevel(level);
      expect(threshold).toBeGreaterThan(previousThreshold);
      previousThreshold = threshold;
    }
  });

  it("correctly maps total XP to levels according to formula", () => {
    // Level 2 threshold = round(100 * 2^1.65) = 314
    expect(getXpRequiredForLevel(2)).toBe(314);
    expect(getLevelFromTotalXp(0)).toBe(1);
    expect(getLevelFromTotalXp(313)).toBe(1);
    expect(getLevelFromTotalXp(314)).toBe(2);
    expect(getLevelFromTotalXp(611)).toBe(2);
    expect(getLevelFromTotalXp(612)).toBe(3);
  });

  it("calculates current level slice XP and progress percentage correctly", () => {
    const summary = getProgressionSummary(100);
    expect(summary.level).toBe(1);
    expect(summary.xpIntoCurrentLevel).toBe(100);
    expect(summary.xpRequiredForNextLevel).toBe(314);
    expect(summary.progressPercent).toBe(Math.round((100 / 314) * 100));
  });

  it("handles prestige levels beyond 20 gracefully", () => {
    expect(getLevelTitle(20)).toBe("Living Legend");
    expect(getLevelTitle(21)).toBe("Living Legend (Prestige 1)");
    expect(getLevelTitle(25)).toBe("Living Legend (Prestige 5)");
  });
});

describe("Reward Calculation Engine", () => {
  it("calculates deterministic rewards for study task", () => {
    const reward = calculateRewards({
      categoryId: "mind",
      difficultyBand: "medium",
      metric: "duration",
      value: 120,
      currentStreak: 0,
    });

    expect(reward.xp).toBeGreaterThan(0);
    expect(reward.gold).toBeGreaterThan(0);
    expect(reward.attributeEffects.intellect).toBeGreaterThan(0);
    expect(reward.attributeEffects.discipline).toBeGreaterThan(0);
    expect(reward.ruleVersion).toBe("2026-09-v1");
  });

  it("applies difficulty multipliers and streak bonus safely", () => {
    const easy = calculateRewards({ categoryId: "body", difficultyBand: "easy" });
    const hard = calculateRewards({ categoryId: "body", difficultyBand: "hard" });
    expect(hard.xp).toBeGreaterThan(easy.xp);

    const withStreak = calculateRewards({ categoryId: "body", currentStreak: 7 });
    expect(withStreak.gem).toBe(1); // 7 day milestone awards gem
  });
});
