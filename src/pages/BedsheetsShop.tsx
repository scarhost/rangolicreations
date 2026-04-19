import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { useSiteContent } from '@/hooks/useSiteContent';
import RangoliSpinner from '@/components/RangoliSpinner';

const sizes = ['Single', 'Double', 'King', 'Super King'];
const materials = ['cotton', 'silk-blend', 'linen', 'sateen', 'organic'];
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'New Arrivals', value: 'new' },
  { label: 'Best Sellers', value: 'bestseller' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const BedsheetsShop = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const { data: products, isLoading } = useProducts('bedsheet');
  const { data: content } = useSiteContent('bedsheets');

  const c = (section: string, field: string, fallback: string) => content?.[section]?.[field] ?? fallback;

  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sort, setSort] = useState(filterParam || 'featured');

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (selectedSize) result = result.filter(p => p.sizes?.includes(selectedSize));
    if (selectedMaterial) result = result.filter(p => p.subcategory === selectedMaterial);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case 'new': result = result.filter(p => p.new_arrival); break;
      case 'bestseller': result = result.filter(p => p.best_seller); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    }

    return result;
  }, [products, selectedSize, selectedMaterial, priceRange, sort]);

  const clearFilters = () => {
    setSelectedSize(null);
    setSelectedMaterial(null);
    setPriceRange([0, 10000]);
    setSort('featured');
  };

  // loading shown inline below

  return (
    <div className="min-h-screen">
      <SEO
        title="Premium Bedsheets Collection"
        description="Shop handcrafted premium cotton, silk-blend & sateen bedsheets. Free shipping above ₹2,999."
      />
      <div className="bg-gradient-to-r from-secondary via-background to-blush/30 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('header', 'eyebrow', 'Our Collection')}</span>
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">{c('header', 'title', 'Premium Bedsheets')}</h1>
          <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto">{c('header', 'description', '')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm font-body text-foreground border border-border rounded-lg px-4 py-2 hover:bg-secondary transition-colors">
            <SlidersHorizontal size={14} /> Filters
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-body hidden sm:block">Sort by:</span>
            <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm font-body bg-secondary border border-border rounded-lg px-3 py-2 outline-none">
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>

        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-8 p-4 bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-semibold">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-primary font-body flex items-center gap-1"><X size={12} /> Clear all</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-body font-medium text-foreground mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(selectedSize === size ? null : size)} className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}>{size}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-foreground mb-2">Material</p>
                <div className="flex flex-wrap gap-2">
                  {materials.map(mat => (
                    <button key={mat} onClick={() => setSelectedMaterial(selectedMaterial === mat ? null : mat)} className={`text-xs font-body px-3 py-1.5 rounded-full border capitalize transition-colors ${selectedMaterial === mat ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}>{mat}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-foreground mb-2">Price Range</p>
                <div className="flex items-center gap-2">
                  <input type="number" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="w-20 text-xs font-body bg-secondary border border-border rounded px-2 py-1.5" placeholder="Min" />
                  <span className="text-muted-foreground text-xs">–</span>
                  <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="w-20 text-xs font-body bg-secondary border border-border rounded px-2 py-1.5" placeholder="Max" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <p className="text-xs text-muted-foreground font-body mb-6">{filtered.length} products</p>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body">No products match your filters.</p>
            <button onClick={clearFilters} className="text-sm text-primary font-body mt-2">Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BedsheetsShop;
