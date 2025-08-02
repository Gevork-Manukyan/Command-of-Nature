import { z } from "zod";
import { ElementalCard, ElementalCardSchema } from "./ElementalCard";

export const ElementalStarterCardSchema = ElementalCardSchema.extend({
    price: z.literal(1),
});

export class ElementalStarterCard extends ElementalCard {
    constructor(
        name: ElementalCard['name'],
        price: ElementalCard['price'],
        img: ElementalCard['img'],
        element: ElementalCard['element'],
        attack: ElementalCard['attack'],
        health: ElementalCard['health'],
        shieldCount: ElementalCard['shieldCount'],
        boostCount: ElementalCard['boostCount'],
        damageCount: ElementalCard['damageCount']
    ) {
        super(name, price, img, element, attack, health, shieldCount, boostCount, damageCount);
    }

    static from(data: unknown): ElementalStarterCard {
        const parsed = ElementalStarterCardSchema.parse(data);
        return new ElementalStarterCard(
            parsed.name,
            parsed.price,
            parsed.img,
            parsed.element,
            parsed.attack,
            parsed.health,
            parsed.shieldCount,
            parsed.boostCount,
            parsed.damageCount
        );
    }
}