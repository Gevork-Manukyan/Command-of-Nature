import { z } from "zod";
import { ElementalSageCardSchema } from "./card-types/ElementalSageCard";
import { ElementalChampionCardSchema } from "./card-types/ElementalChampionCard";
import { ElementalWarriorCardSchema } from "./card-types/ElementalWarriorCard";
import { ElementalStarterCardSchema } from "./card-types/ElementalStarterCard";
import { ItemCardSchema } from "./card-types/ItemCard";

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
})

export type DecklistType = z.infer<typeof DecklistSchema>;

export class Decklist {
    sage: DecklistType['sage'];
    champions: DecklistType['champions'];
    warriors: DecklistType['warriors'];
    basic: DecklistType['basic'];
    items: DecklistType['items'];

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