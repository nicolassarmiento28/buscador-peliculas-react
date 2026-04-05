# Instrucciones de Uso - Buscador de Peliculas

Guia rapida para ejecutar y usar la aplicacion.

## Inicio rapido

1. Instala dependencias (solo la primera vez):

```bash
npm install
```

2. Inicia el servidor de desarrollo:

```bash
npm run dev
```

3. Abre en tu navegador:

`http://localhost:5173/`

## Configuracion minima

En `.env.local` debes tener un token valido de TMDb:

```env
VITE_TMDB_API_TOKEN=tu_token_aqui
```

## Uso de la app

1. Escribe el nombre de una pelicula en el buscador.
2. Presiona Enter o el boton Buscar.
3. Revisa resultados en tarjetas.
4. Cambia tema claro/oscuro con el boton de la esquina superior derecha.

## Comandos utiles

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
npm run format:check
```

## Problemas comunes

- Puerto ocupado:

```bash
npm run dev -- --port 3000
```

- Error de API: verifica `VITE_TMDB_API_TOKEN` en `.env.local`.

## Documentacion

- `README.md`: documentacion principal del proyecto (stack, estructura, notas tecnicas).
- `MIGRATION.md`: cambios realizados durante la migracion a TypeScript.
