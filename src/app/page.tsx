'use client';

import { useProjectSummary } from '@/hooks/useProject';
import { DollarSign, Wallet, Clock, TrendingUp, AlertCircle } from 'lucide-react';

export default function Home() {
  // Hardcodeamos un ID para el MVP
  const { data, loading, error } = useProjectSummary('project-123');

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
          <div className="h-40 bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center gap-4">
          <AlertCircle className="w-8 h-8" />
          <div>
            <h3 className="font-bold">Error al cargar el resumen</h3>
            <p>{error?.message || 'No se pudieron obtener los datos del proyecto.'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Proyecto</h1>
          <p className="text-gray-500">Resumen financiero y estado de avance</p>
        </header>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Monto Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.montoTotal, data.moneda)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pagado</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.montoPagado, data.moneda)}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pendiente</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.montoPendiente, data.moneda)}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Avance del Proyecto</h2>
            </div>
            <span className="text-2xl font-bold text-blue-600">{data.porcentajeAvance}%</span>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${data.porcentajeAvance}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-500 text-right">
            Meta del proyecto: {formatCurrency(data.montoTotal, data.moneda)}
          </p>
        </div>
      </div>
    </main>
  );
}
