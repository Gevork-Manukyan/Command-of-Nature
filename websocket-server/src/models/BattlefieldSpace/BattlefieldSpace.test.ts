import { BattlefieldSpace } from './BattlefieldSpace';
import { ALL_CARDS } from '../../constants/cards';
const { Timber } = ALL_CARDS;

describe("BattlefieldSpace class", () => {
    test("should initialize correctly", () => {
        const space = new BattlefieldSpace(1, null);
        expect(space.spaceNumber).toBe(1);
        expect(space.value).toBe(null);
    });

    test("should set and get value correctly", () => {
        const space = new BattlefieldSpace(1, null);
        space.setValue(Timber());
        expect(space.value).toBe(Timber);
    });

    test("should retrieve connections correctly", () => {
        const space1 = new BattlefieldSpace(1, null);
        const space2 = new BattlefieldSpace(2, null);
        space2.setConnections({ L: space1.spaceNumber });
        expect(space2.getDirection("L")).toBe(space1);
        expect(space2.getDirection("R")).toBe(null);
    });

    test("should get battlefield space state correctly", () => {
        const space = new BattlefieldSpace(1, Timber());
        const state = space.getBattlefieldSpaceState();
        expect(state).toEqual({
            spaceNumber: 1,
            value: Timber
        });
    });

    test("should validate day break activation correctly", () => {
        const space = new BattlefieldSpace(1, null);
        expect(() => space.validateDayBreakActivation()).toThrow("Cannot activate Day Break on an empty space");
    });
}); 