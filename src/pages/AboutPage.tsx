import { motion } from 'framer-motion';

const AboutPage = () => (
  <div className="min-h-screen">
    <div className="bg-gradient-to-r from-secondary via-background to-blush/30 py-12 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
        <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">Our Story</span>
        <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2 mb-6">About Rangoli Creations</h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground font-body leading-relaxed"
        >
          Born from a love for India's rich textile heritage, Rangoli Creations brings you handcrafted luxury for your home and wardrobe.
          Every bedsheet is a canvas of tradition, every piece of jewelry a tribute to timeless artistry.
        </motion.p>
      </div>
    </div>
    <div className="container mx-auto px-4 lg:px-8 py-16 max-w-3xl">
      <div className="grid gap-12">
        {[
          { title: 'Our Mission', text: 'To bring the beauty of Indian craftsmanship into every home, creating products that honor traditional techniques while embracing modern aesthetics.' },
          { title: 'Our Artisans', text: 'We work directly with skilled artisans across Rajasthan, Varanasi, and other craft clusters, ensuring fair wages and preserving centuries-old techniques.' },
          { title: 'Sustainability', text: 'From organic cotton sourcing to eco-friendly packaging, we are committed to minimizing our environmental footprint while maximizing beauty.' },
        ].map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <h2 className="font-heading text-xl font-semibold text-foreground mb-3">{section.title}</h2>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">{section.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default AboutPage;
