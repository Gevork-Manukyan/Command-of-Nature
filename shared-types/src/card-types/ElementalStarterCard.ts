import { z } from "zod";
import { ElementalCard, ElementalCardSchema } from "./ElementalCard";

export const ElementalStarterCardSchema = ElementalCardSchema.extend({
    price: z.literal(1),
});

type ElementalStarterCardType = z.infer<typeof ElementalStarterCardSchema>;

export class ElementalStarterCard extends ElementalCard {
    constructor(params: ElementalStarterCardType) {
        super(params);
    }

    static from(data: unknown): ElementalStarterCard {
        const parsed = ElementalStarterCardSchema.parse(data);
        return new ElementalStarterCard(parsed);
    }
}