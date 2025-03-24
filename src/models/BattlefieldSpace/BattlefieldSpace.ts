import { isElementalWarriorCard } from "../../lib/card-validators";
import { ValidationError } from "../../services/CustomError/BaseError";
import { NullSpaceError } from "../../services/CustomError/GameError";
import { ElementalCard } from "../../types";
import { ElementalWarriorCard } from "../../types/card-types";
import { SpaceOption } from "../../types/types";

export type Direction = "TL" | "T" | "TR" | "L" | "R" | "BL" | "B" | "BR"

export class BattlefieldSpace {
    spaceNumber: SpaceOption;
    value: ElementalCard | null;
    connections: {
        TL?: BattlefieldSpace | null; 
        T?: BattlefieldSpace | null;
        TR?: BattlefieldSpace | null;
        L?: BattlefieldSpace | null;
        R?: BattlefieldSpace | null;
        BL?: BattlefieldSpace | null;
        B?: BattlefieldSpace | null;
        BR?: BattlefieldSpace | null;
    }

    constructor(spaceNumber: SpaceOption, value: BattlefieldSpace['value'], connections?: BattlefieldSpace['connections']) {
        this.spaceNumber = spaceNumber;
        this.value = value;
        this.connections =  {
            TL: null,
            T: null,
            TR: null,
            L: null,
            R: null,
            BL: null,
            B: null,
            BR: null,
            ...connections
        };
    }

    /**
     * Sets the value of the space
     * @param value The value to set the space to
     */
    setValue(value: BattlefieldSpace['value']) {
        this.value = value;
    }

    /**
     * Returns the space at the given direction
     * @param direction The direction to get the space from
     * @returns The space at the given direction
     */
    getDirection(direction: Direction) {
        return this.connections[direction];
    }

    /**
     * Returns the battlefield space state
     * @returns The battlefield space state
     */
    getBattlefieldSpaceState() {
        return {
            spaceNumber: this.spaceNumber,
            value: this.value,
        }
    }

    /**
     * Validates the space number to ensure it is within the correct range and that Card has an ability
     */
    validateDayBreakActivation(): asserts this is BattlefieldSpace & { value: ElementalWarriorCard } {
        if (this.value === null) {
            throw new NullSpaceError(this.spaceNumber, `Cannot activate Day Break on an empty space: ${this.spaceNumber}`);
        }
        
        if (!isElementalWarriorCard(this.value) || !this.value.isDayBreak) {
            throw new ValidationError("Cannot activate Day Break on a card that does not have the ability", "INVALID_INPUT");
        }
    }
} 