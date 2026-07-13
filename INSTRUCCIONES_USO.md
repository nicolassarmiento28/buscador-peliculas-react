# Instrucciones de Uso - Buscador de Peliculas

Guia rapida para ejecutar y usar la aplicacion.

## Inicio rapido

1. Instala dependencias (solo la primera vez):

```bash
npm install
```

2. Configura `.env.local` (ver `.env.example`): `TMDB_API_TOKEN` (sin prefijo `VITE_`) y las variables `VITE_FIREBASE_*`.

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre en tu navegador:

`http://localhost:5173/`

Nota: para que funcionen las llamadas a peliculas (`/api/search`, `/api/movies`), que son funciones serverless de Vercel, hace falta correr `vercel dev` en vez de (o ademas de) `npm run dev`.

## Uso de la app

### Explorar y buscar

1. En la home (`/`) veras peliculas en tendencia y carruseles por categoria.
2. Usa los chips de genero para filtrar (podes seleccionar varios a la vez) y el selector de orden (Popularidad / Mejor valoradas / Mas recientes).
3. Escribe el nombre de una pelicula en el buscador para buscar directamente.
4. Click en una pelicula para ver su detalle en un modal.

### Navegar el carrusel

- Pasa el mouse o trackpad sobre una fila de peliculas y usa scroll (rueda) para desplazarte horizontalmente.
- Tambien podes usar las flechas de los bordes izquierdo/derecho; se ocultan o deshabilitan automaticamente segun si hay mas contenido para ese lado.

### Iniciar sesion

1. Click en el boton de login (Google) en el Header o en `AuthButton`.
2. El login se hace por redireccion (te lleva a Google y volves a la app), no por ventana emergente. Si el navegador bloquea popups no afecta este flujo.

### Guardar favoritos

1. Con sesion iniciada, click en el corazon de una tarjeta de pelicula, o en el boton de favorito dentro del modal de detalle.
2. Las peliculas guardadas se agregan a tu lista personal (`/mi-lista`).

### Ver y compartir tu lista

1. Click en "Mi lista" (siempre visible en el Header).
2. Si no iniciaste sesion, veras un mensaje pidiendo login (no te redirige a otra pagina).
3. Con sesion, veras la grilla de tus peliculas guardadas.
4. Usa el switch Publica/Privada para decidir si tu lista es visible para otros.
5. Con la lista en modo Publica, copia el link con el boton de copiar (al lado del campo de link, de solo lectura) y comparti la URL `/lista/<shareSlug>`.
6. Quien reciba el link puede ver la lista sin necesidad de iniciar sesion, junto con recomendaciones relacionadas a la primera pelicula de la lista.

### Cambiar de tema

Usa el boton de bombilla (`BulbOutlined`/`BulbFilled`) en el Header para alternar entre modo oscuro (ciruela + ambar) y modo claro (pergamino/sepia). La preferencia se guarda en `localStorage`.

## Comandos utiles

```bash
npm run dev           # Desarrollo (Vite)
npm run build         # tsc -b && vite build
npm run lint           # Linter
npm run preview        # Preview de la build
npm run format          # Formatea src/
npm run format:check    # Verifica formato
```

## Problemas comunes

- Puerto ocupado:

```bash
npm run dev -- --port 3000
```

- Error al cargar peliculas: verifica `TMDB_API_TOKEN` en `.env.local` (o en Vercel) y que estes corriendo `vercel dev` si necesitas que `/api/*` funcione localmente.
- No podes ver "Mi lista": revisa que hayas iniciado sesion con Google; el boton siempre esta visible pero el contenido requiere sesion.

## Documentacion

- `README.md`: documentacion principal del proyecto (stack, arquitectura, estructura).
- `CLAUDE.md` / `AGENTS.md`: contexto detallado para agentes de codigo.
