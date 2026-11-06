# AVDAN

Sitio web estático para AVDAN, desarrollado con Astro, TypeScript y React.

## Páginas

- Portafolio
- Servicios
- Acerca de
- Contacto

## Tecnologías

- Astro
- TypeScript
- React
- npm

## Tipografías

El sitio usa Akira Expanded para titulares y Montserrat para texto. Montserrat se sirve localmente desde `public/fonts/` y se distribuye bajo la licencia incluida en `public/fonts/montserrat-OFL.txt`.

## Requisitos

- Node.js `22.22.0` o superior
- npm `9.6.5` o superior

## Instalación

```powershell
npm install
```

## Comandos

Iniciar el servidor de desarrollo:

```powershell
npm run dev
```

Comprobar el proyecto:

```powershell
npm run check
```

Generar la compilación:

```powershell
npm run build
```

Previsualizar la compilación:

```powershell
npm run preview
```

## Estructura

```text
src/
├── components/   Componentes de la interfaz
├── data/         Datos de los proyectos
├── layouts/      Layout compartido
├── pages/        Páginas del sitio
├── styles/       Estilos globales
└── types/        Tipos de TypeScript
```
