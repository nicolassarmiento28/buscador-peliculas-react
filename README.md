# Buscador de Peliculas

Aplicacion web para buscar y explorar peliculas usando la API de TMDb (The Movie Database), con favoritos, tema claro/oscuro y listas de peliculas compartibles (Firebase Auth + Firestore).

## Caracteristicas

- Home con peliculas en tendencia, carruseles por categoria y chips de genero (multi-select + orden por popularidad/valoracion/fecha).
- Busqueda de peliculas en tiempo real.
- Favoritos por pelicula y detalle en modal.
- Login con Google (Firebase Auth) y lista personal guardable, con opcion de compartirla publicamente via link.
- Tema claro/oscuro con persistencia en localStorage.
- Interfaz responsiva, con Ant Design.

## Stack

- React 19 + TypeScript 6
- Vite 7
- Ant Design 6
- React Router 7
- Firebase 12 (Auth + Firestore)
- ESLint + Prettier

## Arquitectura

El cliente nunca llama a TMDb directamente ni conoce su token. Toda la logica de peliculas pasa por `src/services/movieApi.ts`, que llama a funciones serverless propias en `api/` (`api/search.ts`, `api/movies.ts`). Estas funciones corren en Vercel, guardan el token `TMDB_API_TOKEN` solo del lado del servidor, validan los parametros de entrada, y son las unicas que hablan con `api.themoviedb.org`.

Los favoritos y las listas compartibles usan Firebase: Auth (Google, via redirect) y Firestore (una lista por usuario, con un campo `shareSlug` para el link publico y reglas de seguridad en `firestore.rules`).

## Requisitos

- Node.js 18 o superior
- npm
- Cuenta de Vercel (o Vercel CLI) si se quiere correr `/api/*` localmente

## Instalacion y uso local

```bash
npm install
```

Copia `.env.example` a `.env.local` y completa las variables:

```env
TMDB_API_TOKEN=tu_token_de_tmdb

VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Nota: `TMDB_API_TOKEN` NO lleva prefijo `VITE_` (es solo server-side). Las variables `VITE_FIREBASE_*` son la config publica de Firebase.

```bash
npm run dev
```

Abre `http://localhost:5173/`.

**Importante**: `npm run dev` levanta solo el frontend (Vite). Las rutas `/api/search` y `/api/movies` son funciones serverless de Vercel y NO funcionan con `vite dev` solo — para probarlas localmente hace falta `vercel dev` (que sirve tanto el frontend como las funciones de `api/`).

## Scripts disponibles

```bash
npm run dev           # Desarrollo (Vite)
npm run build         # tsc -b && vite build
npm run lint          # ESLint
npm run preview       # Preview del build de produccion
npm run format        # Formatea src/ con Prettier
npm run format:check  # Verifica formato sin escribir
```

## Estructura principal

```text
src/
  components/    # MovieCard, MovieSearch, MovieCarousel, GenreChips, MyList, PublicList, Header, Footer, FilmIntro, AuthButton
  contexts/       # ThemeContext, AuthContext
  hooks/          # useTheme, useAuth, useMyList, useFirstListMovieId
  providers/      # ThemeProvider, AuthProvider
  services/       # movieApi.ts (cliente /api/*), firebase.ts
  styles/         # global.css (paleta "Marquesina")
  theme/          # antdTheme.ts
  types/          # movies.ts
  constants/      # genres.ts
  main.tsx
api/
  search.ts       # proxy serverless a /search/movie
  movies.ts       # proxy serverless multi-endpoint (trending, top_rated, upcoming, discover, credits, videos, recommendations)
firestore.rules
```

## Demo

[agregar URL de demo]

## Sobre el desarrollo

Parte del desarrollo de este proyecto se apoyo en una arquitectura de subagentes de Claude Code (diseño, implementacion, seguridad y QA), con verificacion visual real via Playwright en los pasos de UI y de QA final.

## Documentacion relacionada

- `CLAUDE.md` / `AGENTS.md`: contexto detallado del proyecto para agentes de codigo.
- `INSTRUCCIONES_USO.md`: guia rapida de uso diario.

El proyecto arranco en JavaScript y se migro a TypeScript + Ant Design en una etapa temprana (antes de Firebase, el proxy serverless y los carruseles); ese historico ya no vive en un archivo aparte.

## Troubleshooting

- Si el puerto 5173 esta ocupado:

```bash
npm run dev -- --port 3000
```

- Si falla la carga de peliculas, verifica que `TMDB_API_TOKEN` este configurado (en `.env.local` para `vercel dev`, o en las variables de entorno del proyecto en Vercel para produccion).
