import { NotFoundError, ValidationError } from "../../custom-errors";
import {
  Card,
  Decklist,
  ElementalWarriorStarterCard,
  SpaceOption,
} from "@shared-types";
import { Battlefield } from "../Battlefield/Battlefield";
import { InputJsonValue, JsonValue } from "@prisma/client/runtime/library";
import { TeamSchema } from "@shared-types";
import { Player } from "../Player/Player";
import { reconstructCards } from "@shared-types/card-reconstruction";
import { cardsInclude } from "src/lib/utilities/common";

/**
 * Represents a team in the Command of Nature game
 * @class Team
 */
export class Team {
  userIds: Player["userId"][];
  private battlefield: Battlefield;
  private teamNumber: 1 | 2;
  private teamSize: 1 | 2;
  private gold: number = 0;
  private maxGold: 12 | 20;
  private removedCards: Card[] = [];

  /**
   * Creates a new Team instance
   * @param {1 | 2} teamSize - The number of players in the team
   * @param {1 | 2} teamNumber - The team's number (1 or 2)
   */
  constructor(teamSize: Team["teamSize"], teamNumber: Team["teamNumber"]) {
    this.userIds = [];
    this.battlefield = new Battlefield(teamSize);
    this.teamNumber = teamNumber;
    this.teamSize = teamSize;
    this.maxGold = teamSize === 1 ? 12 : 20;
  }

  /**
   * @returns The state of the team
   */
  getTeamState() {
    return {
      gold: this.gold,
      battlefield: this.battlefield.getBattlefieldState(),
    };
  }

  /**
   * Resets the team by removing all players and resetting the battlefield
   */
  resetTeam() {
    this.userIds = [];
    this.battlefield = new Battlefield(this.teamSize);
  }

  /**
   * @returns The battlefield of the team
   */
  getBattlefield() {
    return this.battlefield;
  }

  /**
   * @returns The players on the team
   */
  getTeamNumber() {
    return this.teamNumber;
  }

  /**
   * @returns The number of players on the team
   */
  getTeamSize() {
    return this.teamSize;
  }

  /**
   * @returns The number of players on the team
   */
  getCurrentNumPlayers() {
    return this.userIds.length;
  }

  /**
   * @returns The gold the team has
   */
  getGold() {
    return this.gold;
  }

  /**
   * Sets the gold the team has
   * @param amount The amount of gold to set
   */
  private setGold(amount: number) {
    if (amount > this.maxGold)
      throw new ValidationError(
        `Team cannot have more than ${this.maxGold} gold`,
        "gold"
      );
    this.gold = amount;
  }

  /**
   * Adds gold to the team
   * @param amount The amount of gold to add to the team
   */
  addGold(amount: number) {
    let newGoldAmount = this.gold + amount;
    if (newGoldAmount > this.maxGold) newGoldAmount = this.maxGold;
    this.setGold(newGoldAmount);
  }

  /**
   * Removes gold from the team
   * @param amount The amount of gold to remove from the team
   */
  removeGold(amount: number) {
    let newGoldAmount = this.gold - amount;
    if (newGoldAmount < 0) newGoldAmount = 0;
    this.setGold(newGoldAmount);
  }

  /**
   * Checks if a player is on the team
   * @param userId - The user ID of the player to check
   * @returns True if the player is on the team, false otherwise
   */
  isPlayerOnTeam(userId: Player["userId"]) {
    return this.userIds.includes(userId);
  }

  /**
   * Adds a player to the team
   * @param userId - The user ID of the player to add
   */
  addPlayerToTeam(userId: Player["userId"]) {
    if (this.userIds.length >= this.teamSize) {
      throw new ValidationError(`Team ${this.teamNumber} is full`, "team");
    }
    this.userIds.push(userId);
  }

  /**
   * Removes a player from the team
   * @param userId - The user ID of the player to remove
   */
  removePlayerFromTeam(userId: Player["userId"]) {
    this.userIds = this.userIds.filter((id) => id !== userId);
  }

  /**
   * Returns the cards that have been removed from the battlefield
   * @returns The cards that have been removed from the battlefield
   */
  getRemovedCards() {
    return this.removedCards;
  }

  /**
   * Adds a card to the removedCards array
   * @param card The card to add to the removedCards array
   */
  addRemovedCard(card: Card) {
    this.removedCards.push(card);
  }

