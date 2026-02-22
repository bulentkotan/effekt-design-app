import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json(
        { id: crypto.randomUUID(), message: 'Running without database' },
        { status: 200 }
      )
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        client_name: body.clientName,
        client_email: body.clientEmail,
        client_phone: body.clientPhone,
        preferred_contact: body.preferredContact,
        property_type: body.propertyType,
        area_sqm: body.areaSqm ? parseFloat(body.areaSqm) : null,
        current_state: body.currentState,
        budget_range: body.budgetRange,
        additional_notes: body.additionalNotes,
        status: 'completed',
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    )
  }
}
