import { z } from 'zod'

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username muss mindestens 3 Zeichen haben')
    .max(20, 'Username darf maximal 20 Zeichen haben')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nur Buchstaben, Zahlen und Unterstriche erlaubt'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen haben'),
})

export const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
})

export const listSchema = z.object({
  title: z
    .string()
    .min(1, 'Titel ist erforderlich')
    .max(100, 'Titel darf maximal 100 Zeichen haben'),
  description: z.string().max(500, 'Beschreibung darf maximal 500 Zeichen haben').optional(),
  category: z.string().max(50, 'Category darf maximal 50 Zeichen haben').optional(),
})