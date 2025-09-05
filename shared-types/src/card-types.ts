import { z } from "zod";
import { AbilityResultSchema } from "./ability-types";

export const ElementSchema = z.enum(["twig", "pebble", "leaf", "droplet"]);
export type Element = z.infer<typeof ElementSchema>;

export const SageSchema = z.enum(["Cedar", "Gravel", "Porella", "Torrent"]);
export type Sage = z.infer<typeof SageSchema>;

export const ItemTypeSchema = z.enum(["attack", "utility", "instant"]);
export type ItemType = z.infer<typeof ItemTypeSchema>;

export const RowRequirementSchema = z.array(z.union([z.literal(1), z.literal(2), z.literal(3)]));
export const AbilitySchema = z.function().args().returns(z.array(AbilityResultSchema));
export const OptionalAbilityCardSchema = z.object({
    ability: AbilitySchema.optional(),
});