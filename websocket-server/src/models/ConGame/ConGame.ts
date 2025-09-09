// Command of Nature (C.O.N)

import {
    NotFoundError, 
    ValidationError,
    NotEnoughGoldError,
    PlayersNotReadyError,
    SageUnavailableError,
    ShopFullError,
} from "../../custom-errors";
import { gameId } from "../../types";
import {
    Sage,
    ElementalCard,
    ItemCard,
    SpaceOption,
    SageSchema,
    CARD_NAMES,
} from "@shared-types";
import { drawCardFromDeck } from "../../lib";
import { Player } from "../Player/Player";
import { Team } from "../Team/Team";
import { ALL_CARDS, processAbility } from "../../constants";
import { ConGame as ConGamePrisma } from "@prisma/client";
import { reconstructCards } from "@shared-types/card-reconstruction";
import { JsonValue } from "@prisma/client/runtime/library";

type ShopIndex = 0 | 1 | 2;

type TeamOrder = {
    first: Team["teamNumber"];
    second: Team["teamNumber"];
};

/**
 * Represents a Command of Nature (C.O.N) game instance
 * @class ConGame
 */
export class ConGame {
    id!: gameId;
    gameName: string;
    isPrivate: boolean;
    password: string | null;
    isStarted: boolean = false;
    protected hasFinishedSetup: boolean = false;
    numPlayersTotal: 2 | 4;
    numPlayersReady: number = 0;
    numPlayersFinishedSetup: number = 0;
    players: Player[] = [];
    team1: Team;
    team2: Team;
    protected teamOrder: TeamOrder;
    protected creatureShop: ElementalCard[] = [];
    protected currentCreatureShopCards: ElementalCard[] = [];
    protected itemShop: ItemCard[] = [];
    protected currentItemShopCards: ItemCard[] = [];

    /**
     * Creates a new ConGame instance
     * @param {2 | 4} numPlayers - The total number of players in the game
     * @param {string} gameName - The name of the game
     * @param {boolean} isPrivate - Whether the game is private
     * @param {string} password - The password for the game
     * @param {gameId} id - The ID of the game
     */
    constructor(
        numPlayers: ConGame["numPlayersTotal"],
        gameName: ConGame["gameName"],
        isPrivate: ConGame["isPrivate"],
        password: ConGame["password"] = null,
        id?: gameId
    ) {
        if (id) this.id = id;
        this.numPlayersTotal = numPlayers;
        this.gameName = gameName;
        this.isPrivate = isPrivate;
        this.password = password || "";

        const teamSize = (numPlayers / 2) as Team["teamSize"];
        this.team1 = new Team(teamSize, 1);
        this.team2 = new Team(teamSize, 2);

        const teamOrder =
            Math.random() > 0.5
                ? [this.team1, this.team2]
                : [this.team2, this.team1];
        this.teamOrder = {
            first: teamOrder[0].getTeamNumber(),
            second: teamOrder[1].getTeamNumber(),
        };
    }

    /**
     * Sets the ID of the game
     * @param id - The ID to set
     */
    setId(id: gameId) {
        this.id = id;
    }

    /**
     * Sets the started status of the game
     * @param value - The value to set the started status to
     */
    setStarted(value: boolean) {
        this.isStarted = value;
    }

    /**
     * Gets the has finished setup status of the game
     * @returns The has finished setup status of the game
     */
    getHasFinishedSetup() {
        return this.hasFinishedSetup;
    }

    /**
     * Adds a player to the game
     * @param player - The player to add
     */
    addPlayer(player: Player) {
        this.players.push(player);
    }

    /**
     * Removes a player from the game
     * @param playerId - The socket ID of the player to remove
     */
    removePlayer(playerId: Player["socketId"]) {
        // If the host is leaving, set a new host
        if (this.getPlayer(playerId).isGameHost) {
            const newHost = this.players.find(
                (player) => player.socketId !== playerId
            );
            if (newHost) newHost.setIsGameHost(true);
        }

        this.players = Player.filterOutPlayerById(this.players, playerId);
        return this.players;
    }

    /**
     * Gets a player from the game
     * @param playerId - The socket ID of the player to get
     * @returns The player
     */
    getPlayer(playerId: Player["socketId"]): Player {
        const player = this.players.find((item) => item.socketId === playerId);
        if (!player)
            throw new NotFoundError(
                "Player",
                `Player with socket ID ${playerId} not found in game ${this.id}`
            );

        return player;
    }

