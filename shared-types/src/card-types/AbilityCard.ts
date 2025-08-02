import { z } from "zod";
import { AbilityResultSchema } from "../ability-types";

export const AbilityCardSchema = z.object({
    ability: z.function().args().returns(z.array(AbilityResultSchema)),
    rowRequirement: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])),
});
type AbilityCardType = z.infer<typeof AbilityCardSchema>;

export class AbilityCard {
    ability: AbilityCardType['ability'];
    rowRequirement: AbilityCardType['rowRequirement'];

    constructor(params: AbilityCardType) {
        this.ability = params.ability;
        this.rowRequirement = params.rowRequirement;
    }

    static from(data: unknown): AbilityCard {
        const parsed = AbilityCardSchema.parse(data);
        return new AbilityCard(parsed);
    }
}