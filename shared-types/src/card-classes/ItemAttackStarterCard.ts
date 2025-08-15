import { z } from "zod";
import { ItemAttackCard, ItemAttackCardSchema } from "./ItemAttackCard";

export const ItemAttackStarterCardSchema = ItemAttackCardSchema.extend({
    price: z.literal(1),
});

type ItemAttackStarterCardType = z.infer<typeof ItemAttackStarterCardSchema>;

export class ItemAttackStarterCard extends ItemAttackCard {
    price: ItemAttackStarterCardType["price"];

    protected constructor(params: ItemAttackStarterCardType) {
        super(params);
        this.price = params.price;
    }

    static from(data: ItemAttackStarterCardType): ItemAttackStarterCard {
        const parsed = ItemAttackStarterCardSchema.parse(data);
        return new ItemAttackStarterCard(parsed);
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