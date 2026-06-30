import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";
import { apiFetch } from "../utils/api";
import { FaCheckCircle, FaHourglassHalf, FaHeart, FaSpa, FaArrowRight } from "react-icons/fa";

export default function BridalMakeup() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    updateSEO({
      title: "Bridal Makeup Packages | Bridal Specialist Kajal Shekhaliya",
      description: "Explore our premium bridal makeup packages in Surat. Features HD base, Airbrush application, dupatta draping, and jewelry setting by specialist Kajal Shekhaliya.",
      keywords: "bridal makeup package Surat, airbrush bridal makeup, Indian wedding makeup, dupatta draping Yogi Chowk",
    });

    async function loadPackages() {
      try {
        const response = await apiFetch("/bridal-packages/active");
        if (response.success) {
          setPackages(response.data);
        }
      } catch (error) {
        console.error("Failed to load bridal packages", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPackages();
  }, []);

  const steps = [
    {
      icon: FaHeart,
      title: "1. Consultation & Design",
      text: "We sit down to discuss your bridal outfit color, jewelry design, and preferred look (classic, modern, or soft glow)."
    },
    {
      icon: FaSpa,
      title: "2. Trial & Skin Prep",
      text: "We schedule a pre-bridal facial/cleanup, and test color bases on your skin to ensure absolute compatibility on the big day."
    },
    {
      icon: FaHourglassHalf,
      title: "3. D-Day Transformation",
      text: "On the wedding day, Kajal applies the makeup, designs the hair, and adjusts the heavy jewelry and dupatta draping safely."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 min-h-screen bg-dark text-white"
    >
      {/* Luxury Hero */}
      <section className="relative h-[75vh] flex items-center justify-center bg-black text-white overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-30 scale-102" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent z-10"></div>

        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <span className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest font-sans mb-3 block">
            Signature Artistry
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-serif mb-6 leading-tight text-white">
            Bridal Specialist
          </h1>
          <p className="text-sm sm:text-base text-muted font-sans max-w-xl mx-auto leading-relaxed mb-8 font-light">
            Create memories with flawless bridal styling that captures your beauty. Hand-crafted looks designed by Kajal Shekhaliya to stay perfect all night.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold font-sans tracking-widest uppercase rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 select-none cursor-pointer"
          >
            Check Availability
          </Link>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-28 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-primary text-xs font-bold uppercase tracking-widest font-sans mb-2">Our Offerings</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">Bridal Packages</h2>
            <p className="text-sm text-muted font-sans max-w-lg leading-relaxed font-light">
              Carefully curated packages incorporating makeup, hairstyle, draping, and nail styling to provide complete peace of mind.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-primary">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3"></div>
              <p className="text-xs uppercase tracking-widest font-sans font-bold text-muted">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 text-muted font-sans font-light">
              No bridal packages listed currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {packages.map((pkg, idx) => {
                const inclusions = pkg.benefits || [];
                return (
                  <div
                    key={pkg.id}
                    className="frosted-glass p-8 bg-[#111111]/85 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-white/10 gold-glow-hover"
                  >
                    {pkg.featured && (
                      <div className="absolute top-0 right-0 bg-primary text-black text-[9px] font-bold font-sans uppercase tracking-wider py-1.5 px-5 rounded-bl-[16px]">
                        Most Popular
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white mb-2">{pkg.title}</h3>
                      <div className="text-2xl font-serif font-bold text-primary mb-4">₹{Number(pkg.price).toLocaleString()}</div>
                      <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed mb-6 border-b border-white/5 pb-4 font-light">
                        {pkg.description}
                      </p>
                      
                      {inclusions.length > 0 && (
                        <ul className="space-y-4 mb-8">
                          {inclusions.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start text-xs sm:text-sm text-white/90 font-sans">
                              <FaCheckCircle className="text-primary w-4.5 h-4.5 mr-2.5 shrink-0 mt-0.5" />
                              <span className="font-light">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Link
                      to="/contact"
                      className="block w-full text-center py-3.5 bg-transparent hover:bg-primary text-primary hover:text-black border border-primary/40 hover:border-primary font-sans font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 select-none cursor-pointer"
                    >
                      Inquire Now
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* D-Day Process Step-by-Step */}
      <section className="py-28 bg-[#111111]/60 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-primary text-xs font-bold uppercase tracking-widest font-sans mb-2">The Timeline</span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-4">Our Bridal Journey</h2>
            <p className="text-sm text-muted font-sans max-w-lg leading-relaxed font-light">
              We guide you step-by-step from booking to the wedding day to guarantee a flawless, stress-free beauty experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="frosted-glass p-8 bg-dark text-center flex flex-col items-center border border-white/10 hover:border-primary/35 duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed font-light">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bridal Benefits */}
      <section className="py-28 bg-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white text-center mb-16">Why Brides Trust Kajal Shekhaliya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 text-sm font-sans text-muted">
            <div className="flex items-start space-x-4">
              <FaCheckCircle className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-white text-base mb-1.5">Punctual Venue Service</h4>
                <p className="leading-relaxed font-light">We understand wedding timelines. Kajal and her team always arrive on time, ensuring your look is complete with time to spare.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaCheckCircle className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-white text-base mb-1.5">Dupatta & Saree Draping</h4>
                <p className="leading-relaxed font-light">Proper pleating, weight distribution, and pinning ensure your heavy bridal outfit remains comfortable and stays in place.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaCheckCircle className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-white text-base mb-1.5">Sanitized Makeup Kits</h4>
                <p className="leading-relaxed font-light">All brushes, blenders, and cosmetic palettes are thoroughly sanitized before application to ensure complete hygiene.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <FaCheckCircle className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif font-bold text-white text-base mb-1.5">Tailored jewelry adjustments</h4>
                <p className="leading-relaxed font-light">We assist in setting maang-tikkas, heavy necklaces, and nose rings safely, protecting your hair and ears from pull strain.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-primary text-black p-10 sm:p-12 rounded-[32px] text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 mix-blend-overlay" />
          
          <h3 className="text-3xl font-serif font-bold mb-4 relative z-10">Secure Your Wedding Date</h3>
          <p className="text-sm sm:text-base text-black/80 font-sans max-w-xl mx-auto mb-8 leading-relaxed relative z-10 font-medium">
            Our wedding diary fills up fast! Get in touch today to schedule a bridal trial and reserve your booking.
          </p>
          
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-black hover:bg-peacock text-white font-sans font-bold uppercase tracking-widest rounded-full shadow transition-all duration-300 hover:-translate-y-1 active:scale-95 relative z-10 select-none cursor-pointer gap-2 group"
          >
            <span>Book Session Now</span>
            <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
