import { ValidationError } from "../../services/CustomError/BaseError";
import { NullSpaceError } from "../../services/CustomError/GameError";
import { ElementalCard, AbilityResult, SpaceOption, OnePlayerSpaceOptions, TwoPlayerSpaceOptions } from "shared-types";
import { BattlefieldSpace } from "../BattlefieldSpace/BattlefieldSpace";
import { IBattlefield } from './db-model';
import { IBattlefieldSpace } from '../BattlefieldSpace/db-model';

const ONE_PLAYER_SPACE_MAX = 6;
const TWO_PLAYER_SPACE_MAX = 12;

export class Battlefield {
    private fieldArray: BattlefieldSpace[] = [];
    private numPlayersOnTeam: 1 | 2;

    constructor(numPlayersOnTeam: Battlefield['numPlayersOnTeam']) {
        this.numPlayersOnTeam = numPlayersOnTeam;
        numPlayersOnTeam === 1 ? this.initOnePlayerBattlefield() : this.initTwoPlayerBattlefield();
    }

    /**
     * Initializes the battlefield for a one player game
     */
    private initOnePlayerBattlefield() {
        let row_1_1, row_2_1, row_2_2, row_3_1, row_3_2, row_3_3;

        row_3_3 = new BattlefieldSpace(8, null, {
            TL: row_2_2,
            L: row_3_2,
        });
        row_3_2 = new BattlefieldSpace(7, null, {
            TL: row_2_1,
            TR: row_2_2,
            L: row_3_1,
            R: row_3_3,
        });
        row_3_1 = new BattlefieldSpace(6, null, {
            TR: row_2_1,
            R: row_3_2,
        });

        row_2_2 = new BattlefieldSpace(4, null, {
            TL: row_1_1,
            L: row_2_1,
            BL: row_3_2,
            BR: row_3_3,
        });
        row_2_1 = new BattlefieldSpace(3, null, {
            TR: row_1_1,
            R: row_2_2,
            BL: row_3_1,
            BR: row_3_2,
        });

        row_1_1 = new BattlefieldSpace(1, null, {
            BL: row_2_1,
            BR: row_2_2,
        });

        this.fieldArray = [row_1_1, row_2_1, row_2_2, row_3_1, row_3_2, row_3_3];
    }

    /**
     * Initializes the battlefield for a two player game
     */
    private initTwoPlayerBattlefield() {
        let row_1_1, row_1_2, row_2_1, row_2_2, row_2_3, row_2_4, row_3_1, row_3_2, row_3_3, row_3_4, row_3_5, row_3_6;

        row_3_6 = new BattlefieldSpace(9, null, {
            TL: row_2_4,
            L: row_3_5,
        });
        row_3_5 = new BattlefieldSpace(9, null, {
            TL: row_2_3, 
            T: row_2_4,
            L: row_3_4,
            R: row_3_6,
        });
        row_3_4 = new BattlefieldSpace(9, null, {
            TL: row_2_2,
            T: row_2_3,
            TR: row_2_4,
            L: row_3_3,
            R: row_3_5,
        });
        row_3_3 = new BattlefieldSpace(8, null, {
            TL: row_2_1,
            T: row_2_2,
            TR: row_2_3,
            L: row_3_2,
            R: row_3_4,
        });
        row_3_2 = new BattlefieldSpace(7, null, {
            T: row_2_1,
            TR: row_2_2,
            L: row_3_1,
            R: row_3_3,
        });
        row_3_1 = new BattlefieldSpace(6, null, {
            TR: row_2_1,
            R: row_3_2,
        });

        row_2_4 = new BattlefieldSpace(5, null, {
            TR: row_1_2,
            L: row_2_3,
            BL: row_3_4,
            B: row_3_5,
            BR: row_3_6,
        });
        row_2_3 = new BattlefieldSpace(5, null, {
            TL: row_1_1,
            T: row_1_2,
            L: row_2_2,
            R: row_2_4,
            BL: row_3_3,
            B: row_3_4,
            BR: row_3_5,
        });
        row_2_2 = new BattlefieldSpace(4, null, {
            T: row_1_1,
            TR: row_1_2,
            L: row_2_1,
            R: row_2_3,
            BL: row_3_2,
            B: row_3_3,
            BR: row_3_4,
        });
        row_2_1 = new BattlefieldSpace(3, null, {
            TR: row_1_1,
            R: row_2_2,
            BL: row_3_1,
            B: row_3_2,
            BR: row_3_3,
        });

        row_1_2 = new BattlefieldSpace(2, null, {
            L: row_1_1,
            BL: row_2_2,
            B: row_2_3,
            BR: row_2_4,
        });
        row_1_1 = new BattlefieldSpace(1, null, {
            R: row_1_2,
            BL: row_2_1,
            B: row_2_2,
            BR: row_2_3,
        });

        this.fieldArray = [row_1_1, row_1_2, row_2_1, row_2_2, row_2_3, row_2_4, row_3_1, row_3_2, row_3_3, row_3_4, row_3_5, row_3_6];
    }

