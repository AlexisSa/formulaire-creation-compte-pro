'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { AccountFormData } from '@/lib/validation'
import type { EntrepriseSearchResult } from '@/types/insee'

// Types pour le contexte
interface FormState {
  currentStep: number
  isTransitioning: boolean
  selectedEntreprise: EntrepriseSearchResult | null
  formData: Partial<AccountFormData>
  isSubmitting: boolean
  errors: Record<string, string>
}

type FormAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'SET_ENTREPRISE'; payload: EntrepriseSearchResult | null }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<AccountFormData> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'RESET_FORM' }

// État initial
const initialState: FormState = {
  currentStep: 1,
  isTransitioning: false,
  selectedEntreprise: null,
  formData: {},
  isSubmitting: false,
  errors: {},
}

// Reducer pour gérer l'état
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }

    case 'SET_TRANSITIONING':
      return { ...state, isTransitioning: action.payload }

    case 'SET_ENTREPRISE':
      return { ...state, selectedEntreprise: action.payload }

    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      }

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload }

    case 'SET_ERRORS':
      return { ...state, errors: action.payload }

    case 'RESET_FORM':
      return initialState

    default:
      return state
  }
}

// Interface du contexte
interface FormContextType {
  state: FormState
  dispatch: React.Dispatch<FormAction>

  // Actions helpers
  goToStep: (step: number) => void
  setTransitioning: (transitioning: boolean) => void
  selectEntreprise: (entreprise: EntrepriseSearchResult | null) => void
  updateFormData: (data: Partial<AccountFormData>) => void
  setSubmitting: (submitting: boolean) => void
  setErrors: (errors: Record<string, string>) => void
  resetForm: () => void

  // Getters
  isFirstStep: boolean
  isLastStep: boolean
  totalSteps: number
  progress: number
}

// Création du contexte
const FormContext = createContext<FormContextType | undefined>(undefined)

// Interface du provider
interface FormProviderProps {
  children: ReactNode
  totalSteps?: number
}

// Provider du contexte
export function FormProvider({ children, totalSteps = 3 }: FormProviderProps) {
  const [state, dispatch] = useReducer(formReducer, initialState)

  // Actions helpers
  const goToStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }

  const setTransitioning = (transitioning: boolean) => {
    dispatch({ type: 'SET_TRANSITIONING', payload: transitioning })
  }

  const selectEntreprise = (entreprise: EntrepriseSearchResult | null) => {
    dispatch({ type: 'SET_ENTREPRISE', payload: entreprise })
  }

  const updateFormData = (data: Partial<AccountFormData>) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: data })
  }

  const setSubmitting = (submitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: submitting })
  }

  const setErrors = (errors: Record<string, string>) => {
    dispatch({ type: 'SET_ERRORS', payload: errors })
  }

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' })
  }

  // Getters
  const isFirstStep = state.currentStep === 1
  const isLastStep = state.currentStep === totalSteps
  const progress = (state.currentStep / totalSteps) * 100

  const value: FormContextType = {
    state,
    dispatch,

    // Actions
    goToStep,
    setTransitioning,
    selectEntreprise,
    updateFormData,
    setSubmitting,
    setErrors,
    resetForm,

    // Getters
    isFirstStep,
    isLastStep,
    totalSteps,
    progress,
  }

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}

// Hook pour utiliser le contexte
export function useFormContext(): FormContextType {
  const context = useContext(FormContext)

  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider')
  }

  return context
}

// Hook spécialisé pour les données du formulaire
export function useFormData() {
  const { state, updateFormData } = useFormContext()

  return {
    formData: state.formData,
    updateFormData,
  }
}

// Hook spécialisé pour la navigation
export function useFormNavigation() {
  const {
    state,
    goToStep,
    setTransitioning,
    isFirstStep,
    isLastStep,
    totalSteps,
    progress,
  } = useFormContext()

  return {
    currentStep: state.currentStep,
    isTransitioning: state.isTransitioning,
    goToStep,
    setTransitioning,
    isFirstStep,
    isLastStep,
    totalSteps,
    progress,
  }
}
