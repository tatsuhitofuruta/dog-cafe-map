import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// POST /api/cafes/[id]/want-to-go - 行きたいリストに追加
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

    // 既に追加済みか確認
    const existing = await prisma.wantToGo.findUnique({
      where: {
        cafeId_userId: {
          cafeId: params.id,
          userId: session.user.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: '既に行きたいリストに追加されています' },
        { status: 400 }
      )
    }

    const wantToGo = await prisma.wantToGo.create({
      data: {
        cafeId: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(wantToGo, { status: 201 })
  } catch (error) {
    console.error('WantToGo creation error:', error)
    return NextResponse.json(
      { error: '行きたいリストへの追加に失敗しました' },
      { status: 500 }
    )
  }
}

// DELETE /api/cafes/[id]/want-to-go - 行きたいリストから削除
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

    const wantToGo = await prisma.wantToGo.findUnique({
      where: {
        cafeId_userId: {
          cafeId: params.id,
          userId: session.user.id,
        },
      },
    })

    if (!wantToGo) {
      return NextResponse.json(
        { error: '行きたいリストに登録されていません' },
        { status: 404 }
      )
    }

    await prisma.wantToGo.delete({
      where: {
        cafeId_userId: {
          cafeId: params.id,
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({ message: '行きたいリストから削除しました' })
  } catch (error) {
    console.error('WantToGo deletion error:', error)
    return NextResponse.json(
      { error: '行きたいリストからの削除に失敗しました' },
      { status: 500 }
    )
  }
}

// GET /api/cafes/[id]/want-to-go - 行きたいリスト状態確認
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ isWantToGo: false })
    }

    const wantToGo = await prisma.wantToGo.findUnique({
      where: {
        cafeId_userId: {
          cafeId: params.id,
          userId: session.user.id,
        },
      },
    })

    return NextResponse.json({ isWantToGo: !!wantToGo })
  } catch (error) {
    console.error('WantToGo check error:', error)
    return NextResponse.json({ isWantToGo: false })
  }
}
