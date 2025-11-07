"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            🐕 ワンちゃんカフェマップ
          </Link>

          <nav className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/cafes/new"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  店舗を登録
                </Link>
                <Link
                  href="/my/want-to-go"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  行きたいリスト
                </Link>
                <span className="text-sm text-gray-600">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
              >
                ログイン
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
