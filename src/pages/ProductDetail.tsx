import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, Shield, ArrowLeft } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import RangoliSpinner from '@/components/RangoliSpinner';
import bedsheetImg from '@/assets/product-bedsheet-1.jpg';
import jewelryImg from '@/assets/product-jewelry-1.jpg';
import type { Product } from '@/hooks/useProducts';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ProductDetail = () => {
  const { id: slug } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { formatPrice, flatShippingFee, currencySymbol, regionName } = useCurrency();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product-slug', slug],
    queryFn: async () => {
      // Try by slug first, then by id
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

  // Set defaults when product loads
  if (product && !selectedSize && product.sizes?.length) {
    setSelectedSize(product.sizes[0]);
  }
  if (product && !selectedColor && product.colors?.length) {
    setSelectedColor(product.colors[0]);
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><RangoliSpinner /></div>;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-body mb-4">Product not found</p>
        <Link to="/bedsheets" className="text-sm text-primary font-body">Browse products</Link>
      </div>
    );
  }

  const related = allProducts?.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) || [];
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <Link to={product.category === 'bedsheet' ? '/bedsheets' : '/jewelry'} className="inline-flex items-center gap-2 text-xs text-muted-foreground font-body mb-6 hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to {product.category === 'bedsheet' ? 'Bedsheets' : 'Jewelry'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="aspect-square bg-secondary rounded-2xl overflow-hidden">
            <img
              src={product.images?.[0] !== '/placeholder.svg' ? product.images?.[0] || '' : product.category === 'bedsheet' ? bedsheetImg : jewelryImg}
              alt={product.name}
              className="w-full h-full object-cover"
              width={800} height={800}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {product.new_arrival && (
              <span className="inline-block bg-gold text-accent-foreground text-[10px] font-body font-medium px-2.5 py-1 rounded-full mb-3">NEW ARRIVAL</span>
            )}
            <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating || 0) ? 'text-gold fill-gold' : 'text-border'} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-body">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading text-3xl font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
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
                    <button key={size} onClick={() => setSelectedSize(size)} className={`text-sm font-body px-4 py-2 rounded-lg border transition-colors ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}>{size}</button>
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
    </div>
  );
};

export default ProductDetail;
