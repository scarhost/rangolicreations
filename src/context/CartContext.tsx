import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { CartContext, type CartItem } from './cart-context-core';

export { useCart } from './cart-context-core';
export type { CartItem } from './cart-context-core';

const CART_STORAGE_KEY = 'rangoli_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items]);

  const addToCart = useCallback((product: Parameters<NonNullable<React.ContextType<typeof CartContext>>['addToCart']>[0], quantity = 1, size?: string, color?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedSize === size);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
    });
    toast.success(`Added "${product.name}" to cart`, {
      description: size ? `Size: ${size}` : undefined,
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.product.id !== productId));
      return;
    }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};