    /**
     * Gets a player from the game by their user ID
     * @param userId - The user ID of the player to get
     * @returns The player
     */
    getPlayerByUserId(userId: string): Player | null {
        return this.players.find((item) => item.userId === userId) || null;
    }

    /**
     * Sets the sage for a player
     * @param playerId - The socket ID of the player to set the sage for
     * @param sage - The sage to set
     */
    setPlayerSage(playerId: Player["socketId"], sage: Sage) {
        const isSageAvailable = this.players.every(
            (player) => player.sage !== sage
        );
        if (!isSageAvailable) throw new SageUnavailableError(sage);
        const player = this.getPlayer(playerId);
        player.setSage(sage);
    }

    /**
     * Gets the available sages
     * @returns The available sages
     */
    getAvailableSages() {
        const selectedSages = this.players
            .filter((player) => player.sage !== null)
            .map((player) => player.sage);
        return Object.values(SageSchema.enum).reduce((acc, sage) => {
            acc[sage] = !selectedSages.includes(sage);
            return acc;
        }, {} as Record<Sage, boolean>);
    }

    /**
     * Checks if all teams have joined
     * @returns True if all teams have joined, false otherwise
     */
    validateAllTeamsJoined() {
        if (this.team1.getCurrentNumPlayers() !== this.numPlayersTotal / 2)
            throw new ValidationError(
                `Team 1 has ${
                    this.numPlayersTotal / 2 - this.team1.getCurrentNumPlayers()
                } players`,
                "team1"
            );
        if (this.team2.getCurrentNumPlayers() !== this.numPlayersTotal / 2)
            throw new ValidationError(
                `Team 2 has ${
                    this.numPlayersTotal / 2 - this.team2.getCurrentNumPlayers()
                } players`,
                "team2"
            );
    }

    /**
     * Gets the team the player is on
     * @param playerSocketId - The socket ID of the player to get the team of
     * @returns The team the player is on
     */
    getPlayerTeam(playerSocketId: Player["socketId"]) {
        const player = this.getPlayer(playerSocketId);
        return this.getPlayerTeamByUserId(player.userId);
    }

    getPlayerTeamByUserId(playerUserId: Player["userId"]) {
        const playerTeam = this.team1.isPlayerOnTeam(playerUserId)
            ? this.team1
            : this.team2.isPlayerOnTeam(playerUserId)
            ? this.team2
            : null;

        if (!playerTeam) return null;
        return playerTeam;
    }

    /**
     * Gets the teammate of the player
     * @param playerUserId - The user ID of the player to get the teammate of
     * @returns The teammate of the player
     */
    getPlayerTeammate(playerUserId: Player["userId"]) {
        const playerTeam = this.getPlayerTeamByUserId(playerUserId);
        const teammateId = playerTeam?.getTeammateId(playerUserId);

        if (!teammateId) return null;
        return this.getPlayerByUserId(teammateId);
    }

    /**
     * Gets the team order
     * @returns The team order
     */
    getTeamOrder() {
        return this.teamOrder;
    }

    /**
     * Gets the team going first
     * @returns The team going first
     */
    getTeamGoingFirst() {
        return this.teamOrder.first;
    }

    /**
     * Gets the team going second
     * @returns The team going second
     */
    getTeamGoingSecond() {
        return this.teamOrder.second;
    }

    /**
     * Gets the opposing team
     * @param team - The team to get the opposing team of
     * @returns The opposing team
     */
    getOpposingTeam(team: Team) {
        return team === this.team1 ? this.team2 : this.team1;
    }

    /**
     * Gets the current creature shop cards
     * @returns Array of available creature cards in the shop
     */
    getCreatureShop(): ElementalCard[] {
        return this.creatureShop;
    }

    /**
     * Gets the current creature shop cards
     * @returns Array of available creature cards in the shop
     */
    getCurrentCreatureShopCards() {
        return this.currentCreatureShopCards;
    }

    /**
     * Adds a card to the creature shop
     */
    addCardToCreatureShop() {
        this.addCardToShop(this.creatureShop, this.currentCreatureShopCards);
    }

