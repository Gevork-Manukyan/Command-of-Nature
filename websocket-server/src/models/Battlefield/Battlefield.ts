import { ValidationError, NullSpaceError } from "../../custom-errors";
import {
    ElementalCard,
    AbilityResult,
    SpaceOption,
    OnePlayerSpaceOptions,
    TwoPlayerSpaceOptions,
} from "@shared-types";
import { BattlefieldSpace } from "../BattlefieldSpace/BattlefieldSpace";
import { JsonValue } from "@prisma/client/runtime/library";
import { BattlefieldSchema } from "../validation";

const ONE_PLAYER_SPACE_MAX = 6;
const TWO_PLAYER_SPACE_MAX = 12;

export class Battlefield {
    private fieldArray: BattlefieldSpace[] = [];
    private numPlayersOnTeam: 1 | 2;

    constructor(numPlayersOnTeam: Battlefield["numPlayersOnTeam"]) {
        this.numPlayersOnTeam = numPlayersOnTeam;
        numPlayersOnTeam === 1
            ? this.initOnePlayerBattlefield()
            : this.initTwoPlayerBattlefield();
    }

    /**
     * Initializes the battlefield for a one player game
     */
    private initOnePlayerBattlefield() {
        const space_1_1 = new BattlefieldSpace(1, null);
        const space_2_1 = new BattlefieldSpace(3, null);
        const space_2_2 = new BattlefieldSpace(4, null);
        const space_3_1 = new BattlefieldSpace(6, null);
        const space_3_2 = new BattlefieldSpace(7, null);
        const space_3_3 = new BattlefieldSpace(8, null);

        space_3_3.setConnections({
            TL: space_2_2.spaceNumber,
            L: space_3_2.spaceNumber,
        });

        space_3_2.setConnections({
            TL: space_2_1.spaceNumber,
            TR: space_2_2.spaceNumber,
            L: space_3_1.spaceNumber,
            R: space_3_3.spaceNumber,
        });
        space_3_1.setConnections({
            TR: space_2_1.spaceNumber,
            R: space_3_2.spaceNumber,
        });

        space_2_2.setConnections({
            TL: space_1_1.spaceNumber,
            L: space_2_1.spaceNumber,
            BL: space_3_2.spaceNumber,
            BR: space_3_3.spaceNumber,
        });

        space_2_1.setConnections({
            TR: space_1_1.spaceNumber,
            R: space_2_2.spaceNumber,
            BL: space_3_1.spaceNumber,
            BR: space_3_2.spaceNumber,
        });

        space_1_1.setConnections({
            BL: space_2_1.spaceNumber,
            BR: space_2_2.spaceNumber,
        });

        this.fieldArray = [
            space_1_1,
            space_2_1,
            space_2_2,
            space_3_1,
            space_3_2,
            space_3_3,
        ];
    }

