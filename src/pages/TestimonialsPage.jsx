import { useEffect } from "react";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";
import { reviewsData } from "../constants/reviewsData";
import { FaStar, FaQuoteRight, FaMagic } from "react-icons/fa";

export default function TestimonialsPage() {
  useEffect(() => {
    updateSEO({
      title: "Client Testimonials & Reviews | Radhe Beauty Care",
      description: "Read glowing reviews from brides, skincare clients, and hair design guests. Find out why Radhe Beauty Care is Surat's preferred salon choice.",
      keywords: "reviews Radhe Beauty Care, bridal makeup customer feedback Surat, salon ratings Yogi Chowk",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 min-h-screen bg-dark text-white"
    >
      {/* Header Banner */}
      <section className="bg-[#111111] py-16 mb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <FaMagic className="w-4 h-4 text-primary animate-pulse" />
            <span>Real Feedback</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-white mt-2 mb-4">
            Customer Testimonials
          </h1>
          <p className="text-muted font-sans text-sm sm:text-base max-w-2xl mx-auto">
            We love hearing from our guests! Read below to discover the luxury service experience Kajal Shekhaliya and the Radhe team deliver.
          </p>
        </div>
      </section>

      {/* Testimonials Wall Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviewsData.map((review) => (
            <div
              key={review.id}
              className="glass-card p-8 bg-[#111111]/85 hover:bg-secondary/95 transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 border border-primary/25 gold-glow-hover"
            >
              {/* Quote icon background */}
              <div className="absolute top-6 right-6 text-primary/15">
                <FaQuoteRight className="w-8 h-8" />
              </div>

              <div>
                {/* Rating Stars */}
                <div className="flex space-x-1 mb-5">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-primary w-4 h-4" />
                  ))}
                </div>

                {/* Feedback text */}
                <p className="text-sm sm:text-base text-white/95 italic font-sans leading-relaxed mb-6">
                  "{review.text}"
                </p>
              </div>

              {/* Reviewer Meta */}
              <div className="flex items-center space-x-4 border-t border-white/5 pt-4 mt-2">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border border-primary/30"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-serif font-bold text-white">{review.name}</span>
                  <span className="text-[11px] font-sans font-semibold text-primary uppercase tracking-wider mt-0.5">
                    {review.service}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Submission Hook */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="glass-card p-8 bg-[#111111]/85 text-center border border-primary/20">
          <h3 className="text-xl font-serif font-bold text-white mb-2">Are You an Existing Client?</h3>
          <p className="text-sm text-muted font-sans leading-relaxed mb-6">
            We would love to hear about your experience! Share your feedback with us on Instagram or WhatsApp, and we might feature it on our reviews wall.
          </p>
          <a
            href="https://www.instagram.com/radhe_beauty_care03/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold font-sans tracking-wider uppercase rounded shadow transition-colors duration-300"
          >
            Review on Instagram
          </a>
        </div>
      </section>
    </motion.div>
  );
}
