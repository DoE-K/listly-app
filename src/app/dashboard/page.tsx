import { createClient } from '@/lib/supabase/server'
import { getMyLists, getPublicFeed } from '@/lib/queries/lists'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ListCard } from '@/components/list-card'
import { logout } from '@/app/(auth)/actions'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [myLists, feedLists] = await Promise.all([
    getMyLists(user.id),
    getPublicFeed(),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/lists/new">+ Neue Liste</Link>
          </Button>
          <form action={logout}>
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </form>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Deine Listen</h2>
        {myLists.length === 0 ? (
          <p className="text-muted-foreground">
            Du hast noch keine Liste erstellt.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {myLists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Öffentlicher Feed</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {feedLists.map((list) => (
            <ListCard key={list.id} list={list} showAuthor />
          ))}
        </div>
      </section>
    </div>
  )
}