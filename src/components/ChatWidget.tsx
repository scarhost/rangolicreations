import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-heading text-sm font-semibold">Rangoli Creations</p>
                <p className="text-[10px] text-primary-foreground/70 font-body">We typically reply in a few minutes</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-primary-foreground/10 rounded">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 p-4 overflow-y-auto">
              <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2 text-sm font-body max-w-[80%]">
                Hello! 👋 Welcome to Rangoli Creations. How can we help you today?
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-secondary/50 rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-1 focus:ring-gold"
              />
              <button className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-maroon-light transition-colors">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-maroon-light transition-colors"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
