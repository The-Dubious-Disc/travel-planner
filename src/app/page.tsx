import { Calendar, Map, List, Layout } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Map className="w-6 h-6" />
          Travel Planner
        </h1>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-gray-100 rounded" aria-label="List view"><List className="w-5 h-5" /></button>
           <button className="p-2 hover:bg-gray-100 rounded" aria-label="Calendar view"><Calendar className="w-5 h-5" /></button>
        </div>
      </header>

      {/* Main Content Area - 2 Columns */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column (e.g., POI List / Sidebar) */}
        <aside className="w-1/3 min-w-[300px] bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4">Places & Activities</h2>
          <div className="space-y-2">
             <div className="p-3 bg-gray-50 rounded border border-gray-100">Draft Item 1</div>
             <div className="p-3 bg-gray-50 rounded border border-gray-100">Draft Item 2</div>
             <div className="p-3 bg-gray-50 rounded border border-gray-100">Draft Item 3</div>
          </div>
        </aside>

        {/* Right Column (e.g., Map or Detail View) */}
        <section className="flex-1 bg-gray-50 p-4 relative">
           <div className="absolute inset-0 flex items-center justify-center text-gray-400">
             Map Placeholder
           </div>
        </section>
      </main>

      {/* Bottom Gantt / Timeline */}
      <footer className="h-48 bg-white border-t border-gray-200 p-4 overflow-x-auto">
         <h2 className="font-semibold mb-2 flex items-center gap-2">
           <Layout className="w-4 h-4" /> Timeline
         </h2>
         <div className="flex gap-4">
            {/* Mock timeline items */}
            <div className="w-32 h-16 bg-blue-100 rounded border border-blue-200 flex-shrink-0 p-2 text-sm">Day 1</div>
            <div className="w-32 h-16 bg-blue-100 rounded border border-blue-200 flex-shrink-0 p-2 text-sm">Day 2</div>
            <div className="w-32 h-16 bg-blue-100 rounded border border-blue-200 flex-shrink-0 p-2 text-sm">Day 3</div>
         </div>
      </footer>
    </div>
  );
}
