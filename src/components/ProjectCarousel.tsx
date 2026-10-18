import { useState } from 'react';
import type { Project } from '../types/project';

interface ProjectCarouselProps {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const publishedProjects = projects.filter((project) => project.published);

  if (publishedProjects.length === 0) {
    return (
      <div className="carousel-empty" role="status">
        <p className="empty-title">Estamos preparando una selección de proyectos para compartir contigo.</p>
      </div>
    );
  }

  const showPrevious = () => {
    setActiveIndex((index) => Math.max(0, index - 1));
  };

  const showNext = () => {
    setActiveIndex((index) => Math.min(publishedProjects.length - 1, index + 1));
  };

  return (
    <div className="carousel" aria-label="Selección de proyectos">
      <button className="carousel__control" type="button" onClick={showPrevious} disabled={activeIndex === 0} aria-label="Proyecto anterior">
        <span aria-hidden="true">←</span>
      </button>
      <article className="carousel__project">
        <div className="carousel__visual" aria-hidden="true">
          <span>{publishedProjects[activeIndex].media === 'video' ? 'PLAY' : 'AVDAN'}</span>
        </div>
        <div className="carousel__details">
          <span>{publishedProjects[activeIndex].category}</span>
          <h3>{publishedProjects[activeIndex].title}</h3>
          {publishedProjects[activeIndex].year && <span>{publishedProjects[activeIndex].year}</span>}
        </div>
      </article>
      <button className="carousel__control" type="button" onClick={showNext} disabled={activeIndex === publishedProjects.length - 1} aria-label="Siguiente proyecto">
        <span aria-hidden="true">→</span>
      </button>
      <p className="carousel__counter" aria-live="polite">
        {activeIndex + 1} / {publishedProjects.length}
      </p>
    </div>
  );
}