    /**
     * Gets the current item shop cards
     * @returns Array of available item cards in the shop
     */
    getItemShop(): ItemCard[] {
        return this.itemShop;
    }

    /**
     * Gets the current item shop cards
     * @returns Array of available item cards in the shop
     */
    getCurrentItemShopCards() {
        return this.currentItemShopCards;
    }

    /**
     * Adds a card to the item shop
     */
    addCardToItemShop() {
        this.addCardToShop(this.itemShop, this.currentItemShopCards);
    }

    /**
     * Adds a card to the shop
     * @param shop - The shop to add the card to
     * @param currentShopCards - The current shop cards
     */
    private addCardToShop<T extends ElementalCard | ItemCard>(
        shop: T[],
        currentShopCards: T[]
    ) {
        const shopType = shop === this.creatureShop ? "creature" : "item";
        if (shop.length === 3) throw new ShopFullError(shopType);

        const card = drawCardFromDeck(shop);
        currentShopCards.push(card);
    }

    /**
     * Joins a player to a team
     * @param playerId - The socket ID of the player to join the team
     * @param teamNumber - The team number to join
     */
    joinTeam(playerId: Player["socketId"], teamNumber: Team["teamNumber"]) {
        const teamSelected = teamNumber === 1 ? this.team1 : this.team2;
        const player = this.getPlayer(playerId);
        const playerUserId = player.userId;

        if (this.team1.isPlayerOnTeam(playerUserId)) {
            this.team1.removePlayerFromTeam(playerUserId);
        } else if (this.team2.isPlayerOnTeam(playerUserId)) {
            this.team2.removePlayerFromTeam(playerUserId);
        }

        teamSelected.addPlayerToTeam(playerUserId);
    }

    /**
     * Increments the number of players ready
     * @returns The number of players ready
     */
    incrementPlayersReady() {
        this.numPlayersReady++;
        if (this.numPlayersReady > this.numPlayersTotal)
            this.numPlayersReady = this.numPlayersTotal;
        return this.numPlayersReady;
    }

    /**
     * Decrements the number of players ready
     * @returns The number of players ready
     */
    decrementPlayersReady() {
        this.numPlayersReady--;
        if (this.numPlayersReady < 0) this.numPlayersReady = 0;
        return this.numPlayersReady;
    }

    /**
     * Checks if all players have finished setup
     * @returns True if all players have finished setup, false otherwise
     */
    validateAllPlayersReady() {
        if (this.numPlayersReady !== this.numPlayersTotal)
            throw new PlayersNotReadyError(
                this.numPlayersReady,
                this.numPlayersTotal
            );
    }

    /**
     * Increments the number of players finished setup
     * @returns The number of players finished setup
     */
    incrementPlayersFinishedSetup() {
        this.numPlayersFinishedSetup++;
        if (this.numPlayersFinishedSetup > this.numPlayersTotal)
            this.numPlayersFinishedSetup = this.numPlayersTotal;
        return this.numPlayersFinishedSetup;
    }

    /**
     * Decrements the number of players finished setup
     * @returns The number of players finished setup
     */
    decrementPlayersFinishedSetup() {
        this.numPlayersFinishedSetup--;
        if (this.numPlayersFinishedSetup < 0) this.numPlayersFinishedSetup = 0;
        return this.numPlayersFinishedSetup;
    }

    /**
     * Clears the teams
     */
    clearTeams() {
        this.team1.resetTeam();
        this.team2.resetTeam();
        this.numPlayersReady = 0;
        this.numPlayersFinishedSetup = 0;
        this.players.forEach((player) => player.setIsReady(false));
    }

    /**
     * Initializes the game by setting up player decks, hands, fields, and shops
     * @throws {PlayersNotReadyError} If not all players are ready
     */
    initGame() {
        this.validateAllPlayersReady();
        this.initPlayerDecks();
        this.initPlayerHands();
        this.initPlayerFields();
        this.initCreatureShop();
        this.initItemShop();
        this.setStarted(true);
    }

    /**
     * Initializes the player decks
     */
    initPlayerDecks() {
        this.players.forEach((player) => player.initDeck());
    }

    /**
     * Initializes the player hands
     */
    initPlayerHands() {
        this.players.forEach((player) => player.initHand());
    }

