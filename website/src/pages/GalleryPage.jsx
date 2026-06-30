import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateSEO } from "../utils/seo";
import { apiFetch } from "../utils/api";
import { FaTimes, FaSearchPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([{ value: "all", label: "All Works" }]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateSEO({
      title: "Our Portfolio Gallery | Bridal & Nail Art Showcase",
      description: "Explore the Radhe Beauty Care image gallery. Real photos of our bridal makeups, party hairstyling, nail extensions, and student works.",
      keywords: "makeup gallery Surat, bridal makeup portfolio, hair smoothening before after, nail art photos",
    });

    async function loadGalleryData() {
      setIsLoading(true);
      try {
        // Fetch categories
        const catRes = await apiFetch("/gallery-categories/active");
        if (catRes.success) {
          const mappedCats = catRes.data.map(cat => ({
            value: cat.slug,
            label: cat.name
          }));
          setCategories([{ value: "all", label: "All Works" }, ...mappedCats]);
        }

        // Fetch gallery images
        const imgRes = await apiFetch("/gallery-images");
        if (imgRes.success) {
          // Response is paginated (data.data) or simple array
          const list = imgRes.data.data || imgRes.data || [];
          setImages(list.filter(img => img.status === 'active'));
        }
      } catch (error) {
        console.error("Failed to load gallery portfolio", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadGalleryData();
  }, []);

  // Filter images based on active category slug
  const filteredImages = activeFilter === "all"
    ? images
    : images.filter((img) => img.category?.slug === activeFilter);

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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-primary">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3"></div>
            <p className="text-xs uppercase tracking-widest font-sans font-bold text-muted">Loading portfolio...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 font-sans text-muted">
            No portfolio images loaded in this category.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
            {filteredImages.map((item, idx) => {
              const imageSrc = item.image_path
                ? (item.image_path.startsWith("http") ? item.image_path : `http://localhost:8000/storage/${item.image_path}`)
                : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800";
              const catName = item.category?.name || "Portfolio";

              return (
                <div
                  key={item.id}
                  onClick={() => openLightbox(idx)}
                  className="break-inside-avoid bg-[#111111] rounded-[28px] overflow-hidden relative cursor-zoom-in group border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-350 gold-glow-hover"
                >
                  <img
                    src={imageSrc}
                    alt={item.alt_text || item.title || "Radhe Portfolio"}
                    className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-350"
                    loading="lazy"
                  />

                  {/* Hover Overlay info */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                    <FaSearchPlus className="w-6 h-6 text-primary mb-3 block" />
                    <h4 className="font-serif font-bold text-base text-white">{item.title || "Makeover Showcase"}</h4>
                    {item.alt_text && (
                      <p className="text-xs text-secondary/80 font-sans mt-1 leading-relaxed font-light">{item.alt_text}</p>
                    )}
                    <span className="text-[9px] uppercase tracking-widest text-primary font-bold mt-2.5 block">{catName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
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
            {(() => {
              const activeItem = filteredImages[lightboxIndex];
              const imageSrc = activeItem.image_path
                ? (activeItem.image_path.startsWith("http") ? activeItem.image_path : `http://localhost:8000/storage/${activeItem.image_path}`)
                : "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800";
              const catName = activeItem.category?.name || "Portfolio";

              return (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-4xl max-h-[85vh] overflow-hidden flex flex-col items-center bg-dark border border-white/10 rounded-[28px] shadow-2xl cursor-default gold-glow animate-duration-200"
                >
                  <img
                    src={imageSrc}
                    alt={activeItem.alt_text || activeItem.title || "Radhe Portfolio"}
                    className="max-h-[70vh] w-auto object-contain pointer-events-none"
                  />
                  
                  <div className="w-full bg-[#111111] p-6 text-left border-t border-white/5">
                    <span className="text-primary text-[9px] uppercase tracking-widest font-bold font-sans">
                      {catName}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-white mt-1">
                      {activeItem.title || "Makeover Design"}
                    </h4>
                    {activeItem.alt_text && (
                      <p className="text-xs sm:text-sm text-secondary/70 font-sans mt-1.5 leading-relaxed font-light">
                        {activeItem.alt_text}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
