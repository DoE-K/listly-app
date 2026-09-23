'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ImageUpload } from '@/components/image-upload'
import { GripVertical, Trash2 } from 'lucide-react'

type SortableItemProps = {
  id: string
  index: number
  userId: string
  title: string
  note: string
  imageUrl: string
  onTitleChange: (value: string) => void
  onNoteChange: (value: string) => void
  onImageChange: (url: string | null) => void
  onRemove: () => void
}

export function SortableItem({
  id,
  index,
  userId,
  title,
  note,
  imageUrl,
  onTitleChange,
  onNoteChange,
  onImageChange,
  onRemove,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style}>
      <CardContent className="flex items-start gap-3 p-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-2.5 shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <span className="mt-2.5 w-6 shrink-0 text-sm text-muted-foreground">
          {index + 1}.
        </span>

        <ImageUpload
          userId={userId}
          value={imageUrl || null}
          onChange={onImageChange}
          folder="items"
        />

        <div className="flex flex-1 flex-col gap-2">
          <Input
            placeholder="Titel"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <Input
            placeholder="Notiz (optional)"
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}