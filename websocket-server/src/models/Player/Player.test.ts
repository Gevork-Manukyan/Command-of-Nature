import { NotFoundError, ValidationError } from "../../services";
import { Player } from "../../models";
import { ALL_CARDS, TwigDeck } from "../../constants";
const { Cedar, Gravel, Timber, CloseStrike, FarStrike, TwigCharm, NaturalRestoration } = ALL_CARDS;

const testPlayerId = "testId123"
const testSocketId = "socket123"

describe("constructor", () => {
    test("should call constructor and create default player", (done) => {
        const player = new Player(testPlayerId, testSocketId)
    
        expect(player.userId).toBe(testPlayerId)
        expect(player.isReady).toBe(false)
        expect(player.isGameHost).toBe(false)
        expect(player.sage).toBe(null)
        expect(player.decklist).toBe(null)
        expect(player.level).toBe(1)
        expect(player.hand).toEqual([])
        expect(player.deck).toEqual([])
        expect(player.discardPile).toEqual([])
        done()
    })
    
    test("should call constructor and create host player", (done) => {
        const player = new Player(testPlayerId, testSocketId, true)
    
        expect(player.isGameHost).toBe(true)
        done()
    })
})

describe("level getter and setters", () => {
    test("should correctly set the player's level", () => {
        const player = new Player(testPlayerId, testSocketId);
        player.levelUp();
        player.levelUp();
        expect(player.level).toBe(3);
    });
});

describe("hand getter and setters", () => {
    test("should correctly set the player's hand", () => {
        const player = new Player(testPlayerId, testSocketId);
        player.addCardToHand(Cedar);
        expect(player.hand).toContainEqual(Cedar);
    });
});

describe("deck getter and setters", () => {
    test("should correctly set the player's deck", () => {
        const player = new Player(testPlayerId, testSocketId);
        player.addCardToDeck(Cedar);
        expect(player.deck).toContainEqual(Cedar);
    });
});

describe("discard pile getter and setters", () => {
    test("should correctly set the player's discard pile", () => {
        const player = new Player(testPlayerId, testSocketId);
        player.addCardToDiscardPile(Cedar);
        expect(player.discardPile).toContainEqual(Cedar);
    });
});

describe("getElement method", () => {
    test("should return the player's element", () => {
        const player = new Player(testPlayerId, testSocketId);
        player.setSage("Cedar");
        player.setDecklist(TwigDeck);
        expect(player.getElement()).toBe("twig");
    });

    test("should throw NotFoundError if sage is not set", () => {
        const player = new Player(testPlayerId, testSocketId);
        player.setDecklist(TwigDeck);
        expect(() => player.getElement()).toThrow(NotFoundError);
    });

    test("should throw NotFoundError if decklist is not set", () => {
        const player = new Player(testPlayerId, testSocketId);
        player.setSage("Cedar");
        expect(() => player.getElement()).toThrow(NotFoundError);
    });
});

describe("toggleReady method", () => {
    test("should toggle player to be ready", (done) => {
        const player = new Player(testPlayerId, testSocketId)
        player.setSage("Cedar")
        player.toggleReady()
        expect(player.isReady).toBe(true)
        done()
    })

    test("should toggle player to be NOT ready", (done) => {
        const player = new Player(testPlayerId, testSocketId)
        player.setSage("Cedar")
        player.toggleReady()
        expect(player.isReady).toBe(true)
        player.toggleReady()
        expect(player.isReady).toBe(false)
        done()
    })
})

describe("addCardsToDeck", () => {
    test("should add a single card (using addCardToDeck)", (done) => {
        const player = new Player(testPlayerId, testSocketId)
        player.addCardToDeck(Cedar)
        expect(player.deck).toStrictEqual([Cedar])
        done()
    })

    test("should add a single card (using addCardsToDeck)", (done) => {
        const player = new Player(testPlayerId, testSocketId)
        player.addCardsToDeck([Cedar])
        expect(player.deck).toContain(Cedar)
        done()
    })

    test("should add a multiple cards", (done) => {
        const player = new Player(testPlayerId, testSocketId)
        player.addCardsToDeck([Cedar, Gravel])
        expect(player.deck).toContainEqual(Cedar)
        expect(player.deck).toContainEqual(Gravel)
        done()
    })
})

describe("initDeck method", () => {
    test("should throw error if player is not ready", (done) => {
        const player = new Player(testPlayerId, testSocketId)
        expect(() => player.initDeck()).toThrow(ValidationError)
        done()
    })

    test("should properly init deck", (done) => {
        const player = new Player(testPlayerId, testSocketId)
        player.setSage("Cedar")
        player.toggleReady()
        player.initDeck()

        expect(player.decklist).toStrictEqual(TwigDeck)
        expect(player.deck).toStrictEqual([Timber, CloseStrike, CloseStrike, FarStrike, NaturalRestoration, TwigCharm])
        done()
    })
})

describe("finishedPlayerSetup", () => {
    test("should set the player as finished setup", () => {
        const player = new Player("player-1", "socket-1");
        player.setIsReady(true);
        player.setHasChosenWarriors(true);
        player.finishPlayerSetup();
        expect(player.isSetup).toBe(true);
    })

    test("should throw error if player is not ready", () => {
        const player = new Player("player-1", "socket-1");
        player.setHasChosenWarriors(true);
        expect(() => player.finishPlayerSetup()).toThrow(NotFoundError);
    })

    test("should throw error if player has not chosen warriors", () => {
        const player = new Player("player-1", "socket-1");
        player.setIsReady(true);
        expect(() => player.finishPlayerSetup()).toThrow(NotFoundError);
    })
})

describe("cancelPlayerSetup", () => {
    test("should set the player as not setup", () => {
        const player = new Player("player-1", "socket-1");
        player.setIsSetup(true);
        player.cancelPlayerSetup();
        expect(player.isSetup).toBe(false);
    })
})