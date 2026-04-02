import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSiteContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';

const ContactPage = () => {
  const { data: content } = useSiteContent('contact');
  const [sending, setSending] = useState(false);

  const c = (section: string, field: string, fallback: string) => content?.[section]?.[field] ?? fallback;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    await supabase.from('contact_messages').insert({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    });

    form.reset();
    setSending(false);
    alert('Message sent successfully!');
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-secondary via-background to-blush/30 py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('header', 'eyebrow', 'Get in Touch')}</span>
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">{c('header', 'title', 'Contact Us')}</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" required placeholder="Your Name" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
              <input name="email" required type="email" placeholder="Your Email" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
              <input name="subject" placeholder="Subject" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
              <textarea name="message" required placeholder="Your Message" rows={5} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold resize-none" />
              <button type="submit" disabled={sending} className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-body font-medium hover:bg-maroon-light transition-colors disabled:opacity-50">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Contact Information</h2>
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: c('info', 'email', 'hello@rangolicreations.com') },
                { icon: Phone, label: 'Phone', value: c('info', 'phone', '+91 98765 43210') },
                { icon: MapPin, label: 'Address', value: c('info', 'address', 'Jaipur, Rajasthan') },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-xs font-body font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground font-body">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
