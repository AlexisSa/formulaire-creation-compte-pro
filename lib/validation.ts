import { z } from 'zod'

/**
 * Schéma de validation pour le formulaire de création de compte professionnel
 */
export const accountFormSchema = z.object({
  // Informations entreprise (depuis API INSEE ou manuel)
  companyName: z
    .string()
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
    .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères"),

  siren: z
    .string()
    .regex(/^\d{9}$/, 'Le SIREN doit contenir exactement 9 chiffres')
    .optional()
    .or(z.literal('')),

  siret: z.string().regex(/^\d{14}$/, 'Le SIRET doit contenir exactement 14 chiffres'),

  nafApe: z.string().optional().or(z.literal('')),

  tvaIntracom: z
    .string()
    .regex(/^FR\d{11}$/, 'Le numéro de TVA doit avoir le format FR suivi de 11 chiffres')
    .optional()
    .or(z.literal('')),

  // Contact
  email: z
    .string()
    .email("L'adresse email n'est pas valide")
    .min(1, "L'email est obligatoire"),

  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Le numéro de téléphone n'est pas valide"
    ),

  // Adresse de facturation
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),

  postalCode: z.string().regex(/^\d{5}$/, 'Le code postal doit contenir 5 chiffres'),

  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),

  // Documents
  legalDocument: z
    .instanceof(File, { message: 'Un document légal est requis' })
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      'Le fichier ne doit pas dépasser 10MB'
    )
    .refine(
      (file) => ['application/pdf', 'image/png', 'image/jpeg'].includes(file.type),
      'Format de fichier non supporté (PDF, PNG, JPG uniquement)'
    ),

  signature: z
    .string()
    .min(10, 'La signature est obligatoire')
    .startsWith('data:image', 'La signature doit être une image valide'),
})

export type AccountFormData = z.infer<typeof accountFormSchema>
