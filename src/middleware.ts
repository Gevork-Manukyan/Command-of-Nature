import { NextRequest, NextResponse } from "next/server";
import { getGuestLocalStorage } from "./lib/localstorage";

export function middleware(request: NextRequest) {
    // const token = getGuestLocalStorage()
    // if (!token) return NextResponse.redirect(new URL("/login", request.url))

    // return NextResponse.redirect(new URL("/lobby", request.url))
}