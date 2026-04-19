import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContent } from '@/hooks/useSiteContent';
import SearchCommand from '@/components/SearchCommand';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Bedsheets', path: '/bedsheets' },
  { label: 'Jewelry', path: '/jewelry' },
  { label: 'New Arrivals', path: '/bedsheets?filter=new' },
  { label: 'Best Sellers', path: '/bedsheets?filter=bestseller' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const { totalItems } = useCart();
  const { count: wishCount } = useWishlist();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: globalContent } = useGlobalContent();

  const c = (field: string, fallback: string) => globalContent?.navbar?.[field] ?? fallback;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="bg-primary text-primary-foreground text-center text-xs py-1.5 font-body tracking-wider">
        {c('announcement', 'Free shipping on orders above ₹2,999 ✦ Handcrafted with love')}
      </div>

      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="flex flex-col items-center">
            <span className="font-heading text-xl lg:text-2xl font-semibold text-foreground tracking-wide">
              {c('brand_name', 'Rangoli')}
            </span>
            <span className="text-[10px] lg:text-xs tracking-[0.3em] text-muted-foreground font-body uppercase -mt-1">
              {c('brand_tagline', 'Creations')}
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`text-sm font-body tracking-wide transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{link.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Search">
              <Search size={18} />
            </button>
            <Link to="/wishlist" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Wishlist">
              <Heart size={18} />
              {wishCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">{wishCount}</motion.span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Cart">
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-medium">{totalItems}</motion.span>
              )}
            </Link>
            <Link to="/admin" className="p-2 text-foreground hover:text-primary transition-colors hidden sm:block" aria-label="Admin">
              <User size={18} />
            </Link>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden overflow-hidden border-t border-border bg-background">
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className={`text-sm font-body py-2 border-b border-border/50 ${location.pathname === link.path ? 'text-primary font-medium' : 'text-foreground'}`}>{link.label}</Link>
              ))}
              <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="text-sm font-body py-2 text-foreground">Wishlist ({wishCount})</Link>
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-body py-2 text-foreground">Admin Panel</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Navbar;
