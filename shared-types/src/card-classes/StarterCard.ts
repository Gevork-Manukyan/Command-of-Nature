import { z } from "zod";
import { Card, CardSchema } from "./Card";

export const StarterCardSchema = CardSchema.extend({
  price: z.literal(1),
});
type StarterCardType = z.infer<typeof StarterCardSchema>;

export class StarterCard extends Card {
    price: StarterCardType["price"];

    protected constructor(params: StarterCardType) {
        super(params);
        this.price = params.price;
    }

    static from(data: unknown): StarterCard {
        const parsed = StarterCardSchema.parse(data);
        return new StarterCard(parsed);
    }
}