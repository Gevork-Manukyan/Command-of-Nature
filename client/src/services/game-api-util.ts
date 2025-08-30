import { socketService } from "./socket";

const BASE_URL = "http://localhost:3003/api/games";

export async function gameApiFetch(
    endpoint: string,
    data: any,
    method: string
) {
    // Check socket connection before making any API call
    if (!socketService.getConnected()) {
        await socketService.connect(data.userId);
    }

    let url = `${BASE_URL}${endpoint}`;

    // For GET requests, append data as query parameters
    if (method.toUpperCase() === "GET" && data) {
        const queryParams = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        });
        const queryString = queryParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    const fetchOptions: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
    };

    // Only add body for non-GET requests
    if (method.toUpperCase() !== "GET") {
        fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok)
        throw new Error(`Game API Error (${endpoint}): ${response.statusText}`);
    const responseData = await response.json();
    return responseData;
}

export function getSetupUrl(url: string, data: any, method: string) {
    return gameApiFetch(`/setup${url}`, data, method);
}

export function getSetupUrlWithGameId(
    url: string,
    gameId: string,
    data: any,
    method: string
) {
    return getSetupUrl(`/${gameId}${url}`, data, method);
}

export function getGameplayUrlWithGameId(
    url: string,
    gameId: string,
    data: any,
    method: string
) {
    return gameApiFetch(`/gameplay/${gameId}${url}`, data, method);
}
