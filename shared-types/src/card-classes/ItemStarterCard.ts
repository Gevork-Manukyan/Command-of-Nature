import { z } from "zod";
import { ItemCard, ItemCardSchema } from "./ItemCard";

export const ItemStarterCardSchema = ItemCardSchema.extend({
    price: z.literal(1),
});

type ItemStarterCardType = z.infer<typeof ItemStarterCardSchema>;

export class ItemStarterCard extends ItemCard {
    price: ItemStarterCardType["price"];

    protected constructor(params: ItemStarterCardType) {
        super(params);
        this.price = params.price;
    }

    static from(data: ItemStarterCardType): ItemStarterCard {
        const parsed = ItemStarterCardSchema.parse(data);
        return new ItemStarterCard(parsed);
    }

    getData() {
        return {
            ...super.getData(),
            price: this.price,
        };
    }
    
    toJSON() {
        return this.getData();
    }
}