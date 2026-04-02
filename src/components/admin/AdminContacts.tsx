import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Eye } from 'lucide-react';

const AdminContacts = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-contacts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-contacts'] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-foreground mb-6">Contact Messages ({messages?.length || 0})</h2>

      {messages?.length === 0 ? (
        <p className="text-sm text-muted-foreground font-body">No contact messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages?.map(m => (
            <div key={m.id} className={`p-4 border rounded-xl ${m.is_read ? 'border-border bg-background' : 'border-gold/30 bg-gold/5'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-body font-medium text-foreground">{m.name}</span>
                    <span className="text-xs text-muted-foreground font-body">{m.email}</span>
                    {!m.is_read && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-body">New</span>}
                  </div>
                  {m.subject && <p className="text-xs font-body font-medium text-foreground mb-1">{m.subject}</p>}
                  <p className="text-sm text-muted-foreground font-body">{m.message}</p>
                  <p className="text-[10px] text-muted-foreground font-body mt-2">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  {!m.is_read && <button onClick={() => markRead.mutate(m.id)} className="p-1.5 text-muted-foreground hover:text-primary"><Eye size={14} /></button>}
                  <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(m.id); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
