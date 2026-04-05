import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import bedsheetImg from '@/assets/product-bedsheet-1.jpg';
import jewelryImg from '@/assets/product-jewelry-1.jpg';

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-secondary overflow-hidden">
        <img
          src={product.images?.[0] !== '/placeholder.svg' ? product.images?.[0] || '' : product.category === 'bedsheet' ? bedsheetImg : jewelryImg}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          width={800}
          height={1000}
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.new_arrival && (
            <span className="bg-gold text-accent-foreground text-[10px] font-body font-medium px-2 py-0.5 rounded-full">NEW</span>
          )}
          {discount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-body font-medium px-2 py-0.5 rounded-full">-{discount}%</span>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute bottom-3 left-3 right-3 flex gap-2"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1, product.sizes?.[0]);
            }}
            className="flex-1 bg-primary text-primary-foreground text-xs font-body font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-maroon-light transition-colors"
          >
            <ShoppingBag size={13} />
            Add to Cart
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="bg-background/90 backdrop-blur-sm text-foreground p-2.5 rounded-lg hover:bg-background transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye size={14} />
          </Link>
        </motion.div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-heading text-sm font-medium text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} className={i < Math.floor(product.rating || 0) ? 'text-gold fill-gold' : 'text-border'} />
          ))}
          <span className="text-[10px] text-muted-foreground font-body ml-1">({product.reviews || 0})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-heading text-base font-semibold text-foreground">₹{product.price.toLocaleString()}</span>
          {product.original_price && (
            <span className="text-xs text-muted-foreground line-through font-body">₹{product.original_price.toLocaleString()}</span>
          )}
        </div>

        {product.sizes && product.sizes.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.slice(0, 3).map(size => (
              <span key={size} className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-body">{size}</span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-[10px] text-muted-foreground font-body">+{product.sizes.length - 3}</span>
            )}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground font-body mt-2">{product.units || 0} units available</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
