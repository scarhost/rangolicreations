import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Star, Award } from 'lucide-react';
import type { Product } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import bedsheetImg from '@/assets/product-bedsheet-1.jpg';
import jewelryImg from '@/assets/product-jewelry-1.jpg';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const variantPrices = (product as any).variant_prices as Record<string, number> | null;
  const favouriteVariant = (product as any).favourite_variant as string | null;
  const currentPrice = variantPrices && selectedSize && variantPrices[selectedSize]
    ? variantPrices[selectedSize]
    : product.price;

  const discount = product.original_price
    ? Math.round(((product.original_price - currentPrice) / product.original_price) * 100)
    : 0;

  const imgSrc = product.images?.[0] !== '/placeholder.svg'
    ? product.images?.[0] || ''
    : product.category === 'bedsheet' ? bedsheetImg : jewelryImg;

  const handleAdd = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X size={16} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
              {/* Image */}
              <div className="aspect-square bg-secondary overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
                <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col">
                {product.new_arrival && (
                  <span className="inline-block w-fit bg-gold text-accent-foreground text-[10px] font-body font-medium px-2.5 py-1 rounded-full mb-2">NEW ARRIVAL</span>
                )}
                <h2 className="font-heading text-xl font-semibold text-foreground mb-1">{product.name}</h2>

                <div className="flex items-center gap-1.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < Math.floor(product.rating || 0) ? 'text-gold fill-gold' : 'text-border'} />
                  ))}
                  <span className="text-[10px] text-muted-foreground font-body ml-1">({product.reviews})</span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-heading text-2xl font-semibold text-foreground">₹{currentPrice.toLocaleString()}</span>
                  {product.original_price && (
                    <>
                      <span className="text-sm text-muted-foreground line-through font-body">₹{product.original_price.toLocaleString()}</span>
                      <span className="text-xs text-primary font-body font-medium">-{discount}%</span>
                    </>
                  )}
                </div>

                {/* Size selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-body font-medium text-foreground mb-2">Size</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`relative text-xs font-body px-3 py-1.5 rounded-lg border transition-colors ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}
                        >
                          {size}
                          {variantPrices?.[size] && (
                            <span className="block text-[9px] opacity-70">₹{variantPrices[size].toLocaleString()}</span>
                          )}
                          {favouriteVariant === size && (
                            <span className="absolute -top-2 -right-1 flex items-center gap-0.5 bg-gold text-accent-foreground text-[8px] font-body font-medium px-1 py-0.5 rounded-full">
                              <Award size={8} /> Fav
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-body font-medium text-foreground mb-2">Color</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => (
                        <button key={color} onClick={() => setSelectedColor(color)} className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${selectedColor === color ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-secondary'}`}>{color}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAdd}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-body font-medium text-sm hover:bg-maroon-light transition-colors"
                  >
                    <ShoppingBag size={16} /> Add to Cart
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
