import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { jewelry } from '@/data/products';

const JewelryPage = () => {
  const categories = ['earrings', 'bangles', 'necklace', 'accessories'];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blush/50 via-background to-gold/5 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Adorn Yourself</span>
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">Artisanal Jewelry</h1>
          <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto">
            Handcrafted pieces celebrating India's timeless jewelry traditions.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Category tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button className="text-xs font-body px-4 py-2 rounded-full bg-primary text-primary-foreground whitespace-nowrap">
            All
          </button>
          {categories.map(cat => (
            <button key={cat} className="text-xs font-body px-4 py-2 rounded-full border border-border hover:bg-secondary transition-colors capitalize whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {jewelry.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JewelryPage;
