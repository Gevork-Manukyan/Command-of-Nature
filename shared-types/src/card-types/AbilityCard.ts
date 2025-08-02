import { z } from "zod";
import { AbilityResultSchema } from "../ability-types";

export const AbilityCardSchema = z.object({
    ability: z.function().args().returns(z.array(AbilityResultSchema)),
    rowRequirement: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])),
});
type AbilityCardType = z.infer<typeof AbilityCardSchema>;

export class AbilityCard {
    constructor(public ability: AbilityCardType['ability'], public rowRequirement: AbilityCardType['rowRequirement']) {}

    static from(data: unknown): AbilityCard {
        const parsed = AbilityCardSchema.parse(data);
        return new AbilityCard(parsed.ability, parsed.rowRequirement);
    }
}