    /**
     * Initializes the battlefield for a two player game
     */
    private initTwoPlayerBattlefield() {
        const space_1_1 = new BattlefieldSpace(1, null);
        const space_1_2 = new BattlefieldSpace(2, null);
        const space_2_1 = new BattlefieldSpace(3, null);
        const space_2_2 = new BattlefieldSpace(4, null);
        const space_2_3 = new BattlefieldSpace(5, null);
        const space_2_4 = new BattlefieldSpace(6, null);
        const space_3_1 = new BattlefieldSpace(7, null);
        const space_3_2 = new BattlefieldSpace(8, null);
        const space_3_3 = new BattlefieldSpace(9, null);
        const space_3_4 = new BattlefieldSpace(10, null);
        const space_3_5 = new BattlefieldSpace(11, null);
        const space_3_6 = new BattlefieldSpace(12, null);

        space_3_6.setConnections({
            TL: space_2_4.spaceNumber,
            L: space_3_5.spaceNumber,
        });
        space_3_5.setConnections({
            TL: space_2_3.spaceNumber,
            T: space_2_4.spaceNumber,
            L: space_3_4.spaceNumber,
            R: space_3_6.spaceNumber,
        });
        space_3_4.setConnections({
            TL: space_2_2.spaceNumber,
            T: space_2_3.spaceNumber,
            TR: space_2_4.spaceNumber,
            L: space_3_3.spaceNumber,
            R: space_3_5.spaceNumber,
        });
        space_3_3.setConnections({
            TL: space_2_1.spaceNumber,
            T: space_2_2.spaceNumber,
            TR: space_2_3.spaceNumber,
            L: space_3_2.spaceNumber,
            R: space_3_4.spaceNumber,
        });
        space_3_2.setConnections({
            T: space_2_1.spaceNumber,
            TR: space_2_2.spaceNumber,
            L: space_3_1.spaceNumber,
            R: space_3_3.spaceNumber,
        });
        space_3_1.setConnections({
            TR: space_2_1.spaceNumber,
            R: space_3_2.spaceNumber,
        });

        space_2_4.setConnections({
            TR: space_1_2.spaceNumber,
            L: space_2_3.spaceNumber,
            BL: space_3_4.spaceNumber,
            B: space_3_5.spaceNumber,
            BR: space_3_6.spaceNumber,
        });
        space_2_3.setConnections({
            TL: space_1_1.spaceNumber,
            T: space_1_2.spaceNumber,
            L: space_2_2.spaceNumber,
            R: space_2_4.spaceNumber,
            BL: space_3_3.spaceNumber,
            B: space_3_4.spaceNumber,
            BR: space_3_5.spaceNumber,
        });
        space_2_2.setConnections({
            T: space_1_1.spaceNumber,
            TR: space_1_2.spaceNumber,
            L: space_2_1.spaceNumber,
            R: space_2_3.spaceNumber,
            BL: space_3_2.spaceNumber,
            B: space_3_3.spaceNumber,
            BR: space_3_4.spaceNumber,
        });
        space_2_1.setConnections({
            TR: space_1_1.spaceNumber,
            R: space_2_2.spaceNumber,
            BL: space_3_1.spaceNumber,
            B: space_3_2.spaceNumber,
            BR: space_3_3.spaceNumber,
        });

        space_1_2.setConnections({
            L: space_1_1.spaceNumber,
            BL: space_2_2.spaceNumber,
            B: space_2_3.spaceNumber,
            BR: space_2_4.spaceNumber,
        });
        space_1_1.setConnections({
            R: space_1_2.spaceNumber,
            BL: space_2_1.spaceNumber,
            B: space_2_2.spaceNumber,
            BR: space_2_3.spaceNumber,
        });

        this.fieldArray = [
            space_1_1,
            space_1_2,
            space_2_1,
            space_2_2,
            space_2_3,
            space_2_4,
            space_3_1,
            space_3_2,
            space_3_3,
            space_3_4,
            space_3_5,
            space_3_6,
        ];
    }

    /**
     * Returns the battlefield space at the given space number
     * @param spaceNumber The space number to get
     * @returns The battlefield space at the given space number
     */
    private getBattlefieldSpace<T extends SpaceOption>(spaceNumber: T) {
        this.validateSpaceNumber(spaceNumber);
        return this.fieldArray[spaceNumber - 1];
    }

    /**
     * Returns the card at the given space number
     * @param spaceNumber The space number to get the card from
     * @returns The card at the given space number
     */
    private getCardAtSpace<T extends SpaceOption>(spaceNumber: T) {
        const card = this.getBattlefieldSpace(spaceNumber).value;
        if (!card)
            throw new NullSpaceError(
                spaceNumber,
                `Cannot get card from empty space: ${spaceNumber}`
            );
        return card;
    }

