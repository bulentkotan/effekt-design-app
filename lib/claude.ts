import { DesignResponse, QuestionResponse, SessionData, UploadedFile, QuoteLineItem } from '@/types'
import { questions } from './questions'
import { allPricingItems, pricingCategories } from './pricing'

function getSelectedLabels(questionId: number, selectedIds: string[]): string[] {
  const q = questions.find(q => q.id === questionId)
  if (!q) return selectedIds
  return selectedIds.map(id => {
    const opt = q.options.find(o => o.id === id)
    return opt ? opt.label : id
  })
}

function buildUserPrompt(
  session: SessionData,
  responses: QuestionResponse[],
  uploads: UploadedFile[]
): string {
  const photoDescriptions = uploads
    .filter(u => u.fileType === 'photo')
    .map((u, i) => `Photo ${i + 1}${u.label ? ` (${u.label})` : ''}: [Uploaded image]`)
    .join('\n')

  const floorplanDescriptions = uploads
    .filter(u => u.fileType === 'floorplan')
    .map((u, i) => `Floor plan ${i + 1}${u.label ? ` (${u.label})` : ''}: [Uploaded image]`)
    .join('\n')

  const questionResponses = responses
    .sort((a, b) => a.questionId - b.questionId)
    .map(r => {
      const q = questions.find(q => q.id === r.questionId)
      const labels = getSelectedLabels(r.questionId, r.selectedOptions)
      return `${r.questionId}. ${q?.title || 'Question ' + r.questionId}: ${labels.join(', ')}`
    })
    .join('\n')

  // Ultra-compact format: "id|unit|rate|req/opt"
  const pricingCatalogCompact = allPricingItems.map(p =>
    `${p.id}|${p.unit}|${p.unitRate}|${p.isOptional ? 'opt' : 'req'}`
  ).join(', ')

  return `Here is the client's design brief:

## Their Space
- Property type: ${session.propertyType || 'Not specified'}
- Outdoor area: ${session.areaSqm || 'Not specified'} sq meters
- Current state: ${session.currentState || 'Not specified'}
- Budget indication: ${session.budgetRange || 'Not specified'}

## Uploaded Photos
${photoDescriptions || 'No photos uploaded'}

## Layout/Dimensions
${floorplanDescriptions || 'No floor plan uploaded'}

## Design Preferences
${questionResponses}

## Additional Notes
${session.additionalNotes || 'None provided'}

## Client Details
Name: ${session.clientName}
Email: ${session.clientEmail}

## PRICING CATALOG (format: id|name|category|unit|unitRate|required/optional)
${pricingCatalogCompact}

For each concept, include a "quoteLineItems" array. Each entry needs: pricingId (exact id from above), quantity (realistic for the garden area). Always include "req" items. Add "opt" items matching the concept. Use garden sqm to set flooring quantities.

Generate 3 distinct landscape design concepts with 5-6 plants each (Dubai climate only). Keep narratives concise (1 paragraph each).

IMPORTANT: Return ONLY valid JSON (no markdown, no code fences):
{
  "greeting": "personalised opening paragraph",
  "concepts": [
    {
      "name": "string",
      "tagline": "string",
      "narrative": "1 paragraph",
      "plantPalette": [{"name":"string","botanical":"string","reason":"string","care":"string","placement":"string"}],
      "materials": [{"category":"string","recommendation":"string","notes":"string"}],
      "keyFeatures": [{"feature":"string","description":"string"}],
      "spatialNotes": "string",
      "estimatedRange": "AED X - Y",
      "colorMood": ["#hex","#hex","#hex"],
      "quoteLineItems": [{"pricingId":"id","quantity":0}]
    }
  ],
  "nextSteps": "closing paragraph"
}`
}

