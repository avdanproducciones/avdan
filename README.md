# AVDAN

Portafolio web para AVDAN, una marca audiovisual orientada a presentar trabajos,
servicios y datos de contacto en una experiencia visual clara, moderna y
responsiva.

El proyecto está construido como un sitio estático con Astro, TypeScript y
componentes React puntuales. Esta arquitectura prioriza rendimiento,
accesibilidad, mantenimiento sencillo y un despliegue de bajo costo. React se
utiliza únicamente en las interfaces que necesitan interacción, como el
carrusel de proyectos.

## Funcionalidades actuales

- Página principal de portafolio.
- Carrusel interactivo de proyectos.
- Vista de servicios.
- Vista sobre AVDAN.
- Vista de contacto.
- Navegación compartida entre páginas.
- Diseño responsive para escritorio y dispositivos móviles.
- Modelo tipado para organizar los proyectos audiovisuales.
- Generación de páginas estáticas listas para desplegar.

El contenido del portafolio todavía utiliza datos provisionales y proyectos no
publicados. Los recursos reales se incorporarán cuando estén disponibles las
autorizaciones, imágenes, textos e identificadores audiovisuales definitivos.

## Tecnologías

- [Astro](https://astro.build/) para la estructura de páginas y generación
  estática.
- [TypeScript](https://www.typescriptlang.org/) para el tipado del proyecto.
- [React](https://react.dev/) para componentes interactivos puntuales.
- npm para la gestión de dependencias y scripts.

## Requisitos

- Node.js `22.22.0` o superior.
- npm `9.6.5` o superior.

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```powershell
git clone <URL_DEL_REPOSITORIO>
cd avdan
```

Instala las dependencias:

```powershell
npm install
```

## Desarrollo local

Inicia el servidor de desarrollo:

```powershell
npm run dev
```

Después, abre la URL indicada por Astro, normalmente
`http://localhost:4321`.

## Validación y construcción

Comprueba los diagnósticos de Astro y TypeScript:

```powershell
npm run check
```

Genera la versión estática de producción:

```powershell
npm run build
```

Para revisar localmente la compilación generada:

```powershell
npm run preview
```

## Estructura principal

```text
src/
├── components/   Componentes reutilizables, incluyendo el carrusel React
├── data/         Datos provisionales de proyectos
├── layouts/      Layout compartido y navegación
├── pages/        Rutas de la aplicación Astro
├── styles/       Estilos globales
└── types/        Modelos TypeScript
```

La carpeta `recursos/` contiene material de trabajo, documentación y
prototipos privados. Está excluida mediante `.gitignore` y no debe subirse al
repositorio público.

## Estado del proyecto

La base técnica de Astro, TypeScript y React está preparada. El siguiente
trabajo consiste en trasladar completamente el mockup aprobado a las páginas
reales, reemplazar los contenidos provisionales e incorporar el material
definitivo del cliente.

## Despliegue previsto

El despliegue previsto es mediante Cloudflare Pages a partir de la salida
estática generada por Astro. El repositorio no almacena videos originales ni
material audiovisual pesado; esos archivos se mantienen en un repositorio
externo como Google Drive y se enlazarán o integrarán cuando corresponda.
