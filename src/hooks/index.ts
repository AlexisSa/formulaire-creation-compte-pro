/**
 * Hooks personnalisés pour l'application de création de compte professionnel
 *
 * Ces hooks encapsulent la logique métier et permettent de :
 * - Séparer la logique des composants UI
 * - Réutiliser la logique entre différents composants
 * - Faciliter les tests unitaires
 * - Améliorer la maintenabilité du code
 */

export { useInseeSearch } from './useInseeSearch'
export { useFormStep } from './useFormStep'
export { useFileUpload } from './useFileUpload'
export { useSignature } from './useSignature'
export { useAutoSave } from './useAutoSave'
export { useAccountForm } from './useAccountForm'
export { useAccessibility } from './useAccessibility'
export {
  useAnimation,
  useProgressAnimation,
  useStaggerAnimation,
  useParticleAnimation,
  useMorphAnimation,
} from './useAnimations'

// Types exports pour faciliter l'utilisation
export type { UseInseeSearchReturn } from './useInseeSearch'
export type { UseFormStepReturn } from './useFormStep'
export type { UseFileUploadReturn } from './useFileUpload'
export type { UseSignatureReturn } from './useSignature'
export type { UseAutoSaveReturn } from './useAutoSave'
export type { UseAccountFormReturn } from './useAccountForm'
