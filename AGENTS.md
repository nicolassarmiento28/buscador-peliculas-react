# Buscador de Peliculas - React + TypeScript

App web para buscar peliculas usando la API de TMDb (The Movie Database).

## Stack

- React 19 + TypeScript 6
- Vite 7
- Ant Design 6 (componentes de UI)
- ESLint + Prettier

## Comandos

```bash
npm run dev           # Desarrollo (http://localhost:5173)
npm run build         # tsc -b && vite build
npm run lint          # ESLint
npm run format        # Prettier sobre src/
npm run format:check  # Verifica formato sin escribir
```

## Estructura

```text
src/
  components/
    MovieCard/        # Tarjeta de pelicula individual
    MovieSearch/       # Buscador principal
  contexts/
    ThemeContext.ts    # Contexto de tema claro/oscuro
  hooks/
    useTheme.ts
  providers/
    ThemeProvider.tsx   # Persiste tema en localStorage
  services/
    movieApi.ts        # Cliente TMDb (fetch a /search/movie)
  styles/
    global.css
  theme/
    antdTheme.ts        # Config de tema de Ant Design
  types/
    movies.ts           # Tipos de dominio (Movie, MovieSearchResponse)
  main.tsx
```

## Notas importantes

- La app consume `https://api.themoviedb.org/3/search/movie`.
- El token se lee desde `import.meta.env.VITE_TMDB_API_TOKEN` en `src/services/movieApi.ts`. Configurar en `.env.local` (ver `.env.example`).
- Proyecto migrado de JavaScript a TypeScript (ver `MIGRATION.md`).
- No commitear `dist/` ni artefactos de build (ya estan en `.gitignore`).

## Documentacion relacionada

- `INSTRUCCIONES_USO.md`: guia rapida de uso diario.
- `MIGRATION.md`: detalles de la migracion de JavaScript a TypeScript.
