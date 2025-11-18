import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// バリデーションスキーマ
const createCafeSchema = z.object({
  name: z.string().min(1, '店舗名は必須です').max(100),
  description: z.string().max(1000).optional(),
  address: z.string().min(1, '住所は必須です').max(200),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().max(20).optional(),
  website: z.string().url().optional().or(z.literal('')),
  openingHours: z.string().max(100).optional(),
  dogRules: z.string().max(500).optional(),
  facilities: z.string().max(500).optional(),
})

// GET /api/cafes - 全店舗取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const cafes = await prisma.cafe.findMany({
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: {
            reviews: true,
            wantToGo: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 平均評価を計算
    const cafesWithAverage = cafes.map((cafe) => {
      const avgRating = cafe.reviews.length > 0
        ? cafe.reviews.reduce((sum, r) => sum + r.rating, 0) / cafe.reviews.length
        : 0

      return {
        id: cafe.id,
        name: cafe.name,
        description: cafe.description,
        address: cafe.address,
        latitude: cafe.latitude,
        longitude: cafe.longitude,
        phone: cafe.phone,
        website: cafe.website,
        openingHours: cafe.openingHours,
        dogRules: cafe.dogRules,
        facilities: cafe.facilities,
        createdAt: cafe.createdAt,
        updatedAt: cafe.updatedAt,
        averageRating: avgRating,
        reviewCount: cafe._count.reviews,
        wantToGoCount: cafe._count.wantToGo,
      }
    })

    return NextResponse.json(cafesWithAverage)
  } catch (error) {
    console.error('Cafe fetch error:', error)
    return NextResponse.json(
      { error: '店舗の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POST /api/cafes - 店舗作成
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createCafeSchema.parse(body)

    const cafe = await prisma.cafe.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    return NextResponse.json(cafe, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Cafe creation error:', error)
    return NextResponse.json(
      { error: '店舗の作成に失敗しました' },
      { status: 500 }
    )
  }
}
