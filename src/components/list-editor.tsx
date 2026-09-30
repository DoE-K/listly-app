'use client'

import { useActionState, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/image-upload'
import { SortableItem } from '@/components/sortable-item'
import { Plus } from 'lucide-react'
import { saveList } from '@/app/lists/actions'

type Item = {
  id: string
  title: string
  note: string
  image_url: string
}

type ListEditorProps = {
  listId: string
  userId: string
  initialTitle: string
  initialDescription: string | null
  initialCoverUrl: string | null
  initialIsRanked: boolean
  initialIsPublic: boolean
  initialItems: {
    title: string
    note: string | null
    image_url: string | null
  }[]
}

export function ListEditor({
  listId,
  userId,
  initialTitle,
  initialDescription,
  initialCoverUrl,
  initialIsRanked,
  initialIsPublic,
  initialItems,
}: ListEditorProps) {
  const [coverUrl, setCoverUrl] = useState<string | null>(initialCoverUrl)
  const [items, setItems] = useState<Item[]>(
    initialItems.length > 0
      ? initialItems.map((i) => ({
          id: crypto.randomUUID(),
          title: i.title,
          note: i.note ?? '',
          image_url: i.image_url ?? '',
        }))
      : [{ id: crypto.randomUUID(), title: '', note: '', image_url: '' }]
  )

  const saveListWithId = saveList.bind(null, listId)
  const [state, formAction, pending] = useActionState(saveListWithId, null)

  const t = useTranslations('NewList')
  const tItems = useTranslations('ItemEditor')
  const tEdit = useTranslations('EditList')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function addItem() {
    setItems([
      ...items,
      { id: crypto.randomUUID(), title: '', note: '', image_url: '' },
    ])
  }

  function removeItem(id: string) {
    setItems(items.filter((item) => item.id !== id))
  }

  function updateItem(id: string, field: keyof Omit<Item, 'id'>, value: string) {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id)
      const newIndex = prev.findIndex((item) => item.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <form action={formAction} className="flex flex-col gap-10">
      {state?.error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* Metadaten-Sektion */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold">{tEdit('detailsHeading')}</h2>

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
      </section>

      {/* Items-Sektion */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{tEdit('itemsHeading')}</h2>

        <input
          type="hidden"
          name="items"
          value={JSON.stringify(
            items.map(({ title, note, image_url }) => ({ title, note, image_url }))
          )}
        />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {items.map((item, index) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  index={index}
                  userId={userId}
                  title={item.title}
                  note={item.note}
                  imageUrl={item.image_url}
                  onTitleChange={(value) => updateItem(item.id, 'title', value)}
                  onNoteChange={(value) => updateItem(item.id, 'note', value)}
                  onImageChange={(url) =>
                    updateItem(item.id, 'image_url', url ?? '')
                  }
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          {tItems('addItem')}
        </Button>
      </section>

      <Button type="submit" disabled={pending}>
        {pending ? tItems('savePending') : tItems('save')}
      </Button>
    </form>
  )
}