"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-md px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
    >
      Delogare
    </button>
  );
}
