import { z } from "zod";
import { ItemCard, ItemCardSchema } from "./ItemCard";

export const ItemStarterCardSchema = ItemCardSchema.extend({
    price: z.literal(1),
});

type ItemStarterCardType = z.infer<typeof ItemStarterCardSchema>;

export class ItemStarterCard extends ItemCard {
    protected constructor(params: ItemStarterCardType) {
        super(params);
    }

    static from(data: unknown): ItemStarterCard {
        const parsed = ItemStarterCardSchema.parse(data);
        return new ItemStarterCard(parsed);
    }
}