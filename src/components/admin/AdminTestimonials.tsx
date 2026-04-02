import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Save, X, Star } from 'lucide-react';

const AdminTestimonials = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase.from('testimonials').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (item: Record<string, any>) => {
      if (item.id) {
        const { error } = await supabase.from('testimonials').update(item).eq('id', item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert([{ name: item.name, location: item.location, text: item.text, rating: item.rating, is_active: item.is_active, sort_order: item.sort_order }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      setEditing(null); setCreating(false); setForm({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  const isFormOpen = editing || creating;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Testimonials</h2>
        <button onClick={() => { setCreating(true); setEditing(null); setForm({ name: '', location: '', text: '', rating: 5, is_active: true, sort_order: 0 }); }} className="flex items-center gap-2 text-sm font-body bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-maroon-light transition-colors">
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6 p-4 bg-secondary/50 border border-border rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold">{creating ? 'New Testimonial' : 'Edit Testimonial'}</h3>
            <button onClick={() => { setEditing(null); setCreating(false); setForm({}); }}><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-xs font-body font-medium">Name</label><input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold" /></div>
            <div><label className="text-xs font-body font-medium">Location</label><input value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold" /></div>
            <div className="sm:col-span-2"><label className="text-xs font-body font-medium">Review Text</label><textarea value={form.text || ''} onChange={e => setForm({ ...form, text: e.target.value })} rows={3} className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold resize-none" /></div>
            <div><label className="text-xs font-body font-medium">Rating (1-5)</label><input type="number" min={1} max={5} value={form.rating || 5} onChange={e => setForm({ ...form, rating: +e.target.value })} className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold" /></div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" />
              <label className="text-sm font-body">Active</label>
            </div>
          </div>
          <button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="flex items-center gap-2 text-sm font-body bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-maroon-light transition-colors disabled:opacity-50"><Save size={14} /> Save</button>
        </div>
      )}

      <div className="space-y-3">
        {testimonials?.map(t => (
          <div key={t.id} className="flex items-start gap-4 p-4 border border-border rounded-xl hover:bg-secondary/30">
            <div className="flex-1">
              <div className="flex gap-1 mb-1">{Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={12} className="text-gold fill-gold" />)}</div>
              <p className="text-sm font-body text-foreground italic mb-1">"{t.text}"</p>
              <p className="text-xs font-body text-muted-foreground">{t.name}, {t.location}</p>
              {!t.is_active && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-body mt-1 inline-block">Inactive</span>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => { setEditing(t.id); setCreating(false); setForm({ ...t }); }} className="p-1.5 text-muted-foreground hover:text-primary"><Pencil size={14} /></button>
              <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(t.id); }} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
