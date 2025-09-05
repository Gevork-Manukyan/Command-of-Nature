import { z } from "zod";
import { Card, CardSchema } from "./Card";
import { AbilitySchema, ItemTypeSchema } from "../card-types";

export const ItemCardSchema = CardSchema.extend({
    ability: AbilitySchema,
    itemType: ItemTypeSchema,
})

type ItemCardType = z.infer<typeof ItemCardSchema>;

export class ItemCard extends Card {
    ability: ItemCardType['ability'];
    itemType: ItemCardType['itemType'];

    constructor(params: ItemCardType) {
        super(params);
        this.ability = params.ability;
        this.itemType = params.itemType;
    }

    static from(data: ItemCardType): ItemCard {
        const parsed = ItemCardSchema.parse(data);
        return new ItemCard(parsed);
    }

    getData() {
        return {
            ...super.getData(),
            itemType: this.itemType,
        };
    }
    
    toJSON() {
        return this.getData();
    }
}