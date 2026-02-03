import { create } from 'zustand';

type Language = 'en' | 'es';

interface TranslationState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'app.title': 'Travel Planner',
    'app.subtitle': 'Build your dream itinerary step by step.',
    'search.label': 'Add a Destination',
    'search.placeholder': 'Add a city (e.g. Paris)...',
    'itinerary.title': 'Itinerary',
    'itinerary.drag': 'Drag to reorder',
    'tab.timeline': 'Timeline',
    'tab.map': 'Map',
    'map.placeholder.title': 'Map View Coming Soon',
    'map.placeholder.desc': 'Select cities to visualize your route',
    'summary.title': 'Trip Summary',
    'summary.trip_name': 'Trip Name',
    'summary.destination': 'Destination',
    'summary.destinations': 'Destinations',
    'summary.start_date': 'Start Date',
    'summary.max_days': 'Max Days (Optional)',
    'summary.total_duration': 'Total Duration',
    'summary.days': 'Days',
    'summary.end_date': 'End Date',
    'summary.limit_exceeded': 'Time Limit Exceeded',
    'summary.within_budget': 'Within Budget',
    'summary.days_over': 'days over limit',
    'summary.days_remaining': 'days remaining',
    'gantt.title': 'Trip Timeline',
    'gantt.total': 'Total',
    'gantt.empty': 'Add cities to generate your timeline.',
    'citylist.empty': 'No cities added yet. Start by searching above!',
  },
  es: {
    'app.title': 'Planificador de Viajes',
    'app.subtitle': 'Construye tu itinerario soñado paso a paso.',
    'search.label': 'Añadir Destino',
    'search.placeholder': 'Añade una ciudad (ej. París)...',
    'itinerary.title': 'Itinerario',
    'itinerary.drag': 'Arrastra para reordenar',
    'tab.timeline': 'Cronograma',
    'tab.map': 'Mapa',
    'map.placeholder.title': 'Vista de Mapa Próximamente',
    'map.placeholder.desc': 'Selecciona ciudades para visualizar tu ruta',
    'summary.title': 'Resumen del Viaje',
    'summary.trip_name': 'Nombre del Viaje',
    'summary.destination': 'Destino',
    'summary.destinations': 'Destinos',
    'summary.start_date': 'Fecha de Inicio',
    'summary.max_days': 'Días Máx (Opcional)',
    'summary.total_duration': 'Duración Total',
    'summary.days': 'Días',
    'summary.end_date': 'Fecha Final',
    'summary.limit_exceeded': 'Límite de Tiempo Excedido',
    'summary.within_budget': 'Dentro del Presupuesto',
    'summary.days_over': 'días sobre el límite',
    'summary.days_remaining': 'días restantes',
    'gantt.title': 'Cronograma del Viaje',
    'gantt.total': 'Total',
    'gantt.empty': 'Añade ciudades para generar tu cronograma.',
    'citylist.empty': 'No hay ciudades añadidas. ¡Empieza buscando arriba!',
  }
};

export const useTranslation = create<TranslationState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const lang = get().language;
    return translations[lang][key as keyof typeof translations['en']] || key;
  }
}));