    /**
     * Initializes the player fields
     */
    initPlayerFields() {
        const team1Decklists = this.getTeamDecklists(this.team1);
        const team2Decklists = this.getTeamDecklists(this.team2);
        this.team1.initBattlefield(team1Decklists);
        this.team2.initBattlefield(team2Decklists);
    }

    getTeamDecklists(team: Team) {
        const teamPlayers = this.players.filter((player) =>
            team.isPlayerOnTeam(player.userId)
        );
        const decklists = teamPlayers.map((player) => player.decklist);
        // Filter out null values and ensure we have valid decklists
        const validDecklists = decklists.filter(
            (decklist) => decklist !== null
        );
        if (validDecklists.length !== teamPlayers.length) {
            throw new ValidationError(
                `Not all players in team have decklists set`,
                "decklists"
            );
        }
        return validDecklists;
    }

    /**
     * Initializes the creature shop with available cards
     */
    initCreatureShop() {
        this.creatureShop = [
            ALL_CARDS[CARD_NAMES.WILLOW](),
            ALL_CARDS[CARD_NAMES.WILLOW](),
            ALL_CARDS[CARD_NAMES.BRUCE](),
            ALL_CARDS[CARD_NAMES.BRUCE](),
            ALL_CARDS[CARD_NAMES.OAK_LUMBERTRON](),
            ALL_CARDS[CARD_NAMES.TWINE_FELINE](),
            ALL_CARDS[CARD_NAMES.CAMOU_CHAMELEON](),
            ALL_CARDS[CARD_NAMES.LUMBER_CLAW](),
            ALL_CARDS[CARD_NAMES.SPLINTER_STINGER](),
            ALL_CARDS[CARD_NAMES.PINE_SNAPPER](),
            ALL_CARDS[CARD_NAMES.ROCCO](),
            ALL_CARDS[CARD_NAMES.ROCCO](),
            ALL_CARDS[CARD_NAMES.FLINT](),
            ALL_CARDS[CARD_NAMES.FLINT](),
            ALL_CARDS[CARD_NAMES.CACKLE_RIPCLAW](),
            ALL_CARDS[CARD_NAMES.REDSTONE](),
            ALL_CARDS[CARD_NAMES.RUNE_PUMA](),
            ALL_CARDS[CARD_NAMES.STONE_DEFENDER](),
            ALL_CARDS[CARD_NAMES.TERRAIN_TUMBLER](),
            ALL_CARDS[CARD_NAMES.RUBY_GUARDIAN](),
            ALL_CARDS[CARD_NAMES.MUSH](),
            ALL_CARDS[CARD_NAMES.MUSH](),
            ALL_CARDS[CARD_NAMES.HERBERT](),
            ALL_CARDS[CARD_NAMES.HERBERT](),
            ALL_CARDS[CARD_NAMES.MOSS_VIPER](),
            ALL_CARDS[CARD_NAMES.BAMBOO_BERSERKER](),
            ALL_CARDS[CARD_NAMES.IGUANA_GUARD](),
            ALL_CARDS[CARD_NAMES.HUMMING_HERALD](),
            ALL_CARDS[CARD_NAMES.SHRUB_BEETLE](),
            ALL_CARDS[CARD_NAMES.FORAGE_THUMPER](),
            ALL_CARDS[CARD_NAMES.DEWY](),
            ALL_CARDS[CARD_NAMES.DEWY](),
            ALL_CARDS[CARD_NAMES.WADE](),
            ALL_CARDS[CARD_NAMES.WADE](),
            ALL_CARDS[CARD_NAMES.ROAMING_RAZOR](),
            ALL_CARDS[CARD_NAMES.CURRENT_CONJURER](),
            ALL_CARDS[CARD_NAMES.TYPHOON_FIST](),
            ALL_CARDS[CARD_NAMES.WHIRL_WHIPPER](),
            ALL_CARDS[CARD_NAMES.SURGESPHERE_MONK](),
            ALL_CARDS[CARD_NAMES.SPLASH_BASILISK](),
        ];

        this.addCardToCreatureShop();
        this.addCardToCreatureShop();
        this.addCardToCreatureShop();
    }

