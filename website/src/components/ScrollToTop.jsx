import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaChevronUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll to top on path change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Monitor scroll height to show/hide button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 p-3.5 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg border border-secondary transition-all hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Scroll to top"
        >
          <FaChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
