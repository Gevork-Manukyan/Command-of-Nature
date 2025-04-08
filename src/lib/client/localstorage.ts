export function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function setToLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(key);
} 