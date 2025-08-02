import { z } from "zod";

export const CardSchema = z.object({
    name: z.string(),
    price: z.number(),
    img: z.string(),
});
type CardType = z.infer<typeof CardSchema>;

export class Card {
    constructor(public name: CardType['name'], public price: CardType['price'], public img: CardType['img']) {}

    static from(data: unknown): Card {
        const parsed = CardSchema.parse(data);
        return new Card(parsed.name, parsed.price, parsed.img);
    }
}