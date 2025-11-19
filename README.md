# Command of Nature

A real-time multiplayer card game built with Next.js, Socket.io, and MongoDB.

## Project Structure

This is a monorepo containing three main packages:

- **`client/`** - Next.js frontend application
- **`websocket-server/`** - Express + Socket.io backend server
- **`shared-types/`** - Shared TypeScript types and Prisma schema

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

Install dependencies for all packages:

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

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Express, Socket.io, TypeScript
- **Database:** MongoDB with Prisma ORM
- **Authentication:** NextAuth.js (JWT)
- **Validation:** Zod
- **Package Management:** npm workspaces

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

## License

[Add your license information here]

