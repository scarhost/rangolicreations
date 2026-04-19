import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useSiteContent } from '@/hooks/useSiteContent';
import SEO from '@/components/SEO';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';

const JewelryPage = () => {
  const { data: jewelry, isLoading } = useProducts('jewelry');
  const { data: content } = useSiteContent('jewelry');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const c = (section: string, field: string, fallback: string) => content?.[section]?.[field] ?? fallback;

  const categories = [...new Set(jewelry?.map(p => p.subcategory).filter(Boolean) || [])];
  const filtered = activeCategory ? jewelry?.filter(p => p.subcategory === activeCategory) : jewelry;

  return (
    <div className="min-h-screen">
      <SEO title="Artisanal Jewelry Collection" description="Handcrafted Indian jewelry — earrings, necklaces, and more at Rangoli Creations." />
      <div className="bg-gradient-to-r from-blush/50 via-background to-gold/5 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('header', 'eyebrow', 'Adorn Yourself')}</span>
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">{c('header', 'title', 'Artisanal Jewelry')}</h1>
          <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto">{c('header', 'description', '')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button onClick={() => setActiveCategory(null)} className={`text-xs font-body px-4 py-2 rounded-full whitespace-nowrap ${!activeCategory ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary transition-colors'}`}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat!)} className={`text-xs font-body px-4 py-2 rounded-full whitespace-nowrap capitalize ${activeCategory === cat ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-secondary transition-colors'}`}>{cat}</button>
          ))}
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filtered?.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default JewelryPage;
