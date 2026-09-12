import React from "react";
import type { CharacterState } from "@liferpg/contracts";
import { getProgressionSummary } from "@liferpg/game-rules";
import { CharacterAvatar } from "../../components/character/CharacterAvatar";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { ScrollText, Plus, Sparkles, Trophy, Flame } from "lucide-react";

export interface HomeGameSceneProps {
  character: CharacterState;
  nickname: string;
  onNavigateToQuests: () => void;
  onNavigateToCharacter: () => void;
}

export function HomeGameScene({
  character,
  nickname,
  onNavigateToQuests,
  onNavigateToCharacter,
}: HomeGameSceneProps): React.JSX.Element {
  const progression = getProgressionSummary(character.totalXp);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 2D Game Scene Stage */}
      <div className="relative w-full rounded-2xl overflow-hidden border-2 border-rpg-border bg-rpg-panel shadow-2xl">
        {/* Render Live 2D Game World Viewport */}
        <div className="relative w-full">
          <CharacterAvatar
            cosmetics={character.cosmetics}
            size="viewport"
            showBackground={true}
            isIdleAnimated={true}
            className="border-none shadow-none rounded-none"
          />

          {/* Overlay Level & Player HUD Badge */}
          <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 bg-rpg-panel/85 backdrop-blur-md border border-rpg-border rounded-xl p-3 sm:p-4 shadow-pixel flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-rpg-surface border border-rpg-amber flex items-center justify-center text-rpg-amber shrink-0 shadow-glow-amber">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-rpg-parchment text-sm sm:text-base font-display">
                    {nickname}
                  </h3>
                  <span className="text-[11px] font-bold text-rpg-amber bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                    Level {progression.level} • {progression.levelTitle}
                  </span>
                </div>
                <p className="text-[11px] text-rpg-parchment-muted font-mono mt-0.5">
                  {progression.xpIntoCurrentLevel} / {progression.xpRequiredForNextLevel} XP
                </p>
              </div>
            </div>

            {/* Quick XP Bar on HUD */}
            <div className="w-full sm:w-60 flex items-center gap-2">
              <ProgressBar
                value={progression.xpIntoCurrentLevel}
                max={progression.xpRequiredForNextLevel}
                variant="amber"
                size="sm"
                className="flex-1"
                label={undefined}
                subLabel={undefined}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={onNavigateToCharacter}
                className="text-xs shrink-0"
              >
                Inspect
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Quests Adventure Board Teaser */}
      <Card variant="panel" className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-rpg-border pb-3">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-rpg-amber" aria-hidden="true" />
            <h3 className="font-bold text-sm sm:text-base text-rpg-parchment font-display">
              Adventure Board — Today&apos;s Quests
            </h3>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onNavigateToQuests}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Quest
          </Button>
        </div>

        {/* Quest Stack Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={onNavigateToQuests}
            className="p-3.5 rounded-xl bg-rpg-surface border border-rpg-border hover:border-rpg-amber transition-all cursor-pointer shadow-pixel-sm space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl" aria-hidden="true">📚</span>
              <span className="text-[10px] font-bold text-rpg-amber bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                +60 XP
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-rpg-parchment group-hover:text-rpg-amber transition-colors">
                Study DSA for 1 hour
              </h4>
              <p className="text-[11px] text-rpg-parchment-muted mt-0.5">Mind • Intellect +6</p>
            </div>
          </div>

          <div
            onClick={onNavigateToQuests}
            className="p-3.5 rounded-xl bg-rpg-surface border border-rpg-border hover:border-rpg-amber transition-all cursor-pointer shadow-pixel-sm space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl" aria-hidden="true">🏃</span>
              <span className="text-[10px] font-bold text-rpg-amber bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                +70 XP
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-rpg-parchment group-hover:text-rpg-amber transition-colors">
                Walk 5 km
              </h4>
              <p className="text-[11px] text-rpg-parchment-muted mt-0.5">Body • Strength +7</p>
            </div>
          </div>

          <div
            onClick={onNavigateToQuests}
            className="p-3.5 rounded-xl bg-rpg-surface border border-rpg-border hover:border-rpg-amber transition-all cursor-pointer shadow-pixel-sm space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl" aria-hidden="true">🧹</span>
              <span className="text-[10px] font-bold text-rpg-amber bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">
                +30 XP
              </span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-rpg-parchment group-hover:text-rpg-amber transition-colors">
                Clean study desk
              </h4>
              <p className="text-[11px] text-rpg-parchment-muted mt-0.5">Life • Discipline +3</p>
            </div>
          </div>
        </div>

        {/* Streak Notice */}
        <div className="flex items-center justify-between pt-3 border-t border-rpg-border/60 text-xs text-rpg-parchment-muted">
          <span className="inline-flex items-center gap-1.5 font-semibold text-orange-400">
            <Flame className="w-4 h-4 fill-orange-400" /> {character.currentStreak}-day active streak
          </span>
          <span className="inline-flex items-center gap-1 text-rpg-amber">
            <Sparkles className="w-3.5 h-3.5" /> Next reward bonus at 7 days
          </span>
        </div>
      </Card>
    </div>
  );
}
