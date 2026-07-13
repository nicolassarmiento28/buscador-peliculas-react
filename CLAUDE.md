# Buscador de Peliculas - React + TypeScript

App web para buscar y explorar peliculas usando la API de TMDb (The Movie Database), con favoritos y listas compartibles via Firebase.

## Stack

- React 19 + TypeScript 6
- Vite 7
- Ant Design 6 (componentes de UI)
- React Router 7
- Firebase 12 (Auth con Google + Firestore)
- ESLint + Prettier

## Comandos (reales, ver package.json)

```bash
npm run dev           # Desarrollo (http://localhost:5173)
npm run build         # tsc -b && vite build
npm run lint          # ESLint
npm run preview       # Sirve el build de produccion
npm run format        # Prettier sobre src/
npm run format:check  # Verifica formato sin escribir
```

No hay script `test`.

## Estructura

```text
src/
  components/
    MovieCard/          # MovieCard.tsx, MovieDetail.tsx (modal), FavoriteButton.tsx
    MovieSearch/         # MovieSearch.tsx (home), MovieRows.tsx
    MovieCarousel/       # Carrusel con scroll horizontal
    GenreChips/          # Chips multi-select de genero + orden
    MyList/              # Vista de lista propia
    PublicList/          # Vista de lista compartida (publica)
    Header/              # Barra fija superior
    Footer/
    FilmIntro/           # Overlay de intro (una vez por sesion)
    AuthButton/
  contexts/
    ThemeContext.ts
    AuthContext.ts
  hooks/
    useTheme.ts
    useAuth.ts
    useMyList.ts
    useFirstListMovieId.ts
  providers/
    ThemeProvider.tsx     # Persiste tema en localStorage
    AuthProvider.tsx       # Suscripcion centralizada a Firebase Auth
  services/
    movieApi.ts            # Cliente que llama a /api/* (NO a TMDb directo)
    firebase.ts             # Inicializacion de Firebase (auth + firestore)
  styles/
    global.css              # Paleta "Marquesina" (variables CSS por tema)
  theme/
    antdTheme.ts             # lightTheme/darkTheme (ThemeConfig de antd)
  types/
    movies.ts
  constants/
    genres.ts
  main.tsx
api/
  search.ts             # Proxy serverless a /search/movie
  movies.ts             # Proxy serverless multi-endpoint (trending/top_rated/upcoming/discover/credits/videos/recommendations)
firestore.rules
```

## Convenciones

- CSS Modules + variables CSS de tema via atributo `[data-theme]` en el root (`light`/oscuro por defecto).
- Componentes tipados con `React.FC`.
- Toda llamada a datos de peliculas pasa por `src/services/movieApi.ts`, que llama a `/api/*` (nunca directo a `api.themoviedb.org` desde el cliente).
- El proxy serverless (`api/`) es quien tiene el token de TMDb; el cliente nunca lo ve.

## Rutas (src/main.tsx)

- `/` -> `MovieSearch`: home con trending, carruseles por categoria, chips de genero y busqueda.
- `/mi-lista` -> `MyList`: requiere sesion (si no hay login, muestra estado dedicado, no redirige).
- `/lista/:shareSlug` -> `PublicList`: lectura publica sin login, via `shareSlug`.

Jerarquia de providers: `ThemeProvider` > `AuthProvider` > `FilmIntro` (overlay, una vez por sesion) + `BrowserRouter` con `Header` fijo arriba y `Footer` abajo.

## api/ (Vercel Serverless Functions)

Node runtime, sin `@vercel/node` instalado (tipos de `req`/`res` como `any`).

- `api/search.ts`: proxy a `/search/movie`. Valida `query` no vacio y <=200 caracteres, `page` entre 1 y 1000.
- `api/movies.ts`: proxy multi-endpoint via query param `type`:
  - `trending` -> `trending/movie/day`
  - `top_rated`
  - `upcoming` -> `movie/{type}`
  - `discover` -> requiere `genre_id` + `sort_by` validado contra whitelist (`popularity.desc`, `vote_average.desc`, `primary_release_date.desc`)
  - `credits` / `videos` / `recommendations` -> requieren `id` de pelicula

El token `TMDB_API_TOKEN` es SOLO server-side (nunca con prefijo `VITE_`, nunca llega al bundle cliente). Ambos endpoints devuelven 500 si falta el token, 400 si los parametros son invalidos, 502 si falla el fetch a TMDb.

## Firebase / Firestore

- **Auth**: Google via `signInWithRedirect` (NO popup). `AuthProvider` tiene una unica suscripcion centralizada a `onAuthStateChanged` + resuelve `getRedirectResult` al montar; expone `{ user, loading }` via `AuthContext`/`useAuth`.
- **Modelo de datos real**: coleccion `lists/{listId}` donde `listId` = uid del dueño (una lista por usuario, resuelta/creada via transaccion en `useMyList.ts` con `runTransaction` para evitar duplicados en carreras).
  - Campos del doc: `ownerId, title, isPublic, shareSlug, createdAt`.
  - `shareSlug` es un CAMPO (generado con `crypto.randomUUID().slice(0, 8)`), NO es el id del documento.
  - Subcoleccion `lists/{listId}/items/{itemId}` con campos `movieId, movieTitle, posterPath, addedAt`.
- `PublicList.tsx` lee la lista compartida con un QUERY (`where('shareSlug', '==', slug) AND where('isPublic', '==', true)`) sobre toda la coleccion `lists`, sin login, sin depender del id de doc.
- `firestore.rules`: el dueño (`auth.uid == listId`) puede leer/crear/actualizar su propio doc pero NUNCA borrarlo (`allow delete: if false`); lectura publica si `isPublic == true`. El orden de las condiciones en `allow read` importa: se evalua primero la del dueño porque no toca `resource`, evitando error en la primera visita cuando el doc aun no existe. La subcoleccion `items` usa el mismo esquema, delegando la lectura publica en el doc padre via `get()`.

