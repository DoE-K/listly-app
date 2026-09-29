'use client'

import { useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { setLocale } from '@/app/settings/actions'
import type { Locale } from '@/i18n/request'

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('Settings')
  const [isPending, startTransition] = useTransition()

  function handleChange(value: string | null) {
    if (!value) return
    startTransition(() => {
      setLocale(value as Locale)
    })
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{t('language')}</p>
        <p className="text-sm text-muted-foreground">
          {t('languageDescription')}
        </p>
      </div>
      <Select value={locale} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="de">Deutsch</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}