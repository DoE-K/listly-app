import { createClient } from '@/lib/supabase/server'

export async function getMyLists(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lists')
    .select('id, title, description, category, is_ranked, cover_url, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fehler beim Laden eigener Listen:', error.message)
    return []
  }
  return data
}

export async function getPublicFeed() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lists')
    .select(
      'id, title, description, category, is_ranked, cover_url, created_at, profiles(username, avatar_url)'
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Fehler beim Laden des Feeds:', error.message)
    return []
  }
  return data
}

export async function getListWithItems(listId: string) {
  const supabase = await createClient()
  const { data: list, error: listError } = await supabase
    .from('lists')
    .select('*, profiles(username, avatar_url)')
    .eq('id', listId)
    .single()

  if (listError || !list) {
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from('list_items')
    .select('*')
    .eq('list_id', listId)
    .order('position', { ascending: true })

  if (itemsError) {
    console.error('Fehler beim Laden der Items:', itemsError.message)
  }

  return { list, items: items ?? [] }
}

export async function getProfileByUsername(username: string) {
  const supabase = await createClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, created_at')
    .eq('username', username)
    .single()

  if (error || !profile) {
    return null
  }

  return profile
}

export async function getPublicListsByUser(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lists')
    .select('id, title, description, category, is_ranked, cover_url, created_at')
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fehler beim Laden der Profil-Listen:', error.message)
    return []
  }
  return data
}