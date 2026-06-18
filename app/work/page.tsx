'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const works = [
  { id: '01', title: 'Solvane', category: 'Branding / Web', date: '2024 Mar' },
  {
    id: '02',
    title: 'ARC COLLECTIVE',
    category: 'UI/UX Design',
    date: '2024 Jan',
  },
  {
    id: '03',
    title: 'MERIDIAN',
    category: 'Web Interaction',
    date: '2023 Nov',
  },
  { id: '04', title: 'FORMA', category: '3D Experience', date: '2023 Aug' },
  { id: '05', title: 'LUNE AGENCY', category: 'Branding', date: '2023 May' },
  {
    id: '06',
    title: 'VOID SYSTEMS',
    category: 'Art Direction / Web',
    date: '2023 Feb',
  },
];

const positions = [
  { x: -800, y: -200 },
  { x: 200, y: -400 },
  { x: 650, y: 50 },
  { x: 250, y: 900 },
  { x: -100, y: 150 },
  { x: -800, y: 600 },
];

export default function Work() {
  const imgRefs = useRef<(HTMLLIElement | null)[]>([]);
  const hoveredIndexRef = useRef<number | null>(null);
  const listItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasPos = useRef({ x: 0, y: 0 });
  const didDrag = useRef(false);
  const infoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scaleRef = useRef(1);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [view, setView] = useState<'spiral' | 'list'>('spiral');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (view === 'list') {
      listItemRefs.current.forEach((el, i) => {
        if (el) {
          gsap.fromTo(
            el,
            { height: 0, overflow: 'hidden' },
            {
              height: 'auto',
              duration: 0.4,
              delay: i * 0.08,
              ease: 'power2.out',
            },
          );
        }
      });
    }
  }, [view]);

  const PADDING = 50;

  const minX = Math.min(...positions.map((p) => p.x)) - PADDING;
  const maxX = Math.max(...positions.map((p) => p.x)) + PADDING;
  const minY = Math.min(...positions.map((p) => p.y)) - PADDING;
  const maxY = Math.max(...positions.map((p) => p.y)) + PADDING;

  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (isDragging.current && canvasRef.current) {
      didDrag.current = true;
      velocity.current = {
        x: e.clientX - lastPos.current.x,
        y: e.clientY - lastPos.current.y,
      };
      lastPos.current = { x: e.clientX, y: e.clientY };

      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const newX = Math.min(-minX, Math.max(-maxX, canvasPos.current.x + dx));
      const newY = Math.min(-minY, Math.max(-maxY, canvasPos.current.y + dy));
      canvasRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${scaleRef.current})`;
    }
  };

  const handleImageClick = (i: number) => {
    if (didDrag.current) return;

    if (
      activeIndex !== null &&
      activeIndex !== i &&
      infoRefs.current[activeIndex]
    ) {
      gsap.to(infoRefs.current[activeIndex], {
        width: 0,
        duration: 0.3,
        ease: 'power2.in',
        overflow: 'hidden',
      });
    }

    if (activeIndex === i) {
      gsap.to(infoRefs.current[i], {
        width: 0,
        duration: 0.3,
        ease: 'power2.in',
        overflow: 'hidden',
      });
      setActiveIndex(null);
    } else {
      gsap.fromTo(
        infoRefs.current[i],
        { width: 0, overflow: 'hidden' },
        { width: 'auto', duration: 0.4, ease: 'power2.out' },
      );
      setActiveIndex(i);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    didDrag.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    lastPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    if (rafId.current) cancelAnimationFrame(rafId.current);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging.current && canvasRef.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const newX = Math.min(-minX, Math.max(-maxX, canvasPos.current.x + dx));
      const newY = Math.min(-minY, Math.max(-maxY, canvasPos.current.y + dy));
      canvasPos.current.x = newX;
      canvasPos.current.y = newY;
      canvasRef.current.style.transform = `translate(${newX}px, ${newY}px) scale(${scaleRef.current})`;

      // 관성 시작
      if (rafId.current) cancelAnimationFrame(rafId.current);
      const inertia = () => {
        velocity.current.x *= 0.92;
        velocity.current.y *= 0.92;

        if (
          Math.abs(velocity.current.x) < 0.1 &&
          Math.abs(velocity.current.y) < 0.1
        )
          return;

        canvasPos.current.x = Math.min(
          -minX,
          Math.max(-maxX, canvasPos.current.x + velocity.current.x),
        );
        canvasPos.current.y = Math.min(
          -minY,
          Math.max(-maxY, canvasPos.current.y + velocity.current.y),
        );

        if (canvasRef.current) {
          canvasRef.current.style.transform = `translate(${canvasPos.current.x}px, ${canvasPos.current.y}px) scale(${scaleRef.current})`;
        }
        rafId.current = requestAnimationFrame(inertia);
      };
      rafId.current = requestAnimationFrame(inertia);
    }
    isDragging.current = false;
  };

  const handleMouseEnter = (i: number) => {
    const prev = hoveredIndexRef.current;
    hoveredIndexRef.current = i;

    imgRefs.current.forEach((el, idx) => {
      if (el) el.style.zIndex = idx === i ? '2' : '1';
    });

    if (imgRefs.current[i]) {
      gsap.fromTo(
        imgRefs.current[i],
        { width: 0, height: 0 },
        {
          width: 300,
          height: 200,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            if (prev !== null && prev !== i && imgRefs.current[prev]) {
              gsap.to(imgRefs.current[prev], {
                width: 0,
                height: 0,
                duration: 0.3,
              });
            }
          },
        },
      );
    }
  };

  const handleItemMouseLeave = (i: number) => {
    requestAnimationFrame(() => {
      if (hoveredIndexRef.current !== i) return;
      hoveredIndexRef.current = null;
      if (imgRefs.current[i]) {
        gsap.to(imgRefs.current[i], { width: 0, height: 0, duration: 0.3 });
      }
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (view !== 'spiral') return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    scaleRef.current = Math.min(2, Math.max(0.3, scaleRef.current + delta));

    if (canvasRef.current) {
      canvasRef.current.style.transform = `translate(${canvasPos.current.x}px, ${canvasPos.current.y}px) scale(${scaleRef.current})`;
    }
  };

  return (
    <main
      className='work'
      onMouseMove={handleMouseMove}
      onMouseDown={view === 'spiral' ? handleMouseDown : undefined}
      onMouseUp={view === 'spiral' ? handleMouseUp : undefined}
      onWheel={handleWheel}
    >
      <div className='work-view'>
        <div className='work-view-wrap'>
          <button
            className={`work-view-toggle ${view === 'spiral' ? 'is-active' : ''}`}
            onClick={() => setView('spiral')}
          >
            board
          </button>
          <span className='dot'></span>
          <button
            className={`work-view-toggle ${view === 'list' ? 'is-active' : ''}`}
            onClick={() => setView('list')}
          >
            list
          </button>
        </div>
        <div className='work-view-text'>
          {view === 'spiral' ? <p>wheel & drag & click</p> : <p>hover</p>}
        </div>
      </div>
      <div className='work-content'>
        <div
          className={`work-content-spiral work-content-wrap ${view === 'spiral' ? 'is-active' : ''}`}
        >
          <div
            ref={canvasRef}
            className='work-canvas'
            style={{ position: 'absolute', top: '7%', left: '50%' }}
          >
            {works.map((work, i) => (
              <div
                key={work.id}
                className='work-canvas-item'
                style={{
                  position: 'absolute',
                  left: positions[i].x,
                  top: positions[i].y,
                }}
              >
                <div className='work-canvas-wrap'>
                  <div
                    className='work-canvas-img'
                    style={{ width: 400, cursor: 'pointer' }}
                    onClick={() => handleImageClick(i)}
                  >
                    <img
                      src={`/images/${work.id}.jpg`}
                      alt={work.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        pointerEvents: 'none',
                      }}
                    />
                    <span className='corner one'></span>
                    <span className='corner two'></span>
                    <span className='corner three'></span>
                    <span className='corner four'></span>
                  </div>
                  <div
                    className='work-canvas-info'
                    ref={(el) => {
                      infoRefs.current[i] = el;
                    }}
                    style={{ width: 0, overflow: 'hidden' }}
                  >
                    <span>{work.title}</span>
                    <span>{work.category}</span>
                    <span>{work.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`work-content-list work-content-wrap ${view === 'list' ? 'is-active' : ''}`}
        >
          <ul
            className='work-img'
            style={{
              position: 'fixed',
              left: mousePos.x + 100,
              top: mousePos.y + 100,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {works.map((work, i) => (
              <li
                key={work.id}
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                className='work-img-wrap'
                style={{ width: 0, height: 0, overflow: 'hidden' }}
              />
            ))}
          </ul>
          <ul className='work-list'>
            {works.map((work, i) => (
              <li
                key={work.id}
                className='work-list-item'
                ref={(el) => {
                  listItemRefs.current[i] = el;
                }}
                onMouseEnter={() => handleMouseEnter(i)}
                onMouseLeave={() => handleItemMouseLeave(i)}
              >
                <div className='work-list-top'>
                  <span className='work-list-title'>{work.title}</span>
                </div>
                <div className='work-list-bottom'>
                  <span className='work-list-date'>{work.date}</span>
                  <span className='work-list-category'>{work.category}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
