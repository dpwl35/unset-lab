'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function LoadHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') {
      // 메인 아닌 페이지는 바로 보여줌
      gsap.set('.header', { opacity: 1, y: 0 });
      return;
    }

    const handler = () => {
      gsap.fromTo(
        '.header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      );
    };
    window.addEventListener('scene-ready', handler, { once: true });
    return () => window.removeEventListener('scene-ready', handler);
  }, [pathname]);

  return null;
}
