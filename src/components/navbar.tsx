import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/(auth)/actions'
import { ListChecks } from 'lucide-react'
import { Settings } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function Navbar() {
  const t = await getTranslations('Navbar')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let username: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    username = profile?.username ?? null
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={user ? '/feed' : '/'} className="flex items-center gap-2 font-semibold">
        <ListChecks className="h-5 w-5" />
        <span>Listly</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/feed"
                className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
              >
                {t('feed')}
              </Link>
              <Link
                href="/lists/new"
                className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
              >
                {t('newList')}
              </Link>

              <Link
                href="/settings"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Einstellungen"
                >
                <Settings className="h-4 w-4" />
                </Link>

              {username && (
                <Link
                    href={`/profile/${username}`}
                    className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
                >
                    @{username}
                </Link>
                )}
              <form action={logout}>
                <Button variant="outline" size="sm" type="submit">
                  {t('logout')}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/login">{t('login')}</Link>} />
                <Button size="sm" render={<Link href="/signup">{t('signup')}</Link>} />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}