import { z } from "zod";

export const CurrencyTypeEnum = z.enum(["GOLD", "GEMS"]);
export type CurrencyType = z.infer<typeof CurrencyTypeEnum>;

export const ItemTypeEnum = z.enum(["HAIR", "OUTFIT", "SHOES", "ACCESSORY", "THEME", "BADGE", "EFFECT"]);
export type ItemType = z.infer<typeof ItemTypeEnum>;

export const ItemRarityEnum = z.enum(["COMMON", "RARE", "EPIC", "LEGENDARY"]);
export type ItemRarity = z.infer<typeof ItemRarityEnum>;

export const CatalogItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: ItemTypeEnum,
  rarity: ItemRarityEnum,
  price: z.object({
    currency: CurrencyTypeEnum,
    amount: z.number().int().positive(),
  }),
  assetId: z.string(),
  previewUrl: z.string().optional(),
  active: z.boolean().default(true),
});
export type CatalogItem = z.infer<typeof CatalogItemSchema>;

export const InventoryItemSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  quantity: z.number().int().min(1),
  acquiredAt: z.string(),
  source: z.enum(["PURCHASE", "ACHIEVEMENT", "EVENT", "INITIAL"]),
});
export type InventoryItem = z.infer<typeof InventoryItemSchema>;

export const PurchaseRequestSchema = z.object({
  itemId: z.string(),
  operationId: z.string(),
});
export type PurchaseRequest = z.infer<typeof PurchaseRequestSchema>;

export const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.string(),
  reward: z.object({
    xp: z.number().int().default(0),
    gold: z.number().int().default(0),
    gems: z.number().int().default(0),
    badgeId: z.string().optional(),
  }),
  unlockedAt: z.string().optional(),
  isSecret: z.boolean().default(false),
});
export type Achievement = z.infer<typeof AchievementSchema>;
