import React from "react";
import type { CharacterCosmetics } from "@liferpg/contracts";
import { cn } from "../../lib/utils";

export interface CharacterAvatarProps {
  cosmetics: Partial<CharacterCosmetics>;
  avatarBaseId?: string;
  size?: "sm" | "md" | "lg" | "xl" | "viewport";
  showBackground?: boolean;
  isIdleAnimated?: boolean;
  className?: string;
}

export function CharacterAvatar({
  cosmetics,
  size = "md",
  showBackground = true,
  isIdleAnimated = true,
  className,
}: CharacterAvatarProps): React.JSX.Element {
  const {
    hairId = "hair_spiky_amber",
    outfitId = "outfit_adventurer",
    accessoryId = "acc_none",
    backgroundId = "bg_forest",
    effectId = "effect_none",
  } = cosmetics;

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-28 h-28 sm:w-32 sm:h-32",
    lg: "w-44 h-44 sm:w-52 sm:h-52",
    xl: "w-64 h-64 sm:w-72 sm:h-72",
    viewport: "w-full aspect-16/9 sm:aspect-21/9 max-h-[420px]",
  };

  // Background Theme Gradients & Accents
  const renderBackground = () => {
    switch (backgroundId) {
      case "bg_library":
        return (
          <g>
            <rect width="400" height="300" fill="#241B15" />
            <rect x="0" y="220" width="400" height="80" fill="#18120E" />
            {/* Bookshelves */}
            <path d="M40 40 H140 V200 H40 Z M260 40 H360 V200 H260 Z" fill="#3D2C1E" stroke="#5C422D" strokeWidth="3" />
            <line x1="40" y1="90" x2="140" y2="90" stroke="#5C422D" strokeWidth="3" />
            <line x1="40" y1="140" x2="140" y2="140" stroke="#5C422D" strokeWidth="3" />
            <line x1="260" y1="90" x2="360" y2="90" stroke="#5C422D" strokeWidth="3" />
            <line x1="260" y1="140" x2="360" y2="140" stroke="#5C422D" strokeWidth="3" />
            {/* Candle light glow */}
            <circle cx="200" cy="80" r="60" fill="#F4B860" opacity="0.12" />
          </g>
        );
      case "bg_mountain":
        return (
          <g>
            <rect width="400" height="300" fill="#131B2D" />
            {/* Mountain Peaks */}
            <polygon points="60,240 180,90 280,240" fill="#202D49" />
            <polygon points="140,240 240,60 350,240" fill="#2A3B5E" />
            <polygon points="210,100 240,60 270,100" fill="#E2E8F0" />
            <rect x="0" y="230" width="400" height="70" fill="#18233A" />
            {/* Cold blue moon glow */}
            <circle cx="90" cy="70" r="30" fill="#6CA8FF" opacity="0.3" />
          </g>
        );
      case "bg_cyber_arcade":
        return (
          <g>
            <rect width="400" height="300" fill="#1C0F2B" />
            {/* Neon grid floor */}
            <rect x="0" y="210" width="400" height="90" fill="#26123D" />
            <line x1="0" y1="210" x2="400" y2="210" stroke="#9B8AFB" strokeWidth="2" opacity="0.6" />
            <line x1="0" y1="240" x2="400" y2="240" stroke="#9B8AFB" strokeWidth="1" opacity="0.4" />
            <line x1="200" y1="210" x2="200" y2="300" stroke="#F4B860" strokeWidth="2" opacity="0.5" />
            <line x1="120" y1="210" x2="80" y2="300" stroke="#9B8AFB" strokeWidth="1" opacity="0.4" />
            <line x1="280" y1="210" x2="320" y2="300" stroke="#9B8AFB" strokeWidth="1" opacity="0.4" />
            {/* Synthwave Sun */}
            <circle cx="200" cy="140" r="50" fill="#E67B7B" opacity="0.25" />
          </g>
        );
      case "bg_celestial":
        return (
          <g>
            <rect width="400" height="300" fill="#120E2E" />
            <circle cx="70" cy="50" r="2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="320" cy="70" r="2" fill="#FFFFFF" opacity="0.8" />
            <circle cx="150" cy="90" r="1.5" fill="#FFFFFF" opacity="0.6" />
            <circle cx="270" cy="40" r="2.5" fill="#9B8AFB" opacity="0.9" />
            {/* Astral portal circle */}
            <circle cx="200" cy="150" r="75" fill="none" stroke="#9B8AFB" strokeWidth="3" opacity="0.35" strokeDasharray="6,6" />
            <rect x="0" y="230" width="400" height="70" fill="#1A153D" />
          </g>
        );
      case "bg_forest":
      default:
        return (
          <g>
            <rect width="400" height="300" fill="#14261C" />
            {/* Cozy trees */}
            <circle cx="80" cy="140" r="70" fill="#1D382A" />
            <circle cx="320" cy="130" r="75" fill="#1A3326" />
            <rect x="0" y="220" width="400" height="80" fill="#1A3326" />
            {/* Ambient fireflies */}
            <circle cx="110" cy="100" r="3" fill="#67C587" opacity="0.7" />
            <circle cx="290" cy="90" r="3.5" fill="#F4B860" opacity="0.8" />
            <circle cx="190" cy="60" r="2.5" fill="#F4B860" opacity="0.6" />
          </g>
        );
    }
  };

  // Outfit Layer
  const renderOutfit = () => {
    switch (outfitId) {
      case "outfit_plate_armor":
        return (
          <g>
            {/* Steel Breastplate */}
            <path d="M175 145 Q200 135 225 145 L220 210 Q200 215 180 210 Z" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
            {/* Pauldrons */}
            <rect x="160" y="145" width="22" height="18" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
            <rect x="218" y="145" width="22" height="18" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
            {/* Gold trim */}
            <line x1="180" y1="165" x2="220" y2="165" stroke="#F4B860" strokeWidth="3" />
          </g>
        );
      case "outfit_mage_robe":
        return (
          <g>
            {/* Flowing Violet Robe */}
            <path d="M170 145 Q200 138 230 145 L240 235 Q200 240 160 235 Z" fill="#581C87" stroke="#9B8AFB" strokeWidth="2" />
            <path d="M185 145 L200 235 L215 145" fill="none" stroke="#F4B860" strokeWidth="2" />
          </g>
        );
      case "outfit_scholar_coat":
        return (
          <g>
            {/* Sage Trenchcoat */}
            <path d="M172 145 Q200 138 228 145 L232 225 Q200 228 168 225 Z" fill="#2A3150" stroke="#3E4870" strokeWidth="2" />
            <rect x="188" y="152" width="24" height="60" fill="#F3E8D0" />
            <line x1="200" y1="152" x2="200" y2="212" stroke="#E67B7B" strokeWidth="2" />
          </g>
        );
      case "outfit_stealth_tunic":
        return (
          <g>
            {/* Rogue Dark Garb */}
            <path d="M174 145 Q200 138 226 145 L222 215 Q200 218 178 215 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            {/* Leather harness */}
            <line x1="175" y1="150" x2="225" y2="210" stroke="#78350F" strokeWidth="3" />
          </g>
        );
      case "outfit_adventurer":
      default:
        return (
          <g>
            {/* Green Adventurer Tunic */}
            <path d="M174 145 Q200 138 226 145 L224 215 Q200 218 176 215 Z" fill="#15803D" stroke="#166534" strokeWidth="2" />
            {/* Brown Belt with Gold Buckle */}
            <rect x="176" y="185" width="48" height="8" fill="#78350F" />
            <rect x="194" y="183" width="12" height="12" fill="#F4B860" rx="2" />
          </g>
        );
    }
  };

  // Hair Layer
  const renderHair = () => {
    switch (hairId) {
      case "hair_flowing_dark":
        return (
          <g>
            <path d="M170 100 Q200 65 230 100 Q240 135 235 155 Q225 125 220 110 Q200 100 180 110 Q175 125 165 155 Q160 135 170 100 Z" fill="#0F172A" />
          </g>
        );
      case "hair_mage_violet":
        return (
          <g>
            <path d="M168 95 Q200 60 232 95 Q245 130 238 160 Q228 120 220 105 Q200 95 180 105 Q172 120 162 160 Q155 130 168 95 Z" fill="#9B8AFB" />
          </g>
        );
      case "hair_scholar_neat":
        return (
          <g>
            <path d="M172 98 Q200 70 228 98 Q232 110 226 115 Q200 102 174 115 Q168 110 172 98 Z" fill="#713F12" />
          </g>
        );
      case "hair_rogue_hood":
        return (
          <g>
            <path d="M162 110 Q200 55 238 110 L242 160 Q200 150 158 160 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          </g>
        );
      case "hair_spiky_amber":
      default:
        return (
          <g>
            {/* Spiky Anime RPG Hair */}
            <polygon points="170,95 185,65 195,90 205,60 215,90 230,68 230,105 170,105" fill="#F4B860" stroke="#D97706" strokeWidth="2" />
          </g>
        );
    }
  };

  // Accessory Layer
  const renderAccessory = () => {
    switch (accessoryId) {
      case "acc_glasses":
        return (
          <g>
            <rect x="180" y="108" width="16" height="10" rx="2" fill="none" stroke="#F4B860" strokeWidth="2" />
            <rect x="204" y="108" width="16" height="10" rx="2" fill="none" stroke="#F4B860" strokeWidth="2" />
            <line x1="196" y1="113" x2="204" y2="113" stroke="#F4B860" strokeWidth="2" />
          </g>
        );
      case "acc_headband":
        return (
          <g>
            <rect x="171" y="96" width="58" height="7" fill="#E67B7B" rx="1" />
            <circle cx="200" cy="99" r="4" fill="#F4B860" />
          </g>
        );
      case "acc_amulet":
        return (
          <g>
            <polygon points="200,165 206,174 200,183 194,174" fill="#6CA8FF" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="200" cy="174" r="2" fill="#FFFFFF" />
          </g>
        );
      case "acc_crown":
        return (
          <g>
            <polygon points="175,82 185,66 193,76 200,60 207,76 215,66 225,82" fill="#F4B860" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="200" cy="74" r="2.5" fill="#E67B7B" />
          </g>
        );
      case "acc_none":
      default:
        return null;
    }
  };

  // Aura / Particle Effects
  const renderEffect = () => {
    switch (effectId) {
      case "effect_sparkles":
        return (
          <g className="animate-pulse">
            <polygon points="150,90 153,95 158,97 153,99 150,104 147,99 142,97 147,95" fill="#F4B860" />
            <polygon points="250,110 252,114 256,115 252,117 250,121 248,117 244,115 248,114" fill="#9B8AFB" />
            <polygon points="160,200 162,204 166,205 162,207 160,211 158,207 154,205 158,204" fill="#67C587" />
          </g>
        );
      case "effect_none":
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden border border-rpg-border flex items-center justify-center select-none shadow-pixel",
        sizeClasses[size],
        className
      )}
      aria-label="Character Sprite Avatar"
    >
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 0: Background */}
        {showBackground && renderBackground()}

        {/* Character Container with optional Idle Float/Breathe */}
        <g className={cn(isIdleAnimated && "motion-safe:animate-bounce-subtle")}>
          {/* Layer 1: Ground Shadow */}
          <ellipse cx="200" cy="255" rx="42" ry="10" fill="#000000" opacity="0.35" />

          {/* Layer 2: Legs & Boots */}
          <rect x="180" y="210" width="14" height="40" fill="#1E293B" rx="3" />
          <rect x="206" y="210" width="14" height="40" fill="#1E293B" rx="3" />
          {/* Boots */}
          <path d="M176 242 H195 V252 H174 Z" fill="#78350F" />
          <path d="M205 242 H224 V252 H203 Z" fill="#78350F" />

          {/* Layer 3: Outfit / Torso */}
          {renderOutfit()}

          {/* Layer 4: Head & Face */}
          <rect x="174" y="88" width="52" height="56" rx="20" fill="#FBD38D" />
          {/* Expressive Eyes */}
          <rect x="185" y="110" width="7" height="6" rx="2" fill="#171A2B" />
          <rect x="208" y="110" width="7" height="6" rx="2" fill="#171A2B" />
          <circle cx="187" cy="111" r="1.5" fill="#FFFFFF" />
          <circle cx="210" cy="111" r="1.5" fill="#FFFFFF" />
          {/* Cozy Smile */}
          <path d="M194 125 Q200 130 206 125" fill="none" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
          {/* Rosy Cheeks */}
          <ellipse cx="182" cy="122" rx="4" ry="2" fill="#E67B7B" opacity="0.5" />
          <ellipse cx="218" cy="122" rx="4" ry="2" fill="#E67B7B" opacity="0.5" />

          {/* Layer 5: Hair */}
          {renderHair()}

          {/* Layer 6: Accessory */}
          {renderAccessory()}

          {/* Layer 7: Effects */}
          {renderEffect()}
        </g>
      </svg>
    </div>
  );
}
