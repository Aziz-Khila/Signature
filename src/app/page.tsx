import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { MenuBook } from "@/components/MenuBook";
import { Dishes } from "@/components/Dishes";
import { Atmosphere } from "@/components/Atmosphere";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Experience />
        <MenuBook />
        <Dishes />
        <Atmosphere />
        <Visit />
      </main>
      <Footer />
    </>
  );
}
