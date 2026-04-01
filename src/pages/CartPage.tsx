import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-muted-foreground" />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground font-body mb-6">Start shopping to add items to your cart</p>
        <Link to="/bedsheets" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body text-sm font-medium hover:bg-maroon-light transition-colors">
          Shop Bedsheets
        </Link>
      </div>
    );
  }

  const shipping = totalPrice >= 2999 ? 0 : 199;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <Link to="/bedsheets" className="inline-flex items-center gap-2 text-xs text-muted-foreground font-body mb-6 hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Continue Shopping
        </Link>

        <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4 p-4 bg-card border border-border rounded-xl"
              >
                <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-2xl">{item.product.category === 'bedsheet' ? '🛏️' : '💎'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-sm font-medium text-foreground truncate">{item.product.name}</h3>
                      {item.selectedSize && <p className="text-xs text-muted-foreground font-body">Size: {item.selectedSize}</p>}
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-secondary">
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-body w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-secondary">
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-heading text-sm font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-28">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-foreground font-medium">
                <span>Total</span>
                <span className="font-heading text-lg">₹{(totalPrice + shipping).toLocaleString()}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full mt-6 bg-primary text-primary-foreground text-center py-3.5 rounded-lg font-body font-medium text-sm hover:bg-maroon-light transition-colors"
            >
              Proceed to Checkout
            </Link>
            {totalPrice < 2999 && (
              <p className="text-[10px] text-muted-foreground font-body mt-3 text-center">
                Add ₹{(2999 - totalPrice).toLocaleString()} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
