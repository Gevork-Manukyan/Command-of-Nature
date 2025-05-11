import { Card, ElementalCard, ElementalWarriorCard, ElementalWarriorCardSchema } from "../types";

export function isElementalCard(card: Card): card is ElementalCard {
    return ElementalWarriorCardSchema.safeParse(card).success;
  }
  
export function isElementalWarriorCard(card: ElementalCard): card is ElementalWarriorCard {
    return ElementalWarriorCardSchema.safeParse(card).success;
}