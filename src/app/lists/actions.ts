'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { listSchema } from '@/lib/validations'
import type { ActionState } from '@/lib/action-state'
import { getTranslations } from 'next-intl/server'


export async function createList(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const raw = {
    title: formData.get('title') as string,
    description: (formData.get('description') as string) || undefined,
  }

  const parsed = listSchema.safeParse(raw)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const isRanked = formData.get('is_ranked') === 'on'
  const isPublic = formData.get('is_public') === 'on'
  const coverUrl = formData.get('cover_url') as string

  const { data, error } = await supabase
    .from('lists')
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      is_ranked: isRanked,
      is_public: isPublic,
      cover_url: coverUrl || null,
    })
    .select('id')
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/feed')
  redirect(`/lists/${data.id}/edit`)
}

export async function saveListItems(
  listId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const t = await getTranslations('ItemEditor')
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const itemsRaw = formData.get('items') as string
  const items = JSON.parse(itemsRaw) as {
    title: string
    note: string
    image_url: string
  }[]

  const validTitledItems = items.filter((item) => item.title.trim() !== '')

  if (validTitledItems.length === 0) {
    return { error: t('minOneItem') }
  }

  const { error: deleteError } = await supabase
    .from('list_items')
    .delete()
    .eq('list_id', listId)

  if (deleteError) {
    return { error: deleteError.message }
  }

  const validItems = validTitledItems.map((item, index) => ({
    list_id: listId,
    title: item.title,
    note: item.note || null,
    image_url: item.image_url || null,
    position: index,
  }))

  const { error: insertError } = await supabase
    .from('list_items')
    .insert(validItems)

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath(`/lists/${listId}`)
  revalidatePath(`/lists/${listId}/edit`)
  redirect(`/lists/${listId}`)
}

export async function deleteList(listId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: list } = await supabase
    .from('lists')
    .select('user_id')
    .eq('id', listId)
    .single()

  if (!list || list.user_id !== user.id) {
    return { error: 'Du bist nicht berechtigt, diese Liste zu löschen.' }
  }

  const { error } = await supabase.from('lists').delete().eq('id', listId)

  if (error) {
    return { error: error.message }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  revalidatePath('/feed')
  redirect(profile ? `/profile/${profile.username}` : '/feed')
}