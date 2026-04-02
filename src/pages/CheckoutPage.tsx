import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Truck, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/hooks/useOrders';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<'checkout' | 'confirmed'>('checkout');
  const [coupon, setCoupon] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit / Debit Card');

  const shipping = totalPrice >= 2999 ? 0 : 199;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const order = await createOrder({
        firstName: fd.get('firstName') as string,
        lastName: fd.get('lastName') as string,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        addressLine1: fd.get('address1') as string,
        addressLine2: fd.get('address2') as string,
        city: fd.get('city') as string,
        state: fd.get('state') as string,
        pinCode: fd.get('pinCode') as string,
        country: fd.get('country') as string || 'India',
        paymentMethod,
        couponCode: coupon,
        items,
        subtotal: totalPrice,
        shipping,
        total: totalPrice + shipping,
      });

      setOrderNumber(order.order_number);
      setStep('confirmed');
      clearCart();
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
            <Check size={36} className="text-gold-dark" />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-foreground mb-3">Order Confirmed!</h1>
          <p className="text-sm text-muted-foreground font-body mb-2">Thank you for shopping with Rangoli Creations.</p>
          <p className="text-xs text-muted-foreground font-body mb-8">Order #{orderNumber} • A confirmation email has been sent.</p>
          <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body text-sm font-medium hover:bg-maroon-light transition-colors">Continue Shopping</Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground font-body mb-4">Your cart is empty</p>
        <Link to="/bedsheets" className="text-sm text-primary font-body">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs text-muted-foreground font-body mb-6 hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        <h1 className="font-heading text-2xl lg:text-3xl font-semibold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={16} className="text-gold-dark" />
                  <h2 className="font-heading text-base font-semibold text-foreground">Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input name="firstName" required placeholder="First Name" className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="lastName" required placeholder="Last Name" className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="email" required type="email" placeholder="Email" className="sm:col-span-2 bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="phone" required placeholder="Phone" className="sm:col-span-2 bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="address1" required placeholder="Address Line 1" className="sm:col-span-2 bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="address2" placeholder="Address Line 2" className="sm:col-span-2 bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="city" required placeholder="City" className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="state" required placeholder="State" className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="pinCode" required placeholder="PIN Code" className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                  <input name="country" required placeholder="Country" defaultValue="India" className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={16} className="text-gold-dark" />
                  <h2 className="font-heading text-base font-semibold text-foreground">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {['Credit / Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'].map((method, i) => (
                    <label key={method} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                      <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="accent-primary" />
                      <span className="text-sm font-body">{method}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground font-body mt-3">This is a demo. No real payment will be processed.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-28">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground truncate mr-2">{item.product.name} × {item.quantity}</span>
                    <span className="shrink-0">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-4">
                <div className="flex-1 flex items-center gap-2 bg-secondary border border-border rounded-lg px-3">
                  <Tag size={13} className="text-muted-foreground" />
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="bg-transparent py-2 text-sm font-body outline-none w-full" />
                </div>
                <button type="button" className="bg-secondary border border-border text-sm font-body px-3 rounded-lg hover:bg-muted transition-colors">Apply</button>
              </div>

              <div className="space-y-2 text-sm font-body border-t border-border pt-4">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-foreground font-medium pt-2 border-t border-border"><span>Total</span><span className="font-heading text-xl">₹{(totalPrice + shipping).toLocaleString()}</span></div>
              </div>

              <button type="submit" disabled={submitting} className="w-full mt-6 bg-primary text-primary-foreground py-3.5 rounded-lg font-body font-medium text-sm hover:bg-maroon-light transition-colors disabled:opacity-50">
                {submitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
