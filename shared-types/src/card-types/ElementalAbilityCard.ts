import { z } from "zod";
import { ElementalCard, ElementalCardSchema } from "./ElementalCard";
import { AbilityResultSchema } from "../ability-types";

export const ElementalAbilityCardSchema = ElementalCardSchema.extend({
    ability: z.function().args().returns(z.array(AbilityResultSchema)),
    rowRequirement: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])),
});

type ElementalAbilityCardType = z.infer<typeof ElementalAbilityCardSchema>;

export class ElementalAbilityCard extends ElementalCard {
    ability: ElementalAbilityCardType['ability'];
    rowRequirement: ElementalAbilityCardType['rowRequirement'];

    constructor(params: ElementalAbilityCardType) {
        super(params);
        this.ability = params.ability;
        this.rowRequirement = params.rowRequirement;
    }

    static from(data: unknown): ElementalAbilityCard {
        const parsed = ElementalAbilityCardSchema.parse(data);
        return new ElementalAbilityCard(parsed);
    }
}