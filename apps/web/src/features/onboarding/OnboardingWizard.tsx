import React, { useState } from "react";
import { BASE_AVATARS, COSMETIC_ASSETS, type BaseAvatarDefinition } from "@liferpg/game-rules";
import type { CharacterCosmetics } from "@liferpg/contracts";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { CharacterAvatar } from "../../components/character/CharacterAvatar";
import { ArrowRight, ArrowLeft, Sparkles, Check, Compass } from "lucide-react";

export interface OnboardingWizardProps {
  onComplete: (data: {
    name: string;
    nickname: string;
    age: number;
    avatarBaseId: string;
    initialCosmetics: CharacterCosmetics;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function OnboardingWizard({ onComplete, isLoading = false }: OnboardingWizardProps): React.JSX.Element {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState<number>(24);
  const [selectedAvatar, setSelectedAvatar] = useState<BaseAvatarDefinition>(BASE_AVATARS[0]!);
  const [customCosmetics, setCustomCosmetics] = useState<CharacterCosmetics>(BASE_AVATARS[0]!.defaultCosmetics);
  const [errors, setErrors] = useState<{ name?: string; nickname?: string; age?: string }>({});

  const handleSelectAvatar = (avatar: BaseAvatarDefinition) => {
    setSelectedAvatar(avatar);
    setCustomCosmetics(avatar.defaultCosmetics);
  };

  const validateStep1 = (): boolean => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Please enter your character's real or hero name.";
    if (!nickname.trim()) errs.nickname = "Please enter a short display nickname.";
    if (age < 1 || age > 120 || isNaN(age)) errs.age = "Please enter a valid age.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < 3) setStep((prev) => (prev + 1) as 2 | 3);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2);
  };

  const handleFinish = async () => {
    await onComplete({
      name: name.trim(),
      nickname: nickname.trim(),
      age: Number(age),
      avatarBaseId: selectedAvatar.id,
      initialCosmetics: customCosmetics,
    });
  };

  const hairAssets = COSMETIC_ASSETS.filter((c) => c.slot === "hair");
  const outfitAssets = COSMETIC_ASSETS.filter((c) => c.slot === "outfit");
  const bgAssets = COSMETIC_ASSETS.filter((c) => c.slot === "background");

  return (
    <div className="min-h-screen bg-rpg-bg flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rpg-amber/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 w-full max-w-2xl bg-rpg-panel border border-rpg-border rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Wizard Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rpg-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rpg-surface border border-rpg-amber flex items-center justify-center text-rpg-amber">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-rpg-parchment">
                Character Creation
              </h1>
              <p className="text-xs text-rpg-parchment-muted">
                Step {step} of 3: {step === 1 ? "Identity" : step === 2 ? "Origin Class" : "Custom Appearance"}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? "w-6 bg-rpg-amber shadow-glow-amber" : s < step ? "w-2 bg-rpg-green" : "w-2 bg-rpg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="text-sm text-rpg-parchment-muted">
              Every legend starts with a name. Tell us who is embarking on this journey.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full / Character Name"
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                autoFocus
              />

              <Input
                label="Display Nickname"
                placeholder="e.g. Nova"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                error={errors.nickname}
                helperText="Shown on HUD and level banners."
              />
            </div>

            <Input
              label="Age"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value, 10))}
              error={errors.age}
              className="sm:w-32"
            />
          </div>
        )}

        {/* STEP 2: ORIGIN CLASS & AVATAR BASE */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs sm:text-sm text-rpg-parchment-muted">
              Select your origin discipline. Each class begins with foundational attribute inclinations.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
              {BASE_AVATARS.map((avatar) => {
                const isSelected = selectedAvatar.id === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleSelectAvatar(avatar)}
                    className={`text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                      isSelected
                        ? "bg-rpg-surface border-rpg-amber shadow-glow-amber scale-102"
                        : "bg-rpg-panel border-rpg-border hover:border-rpg-amber/50 hover:bg-rpg-surface/50"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="text-2xl" aria-hidden="true">{avatar.icon}</span>
                      {isSelected && <Check className="w-4 h-4 text-rpg-amber" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-rpg-parchment">{avatar.name}</h4>
                      <p className="text-[10px] text-rpg-amber font-semibold uppercase">{avatar.classTitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Class Attribute Breakdown */}
            <Card variant="surface" className="p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rpg-parchment">{selectedAvatar.description}</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[11px] pt-2 border-t border-rpg-border/60">
                <div className="bg-rpg-panel p-1.5 rounded border border-rpg-border">
                  <span className="block text-rpg-parchment-muted text-[9px] uppercase">INT</span>
                  <span className="font-bold text-rpg-amber">{selectedAvatar.baseAttributes.intellect}</span>
                </div>
                <div className="bg-rpg-panel p-1.5 rounded border border-rpg-border">
                  <span className="block text-rpg-parchment-muted text-[9px] uppercase">STR</span>
                  <span className="font-bold text-rpg-amber">{selectedAvatar.baseAttributes.strength}</span>
                </div>
                <div className="bg-rpg-panel p-1.5 rounded border border-rpg-border">
                  <span className="block text-rpg-parchment-muted text-[9px] uppercase">DIS</span>
                  <span className="font-bold text-rpg-amber">{selectedAvatar.baseAttributes.discipline}</span>
                </div>
                <div className="bg-rpg-panel p-1.5 rounded border border-rpg-border">
                  <span className="block text-rpg-parchment-muted text-[9px] uppercase">CRE</span>
                  <span className="font-bold text-rpg-amber">{selectedAvatar.baseAttributes.creativity}</span>
                </div>
                <div className="bg-rpg-panel p-1.5 rounded border border-rpg-border">
                  <span className="block text-rpg-parchment-muted text-[9px] uppercase">WIS</span>
                  <span className="font-bold text-rpg-amber">{selectedAvatar.baseAttributes.wisdom}</span>
                </div>
                <div className="bg-rpg-panel p-1.5 rounded border border-rpg-border">
                  <span className="block text-rpg-parchment-muted text-[9px] uppercase">SOC</span>
                  <span className="font-bold text-rpg-amber">{selectedAvatar.baseAttributes.social}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* STEP 3: CUSTOM APPEARANCE & LIVE PREVIEW */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Live 2D Avatar Preview */}
              <div className="shrink-0 flex flex-col items-center">
                <CharacterAvatar
                  cosmetics={customCosmetics}
                  size="lg"
                  showBackground={true}
                  isIdleAnimated={true}
                />
                <span className="text-[11px] text-rpg-parchment-muted mt-2 font-mono">
                  Live 2D Sprite Preview
                </span>
              </div>

              {/* Customization Options */}
              <div className="w-full space-y-3">
                {/* Hair Slot */}
                <div>
                  <label className="block text-[11px] font-bold text-rpg-parchment uppercase mb-1">
                    Hair Style
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {hairAssets.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setCustomCosmetics({ ...customCosmetics, hairId: h.id })}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          customCosmetics.hairId === h.id
                            ? "bg-rpg-amber text-rpg-bg font-bold border-amber-300"
                            : "bg-rpg-surface text-rpg-parchment border-rpg-border hover:border-rpg-amber/50"
                        }`}
                      >
                        {h.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Outfit Slot */}
                <div>
                  <label className="block text-[11px] font-bold text-rpg-parchment uppercase mb-1">
                    Starting Outfit
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {outfitAssets.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setCustomCosmetics({ ...customCosmetics, outfitId: o.id })}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          customCosmetics.outfitId === o.id
                            ? "bg-rpg-amber text-rpg-bg font-bold border-amber-300"
                            : "bg-rpg-surface text-rpg-parchment border-rpg-border hover:border-rpg-amber/50"
                        }`}
                      >
                        {o.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Slot */}
                <div>
                  <label className="block text-[11px] font-bold text-rpg-parchment uppercase mb-1">
                    Starting Environment
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {bgAssets.map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setCustomCosmetics({ ...customCosmetics, backgroundId: bg.id })}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          customCosmetics.backgroundId === bg.id
                            ? "bg-rpg-amber text-rpg-bg font-bold border-amber-300"
                            : "bg-rpg-surface text-rpg-parchment border-rpg-border hover:border-rpg-amber/50"
                        }`}
                      >
                        {bg.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-rpg-border">
          {step > 1 ? (
            <Button
              variant="secondary"
              size="md"
              onClick={handleBack}
              disabled={isLoading}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleFinish}
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-5 h-5 text-rpg-bg" />}
              className="shadow-glow-amber"
            >
              Embark on Adventure
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
