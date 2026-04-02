import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type Product = Tables<'products'>;

export const useProducts = (category?: 'bedsheet' | 'jewelry') => {
  return useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let query = supabase.from('products').select('*').eq('is_active', true).order('sort_order');
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: ['product-id', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
};
