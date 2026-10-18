import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    slug: 'proyecto-audiovisual',
    title: 'Proyecto audiovisual',
    category: 'Video',
    media: 'video',
    year: 2026,
    cover: '/media/projects/lorem-ipsum.webp',
    description: 'Pieza audiovisual pendiente de publicación.',
    published: false,
  },
  {
    slug: 'serie-fotografica',
    title: 'Serie fotográfica',
    category: 'Fotografía',
    media: 'photo',
    year: 2026,
    cover: '/media/projects/dolor-sit.webp',
    description: 'Serie fotográfica pendiente de publicación.',
    published: false,
  },
];
