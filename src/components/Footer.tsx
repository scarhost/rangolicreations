import { Link } from 'react-router-dom';
import { useGlobalContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const { data: globalContent } = useGlobalContent();

  const c = (field: string, fallback: string) => globalContent?.footer?.[field] ?? fallback;

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-2">Rangoli Creations</h3>
            <p className="text-sm text-primary-foreground/60 font-body leading-relaxed mb-4">
              {c('brand_description', 'Handcrafted luxury for your home.')}
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'Pinterest'].map(social => (
                <a key={social} href="#" className="text-xs text-primary-foreground/50 hover:text-gold transition-colors font-body">{social}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 tracking-wide">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Bedsheets', path: '/bedsheets' },
                { label: 'Jewelry', path: '/jewelry' },
                { label: 'New Arrivals', path: '/bedsheets?filter=new' },
                { label: 'Best Sellers', path: '/bedsheets?filter=bestseller' },
              ].map(link => (
                <Link key={link.path} to={link.path} className="text-sm text-primary-foreground/60 hover:text-gold transition-colors font-body">{link.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 tracking-wide">Support</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/60 font-body">
              <span>Shipping & Delivery</span>
              <span>Returns & Exchanges</span>
              <span>Care Guide</span>
              <span>FAQ</span>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 tracking-wide">Stay Connected</h4>
            <p className="text-sm text-primary-foreground/60 font-body mb-3">Get updates on new collections & exclusive offers.</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = (form.elements.namedItem('footerEmail') as HTMLInputElement).value;
              if (!email) return;
              await supabase.from('newsletter_subscribers').insert({ email });
              form.reset();
              alert('Thank you for subscribing!');
            }} className="flex">
              <input name="footerEmail" type="email" required placeholder="Your email" className="flex-1 bg-primary-foreground/10 border border-primary-foreground/20 rounded-l-md px-3 py-2 text-sm font-body outline-none focus:border-gold placeholder:text-primary-foreground/30" />
              <button type="submit" className="bg-gold text-accent-foreground px-4 py-2 rounded-r-md text-sm font-body font-medium hover:bg-gold-dark transition-colors">Join</button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/40 font-body">{c('copyright', '© 2026 Rangoli Creations. All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
