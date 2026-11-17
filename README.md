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

`npm run dev` y `npm run build` generan automáticamente fuentes WOFF2 con caracteres latinos y miniaturas adaptables en `public/media/optimized/`. Los originales se conservan para la ampliación. Para regenerarlos manualmente, ejecuta `npm run optimize:media`. Los archivos generados se excluyen de Git y se reutilizan mientras no cambien los originales o el generador.

El video principal carga YouTube al entrar y solicita reproducción automática sin sonido; el botón permite activarlo. Los demás videos se cargan al pulsar reproducir. Las portadas son locales. La CSP con hashes se genera durante la compilación de Astro; verifica siempre con `build` y `preview`.

## Requisitos

- Node.js `22.23.4` o superior
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

Verificar metadatos y recursos generados (después de compilar):

```powershell
node scripts/verify-build.mjs
node scripts/verify-preview.mjs
```

El dominio público está configurado en `astro.config.mjs` y `src/data/site.ts`.
Los builds con `VERCEL_ENV=preview` generan `noindex` y robots restrictivo.
Las cabeceras de `vercel.json` se aplican en Vercel, no en `astro preview`.
Consulta `AUDITORIA.md` para resultados y límites de la revisión.

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