  /**
   * Initializes the battlefield with the decklists of the players on the team
   * @param decklists The decklists of the players on the team
   */
  initBattlefield(decklists: Decklist[]) {
    const [decklist1, decklist2] = decklists;

    // 2 Players (1 team member)
    if (this.teamSize === 1) {
      const basicStarter = decklist1.basic;
      this.battlefield.addCard(basicStarter, 1);
      this.battlefield.addCard(basicStarter, 2);
      this.battlefield.addCard(basicStarter, 3);
      this.battlefield.addCard(decklist1.sage, 5);
    }

    // 4 Players (2 team members)
    else if (decklist2 !== undefined && this.teamSize === 2) {
      const basicStarter1 = decklist1.basic;
      const basicStarter2 = decklist2.basic;

      this.battlefield.addCard(basicStarter1, 1);
      this.battlefield.addCard(basicStarter2, 2);

      this.battlefield.addCard(basicStarter1, 3);
      this.battlefield.addCard(basicStarter1, 4);
      this.battlefield.addCard(basicStarter2, 5);
      this.battlefield.addCard(basicStarter2, 6);

      this.battlefield.addCard(decklist1.sage, 8);
      this.battlefield.addCard(decklist2.sage, 11);
    }
  }

  /**
   * Validates that a player is on the team
   * @param player - The player to validate
   * @throws ValidationError if the player is not on the team
   */
  private validatePlayerOnTeam(player: Player) {
    if (!this.isPlayerOnTeam(player.userId)) {
      throw new ValidationError(
        `Player ${player.userId} is not on team ${this.teamNumber}`,
        "team"
      );
    }
  }

