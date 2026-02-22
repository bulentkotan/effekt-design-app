import OpenAI from 'openai'
import { DesignConcept } from '@/types'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

function buildImagePrompt(concept: DesignConcept, sessionContext: string): string {
  const plantNames = concept.plantPalette.slice(0, 6).map(p => p.name).join(', ')
  const materialNames = concept.materials.slice(0, 3).map(m => m.recommendation).join(', ')
  const featureNames = concept.keyFeatures.slice(0, 4).map(f => f.feature).join(', ')

  return `Draw a photorealistic aerial-perspective architectural visualization of a luxury Dubai villa garden design called "${concept.name}". ${concept.tagline}.

The scene: ${concept.narrative.slice(0, 500)}

Key design features: ${featureNames}.
Plants visible: ${plantNames}.
Materials and surfaces: ${materialNames}.
${sessionContext}

Ultra-photorealistic, golden hour lighting from the west, shot from a slightly elevated perspective (like a drone at 8 meters height) showing the full garden layout. Modern Dubai luxury villa architecture visible in the background. Clear blue sky with warm desert light. Lush, detailed vegetation. The image should look like a professional landscape architecture rendering from a top Dubai design firm — the kind you'd see in Architectural Digest Middle East. No text, no labels, no watermarks, no people.`
}

export async function generateConceptImage(
  concept: DesignConcept,
  sessionContext: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OpenAI API key not configured')
  }

  const openai = new OpenAI({ apiKey })
  const prompt = buildImagePrompt(concept, sessionContext)

  const response = await openai.responses.create({
    model: 'gpt-5.2',
    input: `Draw this landscape design: ${prompt}`,
    tools: [
      {
        type: 'image_generation',
        quality: 'high',
        size: '1536x1024',
      } as Parameters<typeof openai.responses.create>[0]['tools'][0],
    ],
    tool_choice: { type: 'image_generation' } as Parameters<typeof openai.responses.create>[0]['tool_choice'],
  })

  const imageOutput = response.output.find(
    (o: { type: string }) => o.type === 'image_generation_call'
  ) as { type: string; result?: string } | undefined

  if (!imageOutput?.result) {
    throw new Error(`No image returned for "${concept.name}"`)
  }

  const imagesDir = join(process.cwd(), 'public', 'generated')
  if (!existsSync(imagesDir)) {
    mkdirSync(imagesDir, { recursive: true })
  }

  const slug = concept.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const filename = `concept-${slug}-${Date.now()}.png`
  const filepath = join(imagesDir, filename)
  writeFileSync(filepath, Buffer.from(imageOutput.result, 'base64'))

  return `/generated/${filename}`
}

export async function generateAllConceptImages(
  concepts: DesignConcept[],
  sessionContext: string
): Promise<(string | null)[]> {
  const results: (string | null)[] = []
  for (const concept of concepts) {
    try {
      const url = await generateConceptImage(concept, sessionContext)
      results.push(url)
    } catch (error) {
      console.error(`Image generation failed for "${concept.name}":`, error)
      results.push(null)
    }
  }
  return results
}
