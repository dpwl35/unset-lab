"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function LoadHandler() {
  useEffect(() => {
    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        document.body.classList.add("loaded");
        gsap.fromTo(
          ".header",
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power2.out" },
        );
      });
    });
  }, []);

  return null;
}
