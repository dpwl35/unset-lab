'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GridOverlay() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    console.log('grid:', grid);
    const cellSize = window.innerWidth / 30;
    const cols = 30;
    const rows = Math.ceil(window.innerHeight / cellSize);
    const totalCells = cols * rows;

    const cells: HTMLElement[] = [];
    const cellRands: number[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement('div');
        cell.style.cssText = `
          position: absolute;
          left: ${col * cellSize}px;
          bottom: ${row * cellSize}px;
          width: ${cellSize}px;
          height: ${cellSize}px;
          background: #121813;
          opacity: 0;
        `;
        grid.appendChild(cell);
        cells.push(cell);
        cellRands.push(Math.random()); // 랜덤값 미리 고정
      }
    }

    ScrollTrigger.create({
      trigger: document.querySelector('.main-intro'),
      start: 'top+=100 top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        for (let i = 0; i < totalCells; i++) {
          const row = Math.floor(i / cols);
          const rowFromBottom = rows - 1 - row;
          // 아래 행부터 채워지는 threshold
          const threshold = row / rows;
          // 랜덤 scatter
          const cellThreshold = threshold + cellRands[i] * 0.15 - 0.075;
          cells[i].style.opacity = progress >= cellThreshold ? '1' : '0';
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      grid.innerHTML = '';
    };
  }, []);
  return <div ref={gridRef} className='grid' />;
}
