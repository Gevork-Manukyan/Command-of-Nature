import { config } from '@/lib/server/config';
import { NextResponse } from 'next/server';

const SOCKET_SERVER_URL = config.socket.url;

export async function GET() {
    try {
        const response = await fetch(`${SOCKET_SERVER_URL}/api/games?isStarted=false`);
            if (!response.ok) {
            throw new Error('Failed to fetch games from websocket server');
        }

        const games = await response.json();
        return NextResponse.json(games);
    } catch (error) {
            console.error('Error fetching new games:', error);
            return NextResponse.json(
            { error: 'Failed to fetch new games' },
            { status: 500 }
        );
    }
}
