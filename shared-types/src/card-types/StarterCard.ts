import { z } from "zod";
import { Card, CardSchema } from "./Card";

export const StarterCardSchema = CardSchema.extend({
  price: z.literal(1),
});

export class StarterCard extends Card {
    constructor(name: string, price: number, img: string) {
        super(name, price, img);
    }

    static from(data: unknown): StarterCard {
        const parsed = StarterCardSchema.parse(data);
        return new StarterCard(parsed.name, parsed.price, parsed.img);
    }
}