'use client'

import { useActionState, useState } from 'react'
import { createList } from '@/app/lists/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/image-upload'

export function NewListForm({ userId }: { userId: string }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null)
  const [state, formAction, pending] = useActionState(createList, null)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="grid gap-2">
        <Label>Cover-Bild</Label>
        <ImageUpload
          userId={userId}
          value={coverUrl}
          onChange={setCoverUrl}
          folder="covers"
        />
        {/* Cover-URL als verstecktes Feld, damit es im FormData landet */}
        <input type="hidden" name="cover_url" value={coverUrl ?? ''} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Titel</Label>
        <Input id="title" name="title" placeholder="Meine Top 10 Filme" />
        {state?.fieldErrors?.title && (
          <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Worum geht's in dieser Liste?"
          rows={3}
        />
        {state?.fieldErrors?.description && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category / Tag</Label>
        <Input id="category" name="category" placeholder="Filme, Musik, Reisen, ..." />
        {state?.fieldErrors?.category && (
          <p className="text-sm text-destructive">
            {state.fieldErrors.category[0]}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="is_ranked">Ranked-Liste</Label>
          <p className="text-sm text-muted-foreground">
            Items werden nummeriert dargestellt
          </p>
        </div>
        <Switch id="is_ranked" name="is_ranked" defaultChecked />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Wird erstellt...' : 'Liste erstellen & Items hinzufügen'}
      </Button>
    </form>
  )
}