    /**
     * Returns the battlefield space at the given space number
     * @param spaceNumber The space number to get
     * @returns The battlefield space at the given space number
     */
    private getBattlefieldSpace<T extends SpaceOption>(spaceNumber: T) {
        this.validateSpaceNumber(spaceNumber)
        return this.fieldArray[spaceNumber - 1];
    }

    /**
     * Returns the card at the given space number
     * @param spaceNumber The space number to get the card from
     * @returns The card at the given space number
     */
    private getCardAtSpace<T extends SpaceOption>(spaceNumber: T) {
        const card = this.getBattlefieldSpace(spaceNumber).value;
        if (!card) throw new NullSpaceError(spaceNumber, `Cannot get card from empty space: ${spaceNumber}`);
        return card;
    }

    /**
     * Validates the space number to ensure it is within the correct range
     * @param spaceNumber The space number to validate
     */
    private validateSpaceNumber(spaceNumber: SpaceOption): asserts spaceNumber is OnePlayerSpaceOptions | TwoPlayerSpaceOptions {
        const maxSpaceNumber = this.numPlayersOnTeam === 1 ? ONE_PLAYER_SPACE_MAX : TWO_PLAYER_SPACE_MAX;
    
        if (spaceNumber < 1 || spaceNumber > maxSpaceNumber) {
            throw new ValidationError(`Invalid space for ${this.numPlayersOnTeam}-player battlefield: ${spaceNumber}`, "INVALID_INPUT");
        }
    }

    /**
     * Returns the card at the given space number
     * @param spaceNumber The space number to get the card from
     * @returns The card at the given space number
     */
    getCard(spaceNumber: SpaceOption) {
        return this.getBattlefieldSpace(spaceNumber).value;
    }

    /**
     * Adds a card to the battlefield space
     * @param card The card to add
     * @param spaceNumber The space number to add the card to
     */
    addCard(card: ElementalCard, spaceNumber: SpaceOption) {
        const targetSpace = this.getBattlefieldSpace(spaceNumber)
        if (targetSpace.value !== null) throw new ValidationError("Cannot add a card to a space with an existing card", "INVALID_INPUT")
        targetSpace.value = card;
    }

    /**
     * Removes a card from the battlefield space and returns the card
     * @param spaceNumber The space number to remove the card from
     * @returns The card that was removed
     */
    removeCard(spaceNumber: SpaceOption): ElementalCard {
        const targetSpace = this.getBattlefieldSpace(spaceNumber)
        if (targetSpace.value === null) throw new NullSpaceError(spaceNumber, `Cannot remove an empty space: ${spaceNumber}`)
        const targetCard = targetSpace.value
        targetSpace.value = null
        return targetCard;
    }

    /**
     * Swaps the cards at the given space numbers
     * @param space1Number The first space number to swap
     * @param space2Number The second space number to swap
     */
    swapCards(space1Number: SpaceOption, space2Number: SpaceOption) {
        if (space1Number === space2Number) throw new ValidationError("Cannot swap a card with itself", "spaceNumber");

        const space1 = this.getBattlefieldSpace(space1Number)
        const space2 = this.getBattlefieldSpace(space2Number)

        if (space1.value === null || space2.value === null) {
            const nullSpace = space1 === null ? space1Number : space2Number
            throw new NullSpaceError(nullSpace, `Cannot swap null battlefield space: ${nullSpace}`)
        }

        const space1Value = space1.value
        space1.setValue(space2.value)
        space2.setValue(space1Value)
    }