const SYSTEM_PROMPT = `You are the world's foremost landscape architect, renowned for creating extraordinary outdoor spaces in hot arid climates, particularly Dubai and the Gulf region. You combine deep horticultural knowledge of desert-adapted and tropical plants with cutting-edge contemporary design sensibility. Your designs have won international awards and been featured in Architectural Digest, Dezeen, and Wallpaper Magazine.

You work for Effekt Design, a premium landscape design and build studio in Dubai. Your client has just completed a design preference questionnaire, and you need to create 3 distinct landscape design concepts tailored to their specific space, preferences, and budget.

IMPORTANT GUIDELINES:
- Every plant you recommend MUST thrive in Dubai's climate (USDA Zone 11-12, extreme summer heat 45°C+, mild winters, low humidity inland/high humidity coastal, alkaline sandy soil)
- Reference specific Dubai-available materials and suppliers where possible
- Consider the practical realities: irrigation requirements, maintenance schedules, summer vs winter planting seasons
- Each concept should be genuinely distinct — not variations of the same idea. Push creative boundaries while remaining buildable.
- Write as if presenting to a high-net-worth client who appreciates sophistication but also practicality
- Reference their uploaded photos/dimensions specifically in your spatial recommendations
- If they uploaded photos, describe what you observe and how you'd transform specific areas they showed

PRICING & BOQ GUIDELINES:
- You will be given a pricing catalog with real unit rates from Dubai landscaping projects
- For each concept, select appropriate items from the catalog and assign realistic quantities
- The quantities should be proportional to the client's garden area
- The "estimatedRange" should match the sum of the quoteLineItems (give a range ±10%)
- Always include mandatory items: demolition, floor base, irrigation, main electrical, and management
- Tailor optional items to each concept's unique character
- Use the exact "id" (pricingId) values from the catalog — do NOT invent new ones
- Set unitRate to exactly the value from the catalog
- Set isOptional and category exactly as in the catalog
- Return ONLY valid JSON — no markdown formatting, no code fences, no explanation outside the JSON`

export async function generateDesigns(
  session: SessionData,
  responses: QuestionResponse[],
  uploads: UploadedFile[]
): Promise<DesignResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Anthropic API key not configured')
  }

  const userPrompt = buildUserPrompt(session, responses, uploads)

  // Use streaming to avoid Vercel function timeout
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 7000,
      stream: true,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('[claude] API error response:', response.status, error)
    throw new Error(`Claude API error: ${response.status} — ${error}`)
  }

  // Read the SSE stream and collect all text
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let stopReason = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n')
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6)
      if (data === '[DONE]') continue
      try {
        const event = JSON.parse(data)
        if (event.type === 'content_block_delta' && event.delta?.text) {
          fullText += event.delta.text
        }
        if (event.type === 'message_delta' && event.delta?.stop_reason) {
          stopReason = event.delta.stop_reason
        }
      } catch {
        // skip non-JSON lines
      }
    }
  }

  console.log('[claude] Stream complete. stop_reason:', stopReason, 'chars:', fullText.length)

  if (!fullText) throw new Error('Empty response from Claude')

  // Strip markdown code fences if Claude wraps the JSON
  let cleaned = fullText.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }

  // If the response was truncated (max_tokens hit), try to fix the JSON
  if (stopReason === 'max_tokens') {
    console.warn('[claude] Response was truncated — attempting JSON repair')
    let depth = 0
    for (const ch of cleaned) {
      if (ch === '{' || ch === '[') depth++
      if (ch === '}' || ch === ']') depth--
    }
    while (depth > 0) {
      const lastOpen = cleaned.lastIndexOf('{') > cleaned.lastIndexOf('[') ? '}' : ']'
      cleaned += lastOpen
      depth--
    }
  }

  let parsed: DesignResponse
  try {
    parsed = JSON.parse(cleaned)
  } catch (parseErr) {
    console.error('[claude] JSON parse failed. First 500 chars:', cleaned.slice(0, 500))
    console.error('[claude] Last 500 chars:', cleaned.slice(-500))
    throw new Error(`Failed to parse Claude response as JSON: ${parseErr instanceof Error ? parseErr.message : parseErr}`)
  }

  // Hydrate quoteLineItems from our pricing catalog
  for (const concept of parsed.concepts) {
    if (concept.quoteLineItems && Array.isArray(concept.quoteLineItems)) {
      concept.quoteLineItems = concept.quoteLineItems
        .map((line: { pricingId?: string; quantity?: number }) => {
          const pid = line.pricingId || ''
          const catalogItem = allPricingItems.find(p => p.id === pid)
          if (!catalogItem) return null
          return {
            pricingId: catalogItem.id,
            name: catalogItem.name,
            description: catalogItem.description,
            unit: catalogItem.unit,
            unitRate: catalogItem.unitRate,
            isOptional: catalogItem.isOptional,
            category: catalogItem.category,
            quantity: Math.max(1, Math.round(line.quantity || 1)),
            isIncluded: true,
          } as QuoteLineItem
        })
        .filter((line): line is QuoteLineItem => line !== null)
    } else {
      concept.quoteLineItems = []
    }
  }

  return parsed
}
