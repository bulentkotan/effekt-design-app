'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DesignConcept, QuoteLineItem, SavedConcept } from '@/types'
import { saveConcept, unsaveConcept, isConceptSaved, updateSavedConceptQuote } from '@/lib/store'
import QuoteBuilder from './QuoteBuilder'

interface ConceptCardProps {
  concept: DesignConcept
  index: number
  onSaveChange?: (savedCount: number) => void
}

export default function ConceptCard({ concept, index, onSaveChange }: ConceptCardProps) {
  const [quoteItems, setQuoteItems] = useState<QuoteLineItem[]>(
    concept.quoteLineItems || []
  )
  const [saved, setSaved] = useState<SavedConcept | undefined>(undefined)
  const hasQuote = quoteItems.length > 0

  useEffect(() => {
    setSaved(isConceptSaved(concept.name))
  }, [concept.name])

  const handleQuoteChange = useCallback((items: QuoteLineItem[]) => {
    setQuoteItems(items)
    if (saved) {
      updateSavedConceptQuote(saved.id, items)
    }
  }, [saved])

  const toggleSave = useCallback(() => {
    if (saved) {
      unsaveConcept(saved.id)
      setSaved(undefined)
    } else {
      const newSaved = saveConcept(concept, quoteItems)
      setSaved(newSaved)
    }
    // Notify parent of change
    const { savedConcepts } = JSON.parse(localStorage.getItem('effekt-design-session') || '{}')
    onSaveChange?.(savedConcepts?.length || 0)
  }, [saved, concept, quoteItems, onSaveChange])

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="bg-bg-white rounded-2xl border border-border overflow-hidden"
    >
      {/* Hero image */}
      {concept.imageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={concept.imageUrl}
            alt={`${concept.name} — landscape design concept visualisation`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <span className="text-xs tracking-brand-wide text-white/70 uppercase">
              Concept {index + 1}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white mt-1">
              {concept.name}
            </h2>
            <p className="font-serif text-sm sm:text-base text-white/80 italic mt-1">
              {concept.tagline}
            </p>
          </div>
        </div>
      )}

      {/* Colour mood strip */}
      <div className="flex h-2">
        {concept.colorMood.map((color, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        {/* Header (only if no image) */}
        {!concept.imageUrl && (
          <div className="mb-6">
            <span className="text-xs tracking-brand-wide text-text-muted uppercase">
              Concept {index + 1}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-text-dark mt-2 mb-1">
              {concept.name}
            </h2>
            <p className="font-serif text-base sm:text-lg text-text-medium italic">
              {concept.tagline}
            </p>
          </div>
        )}

        {/* Narrative */}
        <div className="mb-8">
          <h3 className="text-xs tracking-brand-wide text-text-muted uppercase mb-3">
            Design Narrative
          </h3>
          <div className="text-sm sm:text-base text-text-medium leading-relaxed whitespace-pre-line">
            {concept.narrative}
          </div>
        </div>

        {/* Spatial Notes */}
        <div className="mb-8 p-4 sm:p-6 bg-sage-100 rounded-xl">
          <h3 className="text-xs tracking-brand-wide text-text-muted uppercase mb-3">
            Spatial Layout
          </h3>
          <p className="text-sm text-text-medium leading-relaxed">
            {concept.spatialNotes}
          </p>
        </div>

        {/* Plant Palette */}
        <div className="mb-8">
          <h3 className="text-xs tracking-brand-wide text-text-muted uppercase mb-4">
            Plant Palette
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {concept.plantPalette.map((plant, i) => (
              <div key={i} className="p-3 sm:p-4 rounded-lg border border-border bg-bg">
                <div>
                  <p className="text-sm font-medium text-text-dark">{plant.name}</p>
                  <p className="text-xs text-brand-green italic">{plant.botanical}</p>
                </div>
                <p className="text-xs text-text-medium mt-2">{plant.reason}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 bg-sage-200 rounded-full text-text-muted">
                    {plant.care}
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1.5">
                  <span className="font-medium">Placement:</span> {plant.placement}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="mb-8">
          <h3 className="text-xs tracking-brand-wide text-text-muted uppercase mb-4">
            Materials & Hardscape
          </h3>
          <div className="space-y-3">
            {concept.materials.map((material, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-3 rounded-lg border border-border">
                <span className="text-xs tracking-brand text-brand-green uppercase font-medium shrink-0 sm:w-28">
                  {material.category}
                </span>
                <div>
                  <p className="text-sm text-text-dark font-medium">{material.recommendation}</p>
                  <p className="text-xs text-text-muted mt-0.5">{material.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h3 className="text-xs tracking-brand-wide text-text-muted uppercase mb-4">
            Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {concept.keyFeatures.map((feature, i) => (
              <div key={i} className="p-4 rounded-lg bg-sage-100">
                <p className="text-sm font-medium text-text-dark mb-1">{feature.feature}</p>
                <p className="text-xs text-text-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Quote Builder */}
        {hasQuote ? (
          <QuoteBuilder lineItems={quoteItems} onChange={handleQuoteChange} />
        ) : (
          <div className="p-4 sm:p-6 bg-brand-green/5 rounded-xl border border-brand-green/10">
            <h3 className="text-xs tracking-brand-wide text-brand-green uppercase mb-2">
              Estimated Investment
            </h3>
            <p className="text-lg font-serif text-text-dark">
              {concept.estimatedRange}
            </p>
          </div>
        )}

        {/* Save / Unsave button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={toggleSave}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
              saved
                ? 'bg-brand-green text-white hover:bg-brand-green-dark'
                : 'border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white'
            }`}
          >
            {saved ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Saved to My Selection
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Save This Concept
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
