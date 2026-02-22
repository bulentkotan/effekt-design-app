'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ProgressBar from '@/components/ui/ProgressBar'
import Button from '@/components/ui/Button'
import { loadSession, updateSessionData } from '@/lib/store'
import { TOTAL_STEPS } from '@/lib/questions'

const contactMethods = ['Email', 'WhatsApp', 'Phone']

export default function DetailsPage() {
  const router = useRouter()
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [preferredContact, setPreferredContact] = useState('Email')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const session = loadSession()
    const d = session.sessionData
    if (d.additionalNotes) setAdditionalNotes(d.additionalNotes)
    if (d.clientName) setClientName(d.clientName)
    if (d.clientEmail) setClientEmail(d.clientEmail)
    if (d.clientPhone) setClientPhone(d.clientPhone)
    if (d.preferredContact) setPreferredContact(d.preferredContact)
  }, [])

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!clientName.trim()) errs.name = 'Please enter your name'
    if (!clientEmail.trim()) errs.email = 'Please enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail))
      errs.email = 'Please enter a valid email'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleGenerate = () => {
    if (!validate()) return
    updateSessionData({
      additionalNotes,
      clientName,
      clientEmail,
      clientPhone,
      preferredContact,
    })
    router.push('/design/generating')
  }

  const inputClasses = (field?: string) =>
    `w-full px-4 py-3 rounded-lg border bg-bg-white text-sm text-text-dark
     placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-green/30
     focus:border-brand-green transition-all
     ${field && errors[field] ? 'border-red-300' : 'border-border'}`

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProgressBar currentStep={TOTAL_STEPS - 1} totalSteps={TOTAL_STEPS} />

        <div className="mt-8 mb-10">
          <span className="text-xs tracking-brand-wide text-text-muted uppercase">
            Almost There
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-dark mt-2 mb-2">
            A Few Final Thoughts
          </h1>
          <p className="text-text-medium">
            Anything else we should know? Then we&apos;ll create your bespoke landscape concepts.
          </p>
        </div>

        <div className="space-y-6">
          {/* Additional Notes */}
          <div>
            <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
              Anything Specific? <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <textarea
              value={additionalNotes}
              onChange={e => setAdditionalNotes(e.target.value)}
              placeholder="Plants you love or hate? Non-negotiable features? Special requirements? Tell us anything..."
              rows={4}
              className={inputClasses()}
            />
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-serif text-lg text-text-dark mb-4">Your Details</h3>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Your name"
                className={inputClasses('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={e => setClientEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClasses('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
                Phone Number <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                placeholder="+971 55 000 0000"
                className={inputClasses()}
              />
            </div>

            {/* Preferred Contact */}
            <div>
              <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
                Preferred Contact Method
              </label>
              <div className="flex gap-2">
                {contactMethods.map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPreferredContact(method)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200
                      ${preferredContact === method
                        ? 'bg-brand-green text-white'
                        : 'bg-bg-white border border-border text-text-medium hover:border-brand-green/40'
                      }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          <Button variant="ghost" onClick={() => router.push('/design/questions/10')}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back
          </Button>
          <Button size="lg" onClick={handleGenerate}>
            Generate My Designs
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
