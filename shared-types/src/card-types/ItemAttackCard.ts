import { z } from "zod";
import { ItemCard, ItemCardSchema } from "./ItemCard";

export const ItemAttackCardSchema = ItemCardSchema.extend({
    rowRequirement: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)]))
});

type ItemAttackCardType = z.infer<typeof ItemAttackCardSchema>;

export class ItemAttackCard extends ItemCard {
    rowRequirement: ItemAttackCardType['rowRequirement'];

    constructor(params: ItemAttackCardType) {
        super(params);
        this.rowRequirement = params.rowRequirement;
    }

    static from(data: unknown): ItemAttackCard {
        const parsed = ItemAttackCardSchema.parse(data);
        return new ItemAttackCard(parsed);
    }
}