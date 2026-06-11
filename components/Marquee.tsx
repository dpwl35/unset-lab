"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Marquee() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const text =
      wrapRef.current.querySelector<HTMLParagraphElement>(".marquee-text");
    if (!text) return;

    // 텍스트 복제
    const clone = text.cloneNode(true) as HTMLElement;
    wrapRef.current.appendChild(clone);

    const totalWidth = text.offsetWidth;

    gsap.to(wrapRef.current, {
      x: `-=${totalWidth}`,
      duration: 250,
      ease: "none",
      repeat: -1,
    });

    gsap.to(wrapRef.current, {
      y: -300,
      ease: "none",
      scrollTrigger: {
        trigger: wrapRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <div className="marquee">
      <div className="marquee-wrap" ref={wrapRef}>
        <p className="marquee-text">
          Reset*the*standards,Unset*the*limits.Reset the standards,Unset the
          limits.Reset the standards,Unset the limits.
        </p>
      </div>
    </div>
  );
}
