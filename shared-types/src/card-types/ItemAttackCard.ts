import { z } from "zod";
import { ItemCard, ItemCardSchema } from "./ItemCard";
import { RowRequirementSchema } from "../card-types";

export const ItemAttackCardSchema = ItemCardSchema.extend({
    rowRequirement: RowRequirementSchema,
    itemType: z.literal("attack"),
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