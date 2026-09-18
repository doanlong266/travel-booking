import { useRef, useState, useEffect, useCallback } from 'react';

export interface UseDragScrollOptions {
  dragSpeed?: number;
  enableWheel?: boolean;
}

export function useDragScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseDragScrollOptions = {}
) {
  const { dragSpeed = 1.4, enableWheel = true } = options;

  const sliderRef = useRef<T | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // References for drag calculation to avoid stale closures
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDownRef = useRef(false);

  // Check scroll boundary limits for fade masks
  const checkScrollBounds = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  // Update bounds on mount and resize
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    checkScrollBounds();

    const resizeObserver = new ResizeObserver(() => {
      checkScrollBounds();
    });
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [checkScrollBounds]);

  // Non-passive wheel handler to translate vertical scroll to horizontal scroll
  useEffect(() => {
    const el = sliderRef.current;
    if (!el || !enableWheel) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        checkScrollBounds();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [enableWheel, checkScrollBounds]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;

    isDownRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    setHasMoved(false);
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDownRef.current || !sliderRef.current) return;
      e.preventDefault();

      const el = sliderRef.current;
      const x = e.pageX - el.offsetLeft;
      const distance = (x - startXRef.current) * dragSpeed;

      if (Math.abs(distance) > 4) {
        setHasMoved(true);
      }

      el.scrollLeft = scrollLeftRef.current - distance;
      checkScrollBounds();
    };

    const handleMouseUp = () => {
      if (isDownRef.current) {
        isDownRef.current = false;
        setIsDragging(false);
        // Small delay so onClick on child buttons can inspect hasMoved before resetting
        setTimeout(() => setHasMoved(false), 50);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragSpeed, checkScrollBounds]);

  // Scroll active element into center
  const scrollToActive = useCallback((targetEl: HTMLElement) => {
    const container = sliderRef.current;
    if (!container || !targetEl) return;

    const containerWidth = container.clientWidth;
    const targetLeft = targetEl.offsetLeft;
    const targetWidth = targetEl.clientWidth;

    const desiredScrollLeft = targetLeft - containerWidth / 2 + targetWidth / 2;
    container.scrollTo({
      left: Math.max(0, desiredScrollLeft),
      behavior: 'smooth',
    });
  }, []);

  const scrollPrev = useCallback((step = 160) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: -step, behavior: 'smooth' });
    setTimeout(checkScrollBounds, 300);
  }, [checkScrollBounds]);

  const scrollNext = useCallback((step = 160) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: step, behavior: 'smooth' });
    setTimeout(checkScrollBounds, 300);
  }, [checkScrollBounds]);

  return {
    sliderRef,
    isDragging,
    hasMoved,
    canScrollLeft,
    canScrollRight,
    onMouseDown: handleMouseDown,
    onScroll: checkScrollBounds,
    scrollToActive,
    scrollPrev,
    scrollNext,
  };
}
