'use client';

import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

export default function TrashZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: 'trash-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-2 ${
        isOver
          ? 'bg-red-500 border-red-200 text-white scale-110 shadow-2xl'
          : 'bg-red-50 border-red-200 text-red-500 shadow-lg'
      }`}
    >
      <Trash2 size={24} className={isOver ? 'animate-bounce' : ''} />
      <span className="font-bold text-sm">
        {isOver ? 'Drop to Delete' : 'Drag here to delete'}
      </span>
    </div>
  );
}
