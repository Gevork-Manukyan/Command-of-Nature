import { z } from "zod";
import {
    ElementalWarriorStarterCard,
    ElementalWarriorStarterCardSchema,
} from "./ElementalWarriorStarterCard";

export const ElementalChampionCardSchema = ElementalWarriorStarterCardSchema.extend({
    levelRequirement: z.union([z.literal(4), z.literal(6), z.literal(8)]),
});

type ElementalChampionCardType = z.infer<typeof ElementalChampionCardSchema>;

export class ElementalChampionCard extends ElementalWarriorStarterCard {
    levelRequirement: ElementalChampionCardType["levelRequirement"];

    protected constructor(params: ElementalChampionCardType) {
        super(params);
        this.levelRequirement = params.levelRequirement;
    }

    static from(data: unknown): ElementalChampionCard {
        const parsed = ElementalChampionCardSchema.parse(data);
        return new ElementalChampionCard(parsed);
    }

    getData() {
        return {
            ...super.getData(),
            levelRequirement: this.levelRequirement,
        };
    }

    toJSON() {
        return this.getData();
    }
}