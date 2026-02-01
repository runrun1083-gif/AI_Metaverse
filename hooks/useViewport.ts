import { useState, useRef, useCallback } from 'react';
import { MAP_CONFIG } from '../constants';

export const useViewport = () => {
  const [zoom, setZoom] = useState(MAP_CONFIG.DEFAULT_ZOOM);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });

  const performZoom = useCallback((newZoom: number, pivotX?: number, pivotY?: number) => {
    const v = viewportRef.current;
    if (!v) return;
    const boundedZoom = Math.min(Math.max(newZoom, MAP_CONFIG.MIN_ZOOM), MAP_CONFIG.MAX_ZOOM);
    const oldZoom = zoom;
    const px = pivotX ?? v.clientWidth / 2;
    const py = pivotY ?? v.clientHeight / 2;
    const mapX = (v.scrollLeft + px) / oldZoom;
    const mapY = (v.scrollTop + py) / oldZoom;

    setZoom(boundedZoom);
    requestAnimationFrame(() => {
      v.scrollLeft = (mapX * boundedZoom) - px;
      v.scrollTop = (mapY * boundedZoom) - py;
    });
  }, [zoom]);

  // isFading is provided from the component scope when calling this handler
  const handleWheel = useCallback((e: React.WheelEvent, isFading: boolean) => {
    if (isFading) return;
    e.preventDefault();
    const rect = viewportRef.current?.getBoundingClientRect();
    if (rect) {
      performZoom(zoom + (e.deltaY > 0 ? -0.05 : 0.05), e.clientX - rect.left, e.clientY - rect.top);
    }
  }, [zoom, performZoom]);

  const handleDrag = {
    onDown: (e: React.MouseEvent) => {
      if (!viewportRef.current) return;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.pageX - viewportRef.current.offsetLeft,
        y: e.pageY - viewportRef.current.offsetTop,
        scrollLeft: viewportRef.current.scrollLeft,
        scrollTop: viewportRef.current.scrollTop
      };
    },
    onMove: (e: React.MouseEvent) => {
      if (!isDragging || !viewportRef.current) return;
      const x = e.pageX - viewportRef.current.offsetLeft;
      const y = e.pageY - viewportRef.current.offsetTop;
      viewportRef.current.scrollLeft = dragStartRef.current.scrollLeft - (x - dragStartRef.current.x);
      viewportRef.current.scrollTop = dragStartRef.current.scrollTop - (y - dragStartRef.current.y);
    },
    onEnd: () => setIsDragging(false)
  };

  const centerOn = useCallback((x: number, y: number, targetZoom = 1.2) => {
    setZoom(targetZoom);
    requestAnimationFrame(() => {
      if (viewportRef.current) {
        viewportRef.current.scrollLeft = (x * targetZoom) - (viewportRef.current.clientWidth / 2);
        viewportRef.current.scrollTop = (y * targetZoom) - (viewportRef.current.clientHeight / 2);
      }
    });
  }, []);

  return { viewportRef, zoom, isDragging, performZoom, handleWheel, handleDrag, centerOn };
};