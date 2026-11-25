export const site = {
  url: 'https://avdan-bay.vercel.app',
  name: 'AVDAN Producciones',
  image: '/media/projects/seleccion-01.webp',
};

export const pageDescriptions: Record<string, string> = {
  '/': 'Portafolio de AVDAN Producciones: fotografía y producción audiovisual para eventos, matrimonios y sesiones fotográficas.',
  '/servicios/': 'Conoce los servicios de fotografía y producción audiovisual de AVDAN para eventos, matrimonios y sesiones fotográficas.',
  '/sobre/': 'Conoce AVDAN Producciones y nuestra forma de dar vida a tus ideas a través de la fotografía y la producción audiovisual.',
  '/contacto/': 'Cuéntanos tu proyecto. Contacta a AVDAN Producciones por correo, WhatsApp o nuestras redes sociales.',
  '/policy/': 'Consulta la política de privacidad y las condiciones generales de los servicios de AVDAN Producciones.',
};

export const isPreview = import.meta.env.VERCEL_ENV === 'preview';
