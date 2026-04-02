import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Save, ChevronDown, ChevronRight } from 'lucide-react';

const AdminContent = () => {
  const queryClient = useQueryClient();
  const [expandedPage, setExpandedPage] = useState<string | null>('home');

  const { data: content, isLoading } = useQuery({
    queryKey: ['admin-site-content'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_content').select('*').order('page').order('section').order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: string }) => {
      const { error } = await supabase.from('site_content').update({ value }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-site-content'] });
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
    },
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;

  // Group by page, then section
  const grouped: Record<string, Record<string, typeof content>> = {};
  content?.forEach(item => {
    if (!grouped[item.page]) grouped[item.page] = {};
    if (!grouped[item.page][item.section]) grouped[item.page][item.section] = [];
    grouped[item.page][item.section]!.push(item);
  });

  const pageLabels: Record<string, string> = {
    home: '🏠 Homepage',
    global: '🌐 Global (Navbar, Footer, Chat)',
    bedsheets: '🛏️ Bedsheets Page',
    jewelry: '💎 Jewelry Page',
    about: '📖 About Page',
    contact: '📞 Contact Page',
  };

  return (
    <div>
      <h2 className="font-heading text-lg font-semibold text-foreground mb-6">Site Content</h2>
      <p className="text-xs text-muted-foreground font-body mb-6">Edit any text on your website. Changes are saved per field.</p>

      <div className="space-y-4">
        {Object.entries(grouped).map(([page, sections]) => (
          <div key={page} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedPage(expandedPage === page ? null : page)}
              className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <span className="font-heading text-sm font-semibold text-foreground">{pageLabels[page] || page}</span>
              {expandedPage === page ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {expandedPage === page && (
              <div className="p-4 space-y-6">
                {Object.entries(sections).map(([section, fields]) => (
                  <div key={section}>
                    <h4 className="text-xs font-body font-medium text-gold-dark uppercase tracking-wide mb-3">{section.replace(/_/g, ' ')}</h4>
                    <div className="space-y-3">
                      {fields?.map(field => (
                        <ContentField
                          key={field.id}
                          field={field}
                          onSave={(value) => updateMutation.mutate({ id: field.id, value })}
                          saving={updateMutation.isPending}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentField = ({ field, onSave, saving }: { field: any; onSave: (value: string) => void; saving: boolean }) => {
  const [value, setValue] = useState(field.value);
  const isDirty = value !== field.value;

  return (
    <div className="flex gap-3 items-start">
      <div className="flex-1">
        <label className="text-xs font-body text-muted-foreground mb-1 block">{field.field.replace(/_/g, ' ')}</label>
        {field.field_type === 'textarea' ? (
          <textarea value={value} onChange={e => setValue(e.target.value)} rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold resize-none" />
        ) : (
          <input value={value} onChange={e => setValue(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
        )}
      </div>
      {isDirty && (
        <button onClick={() => onSave(value)} disabled={saving} className="mt-5 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-maroon-light transition-colors disabled:opacity-50">
          <Save size={14} />
        </button>
      )}
    </div>
  );
};

export default AdminContent;
