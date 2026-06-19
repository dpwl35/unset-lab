'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (pathname === '/') return; // 메인 페이지일 때만 스킵

    const top = document.querySelector('.page-overlay-top') as HTMLElement;
    const bottom = document.querySelector(
      '.page-overlay-bottom',
    ) as HTMLElement;

    const tl = gsap.timeline();
    tl.to(top, { y: '-100%', duration: 0.5, ease: 'power2.inOut' }).to(
      bottom,
      {
        y: '100%',
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () =>
          window.dispatchEvent(new Event('transition-complete')),
      },
      '<',
    );
  }, [pathname]);

  return (
    <>
      <div ref={topRef} className='page-overlay page-overlay-top' />
      <div ref={bottomRef} className='page-overlay page-overlay-bottom' />
      <div ref={contentRef} className='wrap'>
        {children}
      </div>
    </>
  );
}
