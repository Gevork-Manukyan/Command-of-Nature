import { z } from "zod";

export const CardSchema = z.object({
    name: z.string(),
    price: z.number(),
    img: z.string(),
});
type CardType = z.infer<typeof CardSchema>;

export class Card {
    name: string;
    price: number;
    img: string;

    protected constructor(params: CardType) {
        this.name = params.name;
        this.price = params.price;
        this.img = params.img;
    }

    static from(data: unknown): Card {
        const parsed = CardSchema.parse(data);
        return new Card(parsed);
    }
}