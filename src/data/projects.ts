import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    slug: 'lorem-ipsum',
    title: 'Lorem ipsum',
    category: 'Video',
    media: 'video',
    year: 2026,
    cover: '/media/projects/lorem-ipsum.webp',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    published: false,
  },
  {
    slug: 'dolor-sit',
    title: 'Dolor sit amet',
    category: 'Fotografía',
    media: 'photo',
    year: 2026,
    cover: '/media/projects/dolor-sit.webp',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    published: false,
  },
];
