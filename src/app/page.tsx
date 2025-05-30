
import About from "@/components/landing_page/about/page";
import Benefit from "@/components/landing_page/benefit/page";
import Features from "@/components/landing_page/feature/page";
import Hero from "@/components/landing_page/hero/page";
import Navbar from "@/components/landing_page/navbar/page";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Benefit />
    </div>
  );
}