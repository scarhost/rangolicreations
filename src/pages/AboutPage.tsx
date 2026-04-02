import { motion } from 'framer-motion';
import { useSiteContent } from '@/hooks/useSiteContent';

const AboutPage = () => {
  const { data: content } = useSiteContent('about');

  const c = (section: string, field: string, fallback: string) => content?.[section]?.[field] ?? fallback;

  const sections = [
    { section: 'mission', defaultTitle: 'Our Mission', defaultText: 'To bring the beauty of Indian craftsmanship into every home.' },
    { section: 'artisans', defaultTitle: 'Our Artisans', defaultText: 'We work directly with skilled artisans across Rajasthan.' },
    { section: 'sustainability', defaultTitle: 'Sustainability', defaultText: 'Committed to minimizing our environmental footprint.' },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-secondary via-background to-blush/30 py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
          <span className="text-xs font-body tracking-[0.3em] text-gold-dark uppercase">{c('header', 'eyebrow', 'Our Story')}</span>
          <h1 className="font-heading text-3xl lg:text-4xl font-semibold text-foreground mt-2 mb-6">{c('header', 'title', 'About Rangoli Creations')}</h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-muted-foreground font-body leading-relaxed">
            {c('header', 'description', '')}
          </motion.p>
        </div>
      </div>
      <div className="container mx-auto px-4 lg:px-8 py-16 max-w-3xl">
        <div className="grid gap-12">
          {sections.map((s, i) => (
            <motion.div key={s.section} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">{c(s.section, 'title', s.defaultTitle)}</h2>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{c(s.section, 'text', s.defaultText)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
