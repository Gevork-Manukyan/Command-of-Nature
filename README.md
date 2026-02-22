# Command of Nature

A real-time multiplayer card game built with Next.js, Socket.io, and MongoDB.

Command of Nature is a real-time multiplayer card game for 2 or 4 players. Players form teams, complete a setup phase (warrior selection, team selection, sage selection, and ready-up), then battle in real time over Socket.io. Gameplay uses phased turns, day-break cards, and action points (3 or 6 depending on player count), with game state kept in memory and persisted to MongoDB.

## Features

- **User system** – Register and log in with NextAuth (JWT). User profiles track games played, games won, and online status.
- **Lobby** – Create or join games (public or private with password). Games support 2 or 4 players; the lobby lists available games.
- **Setup phase** – Each player selects warriors, chooses a team, selects a sage, and marks ready. Battle starts only when all players have finished setup.
- **Gameplay** – Real-time play over the Socket.io `/gameplay` namespace. Phases (e.g. phase1–phase4), day-break cards, and action points drive the flow. Teams have battlefields; state is held in memory by `GameStateManager` and persisted to MongoDB (games and `GameState`).
- **Reconnection** – If a user reconnects with the same `userId` in the socket query, they are automatically re-joined to their active game.

## Architecture

```mermaid
flowchart LR
  subgraph client [Client]
    NextJs[Next.js App]
  end
  subgraph server [WebSocket Server]
    Express[Express API]
    SocketNamespace["Socket.io /gameplay"]
    GameStateManager[GameStateManager]
    GameEventEmitter[GameEventEmitter]
  end
  subgraph persistence [Persistence]
    MongoDB[(MongoDB)]
  end
  SharedTypes[shared-types]
  NextJs -->|REST + Socket.io client| Express
  NextJs -->|Socket.io client| SocketNamespace
  Express --> GameStateManager
  SocketNamespace --> GameEventEmitter
  GameEventEmitter --> GameStateManager
  GameStateManager --> MongoDB
  SharedTypes -.->|types + Prisma| NextJs
  SharedTypes -.->|types + Prisma| server
```

- **Monorepo** – npm workspaces with three packages: `client`, `websocket-server`, `shared-types`.
- **Client** – Next.js App Router; connects to the server via REST and Socket.io using `NEXT_PUBLIC_SOCKET_URL`.
- **Server** – Express serves `/api/games` and `/api/users`; Socket.io namespace `/gameplay` handles real-time game events. In-memory game state is managed by `GameStateManager` and `GameEventEmitter`, with MongoDB used for persistence.
- **Shared types** – The `shared-types` package holds the Prisma schema, generated client, and shared TypeScript types used by both client and server.

## Project Structure

This is a monorepo containing three main packages:

- **`client/`** – Next.js frontend application
- **`websocket-server/`** – Express + Socket.io backend server
- **`shared-types/`** – Shared TypeScript types and Prisma schema

### Client (`client/`)

The app uses the Next.js App Router:

- **`(public)/(auth)/`** – Login and register pages
- **`(private)/app/`** – Authenticated area: lobby and game
- **`(private)/app/game/[gameId]/setup`** – Game setup (warrior, team, sage, ready-up)
- **`(private)/app/game/[gameId]`** – In-game gameplay view
- **`src/components/`** – UI: auth, lobby, game setup, gameplay, forms, and shadcn-ui components

### WebSocket Server (`websocket-server/`)

- **`server.ts`** – Creates the Express app and Socket.io server; mounts the `/gameplay` namespace
- **`routes/`** – Games (setup and gameplay sub-routes), users
- **`services/`** – GameStateManager, GameEventEmitter, UserSocketManager
- **`middleware/`** – Auth and error handling
- **`lib/`** – Env, Prisma client, utilities

### Shared Types (`shared-types/`)

- **`src/`** – TypeScript types and Zod schemas for cards, game state, server events, abilities, etc.
- **`prisma/`** – Prisma schema and generated client

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB** (local instance or MongoDB Atlas account)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Command-of-Nature
```

### 2. Install Dependencies

Install dependencies for the root workspace and all packages:

```bash
npm run install:all
```

Or install manually:

```bash
npm install
cd client && npm install && cd ..
cd shared-types && npm install && cd ..
cd websocket-server && npm install && cd ..
```

### 3. Set Up Environment Variables

#### Root/WebSocket Server Environment Variables

Create a `.env` file in the root directory or `websocket-server/` directory with the following variables:

```env
# Node Environment (development or production)
NODE_ENV=development

