import { z } from "zod";

export class Card {
    static schema = z.object({
        name: z.string(),
        price: z.number(),
        img: z.string(),
    });

    constructor(public name: string, public price: number, public img: string) {}

    static from(data: unknown): Card {
        const validatedCard = Card.schema.parse(data);
        return new Card(
            validatedCard.name,
            validatedCard.price,
            validatedCard.img,
        )
    }
}