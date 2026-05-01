import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Products from "@/components/Products";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Clients from "@/components/Clients";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Products />
      <Services />
      <Process />
      <Clients />
      <FinalCTA />
      <Footer />
    </>
  );
}
