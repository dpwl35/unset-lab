'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SERVICES = [
  { num: '01', text: 'UI/UX Design' },
  { num: '02', text: 'Web Interaction' },
  { num: '03', text: '3D Experience' },
  { num: '04', text: 'Art Direction' },
  { num: '05', text: 'Branding' },
  { num: '06', text: 'Illustration' },
];

const TYPING_SPEED = 30;
const PAUSE = 800;

export default function Contact() {
  const [completed, setCompleted] = useState<typeof SERVICES>([]);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinal, setIsFinal] = useState(false);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const wait = (ms: number) =>
      new Promise<void>((r) => {
        timeout = setTimeout(r, ms);
      });

    const run = async () => {
      await wait(500);

      for (let i = 0; i < SERVICES.length; i++) {
        if (cancelled) return;
        const { text } = SERVICES[i];
        setCurrentIndex(i);

        // 타이핑
        for (let j = 0; j <= text.length; j++) {
          if (cancelled) return;
          setDisplayText(text.slice(0, j));
          await wait(TYPING_SPEED);
        }

        await wait(PAUSE);

        // 한 글자씩 지우기
        for (let j = text.length; j >= 0; j--) {
          if (cancelled) return;
          setDisplayText(text.slice(0, j));
          await wait(70);
        }

        await wait(100);

        // 완료 목록에 추가
        setCompleted((prev) => [...prev, SERVICES[i]]);
      }

      setIsFinal(true);
      await wait(50);

      // 마지막 메시지 타이핑
      const finalText = 'Thanks for your visit!';
      for (let j = 0; j <= finalText.length; j++) {
        if (cancelled) return;
        setDisplayText(finalText.slice(0, j));
        await wait(TYPING_SPEED);
      }
    };
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      clearTimeout(fallback);
      run();
    };
    window.addEventListener('transition-complete', start, { once: true });
    const fallback = setTimeout(start, 1500);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearTimeout(fallback);
      window.removeEventListener('transition-complete', start);
    };
  }, []);

  // 완료 목록 높이 애니메이션
  useEffect(() => {
    const i = completed.length - 1;
    if (i < 0) return;
    const newItem = itemRefs.current[i];
    if (!newItem) return;

    const itemHeight = newItem.offsetHeight;
    const serviceEl = document.querySelector('.contact-service') as HTMLElement;

    gsap.to(serviceEl, {
      height: `+=${itemHeight}`,
      duration: 0.8,
      ease: 'none',
    });
  }, [completed]);

  // 숫자 슬롯머신 애니메이션

  useEffect(() => {
    if (!numRef.current) return;
    gsap.fromTo(
      numRef.current,
      { y: 20 },
      { y: 0, duration: 0.3, ease: 'power2.out' },
    );
  }, [currentIndex, isFinal]);

  return (
    <main className='contact'>
      <div className='contact-top'>
        <div className='contact-top-wrap'>
          <div className='contact-top-head'>
            <h2>What we do</h2>
            <p>2026/06/15</p>
          </div>

          {/* 완료된 목록 */}
          <div className='contact-service'>
            <ul className='contact-service-list'>
              {completed.map((s, i) => (
                <li
                  key={s.num}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className='contact-service-item'
                >
                  <span className='contact-service-num'>{s.num}</span>
                  <span className='contact-service-text'>{s.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 타이핑 중인 줄 */}
          <div className='contact-typing'>
            <div className='contact-typing-num'>
              0
              <span
                style={{
                  width: '1ch',
                  display: 'inline-block',
                  overflow: 'hidden',
                  verticalAlign: 'middle',
                }}
              >
                <span ref={numRef} style={{ display: 'inline-block' }}>
                  {isFinal ? '0' : SERVICES[currentIndex].num[1]}
                </span>
              </span>
            </div>
            (
            <span
              className={`contact-typing-service${isFinal ? ' close' : ''}`}
            >
              {displayText}
            </span>
            )
          </div>
        </div>
      </div>

      <ul className='footer-info'>
        <li className='footer-info-email'>
          <i>email</i>contact@unsetlab.com
        </li>
        <li className='footer-info-address'>
          <i>address</i>Seoul, republic of Korea
        </li>
        <li className='footer-info-copy'>© 2026 unsetlab</li>
      </ul>
    </main>
  );
}
