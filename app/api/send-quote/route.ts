import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { SavedConcept } from '@/types'

interface QuoteRequest {
  savedConcepts: SavedConcept[]
  clientDetails: {
    name: string
    email: string
    phone: string
    preferredContact: string
    propertyType: string
    areaSqm: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json()

    if (!body.savedConcepts?.length) {
      return NextResponse.json({ error: 'No concepts provided' }, { status: 400 })
    }

    const quoteData = {
      client_name: body.clientDetails.name,
      client_email: body.clientDetails.email,
      client_phone: body.clientDetails.phone,
      preferred_contact: body.clientDetails.preferredContact,
      property_type: body.clientDetails.propertyType,
      area_sqm: body.clientDetails.areaSqm,
      concepts: body.savedConcepts.map(sc => ({
        id: sc.id,
        name: sc.concept.name,
        tagline: sc.concept.tagline,
        narrative: sc.concept.narrative,
        estimatedRange: sc.concept.estimatedRange,
        quoteLineItems: sc.quoteLineItems,
      })),
      concept_count: body.savedConcepts.length,
      submitted_at: new Date().toISOString(),
    }

    // Log the request
    console.log('=== QUOTE REQUEST ===')
    console.log('Client:', body.clientDetails.name, body.clientDetails.email)
    console.log('Concepts:', body.savedConcepts.length)
    console.log('Recipient: bkotan@effektgroup.com')
    console.log(JSON.stringify(quoteData, null, 2))
    console.log('=== END QUOTE REQUEST ===')

    // Try to persist to Supabase
    const supabase = getSupabaseAdmin()
    if (supabase) {
      try {
        await supabase.from('quote_requests').insert({
          client_name: quoteData.client_name,
          client_email: quoteData.client_email,
          client_phone: quoteData.client_phone,
          preferred_contact: quoteData.preferred_contact,
          property_type: quoteData.property_type,
          area_sqm: quoteData.area_sqm,
          concepts: quoteData.concepts,
          concept_count: quoteData.concept_count,
          submitted_at: quoteData.submitted_at,
        })
      } catch (dbError) {
        // Graceful fallback — table may not exist yet
        console.warn('Supabase insert failed (table may not exist):', dbError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Quote submission error:', error)
    return NextResponse.json({ error: 'Failed to process quote request' }, { status: 500 })
  }
}
