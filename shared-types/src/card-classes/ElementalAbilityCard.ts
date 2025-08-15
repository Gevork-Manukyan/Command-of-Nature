import { z } from "zod";
import { ElementalCard, ElementalCardSchema } from "./ElementalCard";
import { AbilitySchema, RowRequirementSchema } from "../card-types";

export const ElementalAbilityCardSchema = ElementalCardSchema.extend({
    ability: AbilitySchema,
    rowRequirement: RowRequirementSchema,
});

type ElementalAbilityCardType = z.infer<typeof ElementalAbilityCardSchema>;

export class ElementalAbilityCard extends ElementalCard {
    ability: ElementalAbilityCardType['ability'];
    rowRequirement: ElementalAbilityCardType['rowRequirement'];

    protected constructor(params: ElementalAbilityCardType) {
        super(params);
        this.ability = params.ability;
        this.rowRequirement = params.rowRequirement;
    }

    static from(data: ElementalAbilityCardType): ElementalAbilityCard {
        const parsed = ElementalAbilityCardSchema.parse(data);
        return new ElementalAbilityCard(parsed);
    }

    getData() {
        return {
            ...super.getData(),
            rowRequirement: this.rowRequirement,
        };
    }

    toJSON() {
        return this.getData();
    }
}