import { NextRequest, NextResponse } from 'next/server'
import { generateConceptImage } from '@/lib/imagegen'
import { DesignConcept } from '@/types'

export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    const { concept, sessionContext }: { concept: DesignConcept; sessionContext: string } =
      await request.json()

    if (!concept?.name) {
      return NextResponse.json({ error: 'Concept is required' }, { status: 400 })
    }

    const imageUrl = await generateConceptImage(concept, sessionContext || '')
    return NextResponse.json({ imageUrl })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('Image generation error:', errMsg)
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
