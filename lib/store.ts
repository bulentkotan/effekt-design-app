'use client'

import { DesignResponse, DesignSession, QuestionResponse, QuoteLineItem, SavedConcept, SessionData, UploadedFile, DesignConcept } from '@/types'

const STORAGE_KEY = 'effekt-design-session'

function getInitialSession(): DesignSession {
  return {
    sessionData: {
      propertyType: '',
      areaSqm: '',
      currentState: '',
      budgetRange: '',
      additionalNotes: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      preferredContact: 'email',
    },
    uploads: [],
    responses: [],
    savedConcepts: [],
    generationHistory: [],
  }
}

function migrateSession(session: DesignSession): DesignSession {
  if (!session.savedConcepts) session.savedConcepts = []
  if (!session.generationHistory) session.generationHistory = []
  return session
}

export function loadSession(): DesignSession {
  if (typeof window === 'undefined') return getInitialSession()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return migrateSession(JSON.parse(stored))
  } catch {
    // ignore
  }
  return getInitialSession()
}

export function saveSession(session: DesignSession): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // ignore
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function updateSessionData(updates: Partial<SessionData>): DesignSession {
  const session = loadSession()
  session.sessionData = { ...session.sessionData, ...updates }
  saveSession(session)
  return session
}

export function updateUploads(uploads: UploadedFile[]): DesignSession {
  const session = loadSession()
  session.uploads = uploads
  saveSession(session)
  return session
}

export function updateResponse(questionId: number, selectedOptions: string[]): DesignSession {
  const session = loadSession()
  const existing = session.responses.findIndex(r => r.questionId === questionId)
  const response: QuestionResponse = { questionId, selectedOptions }
  if (existing >= 0) {
    session.responses[existing] = response
  } else {
    session.responses.push(response)
  }
  saveSession(session)
  return session
}

export function getResponseForQuestion(questionId: number): string[] {
  const session = loadSession()
  const response = session.responses.find(r => r.questionId === questionId)
  return response?.selectedOptions || []
}

export function setDesignResult(result: DesignResponse): void {
  const session = loadSession()
  session.designResult = result
  saveSession(session)
}

export function saveConcept(concept: DesignConcept, quoteLineItems: QuoteLineItem[], batchId?: string): SavedConcept {
  const session = loadSession()
  const saved: SavedConcept = {
    id: `saved-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    concept,
    quoteLineItems,
    savedAt: new Date().toISOString(),
    batchId: batchId || `batch-${Date.now()}`,
  }
  session.savedConcepts.push(saved)
  saveSession(session)
  return saved
}

export function unsaveConcept(conceptId: string): void {
  const session = loadSession()
  session.savedConcepts = session.savedConcepts.filter(sc => sc.id !== conceptId)
  saveSession(session)
}

export function isConceptSaved(conceptName: string): SavedConcept | undefined {
  const session = loadSession()
  return session.savedConcepts.find(sc => sc.concept.name === conceptName)
}

export function getSavedConcepts(): SavedConcept[] {
  const session = loadSession()
  return session.savedConcepts
}

export function updateSavedConceptQuote(conceptId: string, quoteLineItems: QuoteLineItem[]): void {
  const session = loadSession()
  const saved = session.savedConcepts.find(sc => sc.id === conceptId)
  if (saved) {
    saved.quoteLineItems = quoteLineItems
    saveSession(session)
  }
}

export function preserveCurrentResults(): void {
  const session = loadSession()
  if (session.designResult) {
    session.generationHistory.push(session.designResult)
    session.designResult = undefined
    saveSession(session)
  }
}
