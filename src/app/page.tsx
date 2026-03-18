import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import SequenceScroll from "@/components/SequenceScroll";
import FlavorSection from "@/components/FlavorSection";
import ToppingSection from "@/components/ToppingSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import TestimonialSlider from "@/components/TestimonialSlider";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Preloader />
      <Navbar />
      <SequenceScroll />
      <FlavorSection />
      <ToppingSection />
      <AboutSection />
      <StatsSection />
      <TestimonialSlider />
      <CTASection />
      <Footer />
    </main>
  );
}
