import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ワンちゃんカフェマップ'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom, #3b82f6, #1e40af)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>🐕</div>
        <div style={{ marginBottom: 10 }}>ワンちゃんカフェマップ</div>
        <div style={{ fontSize: 40, opacity: 0.9 }}>
          犬と一緒に行けるカフェを探そう
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
