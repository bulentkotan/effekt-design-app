'use client'

import { Question } from '@/types'
import ImageOption from './ImageOption'

interface QuestionGridProps {
  question: Question
  selectedOptions: string[]
  onToggle: (id: string) => void
}

export default function QuestionGrid({ question, selectedOptions, onToggle }: QuestionGridProps) {
  const cols = question.options.length > 6
    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid ${cols} gap-3 sm:gap-4`}>
      {question.options.map(option => (
        <ImageOption
          key={option.id}
          option={option}
          selected={selectedOptions.includes(option.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
