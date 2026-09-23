'use client'

import { useState } from 'react'
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
import { Plus } from 'lucide-react'
import { saveListItems } from '@/app/lists/actions'
import { SortableItem } from '@/components/sortable-item'

type Item = {
  id: string
  title: string
  note: string
  image_url: string
}

type ItemEditorProps = {
  listId: string
  userId: string
  initialItems: {
    title: string
    note: string | null
    image_url: string | null
  }[]
}

export function ItemEditor({ listId, userId, initialItems }: ItemEditorProps) {
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
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

  async function handleSubmit(formData: FormData) {
    // id ist nur UI-intern, wird für die DB nicht gebraucht
    const itemsForSave = items.map(({ title, note, image_url }) => ({
      title,
      note,
      image_url,
    }))
    formData.set('items', JSON.stringify(itemsForSave))
    await saveListItems(listId, formData)
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
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
        Item hinzufügen
      </Button>

      <Button type="submit" className="mt-4">
        Liste speichern
      </Button>
    </form>
  )
}