import { z } from "zod";
import {
    ElementalSageCard,
    ElementalSageCardSchema,
} from "./card-classes/ElementalSageCard";
import {
    ElementalChampionCard,
    ElementalChampionCardSchema,
} from "./card-classes/ElementalChampionCard";
import {
    ElementalWarriorCard,
    ElementalWarriorCardSchema,
} from "./card-classes/ElementalWarriorCard";
import {
    ElementalStarterCard,
    ElementalStarterCardSchema,
} from "./card-classes/ElementalStarterCard";
import { ItemCard, ItemCardSchema } from "./card-classes/ItemCard";
import { OptionalAbilityCardSchema } from "./card-types";
import { reconstructCard, reconstructCards } from "./card-reconstruction";

export const DecklistSchema = z.object({
    sage: ElementalSageCardSchema.merge(OptionalAbilityCardSchema),
    champions: z.object({
        level4: ElementalChampionCardSchema.merge(OptionalAbilityCardSchema),
        level6: ElementalChampionCardSchema.merge(OptionalAbilityCardSchema),
        level8: ElementalChampionCardSchema.merge(OptionalAbilityCardSchema),
    }),
    warriors: z.array(
        ElementalWarriorCardSchema.merge(OptionalAbilityCardSchema)
    ),
    basic: ElementalStarterCardSchema.merge(OptionalAbilityCardSchema),
    items: z.array(
        ItemCardSchema.merge(OptionalAbilityCardSchema)
    ),
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
        this.sage = reconstructCard(params.sage) as ElementalSageCard;
        this.champions = {
            level4: reconstructCard(
                params.champions.level4
            ) as ElementalChampionCard,
            level6: reconstructCard(
                params.champions.level6
            ) as ElementalChampionCard,
            level8: reconstructCard(
                params.champions.level8
            ) as ElementalChampionCard,
        };
        this.warriors = reconstructCards(
            params.warriors
        ) as ElementalWarriorCard[];
        this.basic = reconstructCard(params.basic) as ElementalStarterCard;
        this.items = reconstructCards(params.items) as ItemCard[];
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
