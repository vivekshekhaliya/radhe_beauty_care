import { useState, useRef, useEffect } from "react";
import { FaArrowsAltH } from "react-icons/fa";

export default function BeforeAfter() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const beforeImage = "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800"; // Clean face model
  const afterImage = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"; // Elegant bridal makeup

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <section className="py-20 bg-[#111111] text-white border-t border-b border-white/5 relative">
      {/* Background radial accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/2 filter blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-10 h-[1.5px] bg-primary"></span>
            <span className="text-sm font-bold uppercase tracking-widest text-primary font-sans">Transformations</span>
            <span className="w-10 h-[1.5px] bg-primary"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
            Witness the Magic
          </h2>
          <p className="text-sm sm:text-base text-muted font-sans max-w-lg leading-relaxed">
            Drag the gold slider from side to side to view the spectacular skin and bridal makeup transformations created by Kajal Shekhaliya.
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="relative w-full max-w-[700px] aspect-[4/3] mx-auto rounded-[20px] overflow-hidden shadow-2xl border-4 border-primary/30 select-none cursor-ew-resize gold-glow"
        >
          {/* Before Image (Background) */}
          <img
            src={beforeImage}
            alt="Before Treatment"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/80 backdrop-blur-xs text-white text-xs font-bold font-sans uppercase tracking-widest rounded border border-white/10">
            Before
          </div>

          {/* After Image (Clipped Overlay) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            <img
              src={afterImage}
              alt="After Makeup"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ width: containerRef.current ? containerRef.current.offsetWidth : "100%" }}
            />
            <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-primary text-black text-xs font-bold font-sans uppercase tracking-widest rounded border border-primary/20">
              After Glam
            </div>
          </div>

          {/* Drag Handle Bar */}
          <div
            className="absolute top-0 bottom-0 w-[3px] bg-primary z-30 cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Glowing gold circular handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-[18px] w-9 h-9 bg-primary text-black rounded-full flex items-center justify-center shadow-lg border-2 border-white select-none transition-transform duration-200 active:scale-90">
              <FaArrowsAltH className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
