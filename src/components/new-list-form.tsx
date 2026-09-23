'use client'

import { useState } from 'react'
import { createList } from '@/app/lists/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/image-upload'

export function NewListForm({ userId }: { userId: string }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    if (coverUrl) {
      formData.set('cover_url', coverUrl)
    }
    await createList(formData)
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-2">
        <Label>Cover-Bild</Label>
        <ImageUpload
          userId={userId}
          value={coverUrl}
          onChange={setCoverUrl}
          folder="covers"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Titel</Label>
        <Input id="title" name="title" placeholder="Meine Top 10 Filme" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Worum geht's in dieser Liste?"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Category / Tag</Label>
        <Input id="category" name="category" placeholder="Filme, Musik, Reisen, ..." />
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

      <Button type="submit" className="w-full">
        Liste erstellen &amp; Items hinzufügen
      </Button>
    </form>
  )
}