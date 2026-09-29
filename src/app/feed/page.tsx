import { getTranslations } from 'next-intl/server'
import { getPublicFeed } from '@/lib/queries/lists'
import { ListCard } from '@/components/list-card'

export default async function FeedPage() {
  const t = await getTranslations('Feed')
  const feedLists = await getPublicFeed()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">{t('title')}</h1>

      {feedLists.length === 0 ? (
        <p className="text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {feedLists.map((list) => (
            <ListCard key={list.id} list={list} showAuthor />
          ))}
        </div>
      )}
    </div>
  )
}