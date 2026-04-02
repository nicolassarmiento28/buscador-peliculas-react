# 🎬 Buscador de Películas - React

Una aplicación web moderna y responsiva para buscar películas usando la API de The Movie Database (TMDb). Construida con React y Vite, con un diseño elegante que soporta tanto modo oscuro como claro.

## ✨ Características Principales

- 🎥 **Búsqueda de películas en tiempo real** - Acceso directo a la base de datos de TMDb
- 🌓 **Modo oscuro y claro** - Toggle entre temas con preferencia guardada en localStorage
- 📱 **Totalmente responsivo** - Optimizado para iPhone, Android, iPad y laptops
- 🎨 **Diseño moderno** - Interfaz glass-morphism con animaciones suaves
- ⚡ **Rendimiento rápido** - Construido con Vite para desarrollo y producción ágil
- 🎯 **Tipografía elegante** - Fuente Inter de Google Fonts
- 📊 **Grid dinámico de resultados** - Las tarjetas se adaptan al tamaño de pantalla

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 14 o superior) - [Descargar](https://nodejs.org/)
- **npm** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## 📦 Instalación y Configuración

### 1. Clonar o descargar el repositorio

```bash
# Si usas Git
git clone <url-del-repositorio>
cd buscador-peliculas-react
```

O descarga el proyecto como ZIP y extrae la carpeta.

### 2. Instalar dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto descargará todas las dependencias necesarias (React, Vite, etc.) en la carpeta `node_modules`.

### 3. Configurar la API de TMDb

El proyecto ya tiene un token de API incluido en el código. Si quieres usar tu propia clave:

1. Ve a [The Movie Database (TMDb)](https://www.themoviedb.org/)
2. Crea una cuenta o inicia sesión
3. Ve a **Settings > API** en tu perfil
4. Copia tu **API Key** o **Access Token (v4)**
5. Abre `src/BuscadorPeliculas.jsx`
6. Reemplaza el valor de `apiToken` con tu clave:

```javascript
const apiToken = "tu-token-aqui";
```

### 4. Colocar la imagen de fondo

La carpeta `src/assets/img/` debe contener un archivo llamado `fondo.jpg` que se usará como fondo. Asegúrate de que esté presente.

## 🎯 Cómo Usar la Aplicación

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

Esto iniciará el servidor local. Verás un mensaje como:

```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Abre `http://localhost:5173/` en tu navegador.

### Buscar películas

1. **Escribe el nombre** de la película en el campo de búsqueda
2. Ejemplo: `Inception`, `The Matrix`, `Avatar`
3. **Haz clic en el botón "Buscar"** o presiona `Enter`
4. Los resultados aparecerán en forma de tarjetas debajo

### Cambiar tema

- Haz clic en el botón con emojis en la **esquina superior derecha**:
  - ☀️ para cambiar a modo claro
  - 🌙 para cambiar a modo oscuro
- Tu preferencia se guarda automáticamente

## 📂 Estructura del Proyecto

```
buscador-peliculas-react/
├── src/
│   ├── assets/
│   │   ├── img/
│   │   │   └── fondo.jpg         # Imagen de fondo
│   │   └── react.svg             # Logo de React
│   ├── styles/
│   │   └── movieSearch.css       # Estilos principales
│   ├── BuscadorPeliculas.jsx     # Componente principal
│   └── main.jsx                  # Punto de entrada
├── index.html                    # HTML principal
├── package.json                  # Dependencias del proyecto
├── vite.config.js               # Configuración de Vite
└── README.md                     # Este archivo
```

### Descripción de archivos clave:

- **`src/BuscadorPeliculas.jsx`** - Componente React que maneja:
  - Estado de búsqueda
  - Llamadas a la API de TMDb
  - Lógica de cambio de tema
  - Renderizado de resultados

- **`src/styles/movieSearch.css`** - Estilos con:
  - Variables CSS para dark/light mode
  - Media queries para responsividad
  - Animaciones y transiciones
  - Glass-morphism effects

- **`src/main.jsx`** - Importa el CSS y monta el componente en el DOM

## 🔧 Detalles Técnicos

### Stack tecnológico

| Tecnología | Propósito |
|-----------|----------|
| **React 18** | Framework de UI |
| **Vite** | Bundler y servidor de desarrollo |
| **The Movie Database API** | Fuente de datos de películas |
| **CSS3** | Estilos y animaciones |
| **localStorage** | Persistencia de preferencias |

### Hooks de React utilizados

- **`useState`** - Para gestionar:
  - Texto de búsqueda
  - Resultados de películas
  - Tema actual (dark/light)

- **`useEffect`** - Para:
  - Cargar preferencia de tema al montar
  - Actualizar el atributo `data-theme` en el documento

### Endpoint de API utilizado

```
GET https://api.themoviedb.org/3/search/movie?query={query}
```

Headers requeridos:
```javascript
{
  Authorization: `Bearer ${apiToken}`,
  "Content-Type": "application/json;charset=utf-8"
}
```

## 📱 Responsive Design

El proyecto está optimizado para las siguientes pantallas:

| Dispositivo | Ancho | Breakpoint |
|-----------|-------|-----------|
| **Móvil pequeño** | < 380px | Custom |
| **Móvil estándar** | 380px - 600px | `@media (max-width: 600px)` |
| **Tablet** | 768px - 1024px | `@media (min-width: 768px)` |
| **Laptop** | > 1025px | `@media (min-width: 1025px)` |

## 🎨 Features de Estilo

### Dark Mode (Defecto)
- Panel background: `rgba(10, 12, 20, 0.72)`
- Texto principal: `#f5f7fb`
- Acento: `#7c5cff` (púrpura)

### Light Mode
- Panel background: `rgba(255, 255, 255, 0.85)`
- Texto principal: `#1a1a2e` (oscuro)
- Acento: `#6c5ce7` (púrpura más suave)

### Componentes principales
- **Input de búsqueda** - Blur glass effect con focus animado
- **Botón Buscar** - Gradiente y sombra dinámica
- **Cards de películas** - Efecto hover con elevación
- **Toggle de tema** - Botón flotante en esquina con iconos emoji

## 🚨 Solución de Problemas

### "API Key inválida"
- Verifica que el token en `BuscadorPeliculas.jsx` sea correcto
- Si la API requiere autenticación Bearer, asegúrate de usar `Authorization: Bearer token`

### "La imagen de fondo no se ve"
- Comprueba que `src/assets/img/fondo.jpg` exista
- Verifica que la ruta en CSS sea: `url("../assets/img/fondo.jpg")`
- Intenta recargar el navegador (Ctrl + F5)

### "No se renderiza nada"
- Abre la consola del navegador (`F12` > `Console`)
- Busca errores de JavaScript
- Comprueba que `main.jsx` tenga un elemento con `id="root"` en `index.html`

### "El tema no se guarda"
- Verifica que localStorage esté habilitado en tu navegador
- Intenta abrir la app en una ventana privada/incógnito para resetear

### "El puerto 5173 ya está en uso"
Ejecuta:
```bash
npm run dev -- --port 3000
```
Luego abre `http://localhost:3000/`

## 📦 Compilar para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Esto generará una carpeta `dist/` con archivos optimizados y minificados listos para desplegar en servidores como Vercel, Netlify o GitHub Pages.

Para previsualizar la build localmente:

```bash
npm run preview
```

## 🔄 Flujo de la Aplicación

```
Usuario escribe película
        ↓
Presiona Enter o haz clic en Buscar
        ↓
Se envía petición GET a TMDb API
        ↓
API devuelve array de películas
        ↓
React renderiza tarjetas con:
  - Imagen (poster)
  - Título
  - Descripción
        ↓
Usuario puede:
  - Ver detalles en las tarjetas
  - Cambiar tema
  - Buscar otra película
```

## 📚 Scripts disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Previsualizar build
npm run preview

# Linter (si está configurado)
npm run lint
```

## 🤝 Contribuir

Para mejorar la aplicación, puedes:

1. Agregar filtros por género, año, calificación
2. Mostrar más detalles de las películas (actores, duración)
3. Agregar favoritos/watchlist
4. Implementar paginación
5. Mejorar estilos y animaciones

## 📄 Licencia

Este proyecto usa la API de The Movie Database (TMDb) bajo sus términos de servicio.

## 🎓 Conceptos de React Aplicados

- Componentes funcionales
- Hooks (useState, useEffect)
- Estado y props
- Renderizado condicional
- Listas y keys
- Event handling
- Local Storage
- Async/Await
- Manejo de errores

## 💡 Consejos de Uso

- Usa nombres completos o parciales de películas
- Prueba con títulos en inglés para mejores resultados
- El dark mode es más cómodo para la noche
- Las cards tienen efecto hover, pruébalo con el ratón
- En móvil, el botón de tema está en la parte superior derecha

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la consola del navegador (`F12 > Console`) para mensajes de error
2. Comprueba la conexión a internet
3. Verifica que la API de TMDb esté disponible en [status.themoviedb.org](https://status.themoviedb.org/)

---

**¡Disfruta buscando tus películas favoritas!** 🍿🎬
