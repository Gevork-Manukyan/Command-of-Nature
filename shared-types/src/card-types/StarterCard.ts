import { z } from "zod";
import { Card, CardSchema } from "./Card";

export const StarterCardSchema = CardSchema.extend({
  price: z.literal(1),
});
type StarterCardType = z.infer<typeof StarterCardSchema>;

export class StarterCard extends Card {
    constructor(name: StarterCardType['name'], price: StarterCardType['price'], img: StarterCardType['img']) {
        super(name, price, img);
    }

    static from(data: unknown): StarterCard {
        const parsed = StarterCardSchema.parse(data);
        return new StarterCard(parsed.name, parsed.price, parsed.img);
    }
}