## Componentes clave (estado real actual)

- **Header**: fijo (`position: fixed`, `#root` tiene `padding-top: 64px` para compensar). Logo/titulo clickeable a `/`. Boton "Mi lista" SIEMPRE visible (no condicional a sesion). Incluye `AuthButton` y toggle de tema (`BulbOutlined`/`BulbFilled`).
- **Footer**: marca + atribucion a TMDb (link) + año dinamico.
- **MovieCarousel**: scroll horizontal real con handler de `wheel` (`e.preventDefault()` + `scrollBy`), flechas izquierda/derecha que desplazan por el ancho de 3 items, fade visual en el borde, se oculta si `movies.length === 0`. Soporta `readOnly`, `authRequired`, `highlighted`, `isSaving`.
- **MovieCard / MovieDetail**: card con boton de favorito (`FavoriteButton`, corazon) y modal de detalle.
- **FilmIntro**: overlay de celuloide (grano + vineta + animacion). Se muestra UNA VEZ por sesion via `sessionStorage` (key `film-intro-shown`) + guard a nivel de modulo para evitar remounts dobles. Respeta `prefers-reduced-motion`. Se puede saltar con click/Enter/Espacio/Escape.
- **GenreChips**: multi-select de generos como chips tipo boton con `aria-pressed` (no un `Select` de antd), mas un `Segmented` de antd para ordenar (Popularidad / Mejor valoradas / Mas recientes), mapeado a `sort_by` de TMDb.
- **MyList**: sin sesion muestra un estado dedicado (flecha para volver + mensaje "Inicia sesion para ver tu lista" + `AuthButton`), NO redirige. Con sesion muestra grilla real (`Row`/`Col` de antd) con toggle publica/privada (`Switch` de antd) + input readonly con el link + boton copiar (usa `navigator.clipboard`).
- **PublicList**: lectura publica sin login, muestra la grilla de la lista + una seccion de recomendaciones (`MovieCarousel` con `getMovieRecommendations` basado en la primera pelicula de la lista).
- **AuthButton**: boton de login/logout con Google.

## Paleta "Marquesina" (src/styles/global.css)

**Modo oscuro** (`:root`, por defecto) - ciruela profundo + ambar dorado:

| Variable | Valor |
|---|---|
| `--bg-primary` | `#1a0e1e` |
| `--panel-bg` | `rgba(43, 23, 48, 0.6)` |
| `--text-main` | `#f6efe4` |
| `--text-muted` | `rgba(246, 239, 228, 0.72)` |
| `--accent` | `#e8a23a` |
| `--accent-hover` | `#f0b859` |
| `--accent-secondary` | `#5a2a4d` |
| `--accent-text-on` | `#1a0e1e` (texto oscuro sobre acento ambar, ratio de contraste ~8.9:1, AA) |

Ademas: `--panel-border`, `--shadow`, `--overlay-scrim`, `--grain-opacity: 0.035`, `--drift-duration: 60s`, `--film-bg`, `--film-hole`.

**Modo claro** (`[data-theme='light']`, "pergamino/sepia"):

| Variable | Valor |
|---|---|
| `--bg-primary` | `#e8dcc3` |
| `--panel-bg` | `rgba(218, 203, 168, 0.55)` |
| `--text-main` | `#3d2b1f` |
| `--text-muted` | `rgba(61, 43, 31, 0.66)` |
| `--accent` | `#cf8a22` |
| `--accent-hover` | `#b5761a` |
| `--accent-secondary` | `#5a2a4d` (igual que oscuro) |
| `--accent-text-on` | `#3d2b1f` |

Fuentes: `Playfair Display` (`--font-display`, titulos) + `Inter` (body). Fondo con imagen (`assets/img/fondo.jpg`) + gradiente + grano SVG animado (respeta `prefers-reduced-motion`). Foco de teclado: anillo ambar consistente via `:focus-visible`.

`src/theme/antdTheme.ts` exporta `lightTheme`/`darkTheme` (ThemeConfig de antd), con tokens de color/radius/shadow por modo, y theming custom del componente `Segmented` (`trackBg`/`itemSelectedBg`/`itemColor`/`itemHoverColor`/`itemSelectedColor` usando las variables CSS de arriba) porque sin eso caia al gris del algoritmo default de antd en vez de la paleta Marquesina.

## Variables de entorno

Ver `.env.example`:

- `TMDB_API_TOKEN` (SIN prefijo `VITE_` - solo server-side, usado por `api/`).
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` (config publica de Firebase, expuesta al cliente por diseño).

## Subagentes disponibles (.claude/agents/*.md)

| Agente | Cuando usarlo | Playwright |
|---|---|---|
| `ux-color-designer` | Paleta, tipografia, layout, estados vacios/carga/error, contraste. Antes de que `frontend-implementer` construya UI nueva. | Si |
| `frontend-implementer` | Features nuevas o cambios de componentes. | Si |
| `security-auditor` | Cualquier diff que toque `api/`, `.env*`, `services/`, dependencias nuevas. | No (solo Read/Grep/Glob/Edit/Bash) |
| `qa-build-reviewer` | Verificacion final (build/lint/accesibilidad/responsive), siempre al final. | Si (ademas `browser_evaluate`) |
| `orchestrator` | Coordina los anteriores para tareas multi-capa. | - |

## Documentacion relacionada

- `README.md`: descripcion, arquitectura y como correr el proyecto localmente.
- `INSTRUCCIONES_USO.md`: guia rapida de uso diario.
- `MIGRATION.md`: detalles de la migracion de JavaScript a TypeScript (historico).