    /**
     * Validates the space number to ensure it is within the correct range
     * @param spaceNumber The space number to validate
     */
    private validateSpaceNumber(
        spaceNumber: SpaceOption
    ): asserts spaceNumber is OnePlayerSpaceOptions | TwoPlayerSpaceOptions {
        const maxSpaceNumber =
            this.numPlayersOnTeam === 1
                ? ONE_PLAYER_SPACE_MAX
                : TWO_PLAYER_SPACE_MAX;

        if (spaceNumber < 1 || spaceNumber > maxSpaceNumber) {
            throw new ValidationError(
                `Invalid space for ${this.numPlayersOnTeam}-player battlefield: ${spaceNumber}`,
                "INVALID_INPUT"
            );
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
        const targetSpace = this.getBattlefieldSpace(spaceNumber);
        if (targetSpace.value !== null)
            throw new ValidationError(
                "Cannot add a card to a space with an existing card",
                "INVALID_INPUT"
            );
        targetSpace.value = card;
    }

    /**
     * Removes a card from the battlefield space and returns the card
     * @param spaceNumber The space number to remove the card from
     * @returns The card that was removed
     */
    removeCard(spaceNumber: SpaceOption): ElementalCard {
        const targetSpace = this.getBattlefieldSpace(spaceNumber);
        if (targetSpace.value === null)
            throw new NullSpaceError(
                spaceNumber,
                `Cannot remove an empty space: ${spaceNumber}`
            );
        const targetCard = targetSpace.value;
        targetSpace.value = null;
        return targetCard;
    }

    /**
     * Swaps the cards at the given space numbers
     * @param space1Number The first space number to swap
     * @param space2Number The second space number to swap
     */
    swapCards(space1Number: SpaceOption, space2Number: SpaceOption) {
        if (space1Number === space2Number)
            throw new ValidationError(
                "Cannot swap a card with itself",
                "spaceNumber"
            );

        const space1 = this.getBattlefieldSpace(space1Number);
        const space2 = this.getBattlefieldSpace(space2Number);

        if (space1.value === null || space2.value === null) {
            const nullSpace = space1 === null ? space1Number : space2Number;
            throw new NullSpaceError(
                nullSpace,
                `Cannot swap null battlefield space: ${nullSpace}`
            );
        }

        const space1Value = space1.value;
        space1.setValue(space2.value);
        space2.setValue(space1Value);
    }

    /**
     * @returns The battlefield state
     */
    getBattlefieldState() {
        return this.fieldArray.map((space) => space.getBattlefieldSpaceState());
    }

    /**
     * Returns the space numbers of the cards with Day Break ability
     * @returns The space numbers of the cards with Day Break ability
     */
    getDayBreakCards(): SpaceOption[] {
        return this.fieldArray
            .filter((space) => {
                if (space.value === null) return false;

                // If space has an ability card with Day Break which is true, return true
                return "isDayBreak" in space.value && space.value.isDayBreak;
            })
            .map((space) => space.spaceNumber);
    }

    /**
     * Activates the Day Break ability of the card at the given space number
     * @param spaceOption The space number to activate the Day Break ability
     */
    activateDayBreak(spaceOption: SpaceOption): AbilityResult[] {
        const targetSpace: BattlefieldSpace =
            this.getBattlefieldSpace(spaceOption);
        if (!targetSpace.validateDayBreakActivation()) {
            throw new ValidationError(
                "Invalid Day Break activation",
                "INVALID_INPUT"
            );
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

    /**
     * Converts a Prisma document to a Battlefield instance
     * @param battlefieldJson - The Prisma document to convert
     * @returns The Battlefield instance
     */
    static fromPrisma(battlefieldJson: JsonValue): Battlefield {
        const { fieldArray, numPlayersOnTeam } =
            BattlefieldSchema.parse(battlefieldJson);
        const battlefield = new Battlefield(numPlayersOnTeam);

        battlefield.fieldArray = fieldArray.map((space) =>
            BattlefieldSpace.fromPrisma(space)
        );

        return battlefield;
    }

    /**
     * Converts the runtime instance to a plain object for Prisma
     * @returns A plain object representation of the Battlefield instance
     */
    toPrismaObject(): JsonValue {
        return {
            fieldArray: this.fieldArray.map((space) => space.toPrismaObject()),
            numPlayersOnTeam: this.numPlayersOnTeam,
        };
    }
}
