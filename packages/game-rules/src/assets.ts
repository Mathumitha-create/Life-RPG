export interface CharacterAttributes {
  intellect: number;
  strength: number;
  discipline: number;
  creativity: number;
  wisdom: number;
  social: number;
}

export interface CharacterCosmetics {
  hairId: string;
  outfitId: string;
  shoesId?: string;
  accessoryId?: string;
  backgroundId: string;
  effectId?: string;
}

export interface BaseAvatarDefinition {
  id: string;
  name: string;
  classTitle: string;
  description: string;
  icon: string;
  baseAttributes: CharacterAttributes;
  defaultCosmetics: CharacterCosmetics;
}

export interface CosmeticAssetDefinition {
  id: string;
  name: string;
  slot: "hair" | "outfit" | "shoes" | "accessory" | "background" | "effect";
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  previewColor: string;
  description: string;
  unlockedByDefault?: boolean;
}

export const BASE_AVATARS: BaseAvatarDefinition[] = [
  {
    id: "base_warrior",
    name: "Iron Vanguard",
    classTitle: "Warrior",
    description: "Driven by physical mastery, grit, and relentless daily discipline.",
    icon: "⚔️",
    baseAttributes: { intellect: 8, strength: 16, discipline: 14, creativity: 8, wisdom: 10, social: 8 },
    defaultCosmetics: {
      hairId: "hair_spiky_amber",
      outfitId: "outfit_plate_armor",
      shoesId: "shoes_boots",
      accessoryId: "acc_headband",
      backgroundId: "bg_mountain",
      effectId: "effect_none",
    },
  },
  {
    id: "base_mage",
    name: "Arcane Mystic",
    classTitle: "Mage",
    description: "Harnesses deep focus, continuous study, and intellectual curiosity.",
    icon: "🔮",
    baseAttributes: { intellect: 16, strength: 6, discipline: 12, creativity: 12, wisdom: 14, social: 8 },
    defaultCosmetics: {
      hairId: "hair_mage_violet",
      outfitId: "outfit_mage_robe",
      shoesId: "shoes_boots",
      accessoryId: "acc_amulet",
      backgroundId: "bg_celestial",
      effectId: "effect_sparkles",
    },
  },
  {
    id: "base_scholar",
    name: "Grand Sage",
    classTitle: "Scholar",
    description: "Devoted to coding, reading, logical analysis, and lifelong learning.",
    icon: "📚",
    baseAttributes: { intellect: 18, strength: 6, discipline: 16, creativity: 10, wisdom: 14, social: 6 },
    defaultCosmetics: {
      hairId: "hair_scholar_neat",
      outfitId: "outfit_scholar_coat",
      shoesId: "shoes_boots",
      accessoryId: "acc_glasses",
      backgroundId: "bg_library",
      effectId: "effect_none",
    },
  },
  {
    id: "base_rogue",
    name: "Shadow Scout",
    classTitle: "Rogue",
    description: "Fast, agile, creative problem solver who executes rapid iterations.",
    icon: "🗡️",
    baseAttributes: { intellect: 10, strength: 10, discipline: 12, creativity: 16, wisdom: 8, social: 12 },
    defaultCosmetics: {
      hairId: "hair_rogue_hood",
      outfitId: "outfit_stealth_tunic",
      shoesId: "shoes_boots",
      accessoryId: "acc_none",
      backgroundId: "bg_cyber_arcade",
      effectId: "effect_none",
    },
  },
  {
    id: "base_ranger",
    name: "Wilds Tracker",
    classTitle: "Ranger",
    description: "Thrives in the outdoors, physical endurance, and environmental balance.",
    icon: "🏹",
    baseAttributes: { intellect: 10, strength: 14, discipline: 14, creativity: 10, wisdom: 14, social: 8 },
    defaultCosmetics: {
      hairId: "hair_flowing_dark",
      outfitId: "outfit_adventurer",
      shoesId: "shoes_boots",
      accessoryId: "acc_headband",
      backgroundId: "bg_forest",
      effectId: "effect_none",
    },
  },
  {
    id: "base_paladin",
    name: "Beacon Knight",
    classTitle: "Paladin",
    description: "Unifies community, ethical leadership, and steadfast physical health.",
    icon: "🛡️",
    baseAttributes: { intellect: 10, strength: 14, discipline: 14, creativity: 8, wisdom: 12, social: 14 },
    defaultCosmetics: {
      hairId: "hair_spiky_amber",
      outfitId: "outfit_plate_armor",
      shoesId: "shoes_boots",
      accessoryId: "acc_amulet",
      backgroundId: "bg_mountain",
      effectId: "effect_sparkles",
    },
  },
  {
    id: "base_bard",
    name: "Story Weaver",
    classTitle: "Bard",
    description: "Inspires through creative arts, communication, writing, and music.",
    icon: "🪕",
    baseAttributes: { intellect: 10, strength: 8, discipline: 10, creativity: 18, wisdom: 10, social: 16 },
    defaultCosmetics: {
      hairId: "hair_flowing_dark",
      outfitId: "outfit_adventurer",
      shoesId: "shoes_boots",
      accessoryId: "acc_crown",
      backgroundId: "bg_cyber_arcade",
      effectId: "effect_sparkles",
    },
  },
  {
    id: "base_alchemist",
    name: "Potion Craft",
    classTitle: "Alchemist",
    description: "Innovator blending experiments, science, and creative breakthrough habits.",
    icon: "⚗️",
    baseAttributes: { intellect: 14, strength: 8, discipline: 12, creativity: 16, wisdom: 12, social: 8 },
    defaultCosmetics: {
      hairId: "hair_scholar_neat",
      outfitId: "outfit_scholar_coat",
      shoesId: "shoes_boots",
      accessoryId: "acc_glasses",
      backgroundId: "bg_library",
      effectId: "effect_sparkles",
    },
  },
];

