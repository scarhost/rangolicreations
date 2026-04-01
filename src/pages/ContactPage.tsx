import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => (
  <div className="min-h-screen">
    <div className="bg-gradient-to-r from-secondary via-background to-blush/30 py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Get in Touch</span>
        <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2">Contact Us</h1>
      </div>
    </div>
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Send us a message</h2>
          <form className="space-y-4">
            <input placeholder="Your Name" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
            <input placeholder="Your Email" type="email" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
            <input placeholder="Subject" className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold" />
            <textarea placeholder="Your Message" rows={5} className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-body outline-none focus:ring-1 focus:ring-gold resize-none" />
            <button type="button" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-body font-medium hover:bg-maroon-light transition-colors">
              Send Message
            </button>
          </form>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-heading text-xl font-semibold text-foreground mb-6">Contact Information</h2>
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@rangolicreations.com' },
              { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
              { icon: MapPin, label: 'Address', value: 'Rangoli House, Johari Bazaar, Jaipur, Rajasthan 302003' },
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

export default ContactPage;
