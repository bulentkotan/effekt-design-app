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

    console.log('[generate] Calling Claude for design concepts...')
    const result = await generateDesigns(sessionData, responses, uploads)
    console.log('[generate] Complete. Concepts:', result.concepts?.length)

    return NextResponse.json(result)
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('Design generation error:', errMsg)
    return NextResponse.json(
      { error: `Failed to generate designs: ${errMsg}` },
      { status: 500 }
    )
  }
}
