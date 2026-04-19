import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, Shield, ArrowLeft, Award, CheckCircle, Lock, Heart, X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import ProductCard from '@/components/ProductCard';
import RangoliSpinner from '@/components/RangoliSpinner';
import RecentlyViewed from '@/components/RecentlyViewed';
import SEO from '@/components/SEO';
import bedsheetImg from '@/assets/product-bedsheet-1.jpg';
import jewelryImg from '@/assets/product-jewelry-1.jpg';
import type { Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ProductDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggle } = useWishlist();
  const { add: addRecent } = useRecentlyViewed();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product-slug', slug],
    queryFn: async () => {
      let { data, error } = await supabase.from('products').select('*').eq('slug', slug!).maybeSingle();
      if (!data) {
        ({ data, error } = await supabase.from('products').select('*').eq('id', slug!).maybeSingle());
      }
      if (error) throw error;
      return data as Product | null;
    },
    enabled: !!slug,
  });

  const { data: allProducts } = useProducts();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (product) {
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.colors?.length) setSelectedColor(product.colors[0]);
      setActiveImageIdx(0);
      addRecent(product.id);
    }
  }, [product, addRecent]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><RangoliSpinner /></div>;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-body mb-4">Product not found</p>
        <Link to="/bedsheets" className="text-sm text-primary font-body">Browse products</Link>
      </div>
    );
  }

  const ext = product as any;
  const variantPrices = ext.variant_prices as Record<string, number> | null;
  const favouriteVariant = ext.favourite_variant as string | null;
  const subtitle = ext.subtitle as string | null;
  const trustSignals = (ext.trust_signals || []) as Array<{ icon: string; text: string }>;
  const benefitPoints = (ext.benefit_points || []) as string[];

  const currentPrice = variantPrices && selectedSize && variantPrices[selectedSize]
    ? variantPrices[selectedSize]
    : product.price;

  const related = allProducts?.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) || [];
  const discount = product.original_price
    ? Math.round(((product.original_price - currentPrice) / product.original_price) * 100)
    : 0;

  const images = (product.images || []).filter(img => img && img !== '/placeholder.svg');
  const fallbackImg = product.category === 'bedsheet' ? bedsheetImg : jewelryImg;
  if (images.length === 0) images.push(fallbackImg);
  const mainImg = images[activeImageIdx] || images[0];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const trustIconMap: Record<string, React.ElementType> = { Truck, RotateCcw, Shield, Lock, CheckCircle, Heart };

  const defaultTrustSignals = [
    { icon: 'RotateCcw', text: 'Free Returns' },
    { icon: 'Shield', text: 'Quality Guarantee' },
    { icon: 'Lock', text: 'Secure Checkout' },
  ];
  const displayTrustSignals = trustSignals.length > 0 ? trustSignals : defaultTrustSignals;

  const wished = isInWishlist(product.id);

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || subtitle || '',
    image: mainImg,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Rangoli Creations' },
    aggregateRating: product.rating
      ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews || 1 }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: typeof window !== 'undefined' ? window.location.href : '',
      priceCurrency: 'INR',
      price: currentPrice,
      availability: (product.units ?? 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <SEO
        title={product.name}
        description={subtitle || product.description?.slice(0, 155) || `Shop ${product.name} at Rangoli Creations.`}
        image={mainImg}
        type="product"
        jsonLd={productJsonLd}
      />
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <Link to={product.category === 'bedsheet' ? '/bedsheets' : '/jewelry'} className="inline-flex items-center gap-2 text-xs text-muted-foreground font-body mb-6 hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to {product.category === 'bedsheet' ? 'Bedsheets' : 'Jewelry'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Main image with hover zoom (desktop) */}
            <div
              ref={imgRef}
              className="relative aspect-square bg-secondary rounded-2xl overflow-hidden cursor-zoom-in lg:cursor-crosshair"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => {
                if (window.innerWidth < 1024) setLightboxOpen(true);
              }}
            >
              <img
                src={mainImg}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200"
                style={isZooming && window.innerWidth >= 1024 ? {
                  transform: 'scale(2)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                } : undefined}
                width={800} height={800}
              />
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {images.slice(0, 6).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImageIdx === idx ? 'border-gold' : 'border-border hover:border-maroon-light'}`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {product.new_arrival && (
              <span className="inline-block bg-gold text-accent-foreground text-[10px] font-body font-medium px-2.5 py-1 rounded-full mb-3">NEW ARRIVAL</span>
            )}
            <div className="flex items-start justify-between gap-3">
              <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-1">{product.name}</h1>
              <button
                onClick={() => toggle(product.id, product.name)}
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                className="shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Heart size={18} className={wished ? 'text-primary fill-primary' : 'text-muted-foreground'} />
              </button>
            </div>

            {subtitle && (
              <p className="text-sm text-primary font-body font-medium mb-3">{subtitle}</p>
            )}

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating || 0) ? 'text-gold fill-gold' : 'text-border'} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-body">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Trust signals bar */}
            <div className="flex flex-wrap gap-4 mb-5 py-3 px-4 bg-secondary/60 rounded-xl border border-border">
              {displayTrustSignals.map((ts, i) => {
                const Icon = trustIconMap[ts.icon] || Shield;
                return (
                  <div key={i} className="flex items-center gap-1.5">
                    <Icon size={14} className="text-gold-dark shrink-0" />
                    <span className="text-[11px] font-body text-muted-foreground">{ts.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading text-3xl font-semibold text-foreground">₹{currentPrice.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through font-body">₹{product.original_price.toLocaleString()}</span>
                  <span className="text-sm text-primary font-body font-medium">-{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-body font-medium text-foreground mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`relative text-sm font-body px-4 py-2 rounded-lg border transition-colors ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}
                    >
                      {size}
                      {variantPrices?.[size] && (
                        <span className="block text-[10px] opacity-70">₹{variantPrices[size].toLocaleString()}</span>
                      )}
                      {favouriteVariant === size && (
                        <span className="absolute -top-2.5 -right-1 flex items-center gap-0.5 bg-gold text-accent-foreground text-[8px] font-body font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          <Award size={9} /> Customer's Favourite
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-body font-medium text-foreground mb-2">Color: {selectedColor}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${selectedColor === color ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}>{color}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs font-body font-medium text-foreground mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Minus size={14} /></button>
                <span className="w-10 text-center font-body font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.units || 99, quantity + 1))} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"><Plus size={14} /></button>
                <span className="text-xs text-muted-foreground font-body">{product.units} available</span>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-lg font-body font-medium text-sm hover:bg-maroon-light transition-colors">
                <ShoppingBag size={16} /> Add to Cart
              </motion.button>
              <Link to="/cart" onClick={handleAddToCart} className="flex-1 flex items-center justify-center border-2 border-primary text-primary py-3.5 rounded-lg font-body font-medium text-sm hover:bg-primary/5 transition-colors">Buy Now</Link>
            </div>

            {/* Why You'll Love It */}
            {benefitPoints.length > 0 && (
              <div className="mb-6 p-4 bg-gold/5 border border-gold/20 rounded-xl">
                <h3 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Heart size={14} className="text-primary" /> Why You'll Love It
                </h3>
                <ul className="space-y-2">
                  {benefitPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-gold-dark mt-0.5 shrink-0" />
                      <span className="text-xs text-muted-foreground font-body">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3 border-t border-border pt-6">
              {product.material && (
                <div className="flex items-start gap-3">
                  <Shield size={16} className="text-gold-dark mt-0.5 shrink-0" />
                  <div><p className="text-xs font-body font-medium text-foreground">Material</p><p className="text-xs text-muted-foreground font-body">{product.material}</p></div>
                </div>
              )}
              {product.care_instructions && (
                <div className="flex items-start gap-3">
                  <RotateCcw size={16} className="text-gold-dark mt-0.5 shrink-0" />
                  <div><p className="text-xs font-body font-medium text-foreground">Care Instructions</p><p className="text-xs text-muted-foreground font-body">{product.care_instructions}</p></div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Truck size={16} className="text-gold-dark mt-0.5 shrink-0" />
                <div><p className="text-xs font-body font-medium text-foreground">Delivery</p><p className="text-xs text-muted-foreground font-body">Free shipping on orders above ₹2,999. Estimated 5-7 business days.</p></div>
              </div>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 lg:mt-24 pb-12">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </section>
        )}
      </div>

      <RecentlyViewed excludeId={product.id} />

      {/* Sticky Mobile Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-4 flex items-center gap-3 lg:hidden z-40">
        <div className="flex-1">
          <p className="font-heading text-lg font-semibold text-foreground">₹{currentPrice.toLocaleString()}</p>
          {product.original_price && <p className="text-xs text-muted-foreground line-through font-body">₹{product.original_price.toLocaleString()}</p>}
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body font-medium text-sm hover:bg-maroon-light transition-colors"
        >
          <ShoppingBag size={16} /> Add to Cart
        </motion.button>
      </div>

      {/* Mobile Lightbox with swipe */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 flex flex-col items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-background" onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}>
              <X size={20} />
            </button>
            {images.length > 1 && (
              <>
                <button className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-background" onClick={(e) => { e.stopPropagation(); setActiveImageIdx((activeImageIdx - 1 + images.length) % images.length); }}>
                  <ArrowLeft size={18} />
                </button>
                <button className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center text-background rotate-180" onClick={(e) => { e.stopPropagation(); setActiveImageIdx((activeImageIdx + 1) % images.length); }}>
                  <ArrowLeft size={18} />
                </button>
              </>
            )}
            <div
              className="w-full h-full flex items-center justify-center p-4 touch-pinch-zoom"
              style={{ touchAction: 'pinch-zoom' }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => { (e.currentTarget as any)._touchX = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                const startX = (e.currentTarget as any)._touchX;
                if (startX == null) return;
                const diff = (e.changedTouches[0]?.clientX || 0) - startX;
                if (Math.abs(diff) > 50) {
                  setActiveImageIdx(diff > 0 ? (activeImageIdx - 1 + images.length) % images.length : (activeImageIdx + 1) % images.length);
                }
              }}
            >
              <img src={images[activeImageIdx] || images[0]} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-6 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setActiveImageIdx(i); }} className={`w-2 h-2 rounded-full transition-colors ${i === activeImageIdx ? 'bg-gold' : 'bg-background/40'}`} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
