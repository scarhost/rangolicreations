import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-foreground mb-6">Orders ({orders?.length || 0})</h2>

      {orders?.length === 0 ? (
        <p className="text-sm text-muted-foreground font-body">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Order #</th>
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Customer</th>
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Total</th>
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Date</th>
                <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map(o => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="py-3 px-2 font-body font-medium text-foreground">{o.order_number}</td>
                  <td className="py-3 px-2 font-body text-foreground">
                    <div>{o.customer_first_name} {o.customer_last_name}</div>
                    <div className="text-[10px] text-muted-foreground">{o.customer_email}</div>
                  </td>
                  <td className="py-3 px-2 font-body text-foreground">₹{o.total.toLocaleString()}</td>
                  <td className="py-3 px-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-body ${statusColors[o.status || 'pending']}`}>{o.status}</span>
                  </td>
                  <td className="py-3 px-2 font-body text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-2">
                    <select
                      value={o.status || 'pending'}
                      onChange={e => updateStatus.mutate({ id: o.id, status: e.target.value })}
                      className="text-xs font-body bg-background border border-border rounded px-2 py-1 outline-none"
                    >
                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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

export default AdminOrders;
