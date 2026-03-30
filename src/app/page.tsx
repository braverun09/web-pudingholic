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
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
  const { data: products } = await supabase.from('products').select('*').order('created_at', { ascending: true });
  const { data: toppings } = await supabase.from('toppings').select('*').order('created_at', { ascending: true });
  const { data: testimonials } = await supabase.from('testimonials').select('*').order('created_at', { ascending: true });

  const nullCategoryProducts = products?.filter(p => !p.category_id) || [];

  return (
    <main className="bg-background min-h-screen">
      <Preloader />
      <Navbar />
      <SequenceScroll />
      
      {/* Dynamic Category Sections */}
      {categories && categories.length > 0 ? (
        categories.map((cat, index) => {
          const catProducts = products?.filter(p => p.category_id === cat.id) || [];
          if (catProducts.length === 0) return null;
          return (
            <FlavorSection 
              key={cat.id}
              title={cat.name}
              description={cat.description}
              products={catProducts}
              index={index}
            />
          );
        })
      ) : null}

      {/* Fallback for Uncategorized Products (or Default state) */}
      {(nullCategoryProducts.length > 0 || !categories || categories.length === 0) && (
          <FlavorSection 
            title={categories && categories.length > 0 ? "Menu Tambahan" : "Simfoni Rasa."} 
            description={categories && categories.length > 0 ? "Varian ekstra yang tak kalah lezat." : "Setiap cup dibuat dengan cermat untuk memastikan keseimbangan sempurna antara rasa manis dan tekstur."}
            products={nullCategoryProducts.length > 0 ? nullCategoryProducts : (products || [])} 
            index={categories?.length || 0}
          />
      )}

      <ToppingSection toppings={toppings || []} />
      <AboutSection />
      <StatsSection />
      <TestimonialSlider testimonials={testimonials || []} />
      <CTASection />
      <Footer />
    </main>
  );
}
