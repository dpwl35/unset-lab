"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;

    const tl = gsap.timeline();

    tl.set(overlayRef.current, { y: "100%" })
      .to(overlayRef.current, {
        y: "0%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .set(contentRef.current, { opacity: 0 })
      .to(overlayRef.current, {
        y: "-100%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        contentRef.current,
        {
          opacity: 1,
          duration: 0.3,
        },
        "<",
      );
  }, [pathname]);

  return (
    <>
      <div ref={overlayRef} className="page-overlay" />
      <div ref={contentRef}>{children}</div>
    </>
  );
}
