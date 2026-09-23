'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createList(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const isRanked = formData.get('is_ranked') === 'on'
  const coverUrl = formData.get('cover_url') as string

  const { data, error } = await supabase
    .from('lists')
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      category: category || null,
      is_ranked: isRanked,
      cover_url: coverUrl || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Fehler beim Erstellen der Liste:', error.message)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect(`/lists/${data.id}/edit`)
}

export async function saveListItems(listId: string, formData: FormData) {
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

  // Alte Items löschen
  const { error: deleteError } = await supabase
    .from('list_items')
    .delete()
    .eq('list_id', listId)

  if (deleteError) {
    return { error: deleteError.message }
  }

  // Neue Items einfügen (nur nicht-leere Titel)
  const validItems = items
    .filter((item) => item.title.trim() !== '')
    .map((item, index) => ({
      list_id: listId,
      title: item.title,
      note: item.note || null,
      image_url: item.image_url || null,
      position: index,
    }))

  if (validItems.length > 0) {
    const { error: insertError } = await supabase
      .from('list_items')
      .insert(validItems)

    if (insertError) {
      return { error: insertError.message }
    }
  }

  revalidatePath(`/lists/${listId}`)
  revalidatePath(`/lists/${listId}/edit`)
  redirect(`/lists/${listId}`)
}