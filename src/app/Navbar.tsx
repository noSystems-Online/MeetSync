'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="neumorphism-container p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        Meeting Scheduler
      </Link>
      <div>
        {session ? (
          <>
            <Link href="/admin" className="neumorphism-button">
              Admin
            </Link>
            <button onClick={() => signOut()} className="neumorphism-button ml-4">
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/api/auth/signin" className="neumorphism-button">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
