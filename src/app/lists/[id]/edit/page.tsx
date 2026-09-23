import { getListWithItems } from '@/lib/queries/lists'
import { ItemEditor } from '@/components/item-editor'
import { notFound } from 'next/navigation'

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

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-3xl font-bold tracking-tight">{list.title}</h1>
      <p className="mb-6 text-muted-foreground">
        Füge Items zu deiner Liste hinzu
      </p>
      <ItemEditor listId={list.id} userId={list.user_id} initialItems={items} />
    </div>
  )
}