export const COSMETIC_ASSETS: CosmeticAssetDefinition[] = [
  // Hairstyles
  { id: "hair_spiky_amber", name: "Amber Spike", slot: "hair", rarity: "COMMON", previewColor: "#F4B860", description: "Bold and adventurous haircut.", unlockedByDefault: true },
  { id: "hair_flowing_dark", name: "Flowing Obsidian", slot: "hair", rarity: "COMMON", previewColor: "#2A3150", description: "Long, resilient dark locks.", unlockedByDefault: true },
  { id: "hair_mage_violet", name: "Violet Cascade", slot: "hair", rarity: "RARE", previewColor: "#9B8AFB", description: "Infused with mystical energy.", unlockedByDefault: true },
  { id: "hair_scholar_neat", name: "Scholar Part", slot: "hair", rarity: "COMMON", previewColor: "#CFC3A8", description: "Crisp and studious styling.", unlockedByDefault: true },
  { id: "hair_rogue_hood", name: "Shadow Shroud", slot: "hair", rarity: "RARE", previewColor: "#171A2B", description: "Concealed look for swift movers.", unlockedByDefault: true },

  // Outfits
  { id: "outfit_adventurer", name: "Adventurer Tunic", slot: "outfit", rarity: "COMMON", previewColor: "#67C587", description: "Versatile leather and linen travel gear.", unlockedByDefault: true },
  { id: "outfit_mage_robe", name: "Arcane Mantle", slot: "outfit", rarity: "RARE", previewColor: "#9B8AFB", description: "Flowing robes woven with runes.", unlockedByDefault: true },
  { id: "outfit_scholar_coat", name: "Sage Overcoat", slot: "outfit", rarity: "COMMON", previewColor: "#363E63", description: "Tailored coat with many parchment pockets.", unlockedByDefault: true },
  { id: "outfit_plate_armor", name: "Iron Cuirass", slot: "outfit", rarity: "RARE", previewColor: "#CFC3A8", description: "Forged steel built for heavy resilience.", unlockedByDefault: true },
  { id: "outfit_stealth_tunic", name: "Nightrunner Garb", slot: "outfit", rarity: "RARE", previewColor: "#202642", description: "Lightweight fabric that dampens footsteps.", unlockedByDefault: true },

  // Accessories
  { id: "acc_none", name: "No Accessory", slot: "accessory", rarity: "COMMON", previewColor: "transparent", description: "Clean minimalist style.", unlockedByDefault: true },
  { id: "acc_glasses", name: "Focus Spectacles", slot: "accessory", rarity: "COMMON", previewColor: "#F4B860", description: "Sharpen your intellect and clarity.", unlockedByDefault: true },
  { id: "acc_headband", name: "Warrior Band", slot: "accessory", rarity: "COMMON", previewColor: "#E67B7B", description: "Symbol of unwavering dedication.", unlockedByDefault: true },
  { id: "acc_amulet", name: "Star Amulet", slot: "accessory", rarity: "EPIC", previewColor: "#6CA8FF", description: "Radiates gentle celestial protection.", unlockedByDefault: true },
  { id: "acc_crown", name: "Laurel Crown", slot: "accessory", rarity: "LEGENDARY", previewColor: "#F4B860", description: "Worn only by relentless achievers.", unlockedByDefault: false },

  // Backgrounds
  { id: "bg_forest", name: "Verdant Sanctuary", slot: "background", rarity: "COMMON", previewColor: "#1B3B2B", description: "A peaceful woodland glowing with fireflies.", unlockedByDefault: true },
  { id: "bg_library", name: "Grand Archives", slot: "background", rarity: "COMMON", previewColor: "#2E241A", description: "Warm study halls lined with endless knowledge.", unlockedByDefault: true },
  { id: "bg_mountain", name: "Summit of Valor", slot: "background", rarity: "COMMON", previewColor: "#1A253B", description: "Crisp snowy mountain overlooking the clouds.", unlockedByDefault: true },
  { id: "bg_cyber_arcade", name: "Retro Arcade", slot: "background", rarity: "RARE", previewColor: "#321538", description: "Nostalgic 80s synthwave glow.", unlockedByDefault: true },
  { id: "bg_celestial", name: "Astral Observatory", slot: "background", rarity: "EPIC", previewColor: "#1E1A3E", description: "Floating terrace beneath the stars.", unlockedByDefault: true },
];

export function getBaseAvatar(avatarId: string): BaseAvatarDefinition {
  return BASE_AVATARS.find((a) => a.id === avatarId) ?? BASE_AVATARS[0]!;
}

export function getCosmeticAsset(assetId: string): CosmeticAssetDefinition | undefined {
  return COSMETIC_ASSETS.find((a) => a.id === assetId);
}
