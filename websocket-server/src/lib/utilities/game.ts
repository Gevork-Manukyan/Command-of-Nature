import { NotFoundError } from "../../custom-errors";
import { Card } from "@shared-types";

export function drawCardFromDeck<T extends Card>(deck: T[]) {
  if (deck.length === 0) throw new NotFoundError("No cards left in deck", "deck");

  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck[randomIndex];
  deck.splice(randomIndex, 1);

  return card;
} 