import { NextRequest, NextResponse } from 'next/server'
import { generateDesigns } from '@/lib/claude'
import { generateAllConceptImages } from '@/lib/imagegen'
import { SessionData, QuestionResponse, UploadedFile } from '@/types'

export const maxDuration = 300

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

    // Step 1: Generate text concepts via Claude
    console.log('[generate] Step 1: Calling Claude for design concepts...')
    let result
    try {
      result = await generateDesigns(sessionData, responses, uploads)
      console.log('[generate] Step 1 complete. Concepts:', result.concepts?.length)
    } catch (claudeErr) {
      console.error('[generate] Claude generation failed:', claudeErr)
      throw claudeErr
    }

    // Step 2: Generate images for each concept via DALL-E 3
    console.log('[generate] Step 2: Generating images...')
    try {
      const sessionContext = [
        sessionData.propertyType && `Property type: ${sessionData.propertyType}.`,
        sessionData.areaSqm && `Garden area: ${sessionData.areaSqm} sqm.`,
      ].filter(Boolean).join(' ')

      const imageUrls = await generateAllConceptImages(result.concepts, sessionContext)

      result.concepts = result.concepts.map((concept, i) => ({
        ...concept,
        imageUrl: imageUrls[i] || null,
      }))
      console.log('[generate] Step 2 complete. Images generated.')
    } catch (imgErr) {
      console.error('[generate] Image generation failed (continuing without images):', imgErr)
    }

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
