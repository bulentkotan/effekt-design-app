'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSavedConcepts, unsaveConcept, updateSavedConceptQuote, loadSession } from '@/lib/store'
import { SavedConcept, QuoteLineItem } from '@/types'
import { calculateLineTotal, calculateVAT, formatAED, VAT_RATE } from '@/lib/pricing'
import QuoteBuilder from '@/components/results/QuoteBuilder'
import Button from '@/components/ui/Button'
import Footer from '@/components/layout/Footer'

export default function SelectionPage() {
  const [concepts, setConcepts] = useState<SavedConcept[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setConcepts(getSavedConcepts())
  }, [])

  const handleRemove = useCallback((id: string) => {
    unsaveConcept(id)
    setConcepts(prev => prev.filter(c => c.id !== id))
  }, [])

  const handleQuoteChange = useCallback((conceptId: string, items: QuoteLineItem[]) => {
    updateSavedConceptQuote(conceptId, items)
    setConcepts(prev =>
      prev.map(c => c.id === conceptId ? { ...c, quoteLineItems: items } : c)
    )
  }, [])

  const combinedTotal = concepts.reduce((total, sc) => {
    const subtotal = sc.quoteLineItems
      .filter(i => i.isIncluded)
      .reduce((s, i) => s + calculateLineTotal(i.unitRate, i.quantity), 0)
    return total + subtotal + calculateVAT(subtotal)
  }, 0)

  const handleSubmitQuote = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const session = loadSession()
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          savedConcepts: concepts,
          clientDetails: {
            name: session.sessionData.clientName,
            email: session.sessionData.clientEmail,
            phone: session.sessionData.clientPhone,
            preferredContact: session.sessionData.preferredContact,
            propertyType: session.sessionData.propertyType,
            areaSqm: session.sessionData.areaSqm,
          },
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-dark mb-4">
            Your Selection Has Been Sent!
          </h1>
          <p className="text-text-medium max-w-lg mx-auto leading-relaxed mb-8">
            Our vetted landscape designers will review your concepts and provide detailed quotes within 72 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/design/results/latest">
              <Button variant="outline">Back to Concepts</Button>
            </a>
            <a href="https://wa.me/971551392887" target="_blank" rel="noopener noreferrer">
              <Button>WhatsApp Us</Button>
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  if (concepts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-text-dark mb-4">No saved concepts</h1>
        <p className="text-text-muted mb-6">
          Go back to your results and save the concepts you love.
        </p>
        <a href="/design/results/latest">
          <Button>View My Concepts</Button>
        </a>
      </div>
    )
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-10 sm:py-16"
        >
          <span className="text-xs tracking-brand-wide text-brand-green uppercase">
            Your Favourites
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-dark mt-3 mb-4">
            My <em className="text-brand-green">Selection</em>
          </h1>
          <p className="text-text-medium max-w-xl mx-auto">
            Review your saved concepts, adjust the quotes, then request pricing from our designers.
          </p>
        </motion.div>

        {/* Saved concept cards */}
        <div className="space-y-8">
          <AnimatePresence>
            {concepts.map((sc, index) => (
              <motion.div
                key={sc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-bg-white rounded-2xl border border-border overflow-hidden"
              >
                {/* Image */}
                {sc.concept.imageUrl && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={sc.concept.imageUrl}
                      alt={sc.concept.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <h2 className="font-serif text-2xl sm:text-3xl text-white">
                        {sc.concept.name}
                      </h2>
                      <p className="font-serif text-sm text-white/80 italic mt-1">
                        {sc.concept.tagline}
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {/* Header (if no image) */}
                  {!sc.concept.imageUrl && (
                    <div className="mb-6">
                      <h2 className="font-serif text-2xl text-text-dark mb-1">
                        {sc.concept.name}
                      </h2>
                      <p className="font-serif text-base text-text-medium italic">
                        {sc.concept.tagline}
                      </p>
                    </div>
                  )}

                  {/* Narrative */}
                  <div className="mb-6">
                    <p className="text-sm text-text-medium leading-relaxed line-clamp-3">
                      {sc.concept.narrative}
                    </p>
                  </div>

                  {/* Quote Builder */}
                  {sc.quoteLineItems.length > 0 && (
                    <QuoteBuilder
                      lineItems={sc.quoteLineItems}
                      onChange={(items) => handleQuoteChange(sc.id, items)}
                    />
                  )}

                  {/* Remove button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemove(sc.id)}
                      className="text-sm text-text-muted hover:text-red-500 transition-colors flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Combined total + submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-bg-white rounded-2xl border border-border p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
              <div>
                <p className="text-xs tracking-brand-wide text-text-muted uppercase mb-1">
                  Combined Estimated Total
                </p>
                <p className="text-2xl sm:text-3xl font-serif text-brand-green font-medium">
                  {formatAED(combinedTotal)}
                </p>
                <p className="text-[10px] text-text-muted mt-1">
                  Incl. {VAT_RATE * 100}% VAT · {concepts.length} concept{concepts.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}

            <Button
              size="lg"
              fullWidth
              onClick={handleSubmitQuote}
              disabled={submitting}
            >
              {submitting ? 'Sending...' : 'Get My Quotes'}
            </Button>

            <p className="text-xs text-text-muted text-center mt-4">
              Our designers will review your selection and provide detailed quotes within 72 hours.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
