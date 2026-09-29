import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function SettingsPage() {
  const t = await getTranslations('Settings')

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{t('title')}</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{t('appearance')}</CardTitle>
          <CardDescription>{t('appearanceDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <LanguageSwitcher />
        </CardContent>
      </Card>
    </div>
  )
}