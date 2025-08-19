import { NextResponse } from 'next/server';

const CACHE_DURATION = 5; // Cache duration in seconds

export async function GET() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/game-listings?isStarted=false`, {
            next: { revalidate: CACHE_DURATION }, // Enable Next.js cache with revalidation
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch games from websocket server');
        }

        const games = await response.json();
        
        // Create response with cache control headers
        return new NextResponse(JSON.stringify(games), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
            },
        });
    } catch (error) {
        console.error('Error fetching new games:', error);
        return NextResponse.json(
            { error: 'Failed to fetch new games' },
            { status: 500 }
        );
    }
}
