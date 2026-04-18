import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Product = Tables<'products'>;

const emptyProduct: Record<string, any> = {
  name: '', slug: '', price: 0, category: 'bedsheet', description: '',
  subcategory: '', material: '', care_instructions: '', rating: 0, reviews: 0,
  units: 0, featured: false, best_seller: false, new_arrival: false,
  images: ['/placeholder.svg'], sizes: [], colors: [], tags: [],
  subtitle: '', trust_signals: [], benefit_points: [], variant_prices: {}, favourite_variant: '',
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (product: Record<string, any>) => {
      if (product.id) {
        const { error } = await supabase.from('products').update(product as any).eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(product as TablesInsert<'products'>);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setEditing(null);
      setCreating(false);
      setForm({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const startEdit = (product: Product) => {
    const ext = product as any;
    setEditing(product.id);
    setForm({
      ...product,
      subtitle: ext.subtitle || '',
      trust_signals: ext.trust_signals || [],
      benefit_points: ext.benefit_points || [],
      variant_prices: ext.variant_prices || {},
      favourite_variant: ext.favourite_variant || '',
    });
    setCreating(false);
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({ ...emptyProduct });
  };

  const handleSave = () => {
    if (!form.name || !form.slug || !form.price) { alert('Name, slug, and price are required'); return; }
    saveMutation.mutate(form);
  };

  const handleArrayField = (field: string, value: string) => {
    setForm({ ...form, [field]: value.split(',').map(s => s.trim()).filter(Boolean) });
  };

  // Trust signals helpers
  const handleTrustSignalChange = (idx: number, key: string, value: string) => {
    const ts = [...(form.trust_signals || [])];
    ts[idx] = { ...ts[idx], [key]: value };
    setForm({ ...form, trust_signals: ts });
  };
  const addTrustSignal = () => {
    setForm({ ...form, trust_signals: [...(form.trust_signals || []), { icon: 'Shield', text: '' }] });
  };
  const removeTrustSignal = (idx: number) => {
    const ts = [...(form.trust_signals || [])];
    ts.splice(idx, 1);
    setForm({ ...form, trust_signals: ts });
  };

  // Variant prices helpers
  const handleVariantPriceChange = (size: string, price: string) => {
    const vp = { ...(form.variant_prices || {}) };
    if (price === '') { delete vp[size]; } else { vp[size] = +price; }
    setForm({ ...form, variant_prices: vp });
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  const isFormOpen = editing || creating;
  const inputClass = "w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Products ({products?.length || 0})</h2>
        <button onClick={startCreate} className="flex items-center gap-2 text-sm font-body bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-maroon-light transition-colors">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6 p-4 bg-secondary/50 border border-border rounded-xl space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between sticky top-0 bg-secondary/80 backdrop-blur-sm py-2 -mx-4 px-4">
            <h3 className="font-heading text-sm font-semibold">{creating ? 'New Product' : 'Edit Product'}</h3>
            <button onClick={() => { setEditing(null); setCreating(false); setForm({}); }} className="p-1 text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>

          {/* Basic Fields */}
          <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">Basic Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-body font-medium text-foreground">Name *</label>
              <input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Slug *</label>
              <input value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Price *</label>
              <input type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: +e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Original Price</label>
              <input type="number" value={form.original_price || ''} onChange={e => setForm({ ...form, original_price: e.target.value ? +e.target.value : null })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Category</label>
              <select value={form.category || 'bedsheet'} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="bedsheet">Bedsheet</option>
                <option value="jewelry">Jewelry</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Subcategory</label>
              <input value={form.subcategory || ''} onChange={e => setForm({ ...form, subcategory: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Material</label>
              <input value={form.material || ''} onChange={e => setForm({ ...form, material: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Units</label>
              <input type="number" value={form.units || ''} onChange={e => setForm({ ...form, units: +e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Rating</label>
              <input type="number" step="0.1" max="5" value={form.rating || ''} onChange={e => setForm({ ...form, rating: +e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Reviews</label>
              <input type="number" value={form.reviews || ''} onChange={e => setForm({ ...form, reviews: +e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Sort Order</label>
              <input type="number" value={form.sort_order || 0} onChange={e => setForm({ ...form, sort_order: +e.target.value })} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs font-body font-medium text-foreground">Subtitle (benefit tagline)</label>
            <input value={form.subtitle || ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="e.g. Luxury comfort for every season" className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-body font-medium text-foreground">Description</label>
            <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + ' resize-none'} />
          </div>
          <div>
            <label className="text-xs font-body font-medium text-foreground">Care Instructions</label>
            <input value={form.care_instructions || ''} onChange={e => setForm({ ...form, care_instructions: e.target.value })} className={inputClass} />
          </div>

          {/* Arrays */}
          <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider pt-2">Variants & Images</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-body font-medium text-foreground">Sizes (comma-separated)</label>
              <input value={form.sizes?.join(', ') || ''} onChange={e => handleArrayField('sizes', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-foreground">Colors (comma-separated)</label>
              <input value={form.colors?.join(', ') || ''} onChange={e => handleArrayField('colors', e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Image Manager */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-body font-medium text-foreground">Product Images (up to 6)</label>
              <button
                onClick={() => {
                  const imgs = [...(form.images || [])].filter(i => i && i !== '/placeholder.svg');
                  if (imgs.length >= 6) { alert('Maximum 6 images allowed'); return; }
                  const url = prompt('Enter image URL:');
                  if (url?.trim()) {
                    setForm({ ...form, images: [...imgs, url.trim()] });
                  }
                }}
                className="text-xs font-body text-primary hover:underline"
              >+ Add Image</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(form.images || []).filter((img: string) => img && img !== '/placeholder.svg').map((img: string, idx: number) => {
                const imgs = (form.images || []).filter((i: string) => i && i !== '/placeholder.svg');
                return (
                  <div key={idx} className={`relative group w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === 0 ? 'border-gold' : 'border-border'}`}>
                    <img src={img} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {idx > 0 && (
                        <button
                          onClick={() => {
                            const newImgs = [...imgs];
                            [newImgs[idx - 1], newImgs[idx]] = [newImgs[idx], newImgs[idx - 1]];
                            setForm({ ...form, images: newImgs });
                          }}
                          className="w-6 h-6 rounded bg-background/80 flex items-center justify-center text-foreground text-[10px]"
                          title="Move left"
                        >←</button>
                      )}
                      {idx === 0 ? (
                        <span className="text-[8px] text-gold font-body font-bold">PRIMARY</span>
                      ) : (
                        <button
                          onClick={() => {
                            const newImgs = [...imgs];
                            const [item] = newImgs.splice(idx, 1);
                            newImgs.unshift(item);
                            setForm({ ...form, images: newImgs });
                          }}
                          className="w-6 h-6 rounded bg-gold/80 flex items-center justify-center text-accent-foreground text-[10px]"
                          title="Set as primary"
                        >★</button>
                      )}
                      {idx < imgs.length - 1 && (
                        <button
                          onClick={() => {
                            const newImgs = [...imgs];
                            [newImgs[idx], newImgs[idx + 1]] = [newImgs[idx + 1], newImgs[idx]];
                            setForm({ ...form, images: newImgs });
                          }}
                          className="w-6 h-6 rounded bg-background/80 flex items-center justify-center text-foreground text-[10px]"
                          title="Move right"
                        >→</button>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        const newImgs = imgs.filter((_: string, i: number) => i !== idx);
                        setForm({ ...form, images: newImgs.length > 0 ? newImgs : ['/placeholder.svg'] });
                      }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                );
              })}
              {((form.images || []).filter((i: string) => i && i !== '/placeholder.svg').length === 0) && (
                <p className="text-xs text-muted-foreground font-body py-2">No images added yet.</p>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-body mt-1">First image (gold border) is the primary. Hover to reorder, set primary (★), or delete.</p>
          </div>

          <div>
            <label className="text-xs font-body font-medium text-foreground">Customer's Favourite Variant</label>
            <select value={form.favourite_variant || ''} onChange={e => setForm({ ...form, favourite_variant: e.target.value })} className={inputClass}>
              <option value="">None</option>
              {(form.sizes || []).map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Variant Pricing */}
          {form.sizes?.length > 0 && (
            <div>
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider pt-2">Variant Pricing (leave blank to use base price)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                {(form.sizes || []).map((size: string) => (
                  <div key={size}>
                    <label className="text-xs font-body text-foreground">{size}</label>
                    <input
                      type="number"
                      value={form.variant_prices?.[size] || ''}
                      onChange={e => handleVariantPriceChange(size, e.target.value)}
                      placeholder={`₹${form.price}`}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trust Signals */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider pt-2">Trust Signals</p>
              <button onClick={addTrustSignal} className="text-xs font-body text-primary hover:underline">+ Add</button>
            </div>
            <div className="space-y-2 mt-2">
              {(form.trust_signals || []).map((ts: any, idx: number) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select value={ts.icon} onChange={e => handleTrustSignalChange(idx, 'icon', e.target.value)} className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs font-body outline-none">
                    {['Truck', 'RotateCcw', 'Shield', 'Lock', 'CheckCircle', 'Heart'].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                  <input value={ts.text} onChange={e => handleTrustSignalChange(idx, 'text', e.target.value)} placeholder="e.g. Free Returns" className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-xs font-body outline-none" />
                  <button onClick={() => removeTrustSignal(idx)} className="text-muted-foreground hover:text-destructive"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefit Points */}
          <div>
            <label className="text-xs font-body font-medium text-foreground">Why You'll Love It — Benefit Points (one per line)</label>
            <textarea
              value={(form.benefit_points || []).join('\n')}
              onChange={e => setForm({ ...form, benefit_points: e.target.value.split('\n').filter(Boolean) })}
              rows={4}
              placeholder="Premium 400TC cotton&#10;OEKO-TEX certified safe&#10;Wrinkle-resistant finish&#10;Fits mattresses up to 15 inches"
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-body">
              <input type="checkbox" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-primary" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-body">
              <input type="checkbox" checked={form.best_seller || false} onChange={e => setForm({ ...form, best_seller: e.target.checked })} className="accent-primary" /> Best Seller
            </label>
            <label className="flex items-center gap-2 text-sm font-body">
              <input type="checkbox" checked={form.new_arrival || false} onChange={e => setForm({ ...form, new_arrival: e.target.checked })} className="accent-primary" /> New Arrival
            </label>
            <label className="flex items-center gap-2 text-sm font-body">
              <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="accent-primary" /> Active
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saveMutation.isPending} className="flex items-center gap-2 text-sm font-body bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-maroon-light transition-colors disabled:opacity-50">
              <Save size={14} /> {saveMutation.isPending ? 'Saving...' : 'Save'}
            </button>
            <button onClick={() => { setEditing(null); setCreating(false); setForm({}); }} className="text-sm font-body px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Name</th>
              <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Category</th>
              <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Price</th>
              <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Units</th>
              <th className="text-left py-3 px-2 font-body font-medium text-muted-foreground text-xs">Status</th>
              <th className="text-right py-3 px-2 font-body font-medium text-muted-foreground text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(p => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                <td className="py-3 px-2 font-body text-foreground">{p.name}</td>
                <td className="py-3 px-2 font-body text-muted-foreground capitalize">{p.category}</td>
                <td className="py-3 px-2 font-body text-foreground">₹{p.price.toLocaleString()}</td>
                <td className="py-3 px-2 font-body text-muted-foreground">{p.units}</td>
                <td className="py-3 px-2">
                  <div className="flex gap-1 flex-wrap">
                    {p.featured && <span className="text-[10px] bg-gold/20 text-gold-dark px-1.5 py-0.5 rounded font-body">Featured</span>}
                    {p.best_seller && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-body">Bestseller</span>}
                    {p.new_arrival && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-body">New</span>}
                    {!p.is_active && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-body">Inactive</span>}
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => startEdit(p)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(p.id); }} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
