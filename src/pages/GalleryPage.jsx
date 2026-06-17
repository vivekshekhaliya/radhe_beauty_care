import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateSEO } from "../utils/seo";
import { galleryData } from "../constants/galleryData";
import { FaTimes, FaSearchPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    updateSEO({
      title: "Our Portfolio Gallery | Bridal & Nail Art Showcase",
      description: "Explore the Radhe Beauty Care image gallery. Real photos of our bridal makeups, party hairstyling, nail extensions, and student works.",
      keywords: "makeup gallery Surat, bridal makeup portfolio, hair smoothening before after, nail art photos",
    });
  }, []);

  const categories = [
    { value: "all", label: "All Works" },
    { value: "bridal", label: "Bridal" },
    { value: "party", label: "Party Glam" },
    { value: "hair", label: "Hair Care" },
    { value: "skin", label: "Skin Care" },
    { value: "nails", label: "Nails" },
    { value: "academy", label: "Academy" }
  ];

  // Filter images
  const filteredImages = activeFilter === "all"
    ? galleryData
    : galleryData.filter((img) => img.category === activeFilter);

  const openLightbox = (imageIndex) => {
    setLightboxIndex(imageIndex);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showPrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 min-h-screen bg-dark text-white"
    >
      {/* Header */}
      <section className="bg-[#111111]/70 py-16 mb-12 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">
            Radhe Beauty Care
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-white mt-2 mb-4">
            Our Work Portfolio
          </h1>
          <p className="text-muted font-sans text-sm sm:text-base max-w-2xl mx-auto font-light">
            Browse through real transformations designed by Kajal Shekhaliya and workshops conducted at our beauty training academy.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveFilter(cat.value);
                setLightboxIndex(null);
              }}
              className={`px-5 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border select-none ${
                activeFilter === cat.value
                  ? "bg-primary text-black border-primary shadow-md font-extrabold"
                  : "bg-transparent text-muted hover:text-primary border-white/10 hover:border-primary/35 hover:bg-primary/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Pinterest style columns layout */}
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {filteredImages.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="break-inside-avoid bg-[#111111] rounded-[28px] overflow-hidden relative cursor-zoom-in group border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-350 gold-glow-hover"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-350"
                loading="lazy"
              />

              {/* Hover Overlay info */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <FaSearchPlus className="w-6 h-6 text-primary mb-3 block" />
                <h4 className="font-serif font-bold text-base text-white">{item.title}</h4>
                <p className="text-xs text-secondary/80 font-sans mt-1 leading-relaxed font-light">{item.description}</p>
                <span className="text-[9px] uppercase tracking-widest text-primary font-bold mt-2.5 block">{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Fallback */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 font-sans text-muted">
            No portfolio images loaded in this category.
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out select-none"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer z-50"
              aria-label="Close Lightbox"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={showPrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3.5 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer z-50"
              aria-label="Previous image"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={showNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3.5 bg-white/5 hover:bg-white/10 rounded-full transition-all cursor-pointer z-50"
              aria-label="Next image"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>

            {/* Content card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden flex flex-col items-center bg-dark border border-white/10 rounded-[28px] shadow-2xl cursor-default gold-glow"
            >
              <img
                src={filteredImages[lightboxIndex].image}
                alt={filteredImages[lightboxIndex].title}
                className="max-h-[70vh] w-auto object-contain pointer-events-none"
              />
              
              <div className="w-full bg-[#111111] p-6 text-left border-t border-white/5">
                <span className="text-primary text-[9px] uppercase tracking-widest font-bold font-sans">
                  {filteredImages[lightboxIndex].category}
                </span>
                <h4 className="font-serif font-bold text-lg text-white mt-1">
                  {filteredImages[lightboxIndex].title}
                </h4>
                <p className="text-xs sm:text-sm text-secondary/70 font-sans mt-1.5 leading-relaxed font-light">
                  {filteredImages[lightboxIndex].description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
