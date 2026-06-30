import { useEffect } from "react";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";
import ServiceGrid from "../components/ServiceGrid";

export default function Services() {
  useEffect(() => {
    updateSEO({
      title: "Our Services | Makeup, Hair Spa, Skin Care & Nails",
      description: "Browse the complete beauty treatment catalog at Radhe Beauty Care. Learn pricing and details for bridal packages, hair smoothening, and Hydra facials.",
      keywords: "makeup list, hair treatments, skin therapy prices Surat, nail extension salon",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 min-h-screen bg-dark text-white"
    >
      {/* Page Header */}
      <section className="bg-[#111111] py-16 mb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">
            Radhe Beauty Care
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-white mt-2 mb-4">
            Our Premium Services
          </h1>
          <p className="text-muted font-sans text-sm sm:text-base max-w-2xl mx-auto">
            Choose from our comprehensive range of high-end salon treatments. We use only premium products to ensure safe, long-lasting, and beautiful results.
          </p>
        </div>
      </section>

      {/* Services Grid with built-in filtering */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ServiceGrid />
      </section>

      {/* Custom Packages Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="glass-card p-8 bg-[#111111]/85 text-center">
          <h3 className="text-xl font-serif font-bold text-white mb-2">Need a Custom Package?</h3>
          <p className="text-sm text-muted font-sans leading-relaxed mb-6">
            Planning a wedding or group event? We design custom styling packages tailored for groups, brides, and family members. Get in touch with Kajal Shekhaliya to discuss details.
          </p>
          <a
            href="tel:+919328412418"
            className="inline-block px-6 py-3 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold font-sans tracking-wider uppercase rounded shadow transition-all duration-300"
          >
            Call to Discuss
          </a>
        </div>
      </section>
    </motion.div>
  );
}
