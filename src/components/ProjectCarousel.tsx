import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project, ProjectMedia } from '../types/project';
import { attachZoom } from '../scripts/zoom';

interface ProjectCarouselProps {
  projects: Project[];
}

interface GalleryItem {
  id: string;
  title: string;
  media: ProjectMedia;
  src?: string;
}

interface ProjectCategory {
  name: string;
  items: GalleryItem[];
}

const DEMO_CATEGORIES: Array<{ name: string; media: ProjectMedia }> = [
  { name: 'Video', media: 'video' },
  { name: 'Fotografía', media: 'photo' },
  { name: 'Campañas', media: 'video' },
  { name: 'Matrimonios', media: 'photo' },
  { name: 'Editorial', media: 'photo' },
];
const DEMO_ITEMS_PER_CATEGORY = 6;
const WEDDING_IMAGE = '/media/projects/matrimonio-iglesia-79.webp';

const buildCategories = (projects: Project[]): ProjectCategory[] => {
  const published = projects.filter((project) => project.published);

  if (published.length > 0) {
    return published.reduce<ProjectCategory[]>((result, project) => {
      const item: GalleryItem = { id: project.slug, title: project.title, media: project.media, src: project.cover || undefined };
      const existing = result.find((category) => category.name === project.category);

      if (existing) existing.items.push(item);
      else result.push({ name: project.category, items: [item] });

      return result;
    }, []);
  }

  return DEMO_CATEGORIES.map(({ name, media }) => ({
    name,
    items: Array.from({ length: DEMO_ITEMS_PER_CATEGORY }, (_, index) => {
      const isWedding = name === 'Matrimonios' && index === 0;
      return {
        id: `demo-${name.toLowerCase()}-${index}`,
        title: isWedding ? 'Matrimonio en iglesia' : `${name} ${index + 1}`,
        media: isWedding ? 'photo' : media,
        src: isWedding ? WEDDING_IMAGE : undefined,
      };
    }),
  }));
};

function ZoomImage({ src, alt, onOutside }: { src: string; alt: string; onOutside: () => void }) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => (frameRef.current ? attachZoom(frameRef.current, onOutside) : undefined), []);

  return (
    <div className="zoom-frame" ref={frameRef}>
      <img src={src} alt={alt} />
    </div>
  );
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [direction, setDirection] = useState<'next' | 'previous'>('next');
  const categories = buildCategories(projects);

  useEffect(() => {
    if (!selectedCategory) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (!selectedItem) return;
        const items = selectedCategory.items;
        const step = event.key === 'ArrowRight' ? 1 : -1;
        const current = items.findIndex((item) => item.id === selectedItem.id);
        setSelectedItem(items[(current + step + items.length) % items.length]);
        return;
      }
      if (event.key !== 'Escape') return;
      if (selectedItem) setSelectedItem(null);
      else setSelectedCategory(null);
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedCategory, selectedItem]);

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

  const moveItem = (step: number) => {
    if (!selectedCategory || !selectedItem) return;
    const items = selectedCategory.items;
    const current = items.findIndex((item) => item.id === selectedItem.id);
    setSelectedItem(items[(current + step + items.length) % items.length]);
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
              <span className="category-card__name">{category.name}</span>
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
              <button className="category-dialog__close" type="button" onClick={() => { setSelectedItem(null); setSelectedCategory(null); }} aria-label="Cerrar galería">
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <div className="category-dialog__gallery">
              {selectedCategory.items.map((item) => (
                <button className="category-dialog__item" type="button" key={item.id} onClick={() => setSelectedItem(item)} aria-label={`Abrir ${item.title}`}>
                  <span className="category-dialog__placeholder" aria-hidden="true">
                    {item.src ? <img src={item.src} alt="" /> : <span>+</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}

      {selectedItem && selectedCategory && typeof document !== 'undefined' && createPortal(
        <div className="item-dialog" role="dialog" aria-modal="true" aria-labelledby="item-dialog-title" onClick={() => setSelectedItem(null)}>
          <div className="item-dialog__content" onClick={(event) => event.stopPropagation()}>
            <div className="image-dialog__header">
              <p id="item-dialog-title">{selectedItem.title}</p>
              <button className="image-dialog__close" type="button" onClick={() => setSelectedItem(null)} aria-label="Cerrar trabajo">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="item-dialog__stage">
              <button className="item-dialog__nav item-dialog__nav--previous" type="button" onClick={() => moveItem(-1)} aria-label="Trabajo anterior">
                <span aria-hidden="true">‹</span>
              </button>
              {selectedItem.src ? (
                <ZoomImage key={selectedItem.id} src={selectedItem.src} alt={selectedItem.title} onOutside={() => setSelectedItem(null)} />
              ) : (
                <div className="portfolio-slot-dialog__preview" aria-hidden="true">
                  <span>+</span>
                </div>
              )}
              <button className="item-dialog__nav item-dialog__nav--next" type="button" onClick={() => moveItem(1)} aria-label="Trabajo siguiente">
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