    /**
     * Initializes the item shop with available cards
     */
    initItemShop() {
        this.itemShop = [
            ALL_CARDS[CARD_NAMES.DISTANT_DOUBLE_STRIKE](),
            ALL_CARDS[CARD_NAMES.DISTANT_DOUBLE_STRIKE](),
            ALL_CARDS[CARD_NAMES.FARSIGHT_FRENZY](),
            ALL_CARDS[CARD_NAMES.FARSIGHT_FRENZY](),
            ALL_CARDS[CARD_NAMES.FARSIGHT_FRENZY](),
            ALL_CARDS[CARD_NAMES.FOCUSED_FURY](),
            ALL_CARDS[CARD_NAMES.FOCUSED_FURY](),
            ALL_CARDS[CARD_NAMES.FOCUSED_FURY](),
            ALL_CARDS[CARD_NAMES.MAGIC_ETHER_STRIKE](),
            ALL_CARDS[CARD_NAMES.MAGIC_ETHER_STRIKE](),
            ALL_CARDS[CARD_NAMES.NATURES_WRATH](),
            ALL_CARDS[CARD_NAMES.NATURES_WRATH](),
            ALL_CARDS[CARD_NAMES.NATURES_WRATH](),
            ALL_CARDS[CARD_NAMES.PRIMITIVE_STRIKE](),
            ALL_CARDS[CARD_NAMES.PRIMITIVE_STRIKE](),
            ALL_CARDS[CARD_NAMES.PROJECTILE_BLAST](),
            ALL_CARDS[CARD_NAMES.PROJECTILE_BLAST](),
            ALL_CARDS[CARD_NAMES.PROJECTILE_BLAST](),
            ALL_CARDS[CARD_NAMES.REINFORCED_IMPACT](),
            ALL_CARDS[CARD_NAMES.REINFORCED_IMPACT](),
            ALL_CARDS[CARD_NAMES.REINFORCED_IMPACT](),
            ALL_CARDS[CARD_NAMES.REINFORCED_IMPACT](),
            ALL_CARDS[CARD_NAMES.ELEMENTAL_INCANTATION](),
            ALL_CARDS[CARD_NAMES.ELEMENTAL_INCANTATION](),
            ALL_CARDS[CARD_NAMES.ELEMENTAL_SWAP](),
            ALL_CARDS[CARD_NAMES.ELEMENTAL_SWAP](),
            ALL_CARDS[CARD_NAMES.EXCHANGE_OF_NATURE](),
            ALL_CARDS[CARD_NAMES.EXCHANGE_OF_NATURE](),
            ALL_CARDS[CARD_NAMES.OBLITERATE](),
            ALL_CARDS[CARD_NAMES.OBLITERATE](),
            ALL_CARDS[CARD_NAMES.NATURAL_DEFENSE](),
            ALL_CARDS[CARD_NAMES.NATURAL_DEFENSE](),
            ALL_CARDS[CARD_NAMES.NATURAL_DEFENSE](),
            ALL_CARDS[CARD_NAMES.NATURAL_DEFENSE](),
            ALL_CARDS[CARD_NAMES.RANGED_BARRIER](),
            ALL_CARDS[CARD_NAMES.RANGED_BARRIER](),
            ALL_CARDS[CARD_NAMES.RANGED_BARRIER](),
            ALL_CARDS[CARD_NAMES.MELEE_SHIELD](),
            ALL_CARDS[CARD_NAMES.MELEE_SHIELD](),
            ALL_CARDS[CARD_NAMES.MELEE_SHIELD](),
        ];

        this.addCardToItemShop();
        this.addCardToItemShop();
        this.addCardToItemShop();
    }

    /**
     * Marks the game setup as finished and returns an ActiveConGame instance
     * @returns A new active game instance
     */
    finishedSetup(): ActiveConGame {
        this.hasFinishedSetup = true;
        return new ActiveConGame(this);
    }

