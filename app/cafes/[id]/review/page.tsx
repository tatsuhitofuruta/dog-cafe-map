"use client"

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ログインしていない場合はリダイレクト
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      alert('評価を選択してください')
      return
    }

    setIsSubmitting(true)

    try {
      // ここでは簡易的に処理（実際はAPIに送信）
      console.log('レビュー送信:', {
        cafeId: params.id,
        rating,
        comment,
      })

      alert('レビューを投稿しました！')
      router.push(`/cafes/${params.id}`)
    } catch (error) {
      console.error('投稿エラー:', error)
      alert('投稿に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            トップ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link
            href={`/cafes/${params.id}`}
            className="text-blue-600 hover:underline"
          >
            店舗詳細
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">レビューを書く</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            レビューを書く
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 評価 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                評価 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-4xl focus:outline-none transition-colors"
                  >
                    <span
                      className={
                        star <= (hoverRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}
                <span className="ml-4 text-gray-600">
                  {rating > 0 ? `${rating}つ星` : '評価を選択'}
                </span>
              </div>
            </div>

            {/* コメント */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                コメント
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="このお店の良かった点や、犬連れで訪問した時の感想などを教えてください"
              />
              <p className="mt-2 text-sm text-gray-500">
                {comment.length}文字
              </p>
            </div>

            {/* ガイドライン */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                レビュー投稿のガイドライン
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>実際に訪問した体験に基づいて投稿してください</li>
                <li>具体的な情報（犬の大きさ、混雑状況など）があると参考になります</li>
                <li>誹謗中傷や不適切な内容は投稿しないでください</li>
              </ul>
            </div>

            {/* 送信ボタン */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? '投稿中...' : 'レビューを投稿'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
