import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const RangoliTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 450);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background overlay - subtle, non-blocking */}
          <motion.div
            className="absolute inset-0 bg-background/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />

          {/* Rangoli pattern - expanding circles */}
          <div className="relative">
            {[0, 1, 2].map(ring => (
              <motion.div
                key={ring}
                className="absolute rounded-full border-2 border-gold/40"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ width: 0, height: 0, opacity: 0 }}
                animate={{
                  width: [0, 80 + ring * 80],
                  height: [0, 80 + ring * 80],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 0.7,
                  delay: ring * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            ))}

            {/* Center dots in radial pattern */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              return (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-gold"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: [0, Math.cos(angle) * 50],
                    y: [0, Math.sin(angle) * 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: 'easeOut',
                  }}
                />
              );
            })}

            {/* Center glow */}
            <motion.div
              className="w-4 h-4 rounded-full bg-gold"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ filter: 'blur(4px)' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RangoliTransition;
