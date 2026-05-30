import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Products from "@/components/Products";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Clients from "@/components/Clients";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import InternshipCTA from "@/components/InternshipCTA";
import JoinEwooralCTA from "@/components/JoinEwooralCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Marquee />
      <Products />
      <JoinEwooralCTA />
      <Services />
      <Process />
      <Clients />
      <FinalCTA />
        <InternshipCTA />
      <Footer />
    </>
  );
}
