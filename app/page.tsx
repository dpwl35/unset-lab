import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import Progress from "@/components/Progress";
import ServiceList from "@/components/ServiceList";

export default function Home() {
  return (
    <main className="main">
      <section className="main-intro">
        <Marquee />
      </section>
      <section className="main-about">소개</section>
      <section className="main-work">작업물</section>
      <section className="main-outro">
        <div className="main-outro-left">
          <p>services</p>
        </div>
        <div className="main-outro-right">
          <ServiceList />
        </div>
      </section>
      <Footer />
      <Progress />
    </main>
  );
}
