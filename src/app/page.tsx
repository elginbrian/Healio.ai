import About from "@/components/landing_page/about/page";
import Benefit from "@/components/landing_page/benefit/page";
import FAQ from "@/components/landing_page/faq/page";
import Features from "@/components/landing_page/feature/page";
import Footer from "@/components/landing_page/footer/page";
import Hero from "@/components/landing_page/hero/page";
import Navbar from "@/components/landing_page/navbar/page";
import Testimony from "@/components/landing_page/testimony/page";

export default function Home() {
  return (
    <div className=" bg-[var(--color-w-300)]">
      <Navbar />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="about" className="py-32 px-4 md:px-12">
          <About />
        </section>
        <section id="features" className="py-32 bg-gray-50">
          <Features />
        </section>
        <section id="benefit" className="py-32 px-4 md:px-12">
          <Benefit />
        </section>
        <section id="testimony" className="py-32 bg-gray-50">
          <Testimony />
        </section>
        <section id="faq" className="py-32 px-4 md:px-12">
          <FAQ />
        </section>
      </main>
      <Footer />
    </div>
  );
}
