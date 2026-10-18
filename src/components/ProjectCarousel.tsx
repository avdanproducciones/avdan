import { useState } from 'react';
import type { Project } from '../types/project';

interface ProjectCarouselProps {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (projects.length === 0) {
    return <p role="status">Lorem ipsum dolor sit amet.</p>;
  }

  const showPrevious = () => {
    setActiveIndex((index) => Math.max(0, index - 1));
  };

  const showNext = () => {
    setActiveIndex((index) => Math.min(projects.length - 1, index + 1));
  };

  return (
    <div className="carousel" aria-label="Selección de proyectos">
      <button type="button" onClick={showPrevious} disabled={activeIndex === 0}>
        Anterior
      </button>
      <article className="carousel__project">
        <span>{projects[activeIndex].category}</span>
        <h3>{projects[activeIndex].title}</h3>
        {projects[activeIndex].year && <span>{projects[activeIndex].year}</span>}
      </article>
      <button type="button" onClick={showNext} disabled={activeIndex === projects.length - 1}>
        Siguiente
      </button>
      <p aria-live="polite">
        {activeIndex + 1} / {projects.length}
      </p>
    </div>
  );
}
