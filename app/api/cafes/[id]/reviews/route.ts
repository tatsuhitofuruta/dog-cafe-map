import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

// GET /api/cafes/[id]/reviews - レビュー一覧取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      where: { cafeId: params.id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'レビューの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST /api/cafes/[id]/reviews - レビュー作成
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // 店舗の存在確認
    const cafe = await prisma.cafe.findUnique({
      where: { id: params.id },
    })

    if (!cafe) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    // 既存レビューの確認
    const existingReview = await prisma.review.findUnique({
      where: {
        cafeId_userId: {
          cafeId: params.id,
          userId: session.user.id,
        },
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: '既にこの店舗のレビューを投稿しています' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        cafeId: params.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Review creation error:', error)
    return NextResponse.json(
      { error: 'レビューの作成に失敗しました' },
      { status: 500 }
    )
  }
}
