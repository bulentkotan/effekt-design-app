'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { loadSession } from '@/lib/store'
import { DesignResponse } from '@/types'
import ConceptCard from '@/components/results/ConceptCard'
import Button from '@/components/ui/Button'
import Footer from '@/components/layout/Footer'

export default function ResultsPage() {
  const [result, setResult] = useState<DesignResponse | null>(null)

  useEffect(() => {
    const session = loadSession()
    if (session.designResult) {
      setResult(session.designResult)
    }
  }, [])

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-text-dark mb-4">No designs found</h1>
        <p className="text-text-muted mb-6">
          It looks like you haven&apos;t completed the design questionnaire yet.
        </p>
        <a href="/design/upload">
          <Button>Start Your Design Journey</Button>
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
            Your Personalised Designs
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-text-dark mt-3 mb-6">
            Your Landscape <em className="text-brand-green">Concepts</em>
          </h1>
          <p className="text-text-medium max-w-2xl mx-auto leading-relaxed">
            {result.greeting}
          </p>
        </motion.div>

        {/* Concept Cards */}
        <div className="space-y-8">
          {result.concepts.map((concept, index) => (
            <ConceptCard key={index} concept={concept} index={index} />
          ))}
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-bg-white rounded-2xl border border-border p-8 sm:p-12">
            <h2 className="font-serif text-2xl sm:text-3xl text-text-dark mb-4">
              Love a concept?{' '}
              <em className="text-brand-green">Let&apos;s bring it to life.</em>
            </h2>
            <p className="text-text-medium mb-8 max-w-xl mx-auto leading-relaxed">
              {result.nextSteps}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:paula@effekt-design.com?subject=Landscape%20Design%20Consultation"
              >
                <Button size="lg">
                  Book a Consultation
                </Button>
              </a>
              <a href="https://wa.me/971551392887" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  WhatsApp Us
                </Button>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-text-muted">
              <a
                href="mailto:paula@effekt-design.com"
                className="hover:text-brand-green transition-colors"
              >
                paula@effekt-design.com
              </a>
              <span className="hidden sm:inline">·</span>
              <a
                href="tel:+971551392887"
                className="hover:text-brand-green transition-colors"
              >
                +971 55 139 2887
              </a>
              <span className="hidden sm:inline">·</span>
              <a
                href="https://effekt-design.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-green transition-colors"
              >
                effekt-design.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
