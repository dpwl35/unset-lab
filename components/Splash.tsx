'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function Splash() {
  const pathname = usePathname();
  const counterRef = useRef<HTMLParagraphElement>(null);
  const maskWrapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(pathname !== '/');
  const initializedRef = useRef(false);

  useEffect(() => {
    if (pathname !== '/') return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const counter = counterRef.current;
    if (!counter) return;

    const shuffleText = (
      finalText: string,
      duration: number,
      callback?: () => void,
    ) => {
      let i = 0;
      const shuffleInterval = setInterval(() => {
        if (i < duration) {
          counter.innerHTML = Math.random().toString(36).substring(2, 8);
          i++;
        } else {
          clearInterval(shuffleInterval);
          counter.innerHTML = finalText;
          if (callback) callback();
        }
      }, 100);
    };

    const fadeOutLoader = () => {
      gsap.to('.splash', {
        opacity: 0,
        pointerEvents: 'none',
        duration: 1,
        delay: 0.5,
        onComplete: () => {
          setIsLoaded(true);
          window.dispatchEvent(new Event('splash-complete'));
        },
      });
    };

    const animateMasks = () => {
      const masks = document.querySelectorAll('.splash-mask-item');
      const clipPathValues = [
        'polygon(10% 0, 0 0, 0 100%, 10% 100%)',
        'polygon(20% 0, 10% 0, 10% 100%, 20% 100%)',
        'polygon(30% 0, 20% 0, 20% 100%, 30% 100%)',
        'polygon(40% 0, 30% 0, 30% 100%, 40% 100%)',
        'polygon(50% 0, 40% 0, 40% 100%, 50% 100%)',
        'polygon(60% 0, 50% 0, 50% 100%, 60% 100%)',
        'polygon(70% 0, 60% 0, 60% 100%, 70% 100%)',
        'polygon(80% 0, 70% 0, 70% 100%, 80% 100%)',
        'polygon(90% 0, 80% 0, 80% 100%, 90% 100%)',
        'polygon(100% 0, 90% 0, 90% 100%, 100% 100%)',
      ];

      setTimeout(() => {
        masks.forEach((mask, index) => {
          gsap.to(mask, {
            clipPath: clipPathValues[index % clipPathValues.length],
            duration: 1,
            delay: index * 0.1,
            onComplete: () => {
              if (index === masks.length - 1) {
                fadeOutLoader();
              }
            },
          });
        });
      });
    };

    gsap.to(counter, {
      innerHTML: 100,
      duration: 3,
      snap: 'innerHTML',
      ease: 'none',
      onUpdate: function () {
        counter.innerHTML =
          Math.round(Number(this.targets()[0].innerHTML)) + '%';
      },
      onComplete: () => {
        setTimeout(() => {
          shuffleText('UNSET LAB', 20, () => {
            setTimeout(() => {
              animateMasks();
            }, 500);
          });
        }, 500);
      },
    });
  }, [pathname]);

  if (isLoaded) return null;

  return (
    <div className='splash'>
      <div className='splash-text'>
        <p ref={counterRef}>0%</p>
      </div>
      <div className='splash-mask'>
        <div className='splash-mask-wrap' ref={maskWrapRef}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className='splash-mask-item' />
          ))}
        </div>
      </div>
    </div>
  );
}
