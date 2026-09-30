'use client'

import { useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import { updateListMetadata } from '@/app/lists/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/image-upload'

type ListMetadataFormProps = {
  listId: string
  userId: string
  initialTitle: string
  initialDescription: string | null
  initialCoverUrl: string | null
  initialIsRanked: boolean
  initialIsPublic: boolean
}

export function ListMetadataForm({
  listId,
  userId,
  initialTitle,
  initialDescription,
  initialCoverUrl,
  initialIsRanked,
  initialIsPublic,
}: ListMetadataFormProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl)
  const updateWithId = updateListMetadata.bind(null, listId)
  const [state, formAction, pending] = useActionState(updateWithId, null)
  const t = useTranslations('NewList')
  const tEdit = useTranslations('EditList')

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-md bg-primary/10 p-3 text-sm text-primary">
          {tEdit('saved')}
        </p>
      )}

      <div className="grid gap-2">
        <Label>{t('cover')}</Label>
        <ImageUpload
          userId={userId}
          value={coverUrl}
          onChange={setCoverUrl}
          folder="covers"
        />
        <input type="hidden" name="cover_url" value={coverUrl ?? ''} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">{t('title')}</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialTitle}
          placeholder={t('titlePlaceholder')}
        />
        {state?.fieldErrors?.title && (
          <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">{t('description')}</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialDescription ?? ''}
          placeholder={t('descriptionPlaceholder')}
          rows={3}
        />
        {state?.fieldErrors?.description && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="is_ranked">{t('rankedLabel')}</Label>
          <p className="text-sm text-muted-foreground">{t('rankedDescription')}</p>
        </div>
        <Switch id="is_ranked" name="is_ranked" defaultChecked={initialIsRanked} />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="is_public">{t('publicLabel')}</Label>
          <p className="text-sm text-muted-foreground">{t('publicDescription')}</p>
        </div>
        <Switch id="is_public" name="is_public" defaultChecked={initialIsPublic} />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? tEdit('savingDetails') : tEdit('saveDetails')}
      </Button>
    </form>
  )
}