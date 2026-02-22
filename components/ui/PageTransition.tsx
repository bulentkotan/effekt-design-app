'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  transitionKey: string
  direction?: 'left' | 'right' | 'fade'
}

const variants = {
  enter: (direction: string) => ({
    x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: string) => ({
    x: direction === 'left' ? -80 : direction === 'right' ? 80 : 0,
    opacity: 0,
  }),
}

export default function PageTransition({
  children,
  transitionKey,
  direction = 'left',
}: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={transitionKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
