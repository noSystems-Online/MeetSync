'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-white">
        Meeting Scheduler
      </Link>
      <div>
        {session ? (
          <>
            <Link href="/admin" className="btn btn-primary">
              Admin
            </Link>
            <button onClick={() => signOut()} className="btn btn-primary ml-4">
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/api/auth/signin" className="btn btn-primary">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
