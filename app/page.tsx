import AboutWrap from '@/components/AboutWrap';
import Footer from '@/components/Footer';
import IntroDown from '@/components/IntroDown';
import Marquee from '@/components/Marquee';
import Outro from '@/components/Outro';
import Progress from '@/components/Progress';
import Scene from '@/components/Scene';
import ServiceList from '@/components/ServiceList';
import Work from '@/components/Work';

export default function Home() {
  return (
    <main className='main'>
      <section className='main-intro'>
        <Scene />
        <div className='main-intro-text'>
          <p>Reset the standards,Unset the limits.Reset the standards,</p>
          <p>Unset the limits.Reset the standards,Unset the limits.</p>
        </div>
        <IntroDown />
      </section>
      <section className='main-about'>
        <AboutWrap />
      </section>
      <section className='main-work'>
        <div className='main-work-wrap'>
          <Work />
        </div>
      </section>
      <section className='main-outro'>
        {/* <Marquee /> */}
        <Outro />
      </section>
      <div className='main-outro-spacer' />
      <Footer />
      <Progress />
    </main>
  );
}
