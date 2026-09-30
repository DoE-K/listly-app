import { getListWithItems } from '@/lib/queries/lists'
import { getTranslations } from 'next-intl/server'
import { ItemEditor } from '@/components/item-editor'
import { ListMetadataForm } from '@/components/list-metadata-form'
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'

export default async function EditListPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getListWithItems(id)

  if (!result) {
    notFound()
  }

  const { list, items } = result

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== list.user_id) {
    redirect('/login')
  }

  const t = await getTranslations('EditList')

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{t('pageTitle')}</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">{t('detailsHeading')}</h2>
        <ListMetadataForm
          listId={list.id}
          userId={list.user_id}
          initialTitle={list.title}
          initialDescription={list.description}
          initialCoverUrl={list.cover_url}
          initialIsRanked={list.is_ranked}
          initialIsPublic={list.is_public}
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">{t('itemsHeading')}</h2>
        <ItemEditor listId={list.id} userId={user.id} initialItems={items} />
      </section>
    </div>
  )
}