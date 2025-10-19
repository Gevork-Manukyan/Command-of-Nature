import { z } from "zod";

export const CardSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    img: z.string(),
});
type CardType = z.infer<typeof CardSchema>;

export class Card {
    name: CardType["name"];
    description: CardType["description"];
    price: CardType["price"];
    img: CardType["img"];

    protected constructor(params: CardType) {
        this.name = params.name;
        this.description = params.description;
        this.price = params.price;
        this.img = params.img;
    }

    static from(data: CardType): Card {
        const parsed = CardSchema.parse(data);
        return new Card(parsed);
    }

    getData() {
        return {
            name: this.name,
            description: this.description,
            price: this.price,
            img: this.img,
        };
    }

    toJSON() {
        return this.getData();
    }
}
