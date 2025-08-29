import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ActiveConGameSchema } from "@shared-types";

const router = express.Router();

// GET endpoint to retrieve user's active games
router.get("/:userId/games", async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const rawGames = await prisma.conGame.aggregateRaw({
            pipeline: [
              {
                $match: {
                  players: { $elemMatch: { userId } },
                  isActive: true
                }
              }
            ]
        });

        if (!rawGames || !(rawGames instanceof Array)) {
            res.status(404).json({ error: "No active games found" });
            return;
        }

        const parsedGames = rawGames.map((game) => ActiveConGameSchema.parse(game));

        const activeGames = parsedGames.map((parsedGames) => ({
            gameId: parsedGames.id,
            gameName: parsedGames.gameName,
            isPrivate: parsedGames.isPrivate,
            isStarted: parsedGames.isStarted,
            numPlayersTotal: parsedGames.numPlayersTotal,
            currentPlayers: parsedGames.players.length,
        }));

        res.json({ activeGames });
    } catch (error) {
        console.error("Error fetching user games:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST endpoint to join or leave a game
router.post("/:userId/games", async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { gameId, action } = req.body;

    if (!gameId || !action) {
        res.status(400).json({ error: "Missing gameId or action" });
        return;
    }

    const validActions = ["create", "join", "leave"];
    if (!validActions.includes(action)) {
        res.status(400).json({ error: `Invalid action: ${action}` });
        return;
    }

    if (action === "join") {
    } else if (action === "leave") {
    }
});

export default router;
