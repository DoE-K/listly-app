'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ImagePlus, X, Loader2 } from 'lucide-react'

type ImageUploadProps = {
  userId: string
  value: string | null
  onChange: (url: string | null) => void
  folder: string // z.B. "covers" oder "items"
}

export function ImageUpload({ userId, value, onChange, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${userId}/${folder}/${fileName}`

    // Datei als ArrayBuffer lesen, statt das File-Objekt direkt zu übergeben
    const fileBuffer = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from('list-images')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Upload-Fehler:', error.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('list-images')
      .getPublicUrl(filePath)

    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-square w-32 overflow-hidden rounded-lg border bg-muted">
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Vorschau"
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6"
              onClick={() => onChange(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground hover:bg-muted/70"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Bild</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}