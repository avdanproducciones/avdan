import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../types/project';

interface ProjectCarouselProps {
  projects: Project[];
}

interface ProjectCategory {
  name: string;
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [direction, setDirection] = useState<'next' | 'previous'>('next');
  const publishedProjects = projects.filter((project) => project.published);
  const sourceProjects = publishedProjects.length > 0 ? publishedProjects : projects;
  const categories = sourceProjects.reduce<ProjectCategory[]>((result, project) => {
    const existingCategory = result.find((category) => category.name === project.category);

    if (existingCategory) {
      existingCategory.projects.push(project);
    } else {
      result.push({ name: project.category, projects: [project] });
    }

    return result;
  }, []);
  const demoCategoryNames = ['Video', 'Fotografía', 'Campañas', 'Matrimonios', 'Editorial'];

  if (publishedProjects.length === 0) {
    demoCategoryNames.forEach((name) => {
      if (!categories.some((category) => category.name === name)) {
        categories.push({
          name,
          projects: [{
            slug: `demo-${name.toLowerCase()}`,
            title: `Proyecto ${name.toLowerCase()}`,
            category: name,
            media: name === 'Video' ? 'video' : 'photo',
            cover: '',
            description: `Previsualización de la categoría ${name.toLowerCase()}.`,
            published: false,
          }],
        });
      }
    });
  }

  useEffect(() => {
    if (!selectedCategory) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedCategory(null);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedCategory]);

  if (categories.length === 0) {
    return (
      <div className="carousel-empty" role="status">
        <p className="empty-title">Estamos preparando una selección de categorías para compartir contigo.</p>
      </div>
    );
  }

  const visibleCategories = categories.slice(0, Math.min(3, categories.length)).map((_, offset) => {
    return categories[(startIndex + offset) % categories.length];
  });

  const showPrevious = () => {
    setDirection('previous');
    setStartIndex((index) => (index - 1 + categories.length) % categories.length);
  };

  const showNext = () => {
    setDirection('next');
    setStartIndex((index) => (index + 1) % categories.length);
  };

  return (
    <>
      <div className={`carousel carousel--categories carousel--${direction}`} aria-label="Categorías de trabajos">
        <button className="carousel__control carousel__control--previous" type="button" onClick={showPrevious} aria-label="Categoría anterior">
          <span aria-hidden="true">‹</span>
        </button>
        <div className="carousel__track">
          {visibleCategories.map((category) => (
            <button
              className="category-card"
              type="button"
              key={category.name}
              onClick={() => setSelectedCategory(category)}
              aria-label={`Abrir galería de ${category.name}`}
            >
              <span className="category-card__preview" aria-hidden="true">
                <span>+</span>
              </span>
            </button>
          ))}
        </div>
        <button className="carousel__control carousel__control--next" type="button" onClick={showNext} aria-label="Siguiente categoría">
          <span aria-hidden="true">›</span>
        </button>
        <p className="carousel__counter" aria-live="polite">
          {startIndex + 1} / {categories.length}
        </p>
      </div>

      {selectedCategory && typeof document !== 'undefined' && createPortal(
        <div className="category-dialog" role="dialog" aria-modal="true" aria-labelledby="category-dialog-title" onClick={() => setSelectedCategory(null)}>
          <div className="category-dialog__content" onClick={(event) => event.stopPropagation()}>
            <header className="category-dialog__header">
              <h3 id="category-dialog-title">{selectedCategory.name}</h3>
              <button className="category-dialog__close" type="button" onClick={() => setSelectedCategory(null)} aria-label="Cerrar galería">
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <div className="category-dialog__gallery">
              {Array.from({ length: Math.max(5, selectedCategory.projects.length) }).map((_, index) => (
                <div className="category-dialog__placeholder" key={`${selectedCategory.name}-${index}`} aria-hidden="true">
                  <span>+</span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
