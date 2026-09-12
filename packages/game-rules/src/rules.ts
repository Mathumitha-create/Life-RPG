export interface GameRulesConfig {
  version: string;
  xp: {
    levelExponent: number;
    levelBase: number;
    difficultyMultiplier: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  categories: Record<
    string,
    {
      name: string;
      primaryAttribute: string;
      secondaryAttribute: string;
      baseXp: number;
      baseGold: number;
    }
  >;
  economy: {
    goldPerXpRatio: number;
    gemMilestones: number[]; // streak or quest milestones that award gems
  };
  streak: {
    milestoneDays: number[];
    bonusPercentPerDay: number;
    maxBonusPercent: number;
  };
}

export const CURRENT_GAME_RULES: GameRulesConfig = {
  version: "2026-09-v1",
  xp: {
    levelExponent: 1.65,
    levelBase: 100,
    difficultyMultiplier: {
      easy: 0.75,
      medium: 1.0,
      hard: 1.5,
    },
  },
  categories: {
    mind: {
      name: "Mind",
      primaryAttribute: "intellect",
      secondaryAttribute: "discipline",
      baseXp: 50,
      baseGold: 15,
    },
    body: {
      name: "Body",
      primaryAttribute: "strength",
      secondaryAttribute: "discipline",
      baseXp: 50,
      baseGold: 15,
    },
    career: {
      name: "Career",
      primaryAttribute: "discipline",
      secondaryAttribute: "intellect",
      baseXp: 50,
      baseGold: 15,
    },
    life: {
      name: "Life",
      primaryAttribute: "discipline",
      secondaryAttribute: "wisdom",
      baseXp: 40,
      baseGold: 12,
    },
    social: {
      name: "Social",
      primaryAttribute: "social",
      secondaryAttribute: "wisdom",
      baseXp: 45,
      baseGold: 15,
    },
    growth: {
      name: "Growth",
      primaryAttribute: "creativity",
      secondaryAttribute: "wisdom",
      baseXp: 50,
      baseGold: 15,
    },
  },
  economy: {
    goldPerXpRatio: 0.3,
    gemMilestones: [3, 7, 14, 30, 60, 100],
  },
  streak: {
    milestoneDays: [3, 7, 14, 30, 60, 100],
    bonusPercentPerDay: 2,
    maxBonusPercent: 20,
  },
};