# WebSocket Server Port (default: 3003)
PORT=3003

# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net
MONGODB_URI=your_mongodb_connection_string_here

# MongoDB Database Name
MONGODB_DB=command_of_nature
```

#### Client Environment Variables

Create a `.env.local` file in the `client/` directory with the following variables:

```env
# JWT Secret for NextAuth authentication
# Generate a secure random string (e.g., using: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here

# WebSocket Server URL (must match the PORT from websocket-server)
# For local development: http://localhost:3003
NEXT_PUBLIC_SOCKET_URL=http://localhost:3003
```

**Important Notes:**
- The `NEXT_PUBLIC_SOCKET_URL` must match the port configured in your websocket-server
- The `JWT_SECRET` should be a long, random, secure string
- Never commit `.env` or `.env.local` files to version control (they are already in `.gitignore`)

### 4. Set Up MongoDB Database

#### Option A: Local MongoDB

1. Install and start MongoDB locally
2. Ensure MongoDB is running on `localhost:27017`
3. Update `MONGODB_URI` in your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file with your Atlas connection string

### 5. Generate Prisma Client

The Prisma schema is located in `shared-types/prisma/schema.prisma`. Generate the Prisma client:

```bash
cd shared-types
npx prisma generate
cd ..
```

**Note:** Prisma will automatically create the database schema on first connection if the database doesn't exist.

### 6. Build Shared Types

Build the shared-types package (required before running client or server):

```bash
npm run build:shared
```

Or manually:

```bash
cd shared-types
npm run build
cd ..
```

## Running the Project

### Development Mode

Run both the client and websocket server concurrently:

```bash
npm run dev
```

This will start:
- **Client** on `http://localhost:3000`
- **WebSocket Server** on `http://localhost:3003`

### Run Services Individually

Run only the client:

```bash
npm run dev:client
```

Run only the websocket server:

```bash
npm run dev:server
```

### Production Build

Build all packages for production:

```bash
npm run build
```

This builds:
1. Shared types
2. Client application
3. WebSocket server

Start the production server:

```bash
# Start websocket server
cd websocket-server
npm start

# Start client (in another terminal)
cd client
npm start
```

## Available Scripts

### Root Level

- `npm run dev` - Run both client and server in development mode
- `npm run dev:client` - Run only the client
- `npm run dev:server` - Run only the websocket server
- `npm run build` - Build all packages for production
- `npm run build:shared` - Build shared-types package
- `npm run build:client` - Build client package
- `npm run build:server` - Build websocket-server package
- `npm run install:all` - Install dependencies for all packages

### Client (`client/`)

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### WebSocket Server (`websocket-server/`)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server (builds first)
- `npm test` - Run tests

### Shared Types (`shared-types/`)

- `npm run build` - Compile TypeScript
- `npm run watch` - Watch mode for development

## Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, next-themes, react-hook-form, Radix (label, slot), class-variance-authority, clsx, tailwind-merge, tailwindcss-animate, lucide-react, sonner
- **Auth:** NextAuth.js (v5 beta), jose, bcryptjs
- **Backend:** Express, Socket.io, TypeScript (tsx in dev)
- **Database:** MongoDB with Prisma ORM (schema in shared-types)
- **Shared:** shared-types package (card/game/server types, Prisma client)
- **Validation:** Zod, @hookform/resolvers
- **Monorepo:** npm workspaces

## Troubleshooting

### Port Already in Use

If you encounter port conflicts:

1. Change the `PORT` in your `.env` file for the websocket server
2. Update `NEXT_PUBLIC_SOCKET_URL` in `client/.env.local` to match

### Database Connection Issues

- Verify MongoDB is running (if using local instance)
- Check your `MONGODB_URI` is correct
- Ensure network access is configured (for MongoDB Atlas)
- Verify the database name in `MONGODB_DB` matches your database

### Prisma Client Not Found

If you see Prisma client errors:

```bash
cd shared-types
npx prisma generate
cd ..
```

### Build Errors

Ensure shared-types is built before building client or server:

```bash
npm run build:shared
```

### Module Resolution Issues

If you encounter module resolution errors:

1. Delete `node_modules` in root and all packages
2. Run `npm run install:all` again
3. Rebuild shared-types: `npm run build:shared`

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all builds pass: `npm run build`
4. Submit a pull request