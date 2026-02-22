'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { QuestionOption } from '@/types'

interface ImageOptionProps {
  option: QuestionOption
  selected: boolean
  onToggle: (id: string) => void
}

export default function ImageOption({ option, selected, onToggle }: ImageOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onToggle(option.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative group rounded-xl overflow-hidden cursor-pointer
        aspect-[4/3] w-full
        transition-all duration-300 ease-out
        ${selected
          ? 'ring-3 ring-brand-green shadow-lg shadow-brand-green/10'
          : 'ring-1 ring-border hover:ring-brand-green/40 hover:shadow-md'
        }
      `}
    >
      <Image
        src={option.imageUrl}
        alt={option.label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 w-7 h-7 bg-brand-green rounded-full flex items-center justify-center shadow-md"
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
        <h3 className="text-white font-medium text-sm sm:text-base leading-tight">
          {option.label}
        </h3>
        {option.description && (
          <p className="text-white/75 text-xs mt-0.5 leading-snug line-clamp-2 hidden sm:block">
            {option.description}
          </p>
        )}
      </div>
    </motion.button>
  )
}
