"use client";

const FONTS = [
  "var(--font-azeret-mono)",
  "var(--font-inter)",
  "var(--font-jetbrains-mono)",
  "serif",
  "cursive",
];

const SERVICES = [
  { num: "01", text: "UI/UX Design" },
  { num: "02", text: "Web Interaction" },
  { num: "03", text: "3D Experience" },
  { num: "04", text: "Art Direction" },
  { num: "05", text: "Branding" },
  { num: "06", text: "Illustration" },
];

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function scramble(el: HTMLElement, original: string) {
  // 글자별 span으로 분리
  el.innerHTML = original
    .split("")
    .map((char) =>
      char === " " ? " " : `<span data-original="${char}">${char}</span>`,
    )
    .join("");

  const spans = el.querySelectorAll<HTMLSpanElement>("span");

  spans.forEach((span) => {
    if (Math.random() < 0.4) return;

    const type = Math.random() < 0.5 ? "char" : "font";
    const orig = span.dataset.original || "";
    const duration = 100 + Math.floor(Math.random() * 150);

    if (type === "char") {
      span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
      setTimeout(() => {
        span.textContent = orig;
      }, duration);
    } else {
      span.style.fontFamily = FONTS[Math.floor(Math.random() * FONTS.length)];
      setTimeout(() => {
        span.style.fontFamily = "";
      }, duration);
    }
  });
}

export default function ServiceList() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
    const span =
      e.currentTarget.querySelector<HTMLElement>(".service-item-text");
    if (!span) return;
    const original = span.dataset.original || span.textContent || "";
    span.dataset.original = original;
    scramble(span, original);
  };

  return (
    <ul className="service">
      {SERVICES.map(({ num, text }) => (
        <li key={num} className="service-item" onMouseEnter={handleMouseEnter}>
          <span className="service-item-num">{num}</span>
          <span className="service-item-text" data-original={text}>
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
}
