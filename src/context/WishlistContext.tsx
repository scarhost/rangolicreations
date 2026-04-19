import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'rangoli_wishlist_v1';

interface WishlistContextType {
  ids: string[];
  isInWishlist: (id: string) => boolean;
  toggle: (id: string, name?: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const isInWishlist = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback((id: string, name?: string) => {
    setIds(prev => {
      if (prev.includes(id)) {
        toast(`Removed${name ? ` "${name}"` : ''} from wishlist`);
        return prev.filter(i => i !== id);
      }
      toast.success(`Added${name ? ` "${name}"` : ''} to wishlist ❤️`);
      return [...prev, id];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setIds(prev => prev.filter(i => i !== id));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  return (
    <WishlistContext.Provider value={{ ids, isInWishlist, toggle, remove, clear, count: ids.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
