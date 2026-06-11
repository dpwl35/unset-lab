"use client";

import { useEffect, useState } from "react";

const SEGMENTS = 10;

export default function Progress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const value =
        scrollHeight > 0
          ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
          : 0;
      setProgress(value);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="progress">
      {Array.from({ length: SEGMENTS }).map((_, index) => (
        <span
          key={index}
          className={
            progress >= ((index + 1) / SEGMENTS) * 100 ? "is-filled" : ""
          }
        />
      ))}
      <p className="progress-text">
        {String(Math.round(progress)).padStart(3, "0")}
      </p>
    </div>
  );
}
