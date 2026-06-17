import { FaAward, FaCrown, FaUsers, FaMagic, FaTags, FaUserCheck } from "react-icons/fa";

export default function WhyChooseUs() {
  const highlights = [
    {
      icon: FaAward,
      title: "Certified Artists",
      description: "Trained and certified in international standards, Kajal and her team bring unmatched professional execution."
    },
    {
      icon: FaCrown,
      title: "Premium Products",
      description: "We use only top-tier luxury cosmetics (like MAC, Sephora, Huda Beauty) to ensure safe, flawless skin coverage."
    },
    {
      icon: FaTags,
      title: "Affordable Pricing",
      description: "Premium service catalog configured at transparent rates to offer unmatched bridal and salon styling value."
    },
    {
      icon: FaUsers,
      title: "1000+ Happy Clients",
      description: "With hundreds of glowing bridal records, we specialize in making every guest feel like royalty."
    },
    {
      icon: FaUserCheck,
      title: "Professional Team",
      description: "Punctual, hygienic, and extremely helpful staff that caters to group look requirements with grace."
    },
    {
      icon: FaMagic,
      title: "Luxury Experience",
      description: "Relaxing, clean, and elegant environment curated with modern aesthetics to pamper your senses."
    }
  ];

  return (
    <section className="py-28 bg-dark text-white relative border-t border-b border-white/5">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/2 filter blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Col: Sticky visual header */}
        <div className="lg:col-span-5 lg:sticky lg:top-36 h-fit flex flex-col space-y-6 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-2">
            <span className="w-8 h-[1px] bg-primary"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary font-sans">Brand Values</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-serif font-black leading-tight text-white">
            An Unmatched <br />
            Beauty <span className="gold-text-gradient font-serif italic">Standards</span>
          </h2>
          
          <p className="text-sm sm:text-base text-muted font-sans leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
            We merge premium cosmetology treatments with high-end artistry to provide a tailored beauty session that makes a statement.
          </p>

          <div className="pt-4 hidden lg:block">
            <div className="w-24 h-[1px] bg-white/10" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary mt-4 block">Radhe Beauty Care</span>
          </div>
        </div>

        {/* Right Col: Staggered grid cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 lg:pt-0">
          {highlights.map((item, index) => {
            const IconComponent = item.icon;
            // Add a slight translation offset for even indices to create a staggered Awwwards effect on desktop
            const staggeredClass = index % 2 === 1 ? "lg:translate-y-8" : "";

            return (
              <div
                key={index}
                className={`frosted-glass p-8 hover:bg-white/8 transition-all duration-300 group gold-glow-hover flex flex-col justify-between h-fit min-h-[220px] ${staggeredClass}`}
              >
                <div className="w-12 h-12 rounded-[16px] bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300 mb-6 shrink-0 shadow-sm">
                  <IconComponent className="w-5 h-5" />
                </div>
                
                <div>
                  <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
