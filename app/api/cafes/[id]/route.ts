import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/cafes/[id] - 店舗詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cafe = await prisma.cafe.findUnique({
      where: { id: params.id },
      include: {
        reviews: {
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
        },
        images: true,
        _count: {
          select: {
            reviews: true,
            wantToGo: true,
          },
        },
      },
    })

    if (!cafe) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    // 平均評価を計算
    const avgRating = cafe.reviews.length > 0
      ? cafe.reviews.reduce((sum, r) => sum + r.rating, 0) / cafe.reviews.length
      : 0

    const response = {
      ...cafe,
      averageRating: avgRating,
      wantToGoCount: cafe._count.wantToGo,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Cafe fetch error:', error)
    return NextResponse.json(
      { error: '店舗の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// PUT /api/cafes/[id] - 店舗更新
export async function PUT(
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

    const cafe = await prisma.cafe.findUnique({
      where: { id: params.id },
    })

    if (!cafe) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    if (cafe.userId !== session.user.id) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    const body = await request.json()

    const updatedCafe = await prisma.cafe.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updatedCafe)
  } catch (error) {
    console.error('Cafe update error:', error)
    return NextResponse.json(
      { error: '店舗の更新に失敗しました' },
      { status: 500 }
    )
  }
}

// DELETE /api/cafes/[id] - 店舗削除
export async function DELETE(
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

    const cafe = await prisma.cafe.findUnique({
      where: { id: params.id },
    })

    if (!cafe) {
      return NextResponse.json(
        { error: '店舗が見つかりません' },
        { status: 404 }
      )
    }

    if (cafe.userId !== session.user.id) {
      return NextResponse.json(
        { error: '権限がありません' },
        { status: 403 }
      )
    }

    await prisma.cafe.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '店舗を削除しました' })
  } catch (error) {
    console.error('Cafe delete error:', error)
    return NextResponse.json(
      { error: '店舗の削除に失敗しました' },
      { status: 500 }
    )
  }
}