    /**
     * Creates a new ConGame instance from plain data
     * @param data - The plain data to create the instance from
     * @returns A new ConGame instance
     */
    static fromPrisma(data: ConGamePrisma): ConGame {
        const { numPlayersTotal, gameName, isPrivate, password, id } = data;

        if (numPlayersTotal !== 2 && numPlayersTotal !== 4) {
            throw new ValidationError(
                `Invalid number of players: ${numPlayersTotal}`,
                "numPlayersTotal"
            );
        }

        const game = new ConGame(
            numPlayersTotal,
            gameName,
            isPrivate,
            password,
            id
        );

        // Convert players to Player instances if they aren't already
        const players = data.players.map((player) => Player.fromPrisma(player as JsonValue));

        // Convert teams to Team instances if they aren't already
        const team1 = Team.fromPrisma(data.team1 as JsonValue);
        const team2 = Team.fromPrisma(data.team2 as JsonValue);

        // Convert shops to proper card instances
        const creatureShop = reconstructCards(data.creatureShop) as ElementalCard[];
        const itemShop = reconstructCards(data.itemShop) as ItemCard[];
        const currentCreatureShopCards = reconstructCards(data.currentCreatureShopCards) as ElementalCard[];
        const currentItemShopCards = reconstructCards(data.currentItemShopCards) as ItemCard[];

        // Copy all properties
        Object.assign(game, {
            isStarted: data.isStarted,
            hasFinishedSetup: data.hasFinishedSetup,
            numPlayersReady: data.numPlayersReady,
            numPlayersFinishedSetup: data.numPlayersFinishedSetup,
            players,
            team1,
            team2,
            teamOrder: data.teamOrder,
            creatureShop,
            itemShop,
            currentCreatureShopCards,
            currentItemShopCards,
        });

        return game;
    }

    /**
     * Converts the runtime instance to a plain object for Prisma
     * @returns A plain object representation of the ConGame instance
     */
    toPrismaObject() {
        return {
            gameName: this.gameName,
            isPrivate: this.isPrivate,
            password: this.password,
            isStarted: this.isStarted,
            hasFinishedSetup: this.hasFinishedSetup,
            numPlayersTotal: this.numPlayersTotal,
            numPlayersReady: this.numPlayersReady,
            numPlayersFinishedSetup: this.numPlayersFinishedSetup,
            players: this.players.map((player) => player.toPrismaObject()),
            team1: this.team1.toPrismaObject(),
            team2: this.team2.toPrismaObject(),
            teamOrder: {
                first: this.teamOrder.first,
                second: this.teamOrder.second,
            },
            creatureShop: this.creatureShop.map((card) => card.getData()),
            itemShop: this.itemShop.map((card) => card.getData()),
            currentCreatureShopCards: this.currentCreatureShopCards.map(
                (card) => card.getData()
            ),
            currentItemShopCards: this.currentItemShopCards.map((card) =>
                card.getData()
            ),

            isActive: false,
            activeTeam: "",
            currentPhase: "",
            actionPoints: 0,
            maxActionPoints: 0,
        };
    }
}

/* ------------ Active ConGame ------------ */
/**
 * Represents an active Command of Nature game with additional game state
 * @class ActiveConGame
 * @extends ConGame
 */
export class ActiveConGame extends ConGame {
    private activeTeam: keyof TeamOrder = "first";
    private currentPhase: "phase1" | "phase2" | "phase3" | "phase4" = "phase1";
    private actionPoints: number;
    private maxActionPoints: 3 | 6;

    constructor(conGame: ConGame) {
        super(
            conGame.numPlayersTotal,
            conGame.gameName,
            conGame.isPrivate,
            conGame.password
        );

        this.maxActionPoints = this.numPlayersTotal === 2 ? 3 : 6;
        this.actionPoints = this.maxActionPoints;
    }

    /**
     * Gets the currently active team
     * @returns The active team
     */
    getActiveTeam(): Team {
        const teamNumber = this.teamOrder[this.activeTeam];
        return teamNumber === 1 ? this.team1 : this.team2;
    }

    /**
     * Gets the team that is not active
     * @returns The waiting team
     */
    getWaitingTeam() {
        const teamNumber = this.teamOrder[this.activeTeam];
        return teamNumber === 1 ? this.team2 : this.team1;
    }

    getActiveTeamPlayers(): Player[] {
        return this.players.filter((player) =>
            this.getActiveTeam().isPlayerOnTeam(player.userId)
        );
    }

    getWaitingTeamPlayers(): Player[] {
        return this.players.filter((player) =>
            this.getWaitingTeam().isPlayerOnTeam(player.userId)
        );
    }

    toggleActiveTeam() {
        this.activeTeam = this.activeTeam === "first" ? "second" : "first";
    }

