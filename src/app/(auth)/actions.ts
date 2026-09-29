'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { signupSchema, loginSchema } from '@/lib/validations'
import type { ActionState } from '@/lib/action-state'
import { getTranslations } from 'next-intl/server'


export async function signup(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const t = await getTranslations('Auth')

  const raw = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: t('emailAlreadyRegistered') }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/feed')
}

export async function login(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const t = await getTranslations('Auth')

  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: t('invalidCredentials') }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/feed')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}