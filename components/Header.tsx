'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import TransitionLink from '@/components/TransitionLink';

export default function Header() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
        now.getDay()
      ];
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTime(`${day} ${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className='header'>
      {/* <div className='header-time'>{time}</div> */}
      <div>***</div>
      <div className='header-logo'>
        <Link href='/'>
          <h1>UNSET LAB</h1>
        </Link>
        <span>Reset the standards, Unset the limits.</span>
      </div>

      <nav className='header-menu'>
        <ul className='menu'>
          <li className='menu-item'>
            <TransitionLink href='/work'>
              <span className='menu-item-text'>WORK</span>
              <span className='menu-item-text2'>WORK</span>
            </TransitionLink>
          </li>
          <li className='menu-item'>
            <TransitionLink href='/contact'>
              <span className='menu-item-text'>CONTACT</span>
              <span className='menu-item-text2'>CONTACT</span>
            </TransitionLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
