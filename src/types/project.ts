export type ProjectMedia = 'photo' | 'video';

export interface Project {
  slug: string;
  title: string;
  category: string;
  media: ProjectMedia;
  year?: number;
  cover: string;
  description: string;
  images?: string[];
  youtubeId?: string;
  credits?: string[];
  published: boolean;
  preview?: boolean;
}
