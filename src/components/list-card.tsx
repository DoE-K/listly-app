import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type ListCardProps = {
  list: {
    id: string
    title: string
    description: string | null
    category: string | null
    is_ranked: boolean
    cover_url: string | null
    profiles?: { username: string; avatar_url: string | null } | { username: string; avatar_url: string | null }[] | null
  }
  showAuthor?: boolean
}

export async function ListCard({ list, showAuthor }: ListCardProps) {
  const t = await getTranslations('ListCard')
  const author = Array.isArray(list.profiles) ? list.profiles[0] : list.profiles

  return (
    <Link href={`/lists/${list.id}`}>
      <Card className="overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="aspect-square w-full overflow-hidden rounded-t-xl bg-muted">
          {list.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={list.cover_url}
              alt={list.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              {t('noCover')}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="truncate font-semibold">{list.title}</h3>
          {list.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {list.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-1">
            {list.category && (
              <Badge variant="secondary">{list.category}</Badge>
            )}
            <Badge variant="outline">
              {list.is_ranked ? t('ranked') : t('unranked')}
            </Badge>
          </div>
          {showAuthor && author && (
            <span className="text-xs leading-none text-muted-foreground">
              @{author.username}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}