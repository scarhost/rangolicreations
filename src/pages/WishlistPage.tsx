import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';

const WishlistPage = () => {
  const { ids, clear } = useWishlist();
  const { data: products, isLoading } = useProducts();

  const items = products?.filter(p => ids.includes(p.id)) || [];

  return (
    <div className="min-h-screen">
      <SEO
        title="Your Wishlist"
        description="Items you've saved for later at Rangoli Creations."
      />
      <div className="bg-gradient-to-r from-blush/40 via-background to-gold/5 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <Heart size={28} className="text-primary mx-auto mb-3" />
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground">Your Wishlist</h1>
          <p className="text-sm text-muted-foreground font-body mt-2">
            {ids.length === 0 ? 'Save your favourites for later' : `${ids.length} item${ids.length === 1 ? '' : 's'} saved`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : ids.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-muted-foreground" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-muted-foreground font-body mb-6">Tap the heart icon on any product to save it here.</p>
            <Link to="/bedsheets" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body text-sm font-medium hover:bg-maroon-light transition-colors">
              <ShoppingBag size={16} /> Start Shopping
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={clear} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-body hover:text-destructive transition-colors">
                <Trash2 size={12} /> Clear all
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
