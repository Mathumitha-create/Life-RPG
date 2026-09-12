import React, { useState } from "react";
import type { UserProfile, CharacterState, CharacterCosmetics, CreateQuestRequest, Quest } from "@liferpg/contracts";
import { TopHud } from "./TopHud";
import { Nav, type NavTab } from "./Nav";
import { HomeGameScene } from "../../features/game/HomeGameScene";
import { CharacterScreen } from "../../features/character/CharacterScreen";
import { Card } from "../ui/Card";
import { Compass, Sparkles } from "lucide-react";
import { QuestsScreen } from "../../features/quests/QuestsScreen";

export interface GameShellProps {
  profile: UserProfile;
  character: CharacterState;
  onUpdateCosmetics: (cosmetics: CharacterCosmetics) => Promise<void>;
  isUpdatingCosmetics?: boolean;
  quests: Quest[];
  isLoadingQuests: boolean;
  isSavingQuest: boolean;
  questError?: string;
  onCreateQuest: (request: CreateQuestRequest) => Promise<void>;
  onUpdateQuest: (questId: string, title: string) => Promise<void>;
  onDeleteQuest: (questId: string) => Promise<void>;
}

export function GameShell({
  profile,
  character,
  onUpdateCosmetics,
  isUpdatingCosmetics = false,
  quests,
  isLoadingQuests,
  isSavingQuest,
  questError,
  onCreateQuest,
  onUpdateQuest,
  onDeleteQuest,
}: GameShellProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<NavTab>("home");

  return (
    <div className="min-h-screen bg-rpg-bg flex flex-col justify-between text-rpg-parchment pb-20 sm:pb-4">
      {/* Top HUD */}
      <TopHud
        totalXp={character.totalXp}
        gold={character.gold}
        gems={character.gems}
        streak={character.currentStreak}
        nickname={profile.nickname}
      />

      {/* Main World Stage Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-start">
        {activeTab === "home" && (
          <HomeGameScene
            character={character}
            nickname={profile.nickname}
            quests={quests}
            onNavigateToQuests={() => setActiveTab("quests")}
            onNavigateToCharacter={() => setActiveTab("character")}
          />
        )}

        {activeTab === "character" && (
          <CharacterScreen
            character={character}
            nickname={profile.nickname}
            onSaveCosmetics={onUpdateCosmetics}
            isSaving={isUpdatingCosmetics}
          />
        )}

        {activeTab === "quests" && <QuestsScreen quests={quests} isLoading={isLoadingQuests} isSaving={isSavingQuest} error={questError} onCreate={onCreateQuest} onUpdate={onUpdateQuest} onDelete={onDeleteQuest} />}

        {activeTab === "bag" && (
          <Card variant="panel" className="p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-rpg-surface border border-rpg-border flex items-center justify-center text-rpg-amber">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rpg-parchment font-display">
                Inventory & Badges
              </h3>
              <p className="text-xs text-rpg-parchment-muted max-w-md mx-auto mt-1">
                Full inventory ledger, achievements, and milestone badges scheduled for Phase 4.
              </p>
            </div>
          </Card>
        )}

        {activeTab === "shop" && (
          <Card variant="panel" className="p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-rpg-surface border border-rpg-violet flex items-center justify-center text-rpg-violet shadow-glow-violet">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rpg-parchment font-display">
                Merchant&apos;s Bazaar
              </h3>
              <p className="text-xs text-rpg-parchment-muted max-w-md mx-auto mt-1">
                Gold & Gem cosmetic catalog and transaction ledger scheduled for Phase 4.
              </p>
            </div>
          </Card>
        )}
      </main>

      {/* Responsive Navigation */}
      <Nav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
}
