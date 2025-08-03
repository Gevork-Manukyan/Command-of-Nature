import { z } from "zod";
import {
    ElementalSageCard,
    ElementalSageCardSchema,
} from "./card-classes/ElementalSageCard";
import { ElementalChampionCard, ElementalChampionCardSchema } from "./card-classes/ElementalChampionCard";
import { ElementalWarriorCard, ElementalWarriorCardSchema } from "./card-classes/ElementalWarriorCard";
import { ElementalStarterCard, ElementalStarterCardSchema } from "./card-classes/ElementalStarterCard";
import { ItemCard, ItemCardSchema } from "./card-classes/ItemCard";

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
    sage: ElementalSageCard;
    champions: {
        level4: ElementalChampionCard;
        level6: ElementalChampionCard;
        level8: ElementalChampionCard;
    };
    warriors: ElementalWarriorCard[];
    basic: ElementalStarterCard;
    items: ItemCard[];

    protected constructor(params: DecklistType) {
        this.sage = ElementalSageCard.from(params.sage);
        this.champions = {
            level4: ElementalChampionCard.from(params.champions.level4),
            level6: ElementalChampionCard.from(params.champions.level6),
            level8: ElementalChampionCard.from(params.champions.level8),
        };
        this.warriors = params.warriors.map((warrior) =>
            ElementalWarriorCard.from(warrior)
        );
        this.basic = ElementalStarterCard.from(params.basic);
        this.items = params.items.map((item) => ItemCard.from(item));
    }

    static from(data: unknown): Decklist {
        const parsed = DecklistSchema.parse(data);
        return new Decklist(parsed);
    }

    getData() {
        return {
            sage: this.sage.getData(),
            champions: {
                level4: this.champions.level4.getData(),
                level6: this.champions.level6.getData(),
                level8: this.champions.level8.getData(),
            },
            warriors: this.warriors.map((warrior) => warrior.getData()),
            basic: this.basic.getData(),
            items: this.items.map((item) => item.getData()),
        };
    }
}
