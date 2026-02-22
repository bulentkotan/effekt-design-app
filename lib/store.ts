'use client'

import { DesignResponse, DesignSession, QuestionResponse, SessionData, UploadedFile } from '@/types'

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
  }
}

export function loadSession(): DesignSession {
  if (typeof window === 'undefined') return getInitialSession()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
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
