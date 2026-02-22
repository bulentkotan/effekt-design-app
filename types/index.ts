export interface QuestionOption {
  id: string
  label: string
  description?: string
  imageUrl: string
}

export interface Question {
  id: number
  title: string
  subtitle: string
  options: QuestionOption[]
  maxSelections: number
}

export interface UploadedFile {
  id: string
  url: string
  previewUrl: string
  fileName: string
  fileType: 'photo' | 'floorplan'
  label?: string
  file?: File
}

export interface PlotDimensions {
  shape: 'rectangular' | 'l_shaped' | 'irregular'
  dimensions: Record<string, number>
  features: PlotFeature[]
  orientation?: string
}

export interface PlotFeature {
  type: string
  x: number
  y: number
  w: number
  h: number
}

export interface SessionData {
  id?: string
  propertyType: string
  areaSqm: string
  currentState: string
  budgetRange: string
  additionalNotes: string
  clientName: string
  clientEmail: string
  clientPhone: string
  preferredContact: string
}

export interface QuestionResponse {
  questionId: number
  selectedOptions: string[]
}

export interface PlantRecommendation {
  name: string
  botanical: string
  reason: string
  care: string
  placement: string
}

export interface MaterialRecommendation {
  category: string
  recommendation: string
  notes: string
}

export interface KeyFeature {
  feature: string
  description: string
}

export interface QuoteLineItem {
  pricingId: string
  name: string
  description: string
  unit: 'sqm' | 'lm' | 'nos' | 'ls' | 'set'
  unitRate: number
  quantity: number
  isIncluded: boolean
  isOptional: boolean
  category: string
}

export interface DesignConcept {
  name: string
  tagline: string
  narrative: string
  plantPalette: PlantRecommendation[]
  materials: MaterialRecommendation[]
  keyFeatures: KeyFeature[]
  spatialNotes: string
  estimatedRange: string
  colorMood: string[]
  imageUrl?: string | null
  quoteLineItems?: QuoteLineItem[]
}

export interface DesignResponse {
  greeting: string
  concepts: DesignConcept[]
  nextSteps: string
}

export interface SavedConcept {
  id: string
  concept: DesignConcept
  quoteLineItems: QuoteLineItem[]
  savedAt: string
  batchId: string
}

export interface DesignSession {
  sessionData: SessionData
  uploads: UploadedFile[]
  responses: QuestionResponse[]
  plotDimensions?: PlotDimensions
  designResult?: DesignResponse
  savedConcepts: SavedConcept[]
  generationHistory: DesignResponse[]
}
