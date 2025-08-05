import { isElementalWarriorCard } from "../../lib/card-validators";
import { ValidationError } from "../../services/CustomError/BaseError";
import { NullSpaceError } from "../../services/CustomError/GameError";
import {
  ElementalCard,
  SpaceOption,
  ElementalWarriorCard,
} from "@shared-types";
import { JsonValue } from "@prisma/client/runtime/library";
import { BattlefieldSpaceSchema } from "../validation";

export type Direction = "TL" | "T" | "TR" | "L" | "R" | "BL" | "B" | "BR";

export class BattlefieldSpace {
  spaceNumber: SpaceOption;
  value: ElementalCard | null;
  connections: {
    TL: BattlefieldSpace['spaceNumber'] | null;
    T: BattlefieldSpace['spaceNumber'] | null;
    TR: BattlefieldSpace['spaceNumber'] | null;
    L: BattlefieldSpace['spaceNumber'] | null;
    R: BattlefieldSpace['spaceNumber'] | null;
    BL: BattlefieldSpace['spaceNumber'] | null;
    B: BattlefieldSpace['spaceNumber'] | null;
    BR: BattlefieldSpace['spaceNumber'] | null;
  };

  constructor(
    spaceNumber: SpaceOption,
    value: BattlefieldSpace["value"],
    connections?: BattlefieldSpace["connections"]
  ) {
    this.spaceNumber = spaceNumber;
    this.value = value;
    this.connections = {
      TL: null,
      T: null,
      TR: null,
      L: null,
      R: null,
      BL: null,
      B: null,
      BR: null,
      ...connections,
    };
  }

  /**
   * Sets the value of the space
   * @param value The value to set the space to
   */
  setValue(value: BattlefieldSpace["value"]) {
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
    };
  }

  /**
   * Validates the space number to ensure it is within the correct range and that Card has an ability
   */
  validateDayBreakActivation(): this is BattlefieldSpace & {
    value: ElementalWarriorCard;
  } {
    if (this.value === null) {
      throw new NullSpaceError(
        this.spaceNumber,
        `Cannot activate Day Break on an empty space: ${this.spaceNumber}`
      );
    }

    if (!isElementalWarriorCard(this.value) || !this.value.isDayBreak) {
      throw new ValidationError(
        "Cannot activate Day Break on a card that does not have the ability",
        "INVALID_INPUT"
      );
    }
    return true;
  }

  /**
   * Converts a Prisma document to a BattlefieldSpace instance
   * @param doc - The Prisma document to convert
   * @returns The BattlefieldSpace instance
   */
  static fromPrisma(battlefieldSpaceJson: JsonValue): BattlefieldSpace {
    const { spaceNumber, value, connections } = BattlefieldSpaceSchema.parse(battlefieldSpaceJson);
    const newSpace = new BattlefieldSpace(spaceNumber, value);
    newSpace.connections = connections;
    return newSpace;
  }

  /**
   * Converts the runtime instance to a plain object for Prisma
   * @returns A plain object representation of the BattlefieldSpace instance
   */
  toPrismaObject(): JsonValue {
    return {
      spaceNumber: this.spaceNumber,
      value: this.value ? this.value.getData() : null,
      connections: this.connections,
    };
  }
}
