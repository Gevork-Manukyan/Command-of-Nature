import { ConflictError, ValidationError } from "../../custom-errors";
import { Battlefield, Player, Team } from "../../models";
import { ALL_CARDS, CARD_NAMES } from "@shared-types";
import { LeafDeck, TwigDeck } from "../../constants/decklists";

const testSocketId = "socket123"
const testUserId = "user123"

jest.mock("../Battlefield", () => {
    return {
        Battlefield: jest.fn().mockImplementation(() => {
            return {
                addCard: jest.fn(),
                getCard: jest.fn().mockReturnValue(null)
            }
        })
    }
})

describe("Team", () => {
    let mockTeam: Team;

    beforeEach(() => {
        mockTeam = new Team(1, 1)
    })

    test("should create a default Team object", (done) => {
        expect(mockTeam.userIds).toEqual([])
        expect(mockTeam.getBattlefield()).toBeDefined();
        expect(mockTeam.getTeamNumber()).toBe(1)
        expect(mockTeam.getTeamSize()).toBe(1)
        done()
    })

    describe("gold manipulation methods", () => {
        test("should correctly set the team's gold amount", () => {
            mockTeam.addGold(10);
            expect(mockTeam.getGold()).toBe(10);
        });

        test("should throw an error if the amount of gold exceeds the maximum", () => {
            expect(() => mockTeam.addGold(1000)).toThrow(ValidationError);
        });

        test("should correctly add gold to the team", () => {
            mockTeam.addGold(5);
            expect(mockTeam.getGold()).toBe(5);
        });

        test("should not exceed the maximum gold amount when adding gold", () => {
            mockTeam.addGold(100);
            expect(mockTeam.getGold()).toBe(12);
        });

        test("should correctly remove gold from the team", () => {
            mockTeam.addGold(10);
            mockTeam.removeGold(5);
            expect(mockTeam.getGold()).toBe(5);
        });

        test("should not go below zero gold when removing gold", () => {
            mockTeam.removeGold(100);
            expect(mockTeam.getGold()).toBe(0);
        });
    });

    describe("resetTeam method", () => {
        test("should remove all players and create new battlefield", () => {
            const initialBattlefield = mockTeam.getBattlefield();
            mockTeam.resetTeam()
            expect(mockTeam.userIds).toEqual([])
            expect(mockTeam.getBattlefield()).not.toBe(initialBattlefield); 
            expect(Battlefield).toHaveBeenCalledWith(mockTeam.getTeamSize()); 
        })
    })

    describe("addPlayerToTeam method", () => {
        test("should add player to team", () => {
            mockTeam.addPlayerToTeam(testUserId)
            expect(mockTeam.userIds[0]).toBe(testUserId)
        })

        test("should throw error if team is full", () => {
            mockTeam.addPlayerToTeam(testUserId)
            expect(() => mockTeam.addPlayerToTeam("user456")).toThrow(ConflictError)
        })
    })

    describe("removePlayerFromTeam method", () => {
        test("should remove player from the team", () => {
            mockTeam.addPlayerToTeam(testUserId)
            expect(mockTeam.userIds[0]).toBe(testUserId)
            mockTeam.removePlayerFromTeam(testUserId)
            expect(mockTeam.userIds.length).toBe(0)
        })

        test("should return unchanged team if player doesn't exist on team", () => {
            mockTeam.addPlayerToTeam(testUserId)
            expect(mockTeam.userIds[0]).toBe(testUserId)
            mockTeam.removePlayerFromTeam("user456")
            expect(mockTeam.userIds.length).toBe(1)
            expect(mockTeam.userIds[0]).toBe(testUserId)
        })
    })

    describe("initBattlefield method", () => {
        test("should initialize battlefield for a single-player team", () => {
            const decklist = TwigDeck;
            const basicCard = ALL_CARDS[CARD_NAMES.TIMBER]();
            const sage = ALL_CARDS[CARD_NAMES.CEDAR]();
            mockTeam.initBattlefield([decklist]);
    
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard, 1);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard, 2);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard, 3);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(sage, 5);
        });

        test("should initialize battlefield for a two-player team", () => {
            mockTeam = new Team(2, 1);

            const decklist_1 = TwigDeck;
            const basicCard_1 = ALL_CARDS[CARD_NAMES.TIMBER]();
            const sage_1 = ALL_CARDS[CARD_NAMES.CEDAR]();

            const decklist_2 = LeafDeck;
            const basicCard_2 = ALL_CARDS[CARD_NAMES.SPROUT]();
            const sage_2 = ALL_CARDS[CARD_NAMES.PORELLA]();

            mockTeam.initBattlefield([decklist_1, decklist_2]);

            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard_1, 1);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard_2, 2);

            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard_1, 3);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard_1, 4);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard_2, 5);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(basicCard_2, 6);

            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(sage_1, 8);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(sage_2, 11);
        })
    })

    describe("chooseWarriors method", () => {
        test("should initialize warriors for one-player team", () => {
            const mockPlayer = {
                getHasChosenWarriors: jest.fn().mockReturnValue(false),
                getDecklist: jest.fn().mockReturnValue({
                    warriors: [ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), ALL_CARDS[CARD_NAMES.QUILL_THORNBACK]()]
                }),
                setHasChosenWarriors: jest.fn(),
                addCardToDeck: jest.fn(),
                userId: testUserId
            };
            mockTeam.addPlayerToTeam(testUserId);
            mockTeam.chooseWarriors(mockPlayer as unknown as Player, [ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), ALL_CARDS[CARD_NAMES.QUILL_THORNBACK]()]);

            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), 4);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(ALL_CARDS[CARD_NAMES.QUILL_THORNBACK](), 6);
        });

        test("should initialize warriors for two-player team (left side)", () => {
            mockTeam = new Team(2, 1);
            const mockPlayer = {
                getHasChosenWarriors: jest.fn().mockReturnValue(false),
                getDecklist: jest.fn().mockReturnValue({
                    warriors: [ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), ALL_CARDS[CARD_NAMES.QUILL_THORNBACK]()]
                }),
                setHasChosenWarriors: jest.fn(),
                addCardToDeck: jest.fn(),
                userId: testUserId
            };

            mockTeam.getBattlefield().getCard = jest
                .fn()
                .mockImplementation((position) => (position === 8 ? ALL_CARDS[CARD_NAMES.CEDAR]() : null));

            mockTeam.addPlayerToTeam(testUserId);
            mockTeam.chooseWarriors(mockPlayer as unknown as Player, [ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), ALL_CARDS[CARD_NAMES.QUILL_THORNBACK]()]);

            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), 7);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(ALL_CARDS[CARD_NAMES.QUILL_THORNBACK](), 9);
        });

        test("should initialize warriors for two-player team (right side)", () => {
            mockTeam = new Team(2, 1);
            const mockPlayer = {
                getHasChosenWarriors: jest.fn().mockReturnValue(false),
                getDecklist: jest.fn().mockReturnValue({
                    warriors: [ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), ALL_CARDS[CARD_NAMES.QUILL_THORNBACK]()]
                }),
                setHasChosenWarriors: jest.fn(),
                addCardToDeck: jest.fn(),
                userId: testUserId
            };

            mockTeam.getBattlefield().getCard = jest
                .fn()
                .mockImplementation((position) => (position === 11 ? ALL_CARDS[CARD_NAMES.CEDAR]() : null));

            mockTeam.addPlayerToTeam(testUserId);
            mockTeam.chooseWarriors(mockPlayer as unknown as Player, [ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), ALL_CARDS[CARD_NAMES.QUILL_THORNBACK]()]);

            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(ALL_CARDS[CARD_NAMES.ACORN_SQUIRE](), 10);
            expect(mockTeam.getBattlefield().addCard).toHaveBeenCalledWith(ALL_CARDS[CARD_NAMES.QUILL_THORNBACK](), 12);
        });
    });

    describe("swapWarriors method", () => {
        test("should swap warriors in a single-player team", () => {
            const mockPlayer = {
                getElement: jest.fn().mockReturnValue("twig"),
                userId: testUserId
            };
            mockTeam.addPlayerToTeam(testUserId);
            mockTeam.swapWarriors(mockPlayer as unknown as Player);

            expect(mockTeam.getBattlefield().swapCards).toHaveBeenCalledWith(4, 6);
        });
    
        test("should swap warriors for the left-side player in a two-player team", () => {
            mockTeam = new Team(2, 1);
            const mockPlayer = {
                getElement: jest.fn().mockReturnValue(ALL_CARDS[CARD_NAMES.CEDAR]().element),
                userId: testUserId
            };
            mockTeam.getBattlefield().getCard = jest.fn().mockReturnValue(ALL_CARDS[CARD_NAMES.CEDAR]());
            
            mockTeam.addPlayerToTeam(testUserId);
            mockTeam.swapWarriors(mockPlayer as unknown as Player);
            
            expect(mockTeam.getBattlefield().swapCards).toHaveBeenCalledWith(7, 9);
        });
    
        test("should swap warriors for the right-side player in a two-player team", () => {
            mockTeam = new Team(2, 1);
            const mockPlayer = {
                getElement: jest.fn().mockReturnValue(ALL_CARDS[CARD_NAMES.CEDAR]().element),
                userId: testUserId
            };
            mockTeam.getBattlefield().getCard = jest.fn().mockReturnValue(ALL_CARDS[CARD_NAMES.CEDAR]());
            
            mockTeam.addPlayerToTeam(testUserId);
            mockTeam.swapWarriors(mockPlayer as unknown as Player);
            
            expect(mockTeam.getBattlefield().swapCards).toHaveBeenCalledWith(10, 12);
        });
    
        test("should throw an error if the element does not match any sage", () => {
            mockTeam = new Team(2, 1);
            const mockPlayer = {
                getElement: jest.fn().mockReturnValue("leaf"),
                userId: testUserId
            };
            mockTeam.getBattlefield().getCard = jest.fn().mockReturnValue(ALL_CARDS[CARD_NAMES.CEDAR]());

            mockTeam.addPlayerToTeam(testUserId);
            expect(() => mockTeam.swapWarriors(mockPlayer as unknown as Player)).toThrow(ValidationError);
        });
    });
});
