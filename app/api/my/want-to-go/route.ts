import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/my/want-to-go - 自分の行きたいリスト取得
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const wantToGoList = await prisma.wantToGo.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        cafe: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 平均評価を計算
    const formattedList = wantToGoList.map((item) => {
      const avgRating = item.cafe.reviews.length > 0
        ? item.cafe.reviews.reduce((sum, r) => sum + r.rating, 0) / item.cafe.reviews.length
        : 0

      return {
        id: item.id,
        createdAt: item.createdAt,
        cafe: {
          id: item.cafe.id,
          name: item.cafe.name,
          description: item.cafe.description,
          address: item.cafe.address,
          latitude: item.cafe.latitude,
          longitude: item.cafe.longitude,
          averageRating: avgRating,
          reviewCount: item.cafe._count.reviews,
          wantToGoCount: item.cafe._count.wantToGo,
        },
      }
    })

    return NextResponse.json(formattedList)
  } catch (error) {
    console.error('WantToGo list fetch error:', error)
    return NextResponse.json(
      { error: '行きたいリストの取得に失敗しました' },
      { status: 500 }
    )
  }
}
