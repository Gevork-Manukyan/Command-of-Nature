import { z } from "zod";

export const CardSchema = z.object({
    name: z.string(),
    price: z.number(),
    img: z.string(),
});
  
export class Card {
    constructor(public name: string, public price: number, public img: string) {}

    static from(data: unknown): Card {
        const parsed = CardSchema.parse(data);
        return new Card(parsed.name, parsed.price, parsed.img);
    }
}