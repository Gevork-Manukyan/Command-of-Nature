import { z } from "zod";
import {
    ElementalWarriorCard,
    ElementalWarriorCardSchema,
} from "./ElementalWarriorCard";

export const ElementalWarriorStarterCardSchema = ElementalWarriorCardSchema.extend({
    price: z.literal(1),
});

type ElementalWarriorStarterCardType = z.infer<typeof ElementalWarriorStarterCardSchema>;

export class ElementalWarriorStarterCard extends ElementalWarriorCard {
    price: ElementalWarriorStarterCardType["price"];

    protected constructor(params: ElementalWarriorStarterCardType) {
        super(params);
        this.price = params.price;
    }

    static from(data: unknown): ElementalWarriorStarterCard {
        const parsed = ElementalWarriorStarterCardSchema.parse(data);
        return new ElementalWarriorStarterCard(parsed);
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