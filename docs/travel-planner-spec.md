# Travel Planner Web App - MVP Spec

## Overview
A web app for planning multi-city trips with flexible scheduling. Users can reorder cities, adjust stay durations, and visualize the trip chronologically in a Gantt chart. Includes constraints like total trip days and date ranges.

## Key Features
- **Initial Setup**: Set start date (optional), total trip days (optional).
- **City Management**: Draggable list of cities (left column).
- **Duration Controls**: Number input with + and - buttons for days per city (right column).
- **Gantt Visualization**: Chronological timeline (bottom), no overlaps >1 day between cities (e.g., same day transition).
- **Constraints & Feedback**:
  - If trip exceeds total days: Mark excess in red.
  - If under: Add gray bars for remaining days.
- **Summary**: Total days, cities, start/end dates (top).
- **Responsive**: Desktop (columns) and mobile (stacked) views.

## User Flow
1. Setup: Enter start date and/or total days.
2. Add/edit cities and durations.
3. Drag to reorder cities.
4. View Gantt for timeline.
5. See summary and constraints feedback.

## Technologies
- **Frontend**: Next.js (React), no SSR initially.
- **UI**: Tailwind CSS, react-dnd for drag-and-drop, D3.js for Gantt.
- **State**: Zustand or Context API.
- **DB**: Supabase (PostgreSQL free tier) for saving trips.
- **Deploy**: Vercel (free).

## Wireframes
- See attached images: `travel-wireframe-2026-02-03.png` (v1), `travel-wireframe-v2-2026-02-03.png` (v2), `travel-wireframe-v3-2026-02-03.png` (v3 final: single Gantt, warning box for days).

## Next Steps
- Code prototype in Next.js.
- Integrate Supabase for persistence.
- Add user auth if needed.
- Test responsive design.

## Estimations
- Design/Refinement: 2-3 hours (done).
- Prototype: 10-15 hours.
- Full MVP: 20-30 hours.

## Notes
- Keep it simple: Local storage first, then DB.
- Constraints: Prevent overlaps, enforce dates.
- Future: Export to PDF, map integration.