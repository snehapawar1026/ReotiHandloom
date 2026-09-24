'use client';

import { useEffect } from 'react';

/**
 * Universal Image Protection System
 * Blocks right-click save, drag-to-download, mobile long-press image saving,
 * and save shortcuts across all product, category, banner, and blog images.
 */
export function ImageProtection() {
  useEffect(() => {
    // 1. Prevent Right-Click Context Menu on any image or element with background image
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isImage =
        target.tagName === 'IMG' ||
        target.tagName === 'PICTURE' ||
        target.tagName === 'SOURCE' ||
        target.tagName === 'CANVAS' ||
        target.closest('img') !== null ||
        target.closest('.protected-image') !== null ||
        target.classList.contains('protected-img') ||
        window.getComputedStyle(target).backgroundImage !== 'none';

      if (isImage) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 2. Prevent Drag and Drop of images to desktop or new tabs
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.tagName === 'IMG' || target.closest('img') !== null) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // 3. Block Keyboard Save shortcuts (Ctrl+S / Cmd+S / Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isSave = (isMac ? e.metaKey : e.ctrlKey) && (e.key === 's' || e.key === 'S');

      if (isSave) {
        e.preventDefault();
      }
    };

    // 4. Prevent mobile touch-hold context menu
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === 'IMG') {
        target.style.setProperty('-webkit-touch-callout', 'none');
        target.style.setProperty('user-select', 'none');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart, { capture: true });
    };
  }, []);

  return null;
}
