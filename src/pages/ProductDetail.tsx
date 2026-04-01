import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, Shield, ArrowLeft } from 'lucide-react';
import { getProductById, allProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import bedsheetImg from '@/assets/product-bedsheet-1.jpg';
import jewelryImg from '@/assets/product-jewelry-1.jpg';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-body mb-4">Product not found</p>
        <Link to="/bedsheets" className="text-sm text-primary font-body">Browse products</Link>
      </div>
    );
  }

  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Link to={product.category === 'bedsheet' ? '/bedsheets' : '/jewelry'} className="inline-flex items-center gap-2 text-xs text-muted-foreground font-body mb-6 hover:text-primary transition-colors">
          <ArrowLeft size={14} />
          Back to {product.category === 'bedsheet' ? 'Bedsheets' : 'Jewelry'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-square bg-secondary rounded-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <span className="text-5xl">{product.category === 'bedsheet' ? '🛏️' : '💎'}</span>
              </div>
              <p className="text-sm text-muted-foreground font-body">{product.name}</p>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {product.newArrival && (
              <span className="inline-block bg-gold text-accent-foreground text-[10px] font-body font-medium px-2.5 py-1 rounded-full mb-3">NEW ARRIVAL</span>
            )}

            <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'text-gold fill-gold' : 'text-border'} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-body">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading text-3xl font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through font-body">₹{product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm text-primary font-body font-medium">-{discount}% OFF</span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

            {/* Size selector */}
            {product.sizes && (
              <div className="mb-5">
                <p className="text-xs font-body font-medium text-foreground mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-sm font-body px-4 py-2 rounded-lg border transition-colors ${
                        selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors && (
              <div className="mb-5">
                <p className="text-xs font-body font-medium text-foreground mb-2">Color: {selectedColor}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${
                        selectedColor === color ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-body font-medium text-foreground mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-body font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.units, quantity + 1))} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors">
                  <Plus size={14} />
                </button>
                <span className="text-xs text-muted-foreground font-body">{product.units} available</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-lg font-body font-medium text-sm hover:bg-maroon-light transition-colors"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </motion.button>
              <Link
                to="/cart"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center border-2 border-primary text-primary py-3.5 rounded-lg font-body font-medium text-sm hover:bg-primary/5 transition-colors"
              >
                Buy Now
              </Link>
            </div>

            {/* Info */}
            <div className="space-y-3 border-t border-border pt-6">
              {product.material && (
                <div className="flex items-start gap-3">
                  <Shield size={16} className="text-gold-dark mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-body font-medium text-foreground">Material</p>
                    <p className="text-xs text-muted-foreground font-body">{product.material}</p>
                  </div>
                </div>
              )}
              {product.careInstructions && (
                <div className="flex items-start gap-3">
                  <RotateCcw size={16} className="text-gold-dark mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-body font-medium text-foreground">Care Instructions</p>
                    <p className="text-xs text-muted-foreground font-body">{product.careInstructions}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Truck size={16} className="text-gold-dark mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-body font-medium text-foreground">Delivery</p>
                  <p className="text-xs text-muted-foreground font-body">Free shipping on orders above ₹2,999. Estimated 5-7 business days.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 lg:mt-24 pb-12">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
