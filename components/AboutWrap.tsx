'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import CameraScene from '@/components/CameraScene';

gsap.registerPlugin(ScrollTrigger);

export default function AboutWrap() {
  const spanRef = useRef<HTMLSpanElement>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!spanRef.current) return;

    gsap.to(spanRef.current, {
      width: 0,
      duration: 0.8,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
      scrollTrigger: {
        trigger: '.main-about',
        start: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    });
  }, []);

  return (
    <div className='main-about-wrap'>
      <p className='main-about-title'>
        At Unset Lab,we challenge the conventional boundaries of web design by
        breaking away from rigid templates and resetting the digital landscape.
        We are a creative interaction studio that seamlessly converges strategic
        thinking, refined aesthetics, and cutting-edge web technology. By
        transforming static structures into fluid, immersive digital
        experiences, we capture the raw essence of each brand and build flawless
        interfaces that leave a lasting <span ref={spanRef}></span>impact.
      </p>
      <div className='main-about-camera'>
        <div className='camera'>
          <canvas className='camera-canvas' ref={cameraCanvasRef}></canvas>
          <CameraScene canvasRef={cameraCanvasRef} />
          <div className='camera-view'>
            <span className='camera-time'>
              <i></i>REC 00:34:28
            </span>
            {['one', 'two', 'three', 'four'].map((pos) => (
              <span key={pos} className={`camera-corner ${pos}`} />
            ))}
            <div className='camera-ev'>
              <div className='camera-ev-wrap'>
                {Array.from({ length: 13 }, (_, i) => (
                  <span
                    key={i}
                    className={`camera-ev-tick ${i % 3 === 0 ? 'long' : 'short'}`}
                  />
                ))}
                <span className='camera-ev-pointer'>▶</span>
              </div>
            </div>

            <div className='camera-center'>
              <div>
                {['one', 'two', 'three', 'four'].map((pos) => (
                  <span key={pos} className={`camera-corner ${pos}`} />
                ))}
                <span className='camera-center-circle'>+</span>
              </div>
            </div>

            <div className='camera-bottom'>
              <span>1/00</span>
              <span>14.0</span>
              <span>100 ISO</span>
            </div>
          </div>
        </div>
      </div>
      <div className='main-about-grid'>
        <div className='main-about-columns'>
          01. 정형화를 거부하는 실험 (Unset & Unbound) 우리는 이미 증명된 안전한
          레이아웃이나 뻔한 템플릿 뒤에 숨지 않습니다. 마우스 휠이 굴러가는
          찰나의 순간, 화면과 마우스가 부드럽게 맞닿는 인터랙션 하나까지
          브랜드의 서사를 담아 독창적으로 실험합니다.
        </div>
        <div className='main-about-columns'>
          02. 정교한 퍼블리싱 기술 (Craftsmanship in Code) 화려한 비주얼은
          탄탄한 구조 위에서만 완벽해집니다. 시맨틱 마크업의 정갈함과 최적화된
          스크롤 라이브러리, 그리고 GPU 가속 기술을 활용하여 어떤 브라우저
          환경에서도 끊김 없이 부드러운 하이엔드 디지털 경험을 선사합니다.
        </div>
        <div className='main-about-columns'>
          03. 경계를 허무는 협업 (Seamless Convergence) 기획, 디자인, 그리고
          개발은 분리된 단계가 아닙니다. 우리는 첫 아이디어 단계부터 최종 배포에
          이르기까지 모든 프로세스를 유기적으로 연결하여, 디자이너의 상상력을
          브라우저 위에 100% 온전한 현실로 펼쳐냅니다.
        </div>
      </div>
      <p className='main-about-text'>
        틀을 깨는 것에서부터 우리의 웹은 시작됩니다. 언셋랩(Unset Lab)은 기획과
        디자인, 그리고 최첨단 웹 테크놀로지의 경계를 허무는 크리에이티브
        스튜디오입니다. 규정되지 않은(Unset) 자유로운 시선으로 브랜드의 본질을
        날카롭게 포착하고, 이를 가장 감각적인 디지털 인터랙션으로 펼쳐냅니다.
      </p>
    </div>
  );
}
