'use client';

import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function TransitionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 현재 페이지면 애니메이션 안함
    if (pathname === href) return;

    const top = document.querySelector('.page-overlay-top') as HTMLElement;
    const bottom = document.querySelector(
      '.page-overlay-bottom',
    ) as HTMLElement;

    const tl = gsap.timeline();
    tl.set(top, { y: '-100%' })
      .set(bottom, { y: '100%' })
      .to(top, { y: '0%', duration: 0.5, ease: 'power2.inOut' })
      .to(bottom, { y: '0%', duration: 0.5, ease: 'power2.inOut' }, '<')
      .add(() => router.push(href));
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
