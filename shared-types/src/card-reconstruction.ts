import { ALL_CARDS } from "./cards";
import { Card } from "./card-classes";

/**
 * Reconstructs a card from its stored data by using the factory function
 * @param cardData - The card data from the database (missing ability function)
 * @returns The reconstructed card with proper ability function
 */
export function reconstructCard(cardData: any): Card {
    if (!cardData) {
        throw new Error("Card data is missing");
    }

    if (typeof cardData.name !== "string") {
        throw new Error("Card data is missing name");
    }

    const factory = ALL_CARDS[cardData.name as keyof typeof ALL_CARDS];
    if (!factory) {
        throw new Error(`No factory function found for card: ${cardData.name}`);
    }

    // Create a fresh card instance with the ability function
    return factory();
}

/**
 * Reconstructs an array of cards
 * @param cardsData - Array of card data from database
 * @returns Array of reconstructed cards
 */
export function reconstructCards(cardsData: any[]): Card[] {
    return cardsData.map(reconstructCard);
}
