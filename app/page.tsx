import AboutWrap from '@/components/AboutWrap';
import Footer from '@/components/Footer';
import IntroDown from '@/components/IntroDown';
import Marquee from '@/components/Marquee';
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
          <div className='main-work-top'>
            <p>WORK LIST</p>
          </div>
          <Work />
        </div>
      </section>
      <section className='main-outro'>{/* <Marquee /> */} 마지막</section>
      <Footer />
      <Progress />
    </main>
  );
}
