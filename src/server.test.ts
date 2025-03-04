import Client, { Socket } from "socket.io-client";
import { server } from "./server";
import { PORT } from "./utils/config";
import { gameStateManager } from "./services/GameStateManager";
import { ConGame, Player } from "./models";
import { AllPlayersSetupEvent, CancelSetupEvent, ChoseWarriorsEvent, ClearTeamsData, CreateGameData, JoinTeamData, LeaveGameData, PlayerFinishedSetupEvent, SelectSageData, StartGameEvent, SwapWarriorsEvent, ToggleReadyStatusData } from "./types/server-types";
import { gameEventEmitter } from "./services/GameEventEmitter";
import { AcornSquire, QuillThornback } from "./utils";
import { Team } from "./models/Team";


let clientSocket: Socket;
let mockGame: ConGame;
let mockPlayer: Player;
const testGameId = "test-game";
const numPlayers = 2;
const testPlayerId = "test-player"

beforeAll((done) => {
  // Start the server (ensure it’s tied to your real server.ts code)
  server.listen(PORT, () => {
    // Connect the client to the same server
    clientSocket = Client(`http://localhost:${PORT}/gameplay`, {
      transports: ["websocket"],
    }); // Connect to the "/gameplay" namespace
    clientSocket.on("connect", done); // Wait until the connection is established
  });
});

afterAll(() => {
  server.close(); 
  clientSocket.close(); 
});

beforeEach(() => {
    mockGame = new ConGame(testGameId, numPlayers)
    mockPlayer = new Player(testPlayerId)
})

afterEach(() => {
  gameStateManager.resetGameStateManager();
  clientSocket.removeAllListeners();
});

