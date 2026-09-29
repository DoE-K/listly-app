import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewListForm } from '@/components/new-list-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function NewListPage() {
  const t = await getTranslations('NewList')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('pageTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <NewListForm userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}