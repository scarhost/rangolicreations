import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { bedsheets } from '@/data/products';

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

  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sort, setSort] = useState(filterParam || 'featured');

  const filtered = useMemo(() => {
    let result = [...bedsheets];

    if (selectedSize) result = result.filter(p => p.sizes?.includes(selectedSize));
    if (selectedMaterial) result = result.filter(p => p.subcategory === selectedMaterial);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sort) {
      case 'new': result = result.filter(p => p.newArrival); break;
      case 'bestseller': result = result.filter(p => p.bestSeller); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    }

    return result;
  }, [selectedSize, selectedMaterial, priceRange, sort]);

  const clearFilters = () => {
    setSelectedSize(null);
    setSelectedMaterial(null);
    setPriceRange([0, 10000]);
    setSort('featured');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary via-background to-blush/30 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Our Collection</span>
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">Premium Bedsheets</h1>
          <p className="text-sm text-muted-foreground font-body mt-3 max-w-md mx-auto">
            Handcrafted luxury for your bedroom. Each piece tells a story of Indian artistry.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-body text-foreground border border-border rounded-lg px-4 py-2 hover:bg-secondary transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-body hidden sm:block">Sort by:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-sm font-body bg-secondary border border-border rounded-lg px-3 py-2 outline-none"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-8 p-4 bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-semibold">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-primary font-body flex items-center gap-1">
                <X size={12} /> Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-body font-medium text-foreground mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${
                        selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-foreground mb-2">Material</p>
                <div className="flex flex-wrap gap-2">
                  {materials.map(mat => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(selectedMaterial === mat ? null : mat)}
                      className={`text-xs font-body px-3 py-1.5 rounded-full border capitalize transition-colors ${
                        selectedMaterial === mat ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-body font-medium text-foreground mb-2">Price Range</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                    className="w-20 text-xs font-body bg-secondary border border-border rounded px-2 py-1.5"
                    placeholder="Min"
                  />
                  <span className="text-muted-foreground text-xs">–</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                    className="w-20 text-xs font-body bg-secondary border border-border rounded px-2 py-1.5"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <p className="text-xs text-muted-foreground font-body mb-6">{filtered.length} products</p>

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
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
