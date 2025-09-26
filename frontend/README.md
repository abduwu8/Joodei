## Joodei Frontend

React + Vite application for interactive medicines analytics and dashboards.

### Tech Stack
- React 18, Vite
- Tailwind CSS
- Recharts/D3-based custom charts and Highcharts (select views)
- Context API for theme/auth, Supabase client for auth

### Prerequisites
- Node.js 18+

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```
Starts Vite on localhost. Hot reload is enabled.

### Build
```bash
npm run build
npm run preview
```

### Environment
Create `.env` in this folder:
```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_BASE_URL=http://localhost:8000
```

### Project Structure (selected)
```
frontend/
  src/
    components/           # Reusable UI + charts
      medicines/          # Medicine-specific visualizations
      ui/                 # Generic UI widgets (globe, search)
    context/              # Theme and auth providers
    hooks/                # Data and UI hooks
    lib/                  # Supabase client, utilities
    pages/                # Routed pages (Dashboard, Auth)
    App.jsx               # Routes and app shell
    main.jsx              # App bootstrap
```

### Key Concepts
- Theming: `context/ThemeContext.jsx` provides `isDark`; components adapt colors accordingly.
- Authentication: `context/AuthContext.jsx` with Supabase; `ProtectedRoute.jsx` guards private routes.
- Data Loading: Custom hooks (e.g., `hooks/useMedicineData.js`) fetch from `VITE_API_BASE_URL` and normalize payloads for charts.
- Charts: Larger composites live in `components/medicines/*`; shared primitives under `components/` and `components/ui/`.

### Scripts
- `dev`: local development server
- `build`: production build
- `preview`: preview built assets

### Coding Notes
- Follow existing Tailwind utility conventions and component props (`isDark`, `data`, `compact`).
- Keep chart inputs normalized: `{ category|label|name, value|count }` arrays.
