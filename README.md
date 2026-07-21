# CineList

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-6-0170FE?logo=antdesign&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black)

Aplicacion web para descubrir y buscar peliculas usando la API de TMDb (The
Movie Database). Permite explorar tendencias y catalogo por genero, guardar
favoritos, armar una lista personal y compartirla publicamente, todo con
autenticacion via Google y una interfaz clara/oscura propia.

## Demo

[https://buscador-peliculas-react-ten.vercel.app](https://buscador-peliculas-react-ten.vercel.app)

> El repo interno se llama `buscador-peliculas-react` por razones historicas;
> el nombre de producto es **CineList**. Nota: la URL sin `-ten`
> (`buscador-peliculas-react.vercel.app`) es otro proyecto/deployment viejo
> que **no** corresponde a este codigo base.

![Home modo oscuro](docs/screenshots/home-dark.png)

![Home modo claro](docs/screenshots/home-light.png)

## Caracteristicas

- **Home**: peliculas en tendencia, carruseles por categoria (top valoradas,
  proximos estrenos) y chips de genero con seleccion multiple + orden por
  popularidad, valoracion o fecha (`Segmented` de Ant Design).
- **Busqueda** de peliculas por titulo.
- **Favoritos** por pelicula (icono de corazon).
- **Modal de detalle**: sinopsis, reparto, videos/trailer y recomendaciones.

![Detalle de pelicula](docs/screenshots/detalle-modal.png)

- **Login con Google** via Firebase Auth (`signInWithPopup`, persistencia
  default `browserLocalPersistence`).
- **Lista personal** en `/mi-lista` (requiere sesion; si no hay sesion se
  muestra un estado dedicado, la ruta nunca redirige), con toggle
  publica/privada y link copiable.

  > La captura de abajo muestra `/mi-lista` **sin sesion iniciada** (estado
  > "Inicia sesion para ver tu lista" + boton de Google), no una lista con
  > peliculas guardadas.

  ![Mi lista sin sesion](docs/screenshots/mi-lista.png)

- **Lista publica compartida** en `/lista/:shareSlug`, sin necesidad de
  login, con recomendaciones basadas en la primera pelicula de la lista.

  ![Lista publica compartida](docs/screenshots/lista-publica.png)

- **Tema claro/oscuro** persistido en `localStorage`. La paleta de colores
  interna se llama "Marquesina" (`src/styles/global.css`) — es el nombre
  interno del sistema de diseno, no el nombre del producto.
- Interfaz responsiva construida con Ant Design 6.

## Seguridad

CineList mantiene dos limites de confianza estrictos: el cliente nunca ve el
token de TMDb, y el cliente nunca puede enumerar listas publicas en batch.

### 1. Proxy serverless a TMDb

El cliente **nunca** llama directo a `api.themoviedb.org` ni conoce el
token. Todas las peticiones de peliculas pasan por `src/services/movieApi.ts`
hacia funciones serverless propias:

- `/api/search`: proxy a `/search/movie`. Valida `query` no vacio y <=200
  caracteres, `page` entero entre 1 y 1000.
- `/api/movies`: proxy multi-endpoint via el parametro `type` — `trending`
  (`trending/movie/day`), `top_rated`, `upcoming` (`movie/{type}`),
  `discover` (requiere `genre_id` + `sort_by` validado contra la whitelist
  `['popularity.desc', 'vote_average.desc', 'primary_release_date.desc']`),
  y `credits` / `videos` / `recommendations` (requieren `id` de pelicula).

`TMDB_API_TOKEN` vive solo en `process.env` del lado del servidor, nunca con
prefijo `VITE_`. Ambos endpoints devuelven `400` (parametros invalidos),
`500` (falta el token) o `502` (falla el fetch a TMDb).

### 2. Lectura publica de listas via Firebase Admin SDK

Antes, `PublicList.tsx` hacia un query directo a Firestore desde el cliente
(`where('shareSlug', '==', slug) AND where('isPublic', '==', true)`) sobre
toda la coleccion `lists`. Esto se reemplazo por `api/public-list.ts`, un
endpoint serverless que usa Firebase Admin SDK (`firebase-admin`,
inicializado con `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`,
`FIREBASE_ADMIN_PRIVATE_KEY`) para hacer esa misma consulta del lado del
servidor. Valida `shareSlug` con la regex `^[a-zA-Z0-9_-]{4,64}$` y devuelve
`400` / `404` / `500` / `502` segun corresponda. `movieApi.ts` expone
`getPublicList(shareSlug)`, que llama a `/api/public-list?shareSlug=...` en
vez de tocar Firestore directo.

Esto no es solo mover codigo de un lugar a otro: `firestore.rules` ahora
tiene `allow list: if false;` **explicito** tanto en `lists` como en la
subcoleccion `items`. Un query (`where(...).get()`) desde el cliente web con
el SDK de Firestore queda bloqueado por las reglas mismas, no solo porque el
codigo cliente ya no lo hace. Las reglas son la ultima linea de defensa:
solo permiten `get` (documento puntual por id conocido), nunca
`list`/query de coleccion completa — una query publica sin filtro por id
especifico permitiria enumerar en batch los `shareSlug` de todas las listas
publicas del sistema.

### 3. Reglas de Firestore generales

Coleccion `lists/{listId}` donde `listId === uid` del dueño:

- `allow get`: el dueño (`auth.uid == listId`) **o** publico si
  `resource.data.isPublic == true`. El orden importa: se evalua primero la
  condicion del dueño porque no toca `resource`, evitando un error en la
  primera visita cuando el documento aun no existe (antes de la transaccion
  de creacion en `useMyList.ts`).
- `allow create`: requiere `ownerId == auth.uid`.
- `allow update`: solo el dueño.
- `allow delete: if false`: el documento nunca se puede borrar.

La subcoleccion `items/{itemId}` replica el mismo patron via `get()` al
documento padre.

## Stack

- React 19 + TypeScript 6 + Vite 7 (`@vitejs/plugin-react-swc`)
- Ant Design 6 (UI)
- React Router 7
- Firebase 12 (Auth + Firestore) + Firebase Admin SDK (server-side)
- Funciones serverless en `api/` (Vercel, runtime Node)
- Vitest 4 (`@firebase/rules-unit-testing` para las reglas de Firestore)
- ESLint + Prettier

## Arquitectura

`src/main.tsx` define la jerarquia de la app:

```
StrictMode
  ThemeProvider
    AuthProvider
      FilmIntro (overlay, una vez por sesion)
      BrowserRouter
        Header (fijo)
        Routes
          "/"                 -> MovieSearch (home + busqueda, import directo)
          "/mi-lista"         -> MyList (lazy, requiere sesion)
          "/lista/:shareSlug" -> PublicList (lazy, lectura publica sin login)
        Footer
```

Las llamadas a red del cliente van siempre por `src/services/movieApi.ts`
(hacia `/api/search`, `/api/movies` y `/api/public-list`) o
`src/services/firebase.ts` (Auth y Firestore del propio usuario). Los tipos
de dominio viven en `src/types/movies.ts`.

### Modelo de datos de Firestore

- `lists/{listId}` (`listId` = `uid` del dueño, una lista por usuario,
  resuelta/creada via transaccion en `useMyList.ts` con `runTransaction` para
  evitar duplicados en carreras). Campos: `ownerId`, `title`, `isPublic`,
  `shareSlug` (generado con `crypto.randomUUID().slice(0, 12)`, es un
  **campo**, no el id del documento), `createdAt`.
- `lists/{listId}/items/{itemId}`: `movieId`, `movieTitle`, `posterPath`,
  `addedAt`.

## Instalacion y uso local

```bash
git clone <url-del-repo>
cd buscador-peliculas-react
npm install
```

Copiar `.env.example` a `.env.local` y completar las variables (ver tabla
abajo).

```bash
npm run dev
```

Levanta la app en `http://localhost:5173`.

> **Importante**: `npm run dev` solo levanta Vite (el frontend). Las
> funciones serverless de `api/` (`/api/search`, `/api/movies`,
> `/api/public-list`) **no** corren con ese comando. Para probarlas
> localmente hace falta la Vercel CLI:
>
> ```bash
> npx vercel dev
> ```
>
> o probarlas directamente en un preview deploy de Vercel.

### Variables de entorno

```
TMDB_API_TOKEN=your_token_here

# Firebase Admin SDK (server-side only, SIN prefijo VITE_, usado por
# api/public-list.ts). Generar en Firebase Console > Configuracion del
# proyecto > Cuentas de servicio > Generar nueva clave privada.
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account@your_project_id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

| Variable | Uso |
|---|---|
| `TMDB_API_TOKEN` | Token de TMDb, solo servidor (`api/search.ts`, `api/movies.ts`). Nunca con prefijo `VITE_`. |
| `FIREBASE_ADMIN_PROJECT_ID` | Firebase Admin SDK, solo servidor (`api/public-list.ts`). |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Firebase Admin SDK, solo servidor (`api/public-list.ts`). |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Firebase Admin SDK, solo servidor. Con `\n` literales entre comillas; el codigo hace `.replace(/\\n/g, '\n')` para des-escaparlos. |
| `VITE_FIREBASE_API_KEY` | Config publica de Firebase (cliente). |
| `VITE_FIREBASE_AUTH_DOMAIN` | Config publica de Firebase (cliente). |
| `VITE_FIREBASE_PROJECT_ID` | Config publica de Firebase (cliente). |
| `VITE_FIREBASE_STORAGE_BUCKET` | Config publica de Firebase (cliente). |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Config publica de Firebase (cliente). |
| `VITE_FIREBASE_APP_ID` | Config publica de Firebase (cliente). |

## Scripts disponibles

| Script | Comando | Descripcion |
|---|---|---|
| `npm run dev` | `vite` | Servidor de desarrollo (solo frontend). |
| `npm run build` | `tsc -b && vite build` | Chequeo de tipos + build de produccion. |
| `npm run lint` | `eslint .` | Linteo del proyecto. |
| `npm run preview` | `vite preview` | Sirve el build de produccion localmente. |
| `npm run format` | `prettier --write "src/**/*.{ts,tsx,js,jsx,css}"` | Formatea `src/` con Prettier. |
| `npm run format:check` | `prettier --check "src/**/*.{ts,tsx,js,jsx,css}"` | Verifica formato sin escribir. |
| `npm run test` | `vitest run` | Corre los tests unitarios. |
| `npm run test:rules` | `firebase emulators:exec --only firestore "vitest run --config vitest.rules.config.ts"` | Corre los tests de `firestore.rules` contra el emulador local (requiere Firebase CLI y Java). |

## Estructura de carpetas

```
src/
  assets/            react.svg, no-poster.svg, img/fondo.jpg
  components/
    AuthButton/
    Footer/
    FilmIntro/
    GenreChips/
    Header/
    MovieCard/         MovieCard, MovieDetail, FavoriteButton
    MovieCarousel/
    MovieSearch/        MovieSearch, MovieRows
    MyList/
    PublicList/
  constants/genres.ts
  contexts/            ThemeContext, AuthContext
  hooks/               useTheme, useAuth, useMyList, useFirstListMovieId
  providers/           ThemeProvider, AuthProvider
  services/            movieApi.ts, firebase.ts
  styles/global.css
  theme/antdTheme.ts
  types/movies.ts
  main.tsx
api/
  search.ts
  movies.ts
  public-list.ts
firestore.rules
```

## Subagentes de Claude Code

Este repo incluye configuraciones de subagentes (`.claude/agents/`) para
trabajar con Claude Code:

| Agente | Cuando usarlo |
|---|---|
| `ux-color-designer` | Paletas, tipografia, layout, espaciado, estados vacios/carga/error, contraste. Antes de que `frontend-implementer` construya UI nueva. |
| `frontend-implementer` | Features nuevas o cambios de componentes. |
| `security-auditor` | Cualquier diff que toque `api/`, `.env*`, `services/`, dependencias nuevas. |
| `qa-build-reviewer` | Verificacion final (build/lint/accesibilidad/responsive), siempre al final. |
| `orchestrator` | Coordina a los anteriores para tareas multi-capa. |

