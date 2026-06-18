'use client';

import { useState, useRef, useEffect } from 'react';
import { works } from '@/data/works';

function PixelateImg({ src, isHovered }: { src: string; isHovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      imgRef.current = img;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      draw(1); // 처음엔 선명하게
    };
  }, [src]);

  const draw = (progress: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const level = Math.max(0.05, progress);
    const w = Math.max(1, Math.floor(canvas.width * level));
    const h = Math.max(1, Math.floor(canvas.height * level));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, w, h);
    ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
  };

  const animate = (target: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const speed = target === 1 ? 0.01 : 0.08; // 호버: 느리게, 언호버: 빠르게
    const step = () => {
      progressRef.current += (target - progressRef.current) * speed;
      draw(progressRef.current);
      if (Math.abs(target - progressRef.current) > 0.01) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    animate(isHovered ? 1 : 0);
  }, [isHovered]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

export default function MainWork() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <ul className='main-work-list'>
      {works.map((work) => {
        const words = work.title.split(' ');
        const hasMultipleWords = words.length > 1;
        const firstWord = words[0];
        const restWords = words.slice(1).join(' ');

        return (
          <li
            key={work.id}
            className='main-work-item'
            onMouseEnter={() => setHoveredId(work.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className='main-work-text'>
              <span className='main-work-title'>{firstWord}</span>
              <div className='main-work-img'>
                <PixelateImg
                  src={`/images/${work.id}.jpg`}
                  isHovered={hoveredId === work.id}
                />
              </div>
              {hasMultipleWords && (
                <span className='main-work-title'>{restWords}</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