describe("Server.ts", () => {
    test("should establish a socket connection", () => {
        expect(clientSocket.connected).toBe(true);
    });

    // Write generic tests for all events that tests if [event]--error is called if error is thrown
    test("should emit an error if a function in an event throws an error", (done) => {
        gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
        const newPlayer = new Player("player-2")
        newPlayer.setSage("Cedar")
        mockGame.addPlayer(newPlayer)

        clientSocket.emit("select-sage", {gameId: testGameId, sage: "Cedar"} as SelectSageData)
        
        clientSocket.once("select-sage--error", () => {
            done()
        })
    })

    describe("create-game event", () => {
        test("should create a new game with given game ID and add the player", (done) => {
            gameStateManager.createGame = jest.fn().mockReturnValue(mockGame)
            mockGame.addPlayer = jest.fn()
            
            clientSocket.emit("create-game", { gameId: testGameId, numPlayers } as CreateGameData)

            clientSocket.once("create-game--success", () => {
                expect(gameStateManager.createGame).toHaveBeenCalledWith(expect.any(ConGame))
                expect(mockGame.addPlayer).toHaveBeenCalledWith(expect.objectContaining({
                    id: expect.any(String),
                    isGameHost: true,
                }))
                done()
            })
        })

        test("should throw an error if number of players is missing", (done) => {
            clientSocket.emit("create-game", { gameId: testGameId })

            clientSocket.once("create-game--error", () => {
                done()
            })
        })

        test("should throw an error if game ID is missing", (done) => {
            clientSocket.emit("create-game", { numPlayers })

            clientSocket.once("create-game--error", () => {
                done()
            })
        })

        test("should throw an error if both of the parameters are missing", (done) => {
            clientSocket.emit("create-game")

            clientSocket.once("create-game--error", () => {
                done()
            })
        })
    })

    describe("join-game event", () => {

        test("should join an existing game", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame);
            mockGame.addPlayer = jest.fn()
            
            clientSocket.emit("join-game", { gameId: testGameId, numPlayers })

            clientSocket.once("join-game--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.addPlayer).toHaveBeenCalledWith(
                    expect.objectContaining({
                      id: expect.any(String),
                      isGameHost: false, 
                    })
                );               
                done();
            });
        })

        test("should throw an error if gameId is missing", (done) => {
            clientSocket.emit("join-game")

            clientSocket.once("join-game--error", () => {
                done()
            })
        })
    })

    describe("select-sage event", () => {
        test("should set the sage that is passed", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.setPlayerSage = jest.fn()

            clientSocket.emit("select-sage", {gameId: testGameId, sage: "Cedar"} as SelectSageData)
            
            clientSocket.once("select-sage--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.setPlayerSage).toHaveBeenCalledWith(expect.any(String), "Cedar")
                done()
            })
        })

        test("should throw an error if game ID is missing", (done) => {
            clientSocket.emit("select-sage", { sage: "Cedar" })
            clientSocket.once("select-sage--error", () => {
                done()
            })
        })

        test("should throw an error if sage is missing", (done) => {
            clientSocket.emit("select-sage", { gameId: testGameId })
            clientSocket.once("select-sage--error", () => {
                done()
            })
        })

        test("should throw an error if both parameters are missing", (done) => {
            clientSocket.emit("select-sage")
            clientSocket.once("select-sage--error", () => {
                done()
            })
        })
    })

    describe("toggle-ready-status", () => {
        beforeEach(() => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.getPlayer = jest.fn().mockReturnValue(mockPlayer)
            mockPlayer.toggleReady = jest.fn()
        })

        test("should toggle the player status to ready", (done) => {
            mockPlayer.setIsReady(true)
            mockPlayer.setSage("Cedar")
            mockGame.incrementPlayersReady = jest.fn()

            clientSocket.emit("toggle-ready-status", { gameId: testGameId } as ToggleReadyStatusData)

            clientSocket.once("ready-status--ready", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(mockPlayer.toggleReady).toHaveBeenCalled()
                expect(mockGame.incrementPlayersReady).toHaveBeenCalled()
                done()
            })
        })

        test("should toggle the player status to not ready", (done) => {
            mockPlayer.setIsReady(false)
            mockPlayer.setSage("Cedar")
            mockGame.decrementPlayersReady = jest.fn()

            clientSocket.emit("toggle-ready-status", { gameId: testGameId } as ToggleReadyStatusData)

            clientSocket.once("ready-status--not-ready", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(mockPlayer.toggleReady).toHaveBeenCalled()
                expect(mockGame.decrementPlayersReady).toHaveBeenCalled()
                done()
            })
        })

        test("should throw error if sage is not set when trying to toggle ready", (done) => {
            mockPlayer.setSage(null)

            clientSocket.emit("toggle-ready-status", { gameId: testGameId } as ToggleReadyStatusData)
            clientSocket.once("toggle-ready-status--error", () => {
                done()
            })
        })

        test("should throw an error if game ID is missing", (done) => {
            clientSocket.emit("toggle-ready-status")
            clientSocket.once("toggle-ready-status--error", () => {
                done()
            })
        })
    })

    describe("join-team event", () => {
        test("should successfully join a team", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.joinTeam = jest.fn()

            clientSocket.emit("join-team", { gameId: testGameId, team: 1 } as JoinTeamData)

            clientSocket.once("join-team--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.joinTeam).toHaveBeenCalledWith(expect.any(String), 1)
                done()
            })
        })

        test("should throw an error if game ID is missing", (done) => {
            clientSocket.emit("join-team", { team: 1 })
            clientSocket.once("join-team--error", () => {
                done()
            })
        })

        test("should throw an error if team number is missing", (done) => {
            clientSocket.emit("join-team", { gameId: testGameId })
            clientSocket.once("join-team--error", () => {
                done()
            })
        })

        test("should throw an error if both parameters are missing", (done) => {
            clientSocket.emit("join-team")
            clientSocket.once("join-team--error", () => {
                done()
            })
        })
    })

    describe("clear-teams event", () => {
        beforeEach(() => {
            gameStateManager.getGame = jest.fn().mockReturnValueOnce(mockGame)
            mockGame.getPlayer = jest.fn().mockReturnValueOnce(new Player(testPlayerId, true))
        })

        test("should clear all teams of players", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.clearTeams = jest.fn()

            clientSocket.emit("clear-teams", { gameId: testGameId } as ClearTeamsData)

            clientSocket.once("clear-teams--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.clearTeams).toHaveBeenCalled()
                done()
            })
        })

        test("should throw an error if a non-host tries to clear teams", (done) => {
            mockGame.getPlayer = jest.fn().mockReturnValueOnce(new Player(testPlayerId, false))
            
            clientSocket.emit("clear-teams", { gameId: testGameId } as ClearTeamsData)

            clientSocket.once("clear-teams--error", () => {
                done()
            })
        })

        test("should throw an error if game ID is missing", (done) => {
            clientSocket.emit("clear-teams")
            clientSocket.once("clear-teams--error", () => {
                done()
            })
        })
    })

    describe("start-game", () => {
        beforeEach(() => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame);
            const player1 = new Player(testPlayerId, true);
            mockGame.getPlayer = jest.fn().mockReturnValue(player1);
            mockGame.initGame = jest.fn();
            mockGame.setStarted = jest.fn();
    
            gameEventEmitter.emitToPlayer = jest.fn();
        });
    
        test("should start the game if all players are ready", (done) => {
            clientSocket.emit(StartGameEvent, { gameId: testGameId });
    
            setTimeout(() => {
                expect(mockGame.initGame).toHaveBeenCalled();
                expect(gameEventEmitter.emitToPlayer).toHaveBeenCalledTimes(mockGame.players.length);
                expect(mockGame.setStarted).toHaveBeenCalledWith(true);
                done();
            }, 50);
        });
    
        test("should throw an error if a non-host tries to start game", (done) => {
            mockGame.getPlayer = jest.fn().mockReturnValue(mockPlayer);
            clientSocket.emit(StartGameEvent, { gameId: testGameId });
            clientSocket.once(`${StartGameEvent}--error`, () => {
                done()
            })
        });
    });

    describe("chose-warriors", () => {
        test("should successfully choose warriors", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.getPlayer = jest.fn().mockReturnValue(mockPlayer)
            mockPlayer.chooseWarriors = jest.fn()

            const choices = [AcornSquire, QuillThornback]
            clientSocket.emit(ChoseWarriorsEvent, { gameId: testGameId, choices })

            clientSocket.once(`${ChoseWarriorsEvent}--success`, () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(mockPlayer.chooseWarriors).toHaveBeenCalledWith(choices)
                done()
            })
        })
    })

    describe("swap-warriors", () => {
        test("should successfully swap warriors", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.getPlayer = jest.fn().mockReturnValue(mockPlayer)
            mockPlayer.swapWarriors = jest.fn()

            clientSocket.emit(SwapWarriorsEvent, { gameId: testGameId })

            clientSocket.once(`${SwapWarriorsEvent}--success`, () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(mockPlayer.swapWarriors).toHaveBeenCalled()
                done()
            })
        })
    })

    describe("player-finished-setup", () => {
        test("should successfully finish setup", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.getPlayer = jest.fn().mockReturnValue(mockPlayer)
            mockPlayer.finishPlayerSetup = jest.fn()
            mockGame.incrementPlayersFinishedSetup = jest.fn()

            clientSocket.emit(PlayerFinishedSetupEvent, { gameId: testGameId })

            clientSocket.once(`${PlayerFinishedSetupEvent}--success`, () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(mockPlayer.finishPlayerSetup).toHaveBeenCalled()
                expect(mockGame.incrementPlayersFinishedSetup).toHaveBeenCalled()
                done()
            })
        })  
    })

    describe("cancel-setup", () => {
        test("should successfully cancel setup", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.getPlayer = jest.fn().mockReturnValue(mockPlayer)
            mockPlayer.cancelPlayerSetup = jest.fn()
            mockGame.decrementPlayersFinishedSetup = jest.fn()

            clientSocket.emit(CancelSetupEvent, { gameId: testGameId })

            clientSocket.once(`${CancelSetupEvent}--success`, () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.getPlayer).toHaveBeenCalledWith(expect.any(String))
                expect(mockPlayer.cancelPlayerSetup).toHaveBeenCalled()
                expect(mockGame.decrementPlayersFinishedSetup).toHaveBeenCalled()
                done()
            })
        })
    })

    describe("all-players-setup", () => {
        beforeEach(() => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame);
            const player1 = new Player(testPlayerId, true);
            mockGame.getPlayer = jest.fn().mockReturnValue(player1);
            mockGame.numPlayersFinishedSetup = 1;
            mockGame.players = [player1];
    
            gameEventEmitter.emitToRoom = jest.fn();
        });

        test("should confirm all players setup, if all players are ready (2-players)", (done) => {
            const mockTeam = new Team(1, 1)
            mockTeam.addPlayerToTeam(mockPlayer)
            mockGame.getTeamGoingFirst = jest.fn().mockReturnValue(mockTeam)
            mockGame.getTeamGoingSecond = jest.fn().mockReturnValue(mockTeam)

            clientSocket.emit(AllPlayersSetupEvent, { gameId: testGameId });
    
            setTimeout(() => {
                expect(gameEventEmitter.emitToRoom).toHaveBeenCalled();
                expect(gameEventEmitter.emitToRoom).toHaveBeenCalled();
                expect(mockGame.getHasFinishedSetup()).toBe(true);
                done();
            }, 50);
        });

        test("should confirm all players setup, if all players are ready (4-players)", (done) => {
            const mockTeam = new Team(1, 1)
            mockTeam.addPlayerToTeam(mockPlayer)
            mockGame.numPlayersTotal = 4

            clientSocket.emit(AllPlayersSetupEvent, { gameId: testGameId })

            setTimeout(() => {
                expect(gameEventEmitter.emitToRoom).toHaveBeenCalled();
                expect(mockGame.getHasFinishedSetup()).toBe(true);
                done();
            }, 50);
        })

        test("should throw an error if all players are not ready", (done) => {
            mockGame.numPlayersFinishedSetup = 0
            clientSocket.emit(AllPlayersSetupEvent, { gameId: testGameId });
            clientSocket.once(`${AllPlayersSetupEvent}--error`, () => {
                done()
            })
        })

        test("should throw an error if a non-host tries to call event", (done) => {
            mockGame.getPlayer = jest.fn().mockReturnValue(mockPlayer)
            clientSocket.emit(AllPlayersSetupEvent, { gameId: testGameId });
            clientSocket.once(`${AllPlayersSetupEvent}--error`, () => {
                done()
            })
        })
    })

    describe("leave-game", () => {
        test("should make player leave the current game", (done) => {
            gameStateManager.getGame = jest.fn().mockReturnValue(mockGame)
            mockGame.removePlayer = jest.fn()

            clientSocket.emit("leave-game", { gameId: testGameId } as LeaveGameData)

            clientSocket.once("leave-game--success", () => {
                expect(gameStateManager.getGame).toHaveBeenCalledWith(testGameId)
                expect(mockGame.removePlayer).toHaveBeenCalledWith(expect.any(String))
                done()
            })
        })

        test("should throw an error if game ID is missing", (done) => {
            clientSocket.emit("leave-game")
            clientSocket.once("leave-game--error", () => {
                done()
            })
        })
    })
})