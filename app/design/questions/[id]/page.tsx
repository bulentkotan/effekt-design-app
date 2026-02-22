'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import QuestionGrid from '@/components/questions/QuestionGrid'
import ProgressBar from '@/components/ui/ProgressBar'
import Button from '@/components/ui/Button'
import { questions, TOTAL_STEPS, getStepForQuestion } from '@/lib/questions'
import { getResponseForQuestion, updateResponse } from '@/lib/store'

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const questionId = parseInt(id)
  const question = questions.find(q => q.id === questionId)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [direction, setDirection] = useState<'left' | 'right'>('left')

  useEffect(() => {
    const saved = getResponseForQuestion(questionId)
    setSelectedOptions(saved)
  }, [questionId])

  const handleToggle = useCallback(
    (optionId: string) => {
      if (!question) return
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId)
        }
        if (prev.length >= question.maxSelections) {
          return [...prev.slice(1), optionId]
        }
        return [...prev, optionId]
      })
    },
    [question]
  )

  const handleBack = () => {
    if (selectedOptions.length > 0) {
      updateResponse(questionId, selectedOptions)
    }
    setDirection('right')
    setTimeout(() => {
      if (questionId === 1) {
        router.push('/design/upload')
      } else {
        router.push(`/design/questions/${questionId - 1}`)
      }
    }, 50)
  }

  const handleContinue = () => {
    if (selectedOptions.length > 0) {
      updateResponse(questionId, selectedOptions)
    }
    setDirection('left')
    setTimeout(() => {
      if (questionId >= questions.length) {
        router.push('/design/details')
      } else {
        router.push(`/design/questions/${questionId + 1}`)
      }
    }, 50)
  }

  const handleSkip = () => {
    setDirection('left')
    setTimeout(() => {
      if (questionId >= questions.length) {
        router.push('/design/details')
      } else {
        router.push(`/design/questions/${questionId + 1}`)
      }
    }, 50)
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">Question not found.</p>
      </div>
    )
  }

  const step = getStepForQuestion(questionId)

  const variants = {
    enter: (dir: string) => ({
      x: dir === 'left' ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: string) => ({
      x: dir === 'left' ? -60 : 60,
      opacity: 0,
    }),
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={questionId}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="mt-8 mb-8">
            <span className="text-xs tracking-brand-wide text-text-muted uppercase">
              Question {questionId} of {questions.length}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-text-dark mt-2 mb-2">
              {question.title}
            </h1>
            <p className="text-sm sm:text-base text-text-medium">
              {question.subtitle}
            </p>
            {selectedOptions.length > 0 && (
              <p className="text-xs text-brand-green mt-2">
                {selectedOptions.length} selected
                {question.maxSelections > 1 ? ` (up to ${question.maxSelections})` : ''}
              </p>
            )}
          </div>

          <QuestionGrid
            question={question}
            selectedOptions={selectedOptions}
            onToggle={handleToggle}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-8 border-t border-border">
        <Button variant="ghost" onClick={handleBack}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back
        </Button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSkip}
            className="text-xs text-text-muted hover:text-text-medium transition-colors"
          >
            Skip this question
          </button>
          <Button onClick={handleContinue}>
            Continue
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
