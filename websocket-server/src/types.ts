import { ConGame, GameState } from "./models";

export type gameId = string;

export type GameStateInfo = {
  game: ConGame;
  state: GameState;
}