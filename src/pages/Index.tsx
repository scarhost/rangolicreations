import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, Repeat, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-bedsheets.jpg';
import ProductCard from '@/components/ProductCard';
import { bedsheets, jewelry, testimonials } from '@/data/products';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Index = () => {
  const featured = bedsheets.filter(p => p.featured).slice(0, 4);
  const bestSellers = bedsheets.filter(p => p.bestSeller).slice(0, 4);
  const newArrivals = bedsheets.filter(p => p.newArrival).slice(0, 4);
  const featuredJewelry = jewelry.filter(p => p.featured).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Rangoli Creations - Premium bedsheets and jewelry" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="text-xs font-body tracking-[0.4em] text-gold-dark uppercase">Handcrafted Luxury</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6"
            >
              Where Comfort Meets{' '}
              <span className="text-primary italic">Elegance</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base lg:text-lg text-muted-foreground font-body leading-relaxed mb-8 max-w-lg"
            >
              Discover our collection of premium bedsheets and artisanal jewelry,
              crafted with love and inspired by India's rich artistic heritage.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/bedsheets"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-medium text-sm hover:bg-maroon-light transition-colors"
              >
                Shop Bedsheets
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/jewelry"
                className="inline-flex items-center gap-2 border-2 border-gold text-foreground px-6 py-3 rounded-lg font-body font-medium text-sm hover:bg-gold/10 transition-colors"
              >
                Explore Jewelry
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Bedsheets */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Curated for You</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">Featured Bedsheets</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/bedsheets" className="inline-flex items-center gap-2 text-sm font-body text-primary hover:text-maroon-light transition-colors">
              View All Bedsheets <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 lg:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Most Loved</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">Best Sellers</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {bestSellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Just Landed</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">New Arrivals</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Jewelry Preview */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blush/50 via-background to-gold/5">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Adorn Yourself</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">Artisanal Jewelry</h2>
            <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto">
              Handcrafted pieces that celebrate India's timeless jewelry traditions.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
            {featuredJewelry.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/jewelry" className="inline-flex items-center gap-2 text-sm font-body text-primary hover:text-maroon-light transition-colors">
              Explore Jewelry Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground">Why Choose Rangoli</h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: Heart, title: 'Handcrafted', desc: 'Each piece made with artisanal care and attention to detail' },
              { icon: Truck, title: 'Free Shipping', desc: 'Complimentary delivery on orders above ₹2,999' },
              { icon: Shield, title: 'Quality Promise', desc: 'Premium materials and rigorous quality checks' },
              { icon: Repeat, title: 'Easy Returns', desc: '30-day hassle-free returns and exchanges' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow"
              >
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
      <section className="py-16 lg:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Love Letters</span>
            <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">What Our Customers Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-foreground font-body leading-relaxed mb-4 italic">"{t.text}"</p>
                <p className="text-xs font-body font-medium text-foreground">{t.name}</p>
                <p className="text-[10px] text-muted-foreground font-body">{t.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div {...fadeUp} className="max-w-lg mx-auto text-center">
            <h2 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-3">Join the Rangoli Family</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">
              Subscribe for exclusive offers, new collection previews, and styling tips.
            </p>
            <div className="flex max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-secondary border border-border rounded-l-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold"
              />
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-r-lg text-sm font-body font-medium hover:bg-maroon-light transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
