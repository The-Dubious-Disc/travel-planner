'use client';

import AppSidebar from '@/components/AppSidebar';

export default function TripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppSidebar />
      <div className="flex-1 w-full md:w-auto">
        {children}
      </div>
    </div>
  );
}
