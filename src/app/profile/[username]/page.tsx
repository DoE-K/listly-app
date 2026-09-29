import { getProfileByUsername, getMyLists, getPublicListsByUser } from '@/lib/queries/lists'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ListCard } from '@/components/list-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getTranslations } from 'next-intl/server'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const t = await getTranslations('Profile')
  const { username } = await params
  const profile = await getProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwnProfile = user?.id === profile.id

  // Eigenes Profil: alle eigenen Listen (inkl. privat). Fremdes Profil: nur öffentliche.
  const lists = isOwnProfile
    ? await getMyLists(profile.id)
    : await getPublicListsByUser(profile.id)

  const joinedDate = new Date(profile.created_at).toLocaleDateString(
    'de-DE',
    { month: 'long', year: 'numeric' }
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-10 flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.username} />
          <AvatarFallback className="text-xl">
            {profile.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {profile.display_name || `@${profile.username}`}
          </h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('joined', { date: joinedDate })}
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-semibold">
        {isOwnProfile ? t('ownLists') : t('userLists', { username: profile.username })}
      </h2>

      {lists.length === 0 ? (
        <p className="text-muted-foreground">
        {isOwnProfile ? t('ownEmpty') : t('otherEmpty')}
      </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  )
}