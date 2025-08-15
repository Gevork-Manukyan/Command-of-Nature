import { z } from "zod";
import {
    ElementalAbilityCard,
    ElementalAbilityCardSchema,
} from "./ElementalAbilityCard";

export const ElementalWarriorCardSchema = ElementalAbilityCardSchema.extend({
    isDayBreak: z.boolean(),
});

type ElementalWarriorCardType = z.infer<typeof ElementalWarriorCardSchema>;

export class ElementalWarriorCard extends ElementalAbilityCard {
    isDayBreak: ElementalWarriorCardType["isDayBreak"];

    protected constructor(params: ElementalWarriorCardType) {
        super(params);
        this.isDayBreak = params.isDayBreak ?? false;
    }

    static from(data: unknown): ElementalWarriorCard {
        const parsed = ElementalWarriorCardSchema.parse(data);
        return new ElementalWarriorCard(parsed);
    }

    getData() {
        return {
            ...super.getData(),
            isDayBreak: this.isDayBreak,
        };
    }
    
    toJSON() {
        return this.getData();
    }
}
