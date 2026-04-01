import { motion } from 'framer-motion';

const RangoliSpinner = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="relative w-16 h-16">
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x = Math.cos(angle) * 24;
          const y = Math.sin(angle) * 24;
          return (
            <motion.div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full bg-gold"
              style={{ left: '50%', top: '50%', marginLeft: -5, marginTop: -5 }}
              animate={{
                x: [x * 0.5, x, x * 0.5],
                y: [y * 0.5, y, y * 0.5],
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeInOut',
              }}
            />
          );
        })}
        <motion.div
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <motion.p
        className="mt-6 text-sm text-muted-foreground font-body tracking-wide"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
};

export default RangoliSpinner;
