'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import PhotoUpload from '@/components/upload/PhotoUpload'
import ProgressBar from '@/components/ui/ProgressBar'
import Button from '@/components/ui/Button'
import { UploadedFile } from '@/types'
import { loadSession, updateSessionData, updateUploads } from '@/lib/store'
import { TOTAL_STEPS } from '@/lib/questions'

const propertyTypes = ['Villa', 'Townhouse', 'Apartment with terrace', 'Penthouse', 'Other']
const currentStates = [
  'Empty plot',
  'Existing garden needing refresh',
  'Some landscaping',
  'Fully landscaped but want redesign',
]
const budgetRanges = [
  'Getting Started (AED 50–150k)',
  'Investing in Quality (AED 150–400k)',
  'No Compromise (AED 400k+)',
  'Prefer not to say',
]

export default function UploadPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<UploadedFile[]>([])
  const [floorplans, setFloorplans] = useState<UploadedFile[]>([])
  const [propertyType, setPropertyType] = useState('')
  const [areaSqm, setAreaSqm] = useState('')
  const [currentState, setCurrentState] = useState('')
  const [budgetRange, setBudgetRange] = useState('')

  useEffect(() => {
    const session = loadSession()
    if (session.uploads.length > 0) {
      setPhotos(session.uploads.filter(u => u.fileType === 'photo'))
      setFloorplans(session.uploads.filter(u => u.fileType === 'floorplan'))
    }
    if (session.sessionData.propertyType) setPropertyType(session.sessionData.propertyType)
    if (session.sessionData.areaSqm) setAreaSqm(session.sessionData.areaSqm)
    if (session.sessionData.currentState) setCurrentState(session.sessionData.currentState)
    if (session.sessionData.budgetRange) setBudgetRange(session.sessionData.budgetRange)
  }, [])

  const handleContinue = () => {
    updateSessionData({ propertyType, areaSqm, currentState, budgetRange })
    updateUploads([...photos, ...floorplans])
    router.push('/design/questions/1')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProgressBar currentStep={1} totalSteps={TOTAL_STEPS} />

        <div className="mt-8 mb-10">
          <span className="text-xs tracking-brand-wide text-text-muted uppercase">
            Step 1
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-text-dark mt-2 mb-2">
            Upload Your Space
          </h1>
          <p className="text-text-medium">
            Help us understand your garden as it is today.
          </p>
        </div>

        {/* Photo Upload */}
        <div className="space-y-8">
          <PhotoUpload
            files={photos}
            onChange={setPhotos}
            fileType="photo"
            maxFiles={10}
            title="Garden Photos"
            description="Upload photos of your outdoor space from different angles. Include any areas you'd like to transform."
          />

          <div className="border-t border-border" />

          {/* Floor Plan Upload */}
          <PhotoUpload
            files={floorplans}
            onChange={setFloorplans}
            fileType="floorplan"
            maxFiles={3}
            title="Floor Plan or Site Layout"
            description="Have a floor plan or site layout? Upload it here. This is optional but helps us understand your space better."
          />

          <div className="border-t border-border" />

          {/* Quick Details */}
          <div>
            <h3 className="font-serif text-lg sm:text-xl text-text-dark mb-1">Quick Details</h3>
            <p className="text-sm text-text-muted mb-6">
              Tell us a bit about your property and outdoor area.
            </p>

            <div className="space-y-5">
              {/* Property Type */}
              <div>
                <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
                  Property Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPropertyType(type)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-200
                        ${propertyType === type
                          ? 'bg-brand-green text-white'
                          : 'bg-bg-white border border-border text-text-medium hover:border-brand-green/40'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
                  Approximate Outdoor Area
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={areaSqm}
                    onChange={e => setAreaSqm(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full sm:w-48 px-4 py-2.5 rounded-lg border border-border bg-bg-white
                             text-sm text-text-dark placeholder-text-muted
                             focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green
                             transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                    sq m
                  </span>
                </div>
              </div>

              {/* Current State */}
              <div>
                <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
                  What Exists Currently
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentStates.map(state => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => setCurrentState(state)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-200
                        ${currentState === state
                          ? 'bg-brand-green text-white'
                          : 'bg-bg-white border border-border text-text-medium hover:border-brand-green/40'
                        }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs tracking-brand text-text-muted uppercase mb-2">
                  Budget Indication
                </label>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                  {budgetRanges.map(range => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setBudgetRange(range)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 text-left
                        ${budgetRange === range
                          ? 'bg-brand-green text-white'
                          : 'bg-bg-white border border-border text-text-medium hover:border-brand-green/40'
                        }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back
          </Button>
          <Button onClick={handleContinue}>
            Continue
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
