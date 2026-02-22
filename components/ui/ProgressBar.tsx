'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs tracking-brand text-text-muted uppercase">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-text-muted">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1 bg-sage-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-green rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
