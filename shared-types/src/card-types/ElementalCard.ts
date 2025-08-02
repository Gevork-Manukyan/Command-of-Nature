import { z } from "zod";
import { CardSchema, ElementSchema } from "../card-types";
import { Card } from "./Card";

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
    constructor(
        name: Card['name'],
        price: Card['price'],
        img: Card['img'],
        public element: ElementalCardType['element'],
        public attack: ElementalCardType['attack'],
        public health: ElementalCardType['health'],
        public shieldCount: ElementalCardType['shieldCount'],
        public boostCount: ElementalCardType['boostCount'],
        public damageCount: ElementalCardType['damageCount']
    ) {
        super(name, price, img);
    }

    static from(data: unknown): ElementalCard {
        const parsed = ElementalCardSchema.parse(data);
        return new ElementalCard(
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
