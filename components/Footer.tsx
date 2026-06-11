"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const KO_TEXT = [
  "언셋랩(Unset Lab)은 정형화된 웹의 규칙을 초기화하고, 코드와 디자인의 새로운 가능성을 탐구하는 인터랙션 웹 에이전시입니다.",
  "우리는 정적인 화면을 넘어 감각적인 스크롤과 유연한 인터랙션을 통해, 사용자에게 깊은 인상을 남기는 디지털 경험을 설계하고 완성도 높게 구현합니다.",
];

function toKorChars(str: string): string[] {
  const cCho = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];
  const cJung = [
    "ㅏ",
    "ㅐ",
    "ㅑ",
    "ㅒ",
    "ㅓ",
    "ㅔ",
    "ㅕ",
    "ㅖ",
    "ㅗ",
    "ㅘ",
    "ㅙ",
    "ㅚ",
    "ㅛ",
    "ㅜ",
    "ㅝ",
    "ㅞ",
    "ㅟ",
    "ㅠ",
    "ㅡ",
    "ㅢ",
    "ㅣ",
  ];
  const cJong = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ];

  const chars: string[] = [];
  for (let i = 0; i < str.length; i++) {
    const cCode = str.charCodeAt(i);
    if (cCode === 32) {
      chars.push(" ");
      continue;
    }
    if (cCode < 0xac00 || cCode > 0xd7a3) {
      chars.push(str.charAt(i));
      continue;
    }
    const code = cCode - 0xac00;
    const jong = code % 28;
    const jung = ((code - jong) / 28) % 21;
    const cho = ((code - jong) / 28 - jung) / 21;
    chars.push(cCho[cho]);
    chars.push(String.fromCharCode(44032 + cho * 588 + jung * 28));
    if (cJong[jong] !== "")
      chars.push(String.fromCharCode(44032 + cho * 588 + jung * 28 + jong));
  }
  return chars;
}

function koreanTyping(el: Element, text: string, onComplete?: () => void) {
  const chars = text.split("").map(toKorChars);
  let i = 0,
    j = 0;
  let accumulated = "";

  const timer = setInterval(() => {
    if (i > chars.length - 1) {
      clearInterval(timer);
      onComplete?.();
      return;
    }
    el.innerHTML = accumulated + chars[i][j];
    j++;
    if (j === chars[i].length) {
      accumulated += chars[i][j - 1];
      i++;
      j = 0;
    }
  }, 30);

  return () => clearInterval(timer);
}

function SplitText({ text }: { text: string }) {
  return (
    <p>
      {text.split(" ").map((word, i) => (
        <span key={i} className="word-wrap">
          <span className="word">{word}&nbsp;</span>
        </span>
      ))}
    </p>
  );
}

export default function Footer() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const koRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current) return;
      const words = textRef.current.querySelectorAll(".word");
      gsap.from(words, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: "power2.out",
        scrollTrigger: { trigger: textRef.current, start: "top 85%" },
        onComplete: () => {
          if (!koRef.current) return;
          const paragraphs = koRef.current.querySelectorAll("p");
          koreanTyping(paragraphs[0], KO_TEXT[0], () =>
            koreanTyping(paragraphs[1], KO_TEXT[1]),
          );
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="footer" ref={ref} onMouseMove={handleMouseMove}>
      <div className="footer-text">
        <div className="footer-text-en" ref={textRef}>
          <SplitText text="Unset Lab is an interactive web agency that resets the conventions of the web and explores new possibilities at the intersection of code and design. We go beyond static screens — crafting digital experiences that leave a lasting impression through expressive scroll interactions and fluid motion, designed and built with meticulous attention to detail." />
        </div>
        <div className="footer-text-ko" ref={koRef}>
          <p></p>
          <p></p>
        </div>
      </div>
      <ul className="footer-info">
        <li className="footer-info-email">
          <i>email</i>contact@unsetlab.com
        </li>
        <li className="footer-info-address">
          <i>address</i>Seoul, republic of Korea
        </li>
        <li className="footer-info-copy">© 2026 unsetlab</li>
      </ul>
      <div className="coordinates">
        ({coords.x}, {coords.y})
      </div>
    </footer>
  );
}
