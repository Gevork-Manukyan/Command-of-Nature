import { z } from "zod";
import { AbilityResultSchema } from "./ability-types";

export const ElementSchema = z.enum(["twig", "pebble", "leaf", "droplet"]);
export type Element = z.infer<typeof ElementSchema>;

export const SageSchema = z.enum(["Cedar", "Gravel", "Porella", "Torrent"]);
export type Sage = z.infer<typeof SageSchema>;

export const RowRequirementSchema = z.array(z.union([z.literal(1), z.literal(2), z.literal(3)]));
export const AbilitySchema = z.function().args().returns(z.array(AbilityResultSchema));

/*
export const CardSchema = z.object({
  name: z.string(),
  price: z.number(),
  img: z.string(),
});

export const StarterCardSchema = z.object({
  price: z.literal(1),
});

export const AbilityCardSchema = z.object({
  ability: z.function().args().returns(z.array(AbilityResultSchema)),
  rowRequirement: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])),
});

export const ElementalCardSchema = CardSchema.extend({
  element: ElementSchema,
  attack: z.number(),
  health: z.number(),
  shieldCount: z.number().default(0),
  boostCount: z.number().default(0),
  damageCount: z.number().default(0),
});

export const ElementalStarterCardSchema = ElementalCardSchema.extend({
  price: z.literal(1),
});

export const ElementalWarriorCardSchema = ElementalCardSchema.merge(AbilityCardSchema)
  .extend({
    isDayBreak: z.boolean().default(false),
});

export const ElementalWarriorStarterCardSchema = ElementalWarriorCardSchema.extend({
  price: z.literal(1),
});

export const ElementalChampionSchema = ElementalWarriorCardSchema.extend({
  price: z.literal(1),
  levelRequirement: z.union([z.literal(4), z.literal(6), z.literal(8)]),
});

export const ElementalSageSchema = ElementalCardSchema.merge(ElementalWarriorCardSchema)
  .extend({
    price: z.literal(1),
    sage: SageSchema,
  });

export const ItemCardSchema = CardSchema.merge(AbilityCardSchema.omit({ rowRequirement: true }));
  
export const AttackCardSchema = CardSchema.merge(AbilityCardSchema);

export const AttackStarterCardSchema = AttackCardSchema.extend({
  price: z.literal(1),
});

export const UtilityCardSchema = ItemCardSchema;

export const InstantCardSchema = ItemCardSchema;

export const InstantStarterCardSchema = InstantCardSchema.extend({
  price: z.literal(1),
});
*/