    /**
     * Gets the current game phase
     * @returns The current phase
     */
    getCurrentPhase(): "phase1" | "phase2" | "phase3" | "phase4" {
        return this.currentPhase;
    }

    /**
     * Advances the game to phase 2
     */
    endPhase1() {
        this.currentPhase = "phase2";
    }

    /**
     * Advances the game to phase 3
     */
    endPhase2() {
        this.currentPhase = "phase3";
    }

    /**
     * Advances the game to phase 4
     */
    endPhase3() {
        this.currentPhase = "phase4";
    }

    endPhase4() {
        // End turn and reset all variables
        this.currentPhase = "phase1";
        this.toggleActiveTeam();
        this.resetActionPoints();
    }

    /**
     * Gets the current number of action points
     * @returns The current action points
     */
    getActionPoints(): number {
        return this.actionPoints;
    }

    resetActionPoints() {
        this.actionPoints = this.maxActionPoints;
    }

    decrementActionPoints() {
        if (this.actionPoints === 0)
            throw new ValidationError(
                "Team has no action points left",
                "actionPoints"
            );
        this.actionPoints -= 1;
    }

    getDayBreakCards(playerId: Player["socketId"]): SpaceOption[] {
        return this.getPlayerTeam(playerId)?.getDayBreakCards() || [];
    }

    /**
     * Activates the daybreak ability the player chooses
     * @param playerId
     * @param spaceOption
     */
    activateDayBreak(playerId: Player["socketId"], spaceOption: SpaceOption) {
        const abilityResult = this.getPlayerTeam(playerId)?.activateDayBreak(spaceOption) || null;
        if (!abilityResult) return;
        processAbility(this, abilityResult);
    }

    buyCreature(playerId: Player["socketId"], creatureShopIndex: ShopIndex) {
        this.buyCard(playerId, creatureShopIndex, this.creatureShop);
    }

    buyItem(playerId: Player["socketId"], itemShopIndex: ShopIndex) {
        this.buyCard(playerId, itemShopIndex, this.itemShop);
    }

    private buyCard(
        playerId: Player["socketId"],
        shopIndex: ShopIndex,
        shop: ElementalCard[] | ItemCard[]
    ) {
        const currentShopCards =
            shop === this.creatureShop
                ? this.currentCreatureShopCards
                : this.currentItemShopCards;
        const player = this.getPlayer(playerId);
        const playerTeam = this.getPlayerTeam(playerId);
        if (!playerTeam) return;
        const card = currentShopCards[shopIndex];
        const cost = card.price;
        if (playerTeam.getGold() < cost) throw new NotEnoughGoldError();

        player.addCardToDeck(card);
        playerTeam.removeGold(cost);
        currentShopCards.splice(shopIndex, 1);
        if (shop === this.creatureShop) this.addCardToCreatureShop();
        else this.addCardToItemShop();
    }

    /**
     * Converts the runtime instance to a plain object for Prisma
     * @returns A plain object representation of the ActiveConGame instance
     */
    toPrismaObject() {
        return {
            ...super.toPrismaObject(),
            isActive: true,
            activeTeam: this.activeTeam,
            currentPhase: this.currentPhase,
            actionPoints: this.actionPoints,
            maxActionPoints: this.maxActionPoints,
        };
    }

    /**
     * Creates an ActiveConGame instance from Prisma data
     * @param data - The Prisma data to create the instance from
     * @returns A new ActiveConGame instance
     */
    static fromPrisma(data: ConGamePrisma): ActiveConGame {
        if (!data.isActive) {
            throw new Error("Document is not an active game");
        }

        const baseGame = ConGame.fromPrisma(data);
        const activeGame = new ActiveConGame(baseGame);

        Object.assign(activeGame, {
            activeTeam: data.activeTeam as keyof TeamOrder,
            currentPhase: data.currentPhase as
                | "phase1"
                | "phase2"
                | "phase3"
                | "phase4",
            actionPoints: data.actionPoints!,
            maxActionPoints: data.maxActionPoints as 3 | 6,
        });

        return activeGame;
    }
}

/**
 * Type guard to check if a ConGame is active
 */
export function isActiveGame(game: ConGamePrisma): game is ConGamePrisma & {
    isActive: true;
    activeTeam: string;
    currentPhase: string;
    actionPoints: number;
    maxActionPoints: number;
} {
    return game.isActive === true;
}
