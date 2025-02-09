import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  image: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, title, description, image }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="min-h-screen px-4 py-8 sm:px-6 flex items-center justify-center">
          <motion.div 
            className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden w-full max-w-3xl mx-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96">
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-shadow-lg">
                  {title}
                </h3>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/30 text-white 
                         hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110
                         focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8 md:p-10">
              <div className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none">
                {description.split('\n').map((paragraph, idx) => (
                  <motion.p 
                    key={idx} 
                    className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 sm:px-8 sm:pb-8 md:px-10 md:pb-10 flex justify-end bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg 
                         hover:bg-gray-800 dark:hover:bg-gray-600 
                         transform hover:scale-105 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2
                         text-sm sm:text-base font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceModal;