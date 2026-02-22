'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { loadSession, setDesignResult } from '@/lib/store'
import { DesignResponse } from '@/types'

const stages = [
  'Analysing your space...',
  'Understanding your style preferences...',
  'Crafting your plant palette...',
  'Designing your outdoor spaces...',
  'Selecting materials and textures...',
  'Composing your layout...',
  'Adding the finishing touches...',
  'Almost there — polishing your concepts...',
]

function BotanicalAnimation() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-10">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ rotate: i * 60, scale: 0.5, opacity: 0 }}
          animate={{
            rotate: [i * 60, i * 60 + 360],
            scale: [0.5, 1, 0.5],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeInOut',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-brand-green"
            fill="none"
            stroke="currentColor"
            strokeWidth={0.8}
          >
            <path d="M50 90 C50 60 20 40 50 10 C80 40 50 60 50 90Z" opacity={0.3} />
          </svg>
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-3 h-3 rounded-full bg-brand-green/40" />
      </motion.div>
    </div>
  )
}

export default function GeneratingPage() {
  const router = useRouter()
  const [currentStage, setCurrentStage] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const hasStarted = useRef(false)

  // Cycle through loading messages on a loop
  useEffect(() => {
    if (error) return
    const interval = setInterval(() => {
      setCurrentStage(prev => (prev + 1) % stages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [error])

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    const generate = async () => {
      const session = loadSession()

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionData: session.sessionData,
            responses: session.responses,
            uploads: session.uploads.map(u => ({
              id: u.id,
              url: u.url,
              fileName: u.fileName,
              fileType: u.fileType,
              label: u.label,
            })),
          }),
        })

        if (!res.ok) {
          const errBody = await res.text()
          console.error('API error:', res.status, errBody)
          throw new Error(`Server returned ${res.status}`)
        }

        const data: DesignResponse = await res.json()
        setDesignResult(data)

        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push('/design/results/latest')
      } catch (err) {
        console.error('Generation failed:', err)
        setError(
          'Our designer is reviewing your brief personally. We\'ll email your concepts within 24 hours.'
        )
      }
    }

    generate()
  }, [router])

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-sage-200 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-text-dark mb-3">
            Your Brief Is With Our Team
          </h1>
          <p className="text-text-medium mb-8">{error}</p>
          <a
            href="mailto:paula@effekt-design.com"
            className="text-sm text-brand-green hover:underline"
          >
            Contact us: paula@effekt-design.com
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <BotanicalAnimation />

        <AnimatePresence mode="wait">
          <motion.p
            key={currentStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="font-serif text-xl sm:text-2xl text-text-dark mb-4"
          >
            {stages[currentStage]}
          </motion.p>
        </AnimatePresence>

        <p className="text-sm text-text-muted">
          This usually takes 30–60 seconds
        </p>

        {/* Animated progress bar */}
        <div className="mt-8 mx-auto max-w-xs">
          <div className="h-1 bg-sage-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-brand-green rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 120, ease: 'linear' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
