import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSiteContent = (page: string) => {
  return useQuery({
    queryKey: ['site-content', page],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('page', page)
        .order('sort_order');
      if (error) throw error;

      // Build a nested map: section -> field -> value
      const content: Record<string, Record<string, string>> = {};
      for (const row of data) {
        if (!content[row.section]) content[row.section] = {};
        content[row.section][row.field] = row.value;
      }
      return content;
    },
  });
};

export const useGlobalContent = () => useSiteContent('global');
