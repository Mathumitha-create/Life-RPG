import React, { useState } from "react";
import type { CharacterState, CharacterCosmetics } from "@liferpg/contracts";
import { COSMETIC_ASSETS, getProgressionSummary } from "@liferpg/game-rules";
import { CharacterAvatar } from "../../components/character/CharacterAvatar";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { Badge } from "../../components/ui/Badge";
import { Sparkles, Shield, Palette, CheckCircle2, RotateCcw } from "lucide-react";

export interface CharacterScreenProps {
  character: CharacterState;
  nickname: string;
  onSaveCosmetics: (cosmetics: CharacterCosmetics) => Promise<void>;
  isSaving?: boolean;
}

export function CharacterScreen({
  character,
  nickname,
  onSaveCosmetics,
  isSaving = false,
}: CharacterScreenProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"attributes" | "wardrobe">("wardrobe");
  const [selectedCosmetics, setSelectedCosmetics] = useState<CharacterCosmetics>(character.cosmetics);
  const [activeSlot, setActiveSlot] = useState<"hair" | "outfit" | "accessory" | "background">("outfit");
  const [isIdleAnimated, setIsIdleAnimated] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const progression = getProgressionSummary(character.totalXp);

  const hasUnsavedChanges = JSON.stringify(selectedCosmetics) !== JSON.stringify(character.cosmetics);

  const handleSave = async () => {
    await onSaveCosmetics(selectedCosmetics);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setSelectedCosmetics(character.cosmetics);
  };

  const filteredAssets = COSMETIC_ASSETS.filter((c) => c.slot === activeSlot);

  const attributeDescriptions: Record<string, string> = {
    intellect: "Powers deep learning, problem solving, analysis, and logic.",
    strength: "Forged through workouts, sports, physical endurance, and active movement.",
    discipline: "Built from daily consistency, completing routines, and overcoming friction.",
    creativity: "Grows through building, coding, writing, art, and exploring novel ideas.",
    wisdom: "Nurtured through reflection, mindfulness, reading, and self-mastery.",
    social: "Enhanced through meaningful connection, collaboration, and community service.",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rpg-border pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-rpg-parchment">
            {nickname}&apos;s Character Hall
          </h2>
          <p className="text-xs text-rpg-parchment-muted">
            Inspect your long-term attribute growth and customize your 2D appearance.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-rpg-panel border border-rpg-border rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab("wardrobe")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "wardrobe"
                ? "bg-rpg-surface text-rpg-amber border border-rpg-amber/40 shadow-glow-amber"
                : "text-rpg-parchment-muted hover:text-rpg-parchment"
            }`}
          >
            <Palette className="w-4 h-4" /> Wardrobe
          </button>
          <button
            onClick={() => setActiveTab("attributes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "attributes"
                ? "bg-rpg-surface text-rpg-amber border border-rpg-amber/40 shadow-glow-amber"
                : "text-rpg-parchment-muted hover:text-rpg-parchment"
            }`}
          >
            <Shield className="w-4 h-4" /> Attributes
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Live Character Stage */}
        <Card variant="panel" className="lg:col-span-5 p-6 flex flex-col items-center space-y-4">
          <div className="relative w-full flex flex-col items-center">
            <CharacterAvatar
              cosmetics={selectedCosmetics}
              size="xl"
              showBackground={true}
              isIdleAnimated={isIdleAnimated}
            />

            {/* Animation Toggle */}
            <button
              onClick={() => setIsIdleAnimated(!isIdleAnimated)}
              className="mt-3 text-[11px] text-rpg-parchment-muted hover:text-rpg-parchment font-mono flex items-center gap-1 bg-rpg-surface px-2.5 py-1 rounded-md border border-rpg-border"
            >
              <Sparkles className="w-3.5 h-3.5 text-rpg-amber" />
              Idle Animation: {isIdleAnimated ? "ON" : "OFF"}
            </button>
          </div>

          {/* Level & XP Overview */}
          <div className="w-full space-y-2 pt-3 border-t border-rpg-border">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-rpg-amber font-display">
                Level {progression.level} • {progression.levelTitle}
              </span>
              <Badge variant="amber">Total {progression.totalXp} XP</Badge>
            </div>
            <ProgressBar
              value={progression.xpIntoCurrentLevel}
              max={progression.xpRequiredForNextLevel}
              variant="amber"
              size="md"
              label={undefined}
              subLabel={undefined}
            />
            <div className="flex justify-between text-[11px] text-rpg-parchment-muted font-mono">
              <span>{progression.xpIntoCurrentLevel} XP in level</span>
              <span>{progression.xpRequiredForNextLevel - progression.xpIntoCurrentLevel} XP to Level {progression.level + 1}</span>
            </div>
          </div>
        </Card>

        {/* Right: Wardrobe / Attributes Panel */}
        <div className="lg:col-span-7">
          {activeTab === "wardrobe" && (
            <Card variant="panel" className="p-6 space-y-5">
              {/* Slot Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-rpg-border pb-3">
                {(["outfit", "hair", "accessory", "background"] as const).map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setActiveSlot(slot)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-bold capitalize transition-all ${
                      activeSlot === slot
                        ? "bg-rpg-amber text-rpg-bg border-amber-300 shadow-pixel-sm font-extrabold"
                        : "bg-rpg-surface text-rpg-parchment border-rpg-border hover:border-rpg-amber/40"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Asset Catalog Grid for Selected Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredAssets.map((asset) => {
                  const isEquipped =
                    activeSlot === "hair"
                      ? selectedCosmetics.hairId === asset.id
                      : activeSlot === "outfit"
                      ? selectedCosmetics.outfitId === asset.id
                      : activeSlot === "accessory"
                      ? selectedCosmetics.accessoryId === asset.id
                      : selectedCosmetics.backgroundId === asset.id;

                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        setSelectedCosmetics({
                          ...selectedCosmetics,
                          ...(activeSlot === "hair" && { hairId: asset.id }),
                          ...(activeSlot === "outfit" && { outfitId: asset.id }),
                          ...(activeSlot === "accessory" && { accessoryId: asset.id }),
                          ...(activeSlot === "background" && { backgroundId: asset.id }),
                        });
                      }}
                      className={`text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                        isEquipped
                          ? "bg-rpg-surface border-rpg-amber shadow-glow-amber"
                          : "bg-rpg-panel border-rpg-border hover:border-rpg-amber/50 hover:bg-rpg-surface/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge
                          variant={
                            asset.rarity === "LEGENDARY"
                              ? "amber"
                              : asset.rarity === "EPIC"
                              ? "violet"
                              : asset.rarity === "RARE"
                              ? "blue"
                              : "neutral"
                          }
                        >
                          {asset.rarity}
                        </Badge>
                        {isEquipped && (
                          <span className="text-[10px] font-bold text-rpg-amber uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Equipped
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-rpg-parchment">{asset.name}</h4>
                        <p className="text-xs text-rpg-parchment-muted mt-0.5">{asset.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-rpg-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={!hasUnsavedChanges || isSaving}
                  leftIcon={<RotateCcw className="w-4 h-4" />}
                >
                  Reset Preview
                </Button>

                <div className="flex items-center gap-2">
                  {saveSuccess && (
                    <span className="text-xs text-rpg-green font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Changes saved!
                    </span>
                  )}
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSave}
                    disabled={!hasUnsavedChanges || isSaving}
                    isLoading={isSaving}
                    leftIcon={<Sparkles className="w-4 h-4 text-rpg-bg" />}
                  >
                    Save Loadout
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "attributes" && (
            <Card variant="panel" className="p-6 space-y-4">
              <div className="border-b border-rpg-border pb-3">
                <h3 className="font-bold text-base text-rpg-parchment font-display">
                  Core Character Attributes
                </h3>
                <p className="text-xs text-rpg-parchment-muted">
                  Attributes grow permanently through real-world quests in their matching categories.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {Object.entries(character.attributes).map(([attrKey, attrVal]) => {
                  const desc = attributeDescriptions[attrKey] || "Character attribute.";
                  return (
                    <div
                      key={attrKey}
                      className="p-3.5 rounded-xl bg-rpg-surface border border-rpg-border space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-rpg-amber">
                          {attrKey}
                        </span>
                        <span className="text-base font-extrabold text-rpg-parchment font-mono">
                          {attrVal}
                        </span>
                      </div>
                      <p className="text-[11px] text-rpg-parchment-muted leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
