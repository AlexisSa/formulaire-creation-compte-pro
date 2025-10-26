/**
 * Contextes React pour l'application de création de compte professionnel
 *
 * Ces contextes permettent de :
 * - Centraliser la gestion d'état global
 * - Éviter le prop drilling
 * - Partager l'état entre composants distants
 * - Faciliter les tests et la maintenance
 */

export {
  FormProvider,
  useFormContext,
  useFormData,
  useFormNavigation,
} from './FormContext'

export { ToastProvider, useToast } from './ToastContext'
