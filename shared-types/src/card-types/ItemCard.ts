import { z } from "zod";
import { Card, CardSchema } from "./Card";
import { AbilitySchema } from "../card-types";

export const ItemCardSchema = CardSchema.extend({
    ability: AbilitySchema,
})

type ItemCardType = z.infer<typeof ItemCardSchema>;

export class ItemCard extends Card {
    ability: ItemCardType['ability'];

    constructor(params: ItemCardType) {
        super(params);
        this.ability = params.ability;
    }
}