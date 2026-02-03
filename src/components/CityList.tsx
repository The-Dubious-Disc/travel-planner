'use client';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useTripStore, City } from '@/store/useTripStore';
import { GripVertical, Trash2 } from 'lucide-react';

function SortableCityItem({ city }: { city: City }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: city.id });

  const updateDays = useTripStore((state) => state.updateDays);
  const removeCity = useTripStore((state) => state.removeCity);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
        <div className="font-medium text-gray-900 truncate min-w-[120px]">
          {city.name}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor={`days-${city.id}`} className="text-sm text-gray-500 hidden sm:inline">
            Days:
          </label>
          <input
            id={`days-${city.id}`}
            type="number"
            min="1"
            max="30"
            value={city.days}
            onChange={(e) => updateDays(city.id, parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
          />
        </div>
        
        <button
          onClick={() => removeCity(city.id)}
          className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
          title="Remove city"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function CityList() {
  const cities = useTripStore((state) => state.cities);
  const reorderCities = useTripStore((state) => state.reorderCities);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cities.findIndex((item) => item.id === active.id);
      const newIndex = cities.findIndex((item) => item.id === over.id);
      reorderCities(oldIndex, newIndex);
    }
  }

  if (cities.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-500">No cities added yet. Start by searching above!</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={cities.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="w-full">
          {cities.map((city) => (
            <SortableCityItem key={city.id} city={city} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
