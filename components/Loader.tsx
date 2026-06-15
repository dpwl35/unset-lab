'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      gsap.to(ref.current, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          if (ref.current) ref.current.style.display = 'none';
        },
      });
    };
    window.addEventListener('scene-ready', handler, { once: true });
    return () => window.removeEventListener('scene-ready', handler);
  }, []);

  return (
    <div ref={ref} className='loader'>
      <p>Loading</p>
    </div>
  );
}
