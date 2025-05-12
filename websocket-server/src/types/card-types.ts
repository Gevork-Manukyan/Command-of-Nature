// import { z } from "zod";
// import { AbilityResultSchema } from "./ability-types";

// export const ElementSchema = z.enum(["twig", "pebble", "leaf", "droplet"]);
// export const SageSchema = z.enum(["Cedar", "Gravel", "Porella", "Torrent"]);
// export type Element = z.infer<typeof ElementSchema>;
// export type Sage = z.infer<typeof SageSchema>;

// export type Decklist = {
//   sage: ElementalSage;
//   champions: {
//     level4: ElementalChampion;
//     level6: ElementalChampion;
//     level8: ElementalChampion;
//   },
//   warriors: ElementalWarriorCard[];
//   basic: ElementalStarterCard;
//   items: ItemCard[];
// }

// export const CardSchema = z.object({
//   name: z.string(),
//   price: z.number(),
//   img: z.string(),
// });

// export const StarterCardSchema = z.object({
//   price: z.literal(1),
// });

// export const AbilityCardSchema = z.object({
//   ability: z.function().args().returns(z.array(AbilityResultSchema)),
//   rowRequirement: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])),
// });

// export const ElementalCardSchema = CardSchema.extend({
//   element: ElementSchema,
//   attack: z.number(),
//   health: z.number(),
//   shieldCount: z.number().default(0),
//   boostCount: z.number().default(0),
//   damageCount: z.number().default(0),
// });

// export const ElementalStarterCardSchema = ElementalCardSchema.extend({
//   price: z.literal(1),
// });

// export const ElementalWarriorCardSchema = ElementalCardSchema.merge(AbilityCardSchema)
//   .extend({
//     isDayBreak: z.boolean().default(false),
// });

// export const ElementalWarriorStarterCardSchema = ElementalWarriorCardSchema.extend({
//   price: z.literal(1),
// });

// export const ElementalChampionSchema = ElementalWarriorCardSchema.extend({
//   price: z.literal(1),
//   levelRequirement: z.union([z.literal(4), z.literal(6), z.literal(8)]),
// });

// export const ElementalSageSchema = ElementalCardSchema.merge(ElementalWarriorCardSchema)
//   .extend({
//     price: z.literal(1),
//     sage: SageSchema,
//   });

// export const ItemCardSchema = CardSchema.merge(AbilityCardSchema.omit({ rowRequirement: true }));
  
// export const AttackCardSchema = CardSchema.merge(AbilityCardSchema);

// export const AttackStarterCardSchema = AttackCardSchema.extend({
//   price: z.literal(1),
// });

// export const UtilityCardSchema = ItemCardSchema;

// export const InstantCardSchema = ItemCardSchema;

// export const InstantStarterCardSchema = InstantCardSchema.extend({
//   price: z.literal(1),
// });


// export type Card = z.infer<typeof CardSchema>;
// export type StarterCard = z.infer<typeof StarterCardSchema>;
// export type AbilityCard = z.infer<typeof AbilityCardSchema>;
// export type ElementalCard = z.infer<typeof ElementalCardSchema>;
// export type ElementalStarterCard = z.infer<typeof ElementalStarterCardSchema>;
// export type ElementalWarriorCard = z.infer<typeof ElementalWarriorCardSchema>;
// export type ElementalWarriorStarterCard = z.infer<typeof ElementalWarriorStarterCardSchema>;
// export type ElementalChampion = z.infer<typeof ElementalChampionSchema>;
// export type ElementalSage = z.infer<typeof ElementalSageSchema>;
// export type ItemCard = z.infer<typeof ItemCardSchema>;
// export type AttackCard = z.infer<typeof AttackCardSchema>;
// export type AttackStarterCard = z.infer<typeof AttackStarterCardSchema>;
// export type UtilityCard = z.infer<typeof UtilityCardSchema>;
// export type InstantCard = z.infer<typeof InstantCardSchema>;
// export type InstantStarterCard = z.infer<typeof InstantStarterCardSchema>;