  /**
   * Chooses warriors for a player
   * @param player - The player choosing warriors
   * @param choices - The warrior choices
   */
  chooseWarriors(
    player: Player,
    choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]
  ) {
    this.validatePlayerOnTeam(player);

    // If player has already chosen warriors
    if (player.hasChosenWarriors)
      throw new ValidationError(
        "Player has already chosen warriors",
        "INVALID_INPUT"
      );

    const decklist = player.decklist;
    if (decklist === null)
      throw new NotFoundError(
        "Decklist",
        `Player ${player.socketId}'s decklist is not set`
      );
    const decklistWariors = decklist.warriors;
    const [choice1, choice2] = choices;

    // If chosen cards are the same
    if (choice1 === choice2)
      throw new ValidationError(
        "Cannot choose the same warrior twice",
        "INVALID_INPUT"
      );

    // If chosen cards are not of the correct deck
    if (
      !cardsInclude(decklistWariors, choice1) ||
      !cardsInclude(decklistWariors, choice2)
    )
      throw new ValidationError(
        "Invalid warrior(s) passed for chosen deck",
        "INVALID_INPUT"
      );

    this.initWarriors(choices);
    player.setHasChosenWarriors(true);

    // Add the non-chosen card to the player's deck
    decklist.warriors.forEach((card) => {
      if (card.name !== choice1.name || card.name !== choice2.name)
        player.addCardToDeck(card);
    });
  }

  /**
   * Initializes the battlefield with the ElementalWarriorStarterCards given
   * @param choices The choices of ElementalWarriorStarterCards to initialize the battlefield with
   */
  private initWarriors(
    choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]
  ) {
    const [choice1, choice2] = choices;

    if (this.teamSize === 1) {
      this.battlefield.addCard(choice1, 4);
      this.battlefield.addCard(choice2, 6);
    } else {
      this.initWarriors2Decks(choices);
    }
  }

  /**
   * Initializes the battlefield with the ElementalWarriorStarterCards given for 2 players
   * @param choices The choices of ElementalWarriorStarterCards to initialize the battlefield with
   */
  private initWarriors2Decks(
    choices: [ElementalWarriorStarterCard, ElementalWarriorStarterCard]
  ) {
    const [choice1, choice2] = choices;

    // If cards given are same class as left sage then place on left side
    if (choice1.element === this.battlefield.getCard(8)?.element) {
      this.battlefield.addCard(choice1, 7);
      this.battlefield.addCard(choice2, 9);
    } else if (choice1.element === this.battlefield.getCard(11)?.element) {
      this.battlefield.addCard(choice1, 10);
      this.battlefield.addCard(choice2, 12);
    }
  }

  /**
   * Swaps warriors for a player
   * @param player - The player swapping warriors
   * @returns Array of the new order of warriors after swapping
   */
  swapWarriors(player: Player): ElementalWarriorStarterCard[] {
    this.validatePlayerOnTeam(player);

    // One player on Team
    if (this.teamSize === 1) {
      this.battlefield.swapCards(4, 6);
      const warrior1 = this.battlefield.getCard(4);
      const warrior2 = this.battlefield.getCard(6);
      return [warrior1, warrior2].filter(card => card !== null) as ElementalWarriorStarterCard[];
    }

    // Two players on Team
    if (player.getElement() === this.battlefield.getCard(8)?.element) {
      this.battlefield.swapCards(7, 9);
      const warrior1 = this.battlefield.getCard(7);
      const warrior2 = this.battlefield.getCard(9);
      return [warrior1, warrior2].filter(card => card !== null) as ElementalWarriorStarterCard[];
    } 
    else if (player.getElement() === this.battlefield.getCard(11)?.element) {
      this.battlefield.swapCards(10, 12);
      const warrior1 = this.battlefield.getCard(10);
      const warrior2 = this.battlefield.getCard(12);
      return [warrior1, warrior2].filter(card => card !== null) as ElementalWarriorStarterCard[];
    } 
    else {
      throw new ValidationError(
        "Player can only swap their own warriors",
        "element"
      );
    }
  }

  /**
   * Resets warrior choices for a player, allowing them to choose again
   * @param player - The player to reset warrior choices for
   */
  resetWarriorChoices(player: Player) {
    this.validatePlayerOnTeam(player);

    // Reset player's warrior choice status
    player.setHasChosenWarriors(false);

    // Remove warriors from battlefield based on team size and player element
    if (this.teamSize === 1) {
      // For 1-player teams, remove from positions 4 and 6
      try {
        this.battlefield.removeCard(4);
      } catch (e) {
        // Position might be empty, ignore
      }
      try {
        this.battlefield.removeCard(6);
      } catch (e) {
        // Position might be empty, ignore
      }
    } else {
      // For 2-player teams, remove based on player's element
      const leftSageElement = this.battlefield.getCard(8)?.element;
      const rightSageElement = this.battlefield.getCard(11)?.element;
      const playerElement = player.getElement();
      
      if (playerElement === leftSageElement) {
        // Remove from positions 7 and 9
        try { this.battlefield.removeCard(7); } catch (e) {}
        try { this.battlefield.removeCard(9); } catch (e) {}
      } else if (playerElement === rightSageElement) {
        // Remove from positions 10 and 12
        try { this.battlefield.removeCard(10); } catch (e) {}
        try { this.battlefield.removeCard(12); } catch (e) {}
      }
    }
  }

  /* ----- GAMEPLAY ----- */

  /**
   * @returns The cards on the battlefield that have a daybreak ability
   */
  getDayBreakCards(): SpaceOption[] {
    return this.battlefield.getDayBreakCards();
  }

  /**
   * Activates the daybreak ability of a card at a given position on the battlefield
   * @param spaceOption The position of the card to activate the daybreak ability of
   */
  activateDayBreak(spaceOption: SpaceOption) {
    return this.battlefield.activateDayBreak(spaceOption);
  }

  /**
   * Deals damage to a card at a given position on the battlefield and removes the card if it is dead
   * @param position The position of the card to deal damage to
   * @param amount The amount of damage to deal
   * @returns Whether the card is dead
   */
  damageCardAtPosition(position: SpaceOption, amount: number) {
    const isDead = this.battlefield.damageCardAtPosition(position, amount);
    if (isDead) {
      const removedCard = this.battlefield.removeCard(position);
      this.addRemovedCard(removedCard);
    }
    return isDead;
  }

  /**
   * Gets the ID of a player's teammate
   * @param userId - The user ID of the player to find the teammate for
   * @returns The user ID of the teammate, or undefined if no teammate exists
   */
  getTeammateId(userId: Player["userId"]): string | undefined {
    return this.userIds.find((id) => id !== userId);
  }

  /**
   * Converts a Prisma document to a Team instance
   * @param doc - The Prisma document to convert
   * @returns The Team instance
   */
  static fromPrisma(teamJson: JsonValue): Team {
    const { userIds, teamNumber, teamSize, gold, maxGold, removedCards, battlefield } = TeamSchema.parse(teamJson);
    const team = new Team(teamSize, teamNumber);
    team.userIds = userIds;
    team.gold = gold;
    team.maxGold = maxGold;
    team.removedCards = reconstructCards(removedCards) as Card[];
    team.battlefield = Battlefield.fromPrisma(battlefield as JsonValue);
    return team;
  }

  /**
   * Converts the runtime instance to a plain object for Prisma
   * @returns A plain object representation of the Team instance
   */
  toPrismaObject(): InputJsonValue {
    return {
      userIds: this.userIds,
      teamNumber: this.teamNumber,
      teamSize: this.teamSize,
      gold: this.gold,
      maxGold: this.maxGold,
      removedCards: this.removedCards.map((card) => card.getData()),
      battlefield: this.battlefield.toPrismaObject(),
    };
  }
}
