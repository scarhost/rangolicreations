import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useProducts } from '@/hooks/useProducts';

const RecentlyViewed = ({ excludeId }: { excludeId?: string }) => {
  const { ids } = useRecentlyViewed();
  const { data: products } = useProducts();

  const items = (products || [])
    .filter(p => ids.includes(p.id) && p.id !== excludeId)
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="py-12 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="font-heading text-xl lg:text-2xl font-semibold text-foreground mb-6">Recently Viewed</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
