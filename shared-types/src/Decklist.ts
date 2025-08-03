import { z } from "zod";
import { ElementalSageCardSchema } from "./card-classes/ElementalSageCard";
import { ElementalChampionCardSchema } from "./card-classes/ElementalChampionCard";
import { ElementalWarriorCardSchema } from "./card-classes/ElementalWarriorCard";
import { ElementalStarterCardSchema } from "./card-classes/ElementalStarterCard";
import { ItemCardSchema } from "./card-classes/ItemCard";

export const DecklistSchema = z.object({
    sage: ElementalSageCardSchema,
    champions: z.object({
        level4: ElementalChampionCardSchema,
        level6: ElementalChampionCardSchema,
        level8: ElementalChampionCardSchema,
    }),
    warriors: z.array(ElementalWarriorCardSchema),
    basic: ElementalStarterCardSchema,
    items: z.array(ItemCardSchema),
});

export type DecklistType = z.infer<typeof DecklistSchema>;

export class Decklist {
    sage: DecklistType["sage"];
    champions: DecklistType["champions"];
    warriors: DecklistType["warriors"];
    basic: DecklistType["basic"];
    items: DecklistType["items"];

    protected constructor(params: DecklistType) {
        this.sage = params.sage;
        this.champions = params.champions;
        this.warriors = params.warriors;
        this.basic = params.basic;
        this.items = params.items;
    }

    static from(data: unknown): Decklist {
        const parsed = DecklistSchema.parse(data);
        return new Decklist(parsed);
    }
}
