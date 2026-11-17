# Optimización del nuevo informe de PageSpeed

Informe: https://pagespeed.web.dev/analysis/https-avdan-bay-vercel-app/kccy5rh5rx?form_factor=mobile

Fecha del informe: 17 de noviembre de 2026, 19:10 (Chile). Las modificaciones están en el proyecto local; no se ha desplegado.

## Resultado y comparación

El informe público marca rendimiento 77, accesibilidad 100, buenas prácticas 96 y SEO 100. Sus métricas son FCP 2,3 s, LCP 3,4 s, TBT 480 ms y CLS 0.

Para comparar el código se ejecutó Lighthouse 13.6.0 con Edge sin interfaz y configuración móvil predeterminada contra la misma vista previa de producción, antes y después de los cambios:

| Indicador | Local antes | Local después |
| --- | ---: | ---: |
| Rendimiento | 95 | 97 |
| Accesibilidad | 100 | 100 |
| Buenas prácticas | 96 | 96 |
| SEO | 100 | 100 |
| FCP | 0,8 s | 0,8 s |
| LCP | 2,9 s | 2,6 s |
| TBT | 0 ms | 0 ms |
| Imágenes locales transferidas | 257.978 bytes | 172.350 bytes |
| Aviso de entrega de imágenes | Ahorro estimado de 5 KiB | Aprobado |

Las imágenes locales transferidas bajaron aproximadamente un 33 %. El resultado local no es una nueva puntuación de PageSpeed en Vercel: varían servidor, red, navegador, CPU y respuestas de YouTube. Una ejecución antes y una después sirven como comprobación local, no como garantía estadística. El costo del video transferido también varía durante la auditoría.

Los informes completos están en `reports/pagespeed-before-new.report.html` y `reports/pagespeed-after-new.report.html`, con sus archivos JSON. Son artefactos locales excluidos de Git.

## Correcciones

- Imágenes: variantes de 360, 400, 480, 640 y 720 px, formatos AVIF y atributos `sizes` ajustados al ancho real. Las portadas de video también tienen tamaños intermedios y AVIF.
- Categorías: miniaturas 4:3 específicas para los tres covers actuales. Se evita descargar áreas que después recorta el CSS. Las fotos originales se mantienen en la ampliación.
- LCP: la portada principal conserva carga inmediata y prioridad alta. La primera fotografía deja de competir con la portada mediante una segunda prioridad alta.
- Autoplay: el primer iframe se activa automáticamente después de decodificar y pintar la portada local. No hay temporizadores de espera artificiales ni detección de Lighthouse. La API de control de YouTube se carga después del iframe; los reproductores secundarios siguen bajo demanda.
- Hilo principal: las actualizaciones de scroll se agrupan en un `requestAnimationFrame` y los observadores de entrada se desconectan al navegar, evitando acumulaciones.
- Composición móvil: se mantiene el grano como textura estática en lugar de una capa animada de tamaño superior a la pantalla. Las entradas de Servicios, la secuencia de la bombilla y los espacios aprobados se conservan.
- Generación reproducible: los tamaños y portadas de categoría se comparten entre generador y componentes mediante `src/data/image-config.json`. El generador reutiliza archivos y limita la concurrencia de codificación.

## Validaciones

- `npm run check`: 0 errores, 0 advertencias y 0 sugerencias.
- `npm run build`: correcto.
- `node scripts/verify-build.mjs`: correcto; comprueba que solo el hero está configurado para autoplay, que permanece silenciado al arrancar y que existen las variantes intermedias de imágenes.
- Vista previa de producción: reproducción automática, botón de sonido, carga secundaria al pulsar, apertura de fotografía original, galería de categorías, navegación a Servicios y regreso al portafolio con autoplay.
- Revisiones a 375 y 1280 px: sin desbordamiento horizontal observado. No se observaron errores de consola en las interacciones comprobadas.

## Límites pendientes

El JavaScript sin usar (532 KiB), CSS sin usar (112 KiB), Roboto sin `font-display` adecuado y las tareas largas señaladas en el informe pertenecen al reproductor de YouTube. El sitio ya sirve sus propias fuentes con `font-display: swap`. Se evita que la inicialización de YouTube compita con la primera pintura, pero su código interno, fuentes y cookies siguen siendo externos.

Se mantiene la reproducción automática solicitada. Por ello permanece el aviso de cookies de YouTube y buenas prácticas sigue en 96 en la prueba local. Eliminar completamente ese costo requeriría volver a cargar el video mediante interacción o cambiar de proveedor de video.

Los avisos adicionales de CSP y Trusted Types requieren una revisión de seguridad independiente; no se añadió una política permisiva para ocultarlos. Las cabeceras de Vercel no se aplican en `astro preview`.

Después del despliegue hay que repetir PageSpeed contra la URL pública para confirmar los resultados de producción.
