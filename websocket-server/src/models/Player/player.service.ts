import { Player } from "./Player";
import { NotFoundError } from "../../services/CustomError/BaseError";
import { prisma } from "../../lib/prisma";

//TODO: not used
/**
 * Service class for managing Player instances in the database
 * @class PlayerService
 */
export class PlayerService {
  constructor() {}

  async createPlayer(
    userId: string,
    socketId: string,
    isGameHost: boolean = false
  ): Promise<Player> {
    const player = new Player(userId, socketId, isGameHost);
    const doc = await prisma.player.create({
      data: player.toPrismaObject(),
    });
    return Player.fromPrisma(doc);
  }

  async findPlayerById(userId: string): Promise<Player> {
    const doc = await this.model.findOne({ userId });
    if (!doc) {
      throw new NotFoundError(
        "Player",
        `Player with userId ${userId} not found`
      );
    }
    return Player.fromPrisma(doc);
  }

  async findPlayerBySocketId(socketId: string): Promise<Player> {
    const doc = await this.model.findOne({ socketId });
    if (!doc) {
      throw new NotFoundError(
        "Player",
        `Player with socketId ${socketId} not found`
      );
    }
    return Player.fromPrisma(doc);
  }

  async updatePlayerSocketId(
    userId: string,
    newSocketId: string
  ): Promise<Player> {
    const doc = await this.model.findOneAndUpdate(
      { userId },
      { socketId: newSocketId },
      { new: true }
    );
    if (!doc) {
      throw new NotFoundError(
        "Player",
        `Player with userId ${userId} not found`
      );
    }
    return Player.fromPrisma(doc);
  }

  async updatePlayerState(
    userId: string,
    updates: Partial<Player>
  ): Promise<Player> {
    const doc = await this.model.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true }
    );
    if (!doc) {
      throw new NotFoundError(
        "Player",
        `Player with userId ${userId} not found`
      );
    }
    return Player.fromPrisma(doc);
  }

  async deletePlayer(userId: string): Promise<void> {
    const result = await this.model.deleteOne({ userId });
    if (result.deletedCount === 0) {
      throw new NotFoundError(
        "Player",
        `Player with userId ${userId} not found`
      );
    }
  }

  async findPlayersByGameId(gameId: string): Promise<Player[]> {
    const docs = await this.model.find({ gameId });
    return docs.map((doc) => Player.fromPrisma(doc));
  }
}