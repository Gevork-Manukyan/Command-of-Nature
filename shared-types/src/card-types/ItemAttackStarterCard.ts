import { z } from "zod";
import { ItemAttackCard, ItemAttackCardSchema } from "./ItemAttackCard";

export const ItemAttackStarterCardSchema = ItemAttackCardSchema.extend({
    price: z.literal(1),
});

type ItemAttackStarterCardType = z.infer<typeof ItemAttackStarterCardSchema>;

export class ItemAttackStarterCard extends ItemAttackCard {
    protected constructor(params: ItemAttackStarterCardType) {
        super(params);
    }

    static from(data: unknown): ItemAttackStarterCard {
        const parsed = ItemAttackStarterCardSchema.parse(data);
        return new ItemAttackStarterCard(parsed);
    }
}