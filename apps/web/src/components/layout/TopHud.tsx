import React from "react";
import { useAuth } from "../../features/auth/AuthContext";
import { ProgressBar } from "../ui/ProgressBar";
import { LogOut, Flame } from "lucide-react";
import { getProgressionSummary } from "@liferpg/game-rules";

export interface TopHudProps {
  totalXp?: number;
  gold?: number;
  gems?: number;
  streak?: number;
  nickname?: string;
}

export function TopHud({
  totalXp = 820,
  gold = 680,
  gems = 24,
  streak = 5,
  nickname = "Nova",
}: TopHudProps): React.JSX.Element {
  const { logout, user } = useAuth();
  const summary = getProgressionSummary(totalXp);
  const displayName = nickname || user?.displayName || "Adventurer";

  return (
    <header className="sticky top-0 z-40 w-full bg-rpg-panel/90 backdrop-blur-md border-b border-rpg-border px-4 py-2.5 shadow-pixel-sm">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Player Level Title */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-rpg-parchment text-sm sm:text-base font-display">
                {displayName}
              </span>
              <span className="text-xs text-rpg-amber font-semibold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                Lvl {summary.level} • {summary.levelTitle}
              </span>
            </div>
            {/* XP progress */}
            <div className="w-36 sm:w-48 mt-1">
              <ProgressBar
                value={summary.xpIntoCurrentLevel}
                max={summary.xpRequiredForNextLevel}
                size="sm"
                variant="amber"
                label={undefined}
                subLabel={undefined}
              />
              <span className="text-[10px] text-rpg-parchment-muted font-mono">
                {summary.xpIntoCurrentLevel} / {summary.xpRequiredForNextLevel} XP
              </span>
            </div>
          </div>
        </div>

        {/* Right: Currencies, Streak, Logout */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-bold">
          {/* Streak */}
          <div
            className="flex items-center gap-1 bg-rpg-bg px-2.5 py-1 rounded-lg border border-rpg-border"
            title={`${streak}-day streak`}
            aria-label={`${streak} day streak`}
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" aria-hidden="true" />
            <span className="text-orange-400">{streak}d</span>
          </div>

          {/* Gems */}
          <div
            className="flex items-center gap-1 bg-rpg-bg px-2.5 py-1 rounded-lg border border-rpg-border"
            title={`${gems} Gems`}
            aria-label={`${gems} Gems`}
          >
            <span className="text-sm" aria-hidden="true">💎</span>
            <span className="text-rpg-violet">{gems}</span>
          </div>

          {/* Gold */}
          <div
            className="flex items-center gap-1 bg-rpg-bg px-2.5 py-1 rounded-lg border border-rpg-border"
            title={`${gold} Gold`}
            aria-label={`${gold} Gold`}
          >
            <span className="text-sm" aria-hidden="true">🪙</span>
            <span className="text-rpg-amber">{gold}</span>
          </div>

          {/* Logout button */}
          <button
            onClick={() => void logout()}
            className="p-2 rounded-lg text-rpg-parchment-muted hover:text-rpg-parchment hover:bg-rpg-surface transition-colors focus-visible:ring-2 focus-visible:ring-rpg-amber"
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
