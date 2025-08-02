import { z } from "zod";
import { AbilityCardSchema } from "./AbilityCard";
import { ElementalCard, ElementalCardSchema } from "./ElementalCard";

export const ElementalWarriorCardSchema = ElementalCardSchema.merge(
    AbilityCardSchema
).extend({
    isDayBreak: z.boolean().default(false),
});

type ElementalWarriorCardType = z.infer<typeof ElementalWarriorCardSchema>;

export class ElementalWarriorCard extends ElementalCard {
    isDayBreak: ElementalWarriorCardType['isDayBreak'];

    constructor(params: ElementalWarriorCardType) {
        super(params);
        this.isDayBreak = params.isDayBreak;
    }

    static from(data: unknown): ElementalWarriorCard {
        const parsed = ElementalWarriorCardSchema.parse(data);
        return new ElementalWarriorCard(parsed);
    }
}
