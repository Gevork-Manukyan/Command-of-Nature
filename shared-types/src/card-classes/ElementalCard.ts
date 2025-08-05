import { z } from "zod";
import { Card, CardSchema } from "./Card";
import { ElementSchema } from "../card-types";

export const ElementalCardSchema = CardSchema.extend({
    element: ElementSchema,
    attack: z.number(),
    health: z.number(),
    shieldCount: z.number(),
    boostCount: z.number(),
    damageCount: z.number(),
});

type ElementalCardType = z.infer<typeof ElementalCardSchema>;

export class ElementalCard extends Card {
    element: ElementalCardType["element"];
    attack: ElementalCardType["attack"];
    health: ElementalCardType["health"];
    shieldCount: ElementalCardType["shieldCount"];
    boostCount: ElementalCardType["boostCount"];
    damageCount: ElementalCardType["damageCount"];

    protected constructor(params: ElementalCardType) {
        super(params);
        this.element = params.element;
        this.attack = params.attack;
        this.health = params.health;
        this.shieldCount = params.shieldCount ?? 0;
        this.boostCount = params.boostCount ?? 0;
        this.damageCount = params.damageCount ?? 0;
    }

    static from(data: unknown): ElementalCard {
        const parsed = ElementalCardSchema.parse(data);
        return new ElementalCard(parsed);
    }

    getData() {
        return {
            ...super.getData(),
            element: this.element,
            attack: this.attack,
            health: this.health,
            shieldCount: this.shieldCount,
            boostCount: this.boostCount,
            damageCount: this.damageCount,
        };
    }

    toJSON() {
        return this.getData();
    }
}
