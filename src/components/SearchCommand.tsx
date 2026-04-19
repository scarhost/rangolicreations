import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchCommand = ({ open, onOpenChange }: Props) => {
  const navigate = useNavigate();
  const { data: products } = useProducts();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const bedsheets = products?.filter(p => p.category === 'bedsheet') || [];
  const jewelry = products?.filter(p => p.category === 'jewelry') || [];

  const handleSelect = (slug: string) => {
    navigate(`/product/${slug}`);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search bedsheets, jewelry..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6">
            <Search size={20} className="text-muted-foreground" />
            <p className="text-sm font-body text-muted-foreground">No products found</p>
          </div>
        </CommandEmpty>
        {bedsheets.length > 0 && (
          <CommandGroup heading="Bedsheets">
            {bedsheets.slice(0, 6).map(p => (
              <CommandItem key={p.id} value={`bedsheet-${p.name}-${p.slug}`} onSelect={() => handleSelect(p.slug)}>
                <span className="font-body">{p.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">₹{p.price.toLocaleString()}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {jewelry.length > 0 && (
          <CommandGroup heading="Jewelry">
            {jewelry.slice(0, 6).map(p => (
              <CommandItem key={p.id} value={`jewelry-${p.name}-${p.slug}`} onSelect={() => handleSelect(p.slug)}>
                <span className="font-body">{p.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">₹{p.price.toLocaleString()}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
