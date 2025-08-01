import { createServer } from "http"; 
import { Server } from "socket.io";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import gameListingsRouter from "./routes/game-listings";
import usersRouter from "./routes/users";
import { processEventMiddleware } from "./lib";
import { GameEventEmitter, GameStateManager } from "./services";
import { RegisterUserSocketEvent, RegisterUserData, SocketEventMap } from "@shared-types";
import { UserSocketManager } from "./services/UserSocketManager";
import createGamesRouter from "./routes/games";
import { errorHandler } from './middleware/errorHandler';
import { env } from "./lib/env";
import { prisma } from "./lib/prisma";

const app = express();
app.use(cors());
app.use(express.json());

// Create server and io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Creates the gameplay namespace that will handle all gameplay connections
const gameNamespace = io.of("/gameplay");

// Initialize services
const gameEventEmitter = GameEventEmitter.getInstance(gameNamespace);
const gameStateManager = GameStateManager.getInstance();
const userSocketManager = UserSocketManager.getInstance();

// API routes
app.use('/api/games', createGamesRouter(gameEventEmitter));
app.use('/api/game-listings', gameListingsRouter);
app.use('/api/users', usersRouter);

// Error handling middleware (must be last)
app.use(errorHandler as express.ErrorRequestHandler);

gameNamespace.on("connection", (socket) => {
  socket.on("error", (error: Error) => {
    console.error("Socket error:", error);
  });

  /* -------- AUTO-REGISTER USER ID ON CONNECT -------- */
  // Extract userId from query parameters
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    userSocketManager.registerSocket(userId, socket);
    socket.emit(RegisterUserSocketEvent);
  } else {
    console.warn('Socket connected without userId in query parameters');
  }

  // Store socket ID and userId pair for REST API responses
  socket.on(RegisterUserSocketEvent, ({ userId }: RegisterUserData) => {
    userSocketManager.registerSocket(userId, socket);
    socket.emit(RegisterUserSocketEvent);
  });

  /*
    PHASE 1
      Daybreak Effects

    PHASE 2
      Draw Card from deck
      Swap Cards
      Summon Card
      Play Attack/Spell
      Level Up
      Sage Ability
    
    PHASE 3
      Buy Card ✅
        Item Shop ✅
        Creature Shop ✅
      Sell Card
      Summon Bought Card
      Refresh Shop

    PHASE 4
      Discard any number of cards
      Draw Cards until 5

    MISC
      Both players confirm action (4 players)
      Toggle hand view (4 players - Yours/Teammate)
      Instant Cards
      Triggered Effects
      Reshuffle Discard Pile
      Gain/Lose Gold
      Gain/Lose Shield
      Gain/Lose Boost
      Take Damage
  */
});

// Start the server with Prisma
async function startServer() {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.debug("Connected to database via Prisma");

    // Start the server after successful database connection
    server.listen(env.PORT, async () => {
      console.debug(`WebSocket server running on http://localhost:${env.PORT}`);
      await gameStateManager.loadExistingGames();
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

export { server, io };
