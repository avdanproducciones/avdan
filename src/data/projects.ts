import type { Project } from '../types/project';

const photo = (category: string, slug: string, title: string, file: string): Project => ({
  slug,
  title,
  category,
  media: 'photo',
  year: 2026,
  cover: `/media/projects/${file}.webp`,
  description: title,
  published: true,
});

export const projects: Project[] = [
  photo('Matrimonios', 'matrimonio-iglesia', 'Ceremonia en la iglesia', 'matrimonio-iglesia-79'),
  photo('Matrimonios', 'matrimonio-costa', 'Baile frente al mar', 'matrimonios-02'),
  photo('Matrimonios', 'matrimonio-retrato-mar', 'Retrato junto al mar', 'matrimonios-03'),
  photo('Matrimonios', 'matrimonio-brindis', 'Brindis de los novios', 'matrimonios-04'),
  photo('Matrimonios', 'matrimonio-jardin', 'Entrada por el jardín', 'matrimonios-05'),
  photo('Matrimonios', 'matrimonio-altar', 'Novios ante el altar', 'matrimonios-06'),
  photo('Matrimonios', 'matrimonio-civil', 'Matrimonio civil', 'matrimonios-07'),
  photo('Matrimonios', 'matrimonio-salida', 'Salida de los novios', 'matrimonios-08'),
  photo('Matrimonios', 'matrimonio-abrazo', 'Abrazo de la celebración', 'matrimonios-09'),
  photo('Matrimonios', 'matrimonio-novia', 'Retrato de la novia', 'matrimonios-10'),
  photo('Matrimonios', 'matrimonio-anillos', 'Detalle de los anillos', 'matrimonios-11'),
  photo('Matrimonios', 'matrimonio-ramo', 'Ramo de tulipanes', 'matrimonios-12'),

  photo('Conciertos', 'concierto-bajista', 'Bajista en escena', 'conciertos-01'),
  photo('Conciertos', 'concierto-escenario', 'Banda en el escenario', 'conciertos-02'),
  photo('Conciertos', 'concierto-percusion', 'Percusión en vivo', 'conciertos-03'),
  photo('Conciertos', 'concierto-saxofon', 'Saxofón y voz', 'conciertos-04'),
  photo('Conciertos', 'concierto-ensamble', 'Ensamble completo', 'conciertos-05'),
  photo('Conciertos', 'concierto-cantante', 'Cantante en escena', 'conciertos-06'),
  photo('Conciertos', 'concierto-acordeon', 'Acordeón en vivo', 'conciertos-07'),
  photo('Conciertos', 'concierto-voz', 'Voz bajo las luces', 'conciertos-08'),
  photo('Conciertos', 'concierto-baile', 'Artista en el escenario', 'conciertos-09'),

  photo('Orquesta', 'orquesta-vientos', 'Sección de vientos', 'orquesta-01'),
  photo('Orquesta', 'orquesta-concierto', 'Concierto sinfónico', 'orquesta-02'),
  photo('Orquesta', 'orquesta-publico', 'Orquesta y público', 'orquesta-03'),
  photo('Orquesta', 'orquesta-cellos', 'Sección de cellos', 'orquesta-04'),

  photo('Festivales', 'festival-escenario', 'Festival frente al muelle', 'festivales-01'),
  photo('Festivales', 'festival-multitud', 'Celebración en la caleta', 'festivales-02'),
  photo('Festivales', 'festival-procesion', 'Procesión de la fiesta', 'festivales-03'),
  photo('Festivales', 'festival-botes', 'Botes y banderas', 'festivales-04'),
  photo('Festivales', 'festival-gastronomico', 'Festival gastronómico', 'festivales-05'),
  photo('Festivales', 'festival-personajes', 'Personajes en la fiesta', 'festivales-06'),
  photo('Festivales', 'festival-carnaval', 'Carnaval al aire libre', 'festivales-07'),
  photo('Festivales', 'festival-noche', 'Noche de fiesta popular', 'festivales-08'),

  photo('Invierno en escena', 'danza-acrobata', 'Acrobacia aérea', 'danza-01'),
  photo('Invierno en escena', 'danza-aro', 'Rueda alemana', 'danza-02'),
  photo('Invierno en escena', 'danza-grupo', 'Coreografía grupal', 'danza-03'),
  photo('Invierno en escena', 'danza-baile', 'Baile en pareja', 'danza-04'),
  photo('Invierno en escena', 'danza-patines', 'Danza sobre patines', 'danza-05'),
  photo('Invierno en escena', 'danza-flamenco', 'Falda en movimiento', 'danza-06'),
];
