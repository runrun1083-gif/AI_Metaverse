
import { useState, useRef, useCallback, useEffect } from 'react';
import { MAP_CONFIG } from '../constants';

export const useViewport = () => {
  const [zoom, setZoom] = useState(MAP_CONFIG.DEFAULT_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const performZoom = useCallback((delta: number, pivotX?: number, pivotY?: number) => {
    setZoom(prevZoom => {
      const newZoom = Math.min(Math.max(prevZoom + delta, MAP_CONFIG.MIN_ZOOM), MAP_CONFIG.MAX_ZOOM);
      
      if (pivotX !== undefined && pivotY !== undefined) {
        // ピボット位置を維持するためのオフセット計算
        const zoomRatio = newZoom / prevZoom;
        setOffset(prev => ({
          x: pivotX - (pivotX - prev.x) * zoomRatio,
          y: pivotY - (pivotY - prev.y) * zoomRatio
        }));
      }
      return newZoom;
    });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    performZoom(delta, e.clientX, e.clientY);
  }, [performZoom]);

  const handleDrag = {
    onDown: (e: React.MouseEvent) => {
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    onMove: (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    onEnd: () => setIsDragging(false)
  };

  const centerOn = useCallback((x: number, y: number, targetZoom = 1.0) => {
    if (!viewportRef.current) return;
    const { clientWidth, clientHeight } = viewportRef.current;
    setZoom(targetZoom);
    setOffset({
      x: clientWidth / 2 - x * targetZoom,
      y: clientHeight / 2 - y * targetZoom
    });
  }, []);

  // 初期配置
  useEffect(() => {
    centerOn(MAP_CONFIG.CENTRAL_PLAZA.x, MAP_CONFIG.CENTRAL_PLAZA.y, MAP_CONFIG.DEFAULT_ZOOM);
  }, []);

  return { viewportRef, zoom, offset, isDragging, performZoom, handleWheel, handleDrag, centerOn };
};
