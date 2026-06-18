'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IntroDown() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      opacity: 0,
      y: -20,
      scrollTrigger: {
        trigger: '.main-intro',
        start: 'top top',
        end: '50% top',
        scrub: true,
      },
    });
  }, []);

  return (
    <p ref={ref} className='main-intro-down'>
      PLEASE SCROLL DOWN
    </p>
  );
}
