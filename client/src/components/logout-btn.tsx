"use client";

import { logoutAction } from "@/actions/auth-actions";

export function LogoutBtn() {
    return (
    <button
        onClick={async () => await logoutAction()}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
      >
        Logout
      </button>
    )
}