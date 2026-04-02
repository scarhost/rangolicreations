import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trash2 } from 'lucide-react';

const AdminNewsletter = () => {
  const queryClient = useQueryClient();

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['admin-newsletter'],
    queryFn: async () => {
      const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-newsletter'] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-foreground mb-6">Newsletter Subscribers ({subscribers?.length || 0})</h2>

      {subscribers?.length === 0 ? (
        <p className="text-sm text-muted-foreground font-body">No subscribers yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Email</th>
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Subscribed</th>
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-right py-3 px-2 font-body font-medium text-muted-foreground text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers?.map(s => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 px-2 font-body text-foreground">{s.email}</td>
                  <td className="py-3 px-2 font-body text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-body ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {s.is_active ? 'Active' : 'Unsubscribed'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button onClick={() => { if (confirm('Remove subscriber?')) deleteMutation.mutate(s.id); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminNewsletter;
