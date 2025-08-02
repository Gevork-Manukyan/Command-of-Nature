import { z } from "zod";
import { Card, CardSchema } from "./Card";
import { AbilityResultSchema } from "../ability-types";

export const ItemCardSchema = CardSchema.extend({
    ability: z.function().args().returns(z.array(AbilityResultSchema)),
})

type ItemCardType = z.infer<typeof ItemCardSchema>;

export class ItemCard extends Card {
    ability: ItemCardType['ability'];

    constructor(params: ItemCardType) {
        super(params);
        this.ability = params.ability;
    }
}