import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, Repeat, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-bedsheets.jpg';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useSiteContent } from '@/hooks/useSiteContent';
import RangoliSpinner from '@/components/RangoliSpinner';

const iconMap: Record<string, React.ElementType> = { Heart, Truck, Shield, Repeat };

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Index = () => {
  const { data: bedsheets, isLoading: loadingBedsheets } = useProducts('bedsheet');
  const { data: jewelry, isLoading: loadingJewelry } = useProducts('jewelry');
  const { data: testimonials } = useTestimonials();
  const { data: content } = useSiteContent('home');

  const c = (section: string, field: string, fallback: string) =>
    content?.[section]?.[field] ?? fallback;

  const isLoading = loadingBedsheets || loadingJewelry;

  const featured = bedsheets?.filter(p => p.featured).slice(0, 4) || [];
  const bestSellers = bedsheets?.filter(p => p.best_seller).slice(0, 4) || [];
  const newArrivals = bedsheets?.filter(p => p.new_arrival).slice(0, 4) || [];
  const featuredJewelry = jewelry?.filter(p => p.featured).slice(0, 3) || [];

  // Why choose us items from content
  const whyChooseItems = [1, 2, 3, 4].map(i => {
    const section = `whychooseus_item_${i}`;
    const iconName = c(section, 'icon', ['Heart', 'Truck', 'Shield', 'Repeat'][i - 1]);
    return {
      icon: iconMap[iconName] || Heart,
      title: c(section, 'title', ''),
      desc: c(section, 'description', ''),
    };
  });

  const heroTitle = c('hero', 'title', 'Where Comfort Meets Elegance');
  const heroHighlight = c('hero', 'highlight', 'Elegance');
  const titleParts = heroTitle.split(heroHighlight);

  return (
    <div>
      <SEO
        title="Rangoli Creations — Premium Bedsheets & Artisanal Jewelry"
        description="Discover handcrafted luxury bedsheets and artisanal Indian jewelry at Rangoli Creations. Free shipping on orders above ₹2,999."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Rangoli Creations',
          url: typeof window !== 'undefined' ? window.location.origin : '',
        }}
      />
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Rangoli Creations - Premium bedsheets and jewelry" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-4">
              <span className="text-xs font-body tracking-[0.4em] text-gold-dark uppercase">{c('hero', 'eyebrow', 'Handcrafted Luxury')}</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6">
              {titleParts[0]}<span className="text-primary italic">{heroHighlight}</span>{titleParts[1] || ''}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-base lg:text-lg text-muted-foreground font-body leading-relaxed mb-8 max-w-lg">
              {c('hero', 'description', '')}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap gap-4">
              <Link to="/bedsheets" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-medium text-sm hover:bg-maroon-light transition-colors">
                {c('hero', 'cta_primary', 'Shop Bedsheets')} <ArrowRight size={16} />
              </Link>
              <Link to="/jewelry" className="inline-flex items-center gap-2 border-2 border-gold text-foreground px-6 py-3 rounded-lg font-body font-medium text-sm hover:bg-gold/10 transition-colors">
                {c('hero', 'cta_secondary', 'Explore Jewelry')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Bedsheets */}
      {(featured.length > 0 || isLoading) && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('featured', 'eyebrow', 'Curated for You')}</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">{c('featured', 'title', 'Featured Bedsheets')}</h2>
            </motion.div>
            {isLoading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {featured.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
              </div>
            )}
            <div className="text-center mt-10">
              <Link to="/bedsheets" className="inline-flex items-center gap-2 text-sm font-body text-primary hover:text-maroon-light transition-colors">View All Bedsheets <ArrowRight size={14} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('bestsellers', 'eyebrow', 'Most Loved')}</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">{c('bestsellers', 'title', 'Best Sellers')}</h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {bestSellers.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('newarrivals', 'eyebrow', 'Just Landed')}</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">{c('newarrivals', 'title', 'New Arrivals')}</h2>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newArrivals.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
          </div>
        </section>
      )}

      {/* Jewelry Preview */}
      {featuredJewelry.length > 0 && (
        <section className="py-16 lg:py-24 bg-gradient-to-r from-blush/50 via-background to-gold/5">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('jewelry', 'eyebrow', 'Adorn Yourself')}</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">{c('jewelry', 'title', 'Artisanal Jewelry')}</h2>
              <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto">{c('jewelry', 'description', '')}</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
              {featuredJewelry.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
            </div>
            <div className="text-center mt-10">
              <Link to="/jewelry" className="inline-flex items-center gap-2 text-sm font-body text-primary hover:text-maroon-light transition-colors">Explore Jewelry Collection <ArrowRight size={14} /></Link>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground">{c('whychooseus', 'title', 'Why Choose Rangoli')}</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {whyChooseItems.map((item, i) => (
              <motion.div key={item.title || i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                  <item.icon size={20} className="text-gold-dark" />
                </div>
                <h3 className="font-heading text-sm font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 lg:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-12">
              <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('testimonials', 'eyebrow', 'Love Letters')}</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">{c('testimonials', 'title', 'What Our Customers Say')}</h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div key={t.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="bg-card p-6 rounded-xl border border-border">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => <Star key={j} size={14} className="text-gold fill-gold" />)}
                  </div>
                  <p className="text-sm text-foreground font-body leading-relaxed mb-4 italic">"{t.text}"</p>
                  <p className="text-xs font-body font-medium text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{t.location}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="max-w-lg mx-auto text-center">
            <h2 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-3">{c('newsletter', 'title', 'Join the Rangoli Family')}</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">{c('newsletter', 'description', '')}</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem('email') as HTMLInputElement).value;
              if (!email) return;
              const { supabase } = await import('@/integrations/supabase/client');
              await supabase.from('newsletter_subscribers').insert({ email });
              form.reset();
              alert('Thank you for subscribing!');
            }} className="flex max-w-sm mx-auto">
              <input name="email" type="email" required placeholder="Enter your email" className="flex-1 bg-secondary border border-border rounded-l-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-3 rounded-r-lg text-sm font-body font-medium hover:bg-maroon-light transition-colors">Subscribe</button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
