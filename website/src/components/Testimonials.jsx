import { useState, useEffect } from "react";
import { reviewsData } from "../constants/reviewsData";
import { FaStar, FaQuoteRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide interval
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviewsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviewsData.length - 1 ? 0 : prev + 1));
  };

  const activeReview = reviewsData[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-dark text-white border-t border-b border-white/5 relative overflow-hidden">
      {/* Background graphic glow */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-primary/2 filter blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-10 h-[1.5px] bg-primary"></span>
            <span className="text-sm font-bold uppercase tracking-widest text-primary font-sans">Reviews</span>
            <span className="w-10 h-[1.5px] bg-primary"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
            Words From Our Beautiful Clients
          </h2>
        </div>

        {/* Testimonial slider card */}
        <div className="relative min-h-[350px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full frosted-glass p-8 sm:p-12 relative overflow-hidden border border-white/10 shadow-2xl gold-glow"
            >
              {/* Quote Mark accent */}
              <div className="absolute top-6 right-8 text-primary/10 select-none pointer-events-none">
                <FaQuoteRight className="w-20 h-20" />
              </div>

              <div className="flex flex-col justify-between h-full">
                <div>
                  {/* Star rating icons */}
                  <div className="flex space-x-1 mb-6">
                    {[...Array(activeReview.rating)].map((_, i) => (
                      <FaStar key={i} className="text-primary w-4.5 h-4.5" />
                    ))}
                  </div>

                  {/* Feedback text */}
                  <p className="text-base sm:text-xl text-white font-serif leading-relaxed italic pr-4 mb-8 font-medium">
                    "{activeReview.text}"
                  </p>
                </div>

                {/* Profile meta */}
                <div className="flex items-center space-x-4 border-t border-white/5 pt-6 mt-4">
                  <img
                    src={activeReview.image}
                    alt={activeReview.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/40 shadow-md shrink-0"
                    loading="lazy"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-serif font-bold text-white">{activeReview.name}</span>
                    <span className="text-[10px] font-sans font-bold text-primary uppercase tracking-widest mt-1">
                      {activeReview.service}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots & arrows */}
        <div className="flex items-center justify-between mt-8 px-2">
          {/* Dots indicators */}
          <div className="flex space-x-2">
            {reviewsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "w-6 bg-primary" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex space-x-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-white/10 hover:border-primary text-white hover:text-black hover:bg-primary transition-all cursor-pointer select-none active:scale-95"
              aria-label="Previous testimonial"
            >
              <FaChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-white/10 hover:border-primary text-white hover:text-black hover:bg-primary transition-all cursor-pointer select-none active:scale-95"
              aria-label="Next testimonial"
            >
              <FaChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
