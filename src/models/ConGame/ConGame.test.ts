import { NotFoundError, PlayersNotReadyError, SageUnavailableError } from "../../services";
import { LeafDeck, TwigDeck } from "../../constants";
import { ConGame, Player, Team } from "../../models";

describe("ConGame", () => {
    let mockGame: ConGame;
  
    beforeEach(() => {
      mockGame = new ConGame(4, 'test-game', false, '');
      mockGame.setId("game-1");
    });
  
    describe("constructor", () => {
      test("initializes the game with the correct properties", () => {
        expect(mockGame.id).toBe("game-1");
        expect(mockGame.isStarted).toBe(false);
        expect(mockGame.getHasFinishedSetup()).toBe(false);
        expect(mockGame.numPlayersTotal).toBe(4);
        expect(mockGame.numPlayersReady).toBe(0);
        expect(mockGame.numPlayersFinishedSetup).toBe(0);
        expect(mockGame.players).toEqual([]);
        expect(mockGame.team1).toBeInstanceOf(Team);
        expect(mockGame.team2).toBeInstanceOf(Team);
        expect(mockGame.getTeamOrder()).toEqual({
          first: expect.any(Team),
          second: expect.any(Team),
        });
        expect(mockGame.getCreatureShop()).toEqual([]);
        expect(mockGame.getItemShop()).toEqual([]);
      });
    });
  
    describe("setStarted", () => {
      test("sets the game start status", () => {
        mockGame.setStarted(true);
        expect(mockGame.isStarted).toBe(true);
      });
    });
  
    describe("addPlayer", () => {
      test("adds a player to the game", () => {
        const player = new Player("player-1", "socket-1");
        mockGame.addPlayer(player);
        expect(mockGame.players).toContain(player);
      });
    });
  
    describe("removePlayer", () => {
      test("removes a player from the game by ID", () => {
        const player = new Player("player-1", "socket-1");
        mockGame.addPlayer(player);
        mockGame.removePlayer("player-1");
        expect(mockGame.players).not.toContainEqual(player);
      });
    });
  
    describe("getPlayer", () => {
      test("returns the correct player by ID", () => {
        const player = new Player("player-1", "socket-1");
        mockGame.addPlayer(player);
        expect(mockGame.getPlayer("player-1")).toBe(player);
      });
  
      test("throws NotFoundError if player ID is not found", () => {
        expect(() => mockGame.getPlayer("non-existent-id")).toThrow(NotFoundError);
      });
    });
  
    describe("setPlayerSage", () => {
      test("sets the sage for a player if available", () => {
        const player = new Player("player-1", "socket-1");
        player.setSage = jest.fn()
        mockGame.addPlayer(player);
        mockGame.setPlayerSage("player-1", "Cedar");
        expect(player.setSage).toHaveBeenCalledWith("Cedar");
      });
  
      test("throws SageUnavailableError if the sage is already chosen", () => {
        const player1 = new Player("player-1", "socket-1");
        const player2 = new Player("player-2", "socket-2");
        player1.setSage("Cedar");
  
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
  
        expect(() => mockGame.setPlayerSage("player-2", "Cedar")).toThrow(SageUnavailableError);
      });
    });

    describe("getTeamOrder", () => {
      test("should return the correct team order", () => {
        expect(mockGame.getTeamOrder()).toEqual({
          first: expect.any(Team),
          second: expect.any(Team),
        })
      });
    });

    describe("getTeamGoingFirst", () => {
      test("should return the team that is going first", () => {
        const firstTeam = mockGame.getTeamOrder().first;
        expect(mockGame.getTeamGoingFirst()).toEqual(firstTeam);
      });
    });

    describe("getTeamGoingSecond", () => {
      test("should return the team that is going second", () => {
        const secondTeam = mockGame.getTeamOrder().second;
        expect(mockGame.getTeamGoingSecond()).toEqual(secondTeam);
      });
    });
  
    describe("joinTeam", () => {
      test("adds a player to the selected team", () => {
        const player = new Player("player-1", "socket-1");
        mockGame.addPlayer(player);
        mockGame.team1.addPlayerToTeam = jest.fn()
        
        mockGame.joinTeam("player-1", 1);
        expect(mockGame.team1.addPlayerToTeam).toHaveBeenCalledWith(player.userId);
      });
  
      test("removes the player from the current team before joining a new one", () => {
        const player = new Player("player-1", "socket-1");
        
        mockGame.addPlayer(player);
        mockGame.joinTeam("player-1", 1)
        
        mockGame.team1.removePlayerFromTeam = jest.fn()
        mockGame.team2.addPlayerToTeam = jest.fn()

        mockGame.joinTeam("player-1", 2);

        expect(mockGame.team1.removePlayerFromTeam).toHaveBeenCalledWith(player.userId);
        expect(mockGame.team2.addPlayerToTeam).toHaveBeenCalledWith(player.userId)
      });
    });

    describe("incrementPlayersReady", () => {
      test("increments the number of players ready", () => {
        expect(mockGame.incrementPlayersReady()).toBe(1);
        expect(mockGame.numPlayersReady).toBe(1);
      });

      test("incrementing past the total number of players does not change the count", () => {
        mockGame.numPlayersReady = 4;
        expect(mockGame.incrementPlayersReady()).toBe(4);
        expect(mockGame.numPlayersReady).toBe(4);
      })
    });
  
    describe("decrementPlayersReady", () => {
      test("decrements the number of players ready", () => {
        mockGame.numPlayersReady = 1;
        expect(mockGame.decrementPlayersReady()).toBe(0);
        expect(mockGame.numPlayersReady).toBe(0);
      });

      test("decrementing below zero does not change the count", () => {
        expect(mockGame.decrementPlayersReady()).toBe(0);
        expect(mockGame.numPlayersReady).toBe(0);
      })
    });

    describe("incrementPlayersFinishedSetup", () => {
      test("increments the number of players finished setup", () => {
        expect(mockGame.incrementPlayersFinishedSetup()).toBe(1);
        expect(mockGame.numPlayersFinishedSetup).toBe(1);
      });

      test("incrementing past the total number of players does not change the count", () => {
        mockGame.numPlayersFinishedSetup = 4;
        expect(mockGame.incrementPlayersFinishedSetup()).toBe(4);
        expect(mockGame.numPlayersFinishedSetup).toBe(4);
      })
    });

    describe("decrementPlayersFinishedSetup", () => {
      test("decrements the number of players finished setup", () => {
        mockGame.numPlayersFinishedSetup = 1;
        expect(mockGame.decrementPlayersFinishedSetup()).toBe(0);
        expect(mockGame.numPlayersFinishedSetup).toBe(0);
      });

      test("decrementing below zero does not change the count", () => {
        expect(mockGame.decrementPlayersFinishedSetup()).toBe(0);
        expect(mockGame.numPlayersFinishedSetup).toBe(0);
      })
    });

    describe("clearTeams", () => {
      test("should reset all teams and set ready/set up players to zero", () => {
        mockGame.team1.resetTeam = jest.fn()
        mockGame.team2.resetTeam = jest.fn()

        mockGame.clearTeams()
        
        expect(mockGame.team1.resetTeam).toHaveBeenCalled()
        expect(mockGame.team2.resetTeam).toHaveBeenCalled()
        expect(mockGame.numPlayersReady).toBe(0)
        expect(mockGame.numPlayersFinishedSetup).toBe(0)
        mockGame.players.forEach(player => {
          expect(player.getIsReady()).toBe(false)
        })
      })
    })
  
    describe("startGame", () => {
      test("starts the game if all players are ready and host initiates", () => {
        const hostPlayer = new Player("player-1", "socket-1", true);
        mockGame.addPlayer(hostPlayer);
        mockGame.numPlayersReady = 4;
  
        mockGame.initPlayerDecks = jest.fn()
        mockGame.initPlayerFields = jest.fn()

        mockGame.initGame();
  
        expect(mockGame.isStarted).toBe(true);
        expect(mockGame.initPlayerDecks).toHaveBeenCalled();
        expect(mockGame.initPlayerFields).toHaveBeenCalled();
      });
  
      test("throws PlayersNotReadyError if not all players are ready", () => {
        const hostPlayer = new Player("player-1", "socket-1", true);
        mockGame.addPlayer(hostPlayer);
        mockGame.numPlayersReady = 3;
  
        expect(() => mockGame.initGame()).toThrow(PlayersNotReadyError);
      });
    });

    describe("initPlayerDecks", () => {
      test("should initialize the deck for each player", () => {
        const player1 = new Player("player-1", "socket-1");
        const player2 = new Player("player-2", "socket-2");
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
  
        player1.initDeck = jest.fn()
        player2.initDeck = jest.fn()
  
        mockGame.initPlayerDecks();
  
        expect(player1.initDeck).toHaveBeenCalled();
        expect(player2.initDeck).toHaveBeenCalled();
      });
    })

    describe("initPlayerFields", () => {
      test("should initialize the player field for each player", () => {
        const player1 = new Player("player-1", "socket-1");
        const player2 = new Player("player-2", "socket-2");
        mockGame.addPlayer(player1);
        mockGame.addPlayer(player2);
        mockGame.team1.addPlayerToTeam(player1.userId);
        mockGame.team2.addPlayerToTeam(player2.userId);

        const decklist1 = [TwigDeck]
        const decklist2 = [LeafDeck]
        mockGame.getTeamDecklists = jest.fn()
          .mockReturnValueOnce(decklist1)
          .mockReturnValueOnce(decklist2)
        mockGame.team1.initBattlefield = jest.fn()
        mockGame.team2.initBattlefield = jest.fn()

        mockGame.initPlayerFields();

        expect(mockGame.getTeamDecklists).toHaveBeenCalledWith(mockGame.team1)
        expect(mockGame.getTeamDecklists).toHaveBeenCalledWith(mockGame.team2)
        expect(mockGame.team1.initBattlefield).toHaveBeenCalledWith(decklist1)
        expect(mockGame.team2.initBattlefield).toHaveBeenCalledWith(decklist2)
      })
    })
});
  