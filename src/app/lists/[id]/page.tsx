import { getListWithItems } from '@/lib/queries/lists'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DeleteListButton } from '@/components/delete-list-button'

export default async function ListDetailPage({
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
  const author = Array.isArray(list.profiles) ? list.profiles[0] : list.profiles

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === list.user_id

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row">
        <div className="aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-48">
          {list.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={list.cover_url}
              alt={list.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              Kein Cover
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              {list.category && (
                <Badge variant="secondary">{list.category}</Badge>
              )}
              <Badge variant="outline">
                {list.is_ranked ? 'Ranked' : 'Unranked'}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {list.title}
            </h1>
            {author && (
              <Link
                href={`/profile/${author.username}`}
                className="mt-1 inline-block text-sm text-muted-foreground hover:underline"
              >
                von @{author.username}
              </Link>
            )}
            {list.description && (
              <p className="mt-3 text-muted-foreground">
                {list.description}
              </p>
            )}
          </div>

          {isOwner && (
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline">
                <Link href={`/lists/${list.id}/edit`}>Liste bearbeiten</Link>
              </Button>
              <DeleteListButton listId={list.id} listTitle={list.title} />
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-muted-foreground">Diese Liste hat noch keine Items.</p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg border bg-card p-3"
            >
              {list.is_ranked && (
                <span className="w-8 shrink-0 text-center text-xl font-bold text-muted-foreground">
                  {index + 1}
                </span>
              )}

              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                {item.note && (
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}