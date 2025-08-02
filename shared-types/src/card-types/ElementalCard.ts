import { z } from "zod";
import { Card, CardSchema } from "./Card";
import { ElementSchema } from "../card-types";

export const ElementalCardSchema = CardSchema.extend({
    element: ElementSchema,
    attack: z.number(),
    health: z.number(),
    shieldCount: z.number().default(0),
    boostCount: z.number().default(0),
    damageCount: z.number().default(0),
});

type ElementalCardType = z.infer<typeof ElementalCardSchema>;

export class ElementalCard extends Card {
    element: ElementalCardType['element'];
    attack: ElementalCardType['attack'];
    health: ElementalCardType['health'];
    shieldCount: ElementalCardType['shieldCount'];
    boostCount: ElementalCardType['boostCount'];
    damageCount: ElementalCardType['damageCount'];

    constructor(params: ElementalCardType) {
        super(params);
        this.element = params.element;
        this.attack = params.attack;
        this.health = params.health;
        this.shieldCount = params.shieldCount;
        this.boostCount = params.boostCount;
        this.damageCount = params.damageCount;
    }

    static from(data: unknown): ElementalCard {
        const parsed = ElementalCardSchema.parse(data);
        return new ElementalCard(parsed);
    }
}
