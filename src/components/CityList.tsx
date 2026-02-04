'use client';

import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useTripStore, City } from '@/store/useTripStore';
import { useTranslation } from '@/hooks/useTranslation';
import { GripVertical, Trash2, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import TrashZone from './TrashZone';

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
  const { t } = useTranslation();

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
      className="flex flex-wrap sm:flex-nowrap items-center justify-between p-3 sm:p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors gap-2"
    >
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden flex-grow">
        <button
          className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing touch-none p-1 sm:p-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
        <div className="flex items-center gap-2 font-medium text-gray-900 truncate min-w-[100px] sm:min-w-[120px]">
          {city.countryCode && (
            <Image 
              src={`https://flagcdn.com/w20/${city.countryCode.toLowerCase()}.png`}
              alt={city.countryCode}
              width={20}
              height={15}
              className="w-5 h-auto object-cover rounded-sm flex-shrink-0"
            />
          )}
          <span className="truncate">{city.name.split(',')[0]}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5">
          <button
            onClick={() => updateDays(city.id, city.days - 1)}
            disabled={city.days <= 1}
            className="p-1.5 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold text-gray-900 tabular-nums">
            {city.days}
          </span>
          <button
            onClick={() => updateDays(city.id, city.days + 1)}
            disabled={city.days >= 30}
            className="p-1.5 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        
        <button
          onClick={() => removeCity(city.id)}
          className="hidden sm:flex text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
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
  const removeCity = useTripStore((state) => state.removeCity);
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (over && over.id === 'trash-zone') {
      removeCity(active.id as string);
      return;
    }

    if (over && active.id !== over.id) {
      const oldIndex = cities.findIndex((item) => item.id === active.id);
      const newIndex = cities.findIndex((item) => item.id === over.id);
      reorderCities(oldIndex, newIndex);
    }
  }

  if (cities.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-500">{t('citylist.empty')}</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
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
      {activeId && createPortal(<TrashZone />, document.body)}
    </DndContext>
  );
}
