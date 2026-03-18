import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

export const devisSchema = z.object({
  type: z.string().min(1, 'Veuillez sélectionner un type de projet'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(9, 'Numéro de téléphone invalide'),
  company: z.string().optional(),
  description: z.string().min(20, 'Veuillez décrire votre projet en détail (min. 20 caractères)'),
  budget: z.string().min(1, 'Veuillez sélectionner un budget'),
  deadline: z.string().optional(),
  features: z.array(z.string()),
})

export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export type ContactFormValues = z.infer<typeof contactSchema>
export type DevisFormValues = z.infer<typeof devisSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
