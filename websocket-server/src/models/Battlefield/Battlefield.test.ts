import { NullSpaceError, ValidationError } from "../../custom-errors";
import { Battlefield } from "./Battlefield";
import { ALL_CARDS, CARD_NAMES } from "@shared-types";

describe("Battlefield class", () => {
    let mockBattlefield: Battlefield;

    beforeEach(() => {
        mockBattlefield = new Battlefield(1);
    });

    describe("constructor", () => {
        test("should initialize a one-player battlefield correctly", () => {
            const battlefield = new Battlefield(1);
            expect(battlefield.getCard(1)).toBe(null);
            expect(battlefield.getCard(2)).toBe(null);
            expect(battlefield.getCard(3)).toBe(null);
            expect(battlefield.getCard(4)).toBe(null);
            expect(battlefield.getCard(5)).toBe(null);
            expect(battlefield.getCard(6)).toBe(null);
            expect(() => battlefield.getCard(7)).toThrow(ValidationError);
        });

        test("should initialize a two-player battlefield correctly", () => {
            const battlefield = new Battlefield(2);
            expect(battlefield.getCard(1)).toBe(null);
            expect(battlefield.getCard(2)).toBe(null);
            expect(battlefield.getCard(3)).toBe(null);
            expect(battlefield.getCard(4)).toBe(null);
            expect(battlefield.getCard(5)).toBe(null);
            expect(battlefield.getCard(6)).toBe(null);
            expect(battlefield.getCard(7)).toBe(null);
            expect(battlefield.getCard(8)).toBe(null);
            expect(battlefield.getCard(9)).toBe(null);
            expect(battlefield.getCard(10)).toBe(null);
            expect(battlefield.getCard(11)).toBe(null);
            expect(battlefield.getCard(12)).toBe(null);
        });
    });

    describe("addCard method", () => {
        test("should add a card to an empty space", () => {
            mockBattlefield.addCard(ALL_CARDS[CARD_NAMES.TIMBER](), 1);
            expect(mockBattlefield.getCard(1)).toBe(ALL_CARDS[CARD_NAMES.TIMBER]());
        });

        test("should throw an error when adding a card to a non-empty space", () => {
            mockBattlefield.addCard(ALL_CARDS[CARD_NAMES.TIMBER](), 1);
            expect(() => mockBattlefield.addCard(ALL_CARDS[CARD_NAMES.TIMBER](), 1)).toThrow(
                ValidationError
            );
        });
    });

    describe("removeCard method", () => {
        test("should remove a card from a space", () => {
            mockBattlefield.addCard(ALL_CARDS[CARD_NAMES.TIMBER](), 1);
            const removedCard = mockBattlefield.removeCard(1);
            expect(mockBattlefield.getCard(1)).toBe(null);
            expect(removedCard).toBe(ALL_CARDS[CARD_NAMES.TIMBER]());
        });

        test("should throw an error if removing card from empty space", () => {
            expect(() => mockBattlefield.removeCard(1)).toThrow(NullSpaceError);
        });
    });

    describe("swapCards method", () => {
        test("should swap two cards between spaces", () => {
            mockBattlefield.addCard(ALL_CARDS[CARD_NAMES.TIMBER](), 1);
            mockBattlefield.addCard(ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), 6);
            mockBattlefield.swapCards(1, 6);
            expect(mockBattlefield.getCard(1)).toBe(ALL_CARDS[CARD_NAMES.ACORN_SQUIRE]());
            expect(mockBattlefield.getCard(6)).toBe(ALL_CARDS[CARD_NAMES.TIMBER]());
        });

        test("should throw an error if either space is empty", () => {
            mockBattlefield.addCard(ALL_CARDS[CARD_NAMES.TIMBER](), 3);

            expect(() => mockBattlefield.swapCards(3, 6)).toThrow(
                NullSpaceError
            );
            expect(() => mockBattlefield.swapCards(1, 3)).toThrow(
                NullSpaceError
            );
            expect(() => mockBattlefield.swapCards(1, 6)).toThrow(
                NullSpaceError
            );
        });

        test("should throw an error if swapping a space with itself", () => {
            mockBattlefield.addCard(ALL_CARDS[CARD_NAMES.TIMBER](), 3);
            expect(() => mockBattlefield.swapCards(1, 1)).toThrow(
                ValidationError
            );
        });
    });

    describe("getBattlefieldSpace method", () => {
        test("should retrieve the correct battlefield space", () => {
            mockBattlefield.getCard(1);
            expect(mockBattlefield.getCard(1)).toBe(null);
        });
    });

    describe("validateSpaceNumber method", () => {
        test("should throw an error for an invalid space number", () => {
            expect(() => mockBattlefield.getCard(7)).toThrow(ValidationError);
        });
    });

    describe("updateBattlefield method", () => {
        test("should update the battlefield state correctly", () => {
            // TODO: Implement test once implemented
        });
    });
});
