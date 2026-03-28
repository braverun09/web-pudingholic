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
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: true });
  const { data: toppings } = await supabase.from('toppings').select('*').order('created_at', { ascending: true });
  const { data: testimonials } = await supabase.from('testimonials').select('*').order('created_at', { ascending: true });

  return (
    <main className="bg-background min-h-screen">
      <Preloader />
      <Navbar />
      <SequenceScroll />
      <FlavorSection products={products || []} />
      <ToppingSection toppings={toppings || []} />
      <AboutSection />
      <StatsSection />
      <TestimonialSlider testimonials={testimonials || []} />
      <CTASection />
      <Footer />
    </main>
  );
}
