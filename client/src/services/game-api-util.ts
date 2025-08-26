import { socketService } from "./socket";

const BASE_URL = 'http://localhost:3003/api/games';

export async function gameApiFetch(endpoint: string, data: any, method: string) {
  // Check socket connection before making any API call
  if (!socketService.getConnected()) {
    await socketService.connect(data.userId);
  }    

  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const responseData = await response.json();
  if (responseData instanceof Error) throw responseData;
  return responseData;
}


export function getSetupUrl(url: string, data: any, method: string) {
    return gameApiFetch(`/setup${url}`, data, method);
}
  
export function getSetupUrlWithGameId(url: string, gameId: string, data: any, method: string) {
    return getSetupUrl(`/${gameId}${url}`, data, method);
}

export function getGameplayUrlWithGameId(url: string, gameId: string, data: any, method: string) {
    return gameApiFetch(`/gameplay/${gameId}${url}`, data, method);
}