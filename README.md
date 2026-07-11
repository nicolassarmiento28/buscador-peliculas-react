# Aplicación de Búsqueda de Películas

Aplicación web desarrollada con React para búsqueda y exploración de películas mediante consumo de la API de The Movie Database (TMDb). El proyecto fue migrado de JavaScript a TypeScript y actualmente utiliza React, Vite y Ant Design para construir una interfaz moderna, responsive y enfocada en experiencia de usuario.

La aplicación incluye renderizado dinámico de resultados, manejo de estado y visualización organizada de información para facilitar la búsqueda y exploración de contenido en tiempo real.


## Caracteristicas

- Busqueda de peliculas en tiempo real
- Tema claro/oscuro con persistencia en localStorage
- Interfaz responsiva para movil, tablet y desktop
- Tipado fuerte con TypeScript
- Componentes de UI con Ant Design

## Stack

- React 19
- TypeScript 6
- Vite 7
- Ant Design 6
- ESLint + Prettier

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion

```bash
npm install
```

## Configuracion de entorno

El token de TMDb se usa solo del lado del servidor, en la funcion
serverless `api/search.ts`, para que nunca quede expuesto en el bundle
del cliente.

1. Crea o edita el archivo `.env.local` en la raiz del proyecto (usado por
   `vercel dev`) o configura la variable en el entorno de Vercel
   (Project Settings > Environment Variables) para produccion.
2. Define tu token de TMDb (sin prefijo `VITE_`):

```env
TMDB_API_TOKEN=tu_token_aqui
```

Puedes usar `.env.example` como referencia. El cliente llama a
`/api/search` (mismo origen) en vez de llamar a TMDb directamente.

## Scripts disponibles

```bash
npm run dev           # Desarrollo
npm run build         # Build de produccion (TypeScript + Vite)
npm run preview       # Preview de la build
npm run lint          # Linter
npm run format        # Formatea archivos en src/
npm run format:check  # Verifica formato
```

## Uso

1. Ejecuta `npm run dev`.
2. Abre `http://localhost:5173/`.
3. Escribe una pelicula en el buscador y presiona Enter o el boton Buscar.
4. Cambia el tema con el boton de la esquina superior derecha.

## Estructura principal

```text
src/
  components/
    MovieCard/
    MovieSearch/
  contexts/
    ThemeContext.ts
  hooks/
    useTheme.ts
  providers/
    ThemeProvider.tsx
  services/
    movieApi.ts
  styles/
    global.css
  theme/
    antdTheme.ts
  types/
    movies.ts
  main.tsx
```

## Notas importantes

- La app consume `https://api.themoviedb.org/3/search/movie`.
- El token se lee desde `import.meta.env.VITE_TMDB_API_TOKEN` en `src/services/movieApi.ts`.
- Existe un respaldo del componente anterior en `src/BuscadorPeliculas.jsx.backup`.

## Documentacion relacionada

- `INSTRUCCIONES_USO.md`: guia rapida de uso diario.
- `MIGRATION.md`: detalles de la migracion de JavaScript a TypeScript.

## Troubleshooting

- Si el puerto 5173 esta ocupado:

```bash
npm run dev -- --port 3000
```

- Si falla la API, verifica que `VITE_TMDB_API_TOKEN` exista y sea valido.
