"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Marquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;

    const text =
      wrapRef.current.querySelector<HTMLParagraphElement>(".marquee-text");
    if (!text) return;

    const clone = text.cloneNode(true) as HTMLElement;
    wrapRef.current.appendChild(clone);

    const totalWidth = text.offsetWidth;

    gsap.to(wrapRef.current, {
      x: `-=${totalWidth}`,
      duration: 250,
      ease: "none",
      repeat: -1,
    });
  }, []);

  return (
    <div className="marquee">
      <div className="marquee-parallax" ref={parallaxRef}>
        <div className="marquee-wrap" ref={wrapRef}>
          <p className="marquee-text">
            Reset*the*standards,Unset*the*limits.Reset the standards,Unset the
            limits.Reset the standards,Unset the limits.&nbsp;
          </p>
        </div>
      </div>
    </div>
  );
}
