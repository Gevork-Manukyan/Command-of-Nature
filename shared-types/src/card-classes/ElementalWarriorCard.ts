import { z } from "zod";
import {
    ElementalAbilityCard,
    ElementalAbilityCardSchema,
} from "./ElementalAbilityCard";

export const ElementalWarriorCardSchema = ElementalAbilityCardSchema.extend({
    isDayBreak: z.boolean().default(false),
});

type ElementalWarriorCardType = z.infer<typeof ElementalWarriorCardSchema>;

export class ElementalWarriorCard extends ElementalAbilityCard {
    isDayBreak: ElementalWarriorCardType["isDayBreak"];

    protected constructor(params: ElementalWarriorCardType) {
        super(params);
        this.isDayBreak = params.isDayBreak;
    }

    static from(data: unknown): ElementalWarriorCard {
        const parsed = ElementalWarriorCardSchema.parse(data);
        return new ElementalWarriorCard(parsed);
    }
}
