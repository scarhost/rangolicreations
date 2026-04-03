import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface ShippingZone {
  id: string;
  region_name: string;
  countries: string[];
  currency_code: string;
  markup_percentage: number;
  flat_shipping_fee: number;
  is_active: boolean;
  sort_order: number;
}

const emptyZone = {
  region_name: '',
  countries: [] as string[],
  currency_code: 'USD',
  markup_percentage: 0,
  flat_shipping_fee: 0,
  is_active: true,
  sort_order: 0,
};

const AdminShipping = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyZone);
  const [countriesInput, setCountriesInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { data: zones, isLoading } = useQuery({
    queryKey: ['shipping-zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipping_zones')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as unknown as ShippingZone[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (zone: typeof form & { id?: string }) => {
      const payload = {
        region_name: zone.region_name,
        countries: zone.countries,
        currency_code: zone.currency_code,
        markup_percentage: zone.markup_percentage,
        flat_shipping_fee: zone.flat_shipping_fee,
        is_active: zone.is_active,
        sort_order: zone.sort_order,
      };
      if (zone.id) {
        const { error } = await supabase.from('shipping_zones').update(payload).eq('id', zone.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('shipping_zones').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipping-zones'] });
      toast.success('Zone saved');
      setEditing(null);
      setIsAdding(false);
    },
    onError: () => toast.error('Failed to save zone'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('shipping_zones').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['shipping-zones'] });
      toast.success('Zone deleted');
    },
  });

  const startEdit = (zone: ShippingZone) => {
    setEditing(zone.id);
    setForm({
      region_name: zone.region_name,
      countries: zone.countries,
      currency_code: zone.currency_code,
      markup_percentage: zone.markup_percentage,
      flat_shipping_fee: zone.flat_shipping_fee,
      is_active: zone.is_active,
      sort_order: zone.sort_order,
    });
    setCountriesInput(zone.countries.join(', '));
    setIsAdding(false);
  };

  const startAdd = () => {
    setIsAdding(true);
    setEditing(null);
    setForm(emptyZone);
    setCountriesInput('');
  };

  const cancel = () => { setEditing(null); setIsAdding(false); };

  const handleSave = () => {
    const countries = countriesInput.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
    const payload = { ...form, countries };
    if (editing) saveMutation.mutate({ ...payload, id: editing });
    else saveMutation.mutate(payload);
  };

  const formUI = (
    <div className="bg-secondary/50 rounded-lg p-4 mb-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-body text-muted-foreground mb-1 block">Region Name</label>
          <input value={form.region_name} onChange={e => setForm(f => ({ ...f, region_name: e.target.value }))} className="w-full text-sm font-body px-3 py-2 rounded-lg border border-border bg-background" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground mb-1 block">Countries (comma-separated ISO codes, * for wildcard)</label>
          <input value={countriesInput} onChange={e => setCountriesInput(e.target.value)} className="w-full text-sm font-body px-3 py-2 rounded-lg border border-border bg-background" placeholder="US, CA" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground mb-1 block">Currency Code</label>
          <input value={form.currency_code} onChange={e => setForm(f => ({ ...f, currency_code: e.target.value.toUpperCase() }))} className="w-full text-sm font-body px-3 py-2 rounded-lg border border-border bg-background" placeholder="USD" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground mb-1 block">Markup %</label>
          <input type="number" value={form.markup_percentage} onChange={e => setForm(f => ({ ...f, markup_percentage: +e.target.value }))} className="w-full text-sm font-body px-3 py-2 rounded-lg border border-border bg-background" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground mb-1 block">Flat Shipping Fee (in target currency)</label>
          <input type="number" value={form.flat_shipping_fee} onChange={e => setForm(f => ({ ...f, flat_shipping_fee: +e.target.value }))} className="w-full text-sm font-body px-3 py-2 rounded-lg border border-border bg-background" />
        </div>
        <div>
          <label className="text-xs font-body text-muted-foreground mb-1 block">Sort Order</label>
          <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} className="w-full text-sm font-body px-3 py-2 rounded-lg border border-border bg-background" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} id="zone-active" />
        <label htmlFor="zone-active" className="text-xs font-body text-foreground">Active</label>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saveMutation.isPending} className="flex items-center gap-1.5 text-xs font-body px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-maroon-light transition-colors">
          <Save size={13} /> Save
        </button>
        <button onClick={cancel} className="flex items-center gap-1.5 text-xs font-body px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors">
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Shipping & Pricing Zones</h2>
          <p className="text-xs text-muted-foreground font-body mt-1">Set currency, markup, and shipping fees per region. Prices auto-convert for visitors.</p>
        </div>
        <button onClick={startAdd} className="flex items-center gap-1.5 text-xs font-body px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-maroon-light transition-colors">
          <Plus size={13} /> Add Zone
        </button>
      </div>

      {isAdding && formUI}

      {isLoading ? (
        <p className="text-sm text-muted-foreground font-body">Loading...</p>
      ) : (
        <div className="space-y-2">
          {zones?.map(zone => (
            <div key={zone.id}>
              {editing === zone.id ? formUI : (
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border">
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm font-body">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Region</span>
                      <span className="font-medium text-foreground">{zone.region_name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Countries</span>
                      <span className="text-foreground">{zone.countries.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Currency</span>
                      <span className="text-foreground">{zone.currency_code}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Markup</span>
                      <span className="text-foreground">{zone.markup_percentage}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Shipping Fee</span>
                      <span className="text-foreground">{zone.flat_shipping_fee}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3">
                    {!zone.is_active && <span className="text-[10px] text-muted-foreground font-body mr-2">Inactive</span>}
                    <button onClick={() => startEdit(zone)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => deleteMutation.mutate(zone.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminShipping;
