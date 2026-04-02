import { supabase } from '@/integrations/supabase/client';
import type { CartItem } from '@/context/CartContext';

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  paymentMethod: string;
  couponCode?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export const createOrder = async (data: OrderData) => {
  const orderNumber = `RC${Date.now().toString().slice(-8)}`;

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_first_name: data.firstName,
      customer_last_name: data.lastName,
      customer_email: data.email,
      customer_phone: data.phone,
      address_line1: data.addressLine1,
      address_line2: data.addressLine2 || null,
      city: data.city,
      state: data.state,
      pin_code: data.pinCode,
      country: data.country,
      payment_method: data.paymentMethod,
      coupon_code: data.couponCode || null,
      subtotal: data.subtotal,
      shipping: data.shipping,
      total: data.total,
    })
    .select()
    .single();

  if (error) throw error;

  // Insert order items
  const orderItems = data.items.map(item => ({
    order_id: order.id,
    product_name: item.product.name,
    quantity: item.quantity,
    price: item.product.price,
    size: item.selectedSize || null,
    color: item.selectedColor || null,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  return order;
};
