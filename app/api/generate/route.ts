import { NextRequest, NextResponse } from 'next/server'
import { generateDesigns } from '@/lib/claude'
import { SessionData, QuestionResponse, UploadedFile } from '@/types'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sessionData,
      responses,
      uploads,
    }: {
      sessionData: SessionData
      responses: QuestionResponse[]
      uploads: UploadedFile[]
    } = body

    if (!sessionData?.clientName || !sessionData?.clientEmail) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Use a TransformStream to keep Vercel's connection alive
    // by sending periodic heartbeat comments while Claude generates
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()

    const heartbeat = setInterval(() => {
      writer.write(encoder.encode(': heartbeat\n\n')).catch(() => {})
    }, 5000)

    ;(async () => {
      try {
        console.log('[generate] Calling Claude for design concepts...')
        const result = await generateDesigns(sessionData, responses, uploads)
        console.log('[generate] Complete. Concepts:', result.concepts?.length)

        clearInterval(heartbeat)
        await writer.write(encoder.encode(`data: ${JSON.stringify(result)}\n\n`))
      } catch (error) {
        clearInterval(heartbeat)
        const errMsg = error instanceof Error ? error.message : String(error)
        console.error('Design generation error:', errMsg)
        await writer.write(
          encoder.encode(`event: error\ndata: ${JSON.stringify({ error: errMsg })}\n\n`)
        )
      } finally {
        await writer.close()
      }
    })()

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('Design generation error:', errMsg)
    return NextResponse.json(
      { error: `Failed to generate designs: ${errMsg}` },
      { status: 500 }
    )
  }
}
