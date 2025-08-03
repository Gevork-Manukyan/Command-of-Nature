import { z } from "zod";
import { SageSchema } from "../card-types";
import { ElementalWarriorStarterCard, ElementalWarriorStarterCardSchema } from "./ElementalWarriorStarterCard";

export const ElementalSageCardSchema = ElementalWarriorStarterCardSchema.extend({
    sage: SageSchema
})

type ElementalSageCardType = z.infer<typeof ElementalSageCardSchema>;

export class ElementalSageCard extends ElementalWarriorStarterCard {
    sage: ElementalSageCardType["sage"];

    protected constructor(params: ElementalSageCardType) {
        super(params);
        this.sage = params.sage;
    }

    static from(data: unknown): ElementalSageCard {
        const parsed = ElementalSageCardSchema.parse(data);
        return new ElementalSageCard(parsed);
    }

    getData() {
        return {
            ...super.getData(),
            sage: this.sage,
        };
    }
    
    toJSON() {
        return this.getData();
    }
}