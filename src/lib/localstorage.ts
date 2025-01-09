'use client'

const GUEST_KEY = 'guestSession'

type GuestSession = {
    userId: string,
    guestName: string,
}

export function setGuestLocalStorage(guestSession: GuestSession) {
    localStorage.setItem('guestSession', JSON.stringify(guestSession))
}

export function getGuestLocalStorage(): GuestSession | null {
    const result = localStorage.getItem(GUEST_KEY)
    return result ? JSON.parse(result) : null;
}

export function getUserId() {
    const data = getGuestLocalStorage()
    return data ? data.userId : null;
}

export function getGuestName() {
    const data = getGuestLocalStorage()
    return data ? data.guestName : null;
}

export function clearGuestStorage() {
    localStorage.removeItem(GUEST_KEY)
}