    /**
     * @returns The battlefield state
     */
    getBattlefieldState() {
        return this.fieldArray.map(space => space.getBattlefieldSpaceState())
    }

    /**
     * Returns the space numbers of the cards with Day Break ability
     * @returns The space numbers of the cards with Day Break ability
     */
    getDayBreakCards(): SpaceOption[] {
        return this.fieldArray.filter(space => {
            if (space.value === null) return false;
            
            // If space has an ability card with Day Break which is true, return true
            return "isDayBreak" in space.value && space.value.isDayBreak
        }).map(space => space.spaceNumber)
    }

    /**
     * Activates the Day Break ability of the card at the given space number
     * @param spaceOption The space number to activate the Day Break ability
     */
    activateDayBreak(spaceOption: SpaceOption): AbilityResult[] {
        const targetSpace: BattlefieldSpace = this.getBattlefieldSpace(spaceOption);
        if (!targetSpace.validateDayBreakActivation()) {
            throw new ValidationError("Invalid Day Break activation", "INVALID_INPUT");
        }
        return targetSpace.value.ability();
    }

    /**
     * Damages the card at the given space number
     * @param position The position of the card to damage
     * @param amount The amount of damage to deal
     * @returns True if the card is destroyed, false otherwise
     */
    damageCardAtPosition(position: SpaceOption, amount: number): boolean {
        const card = this.getCardAtSpace(position);

        const newDamageCount = card.damageCount + amount;
        if (newDamageCount >= card.health) {
            card.damageCount = card.health;
            return true;
        }
        
        card.damageCount = newDamageCount;
        return false;
    }

    /**
     * Clears the damage on the card at the given space number
     * @param position The position of the card to clear the damage from
     */
    clearDamage(position: SpaceOption) {
        const card = this.getCardAtSpace(position);
        card.damageCount = 0;
    }

    /**
     * Adds shield to the card at the given space number
     * @param position The position of the card to add shield to
     * @param amount The amount of shield to add
     */
    addShieldToCardAtPosition(position: SpaceOption, amount: number) {
        const card = this.getCardAtSpace(position);
        const newShield = card.shieldCount + amount;
        card.shieldCount = newShield;
    }

    /**
     * Adds boost to the card at the given space number
     * @param position The position of the card to add boost to
     * @param amount The amount of boost
     */
    addBoostToCardAtPosition(position: SpaceOption, amount: number) {
        const card = this.getCardAtSpace(position);
        const newBoost = card.boostCount + amount;
        card.boostCount = newBoost;
    }

    // Convert from Mongoose document to runtime instance
    static fromMongoose(doc: IBattlefield): Battlefield {
        const battlefield = new Battlefield(doc.numPlayersOnTeam);
        
        // Set up spaces and their connections
        const spaces = doc.fieldArray.map(space => BattlefieldSpace.fromMongoose(space));
        battlefield.fieldArray = spaces;

        // Set up connections between spaces
        spaces.forEach(space => {
            Object.entries(space.connections).forEach(([direction, targetSpaceNumber]) => {
                if (typeof targetSpaceNumber === 'number') {
                    const targetSpace = spaces.find(s => s.spaceNumber === targetSpaceNumber);
                    if (targetSpace) {
                        space.connections[direction as keyof typeof space.connections] = targetSpace;
                    }
                }
            });
        });

        return battlefield;
    }

    // Convert runtime instance to plain object for Mongoose
    toMongoose(): Omit<IBattlefield, '_id'> {
        return {
            fieldArray: this.fieldArray.map(space => space.toMongoose()) as IBattlefieldSpace[],
            numPlayersOnTeam: this.numPlayersOnTeam
        } as Omit<IBattlefield, '_id'>;
    }
}