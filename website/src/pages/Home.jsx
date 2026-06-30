import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import ServiceGrid from "../components/ServiceGrid";
import BeforeAfter from "../components/BeforeAfter";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import InquiryForm from "../components/InquiryForm";
import ContactInfo from "../components/ContactInfo";
import BookingCTA from "../components/BookingCTA";
import { FaArrowRight } from "react-icons/fa";

export default function Home() {
  useEffect(() => {
    updateSEO({
      title: "Radhe Beauty Care | Premium Bridal Makeup, Skin & Hair Salon in Surat",
      description: "Step into luxury with Radhe Beauty Care. Specialist bridal makeup, HD treatments, hair spas, and certified academy programs under Kajal Shekhaliya.",
      keywords: "Radhe Beauty Care, Kajal Shekhaliya, bridal makeup Yogi Chowk, skin clinic Surat, hair treatment, luxury salon Surat",
      pageType: "beauty-salon",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full bg-dark text-white"
    >
      {/* 1. Fullscreen Hero Section */}
      <HeroSection />

      {/* 2. Biography Intro Section */}
      <AboutSection />

      {/* 3. Services Preview Section (Large spacing) */}
      <section id="services" className="py-28 bg-[#111111]/60 border-t border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col items-center text-center mb-20">
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-8 h-[1px] bg-primary"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary font-sans">Our Signature Catalog</span>
              <span className="w-8 h-[1px] bg-primary"></span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white mb-4">
              Explore Our Services
            </h2>
            <p className="text-sm sm:text-base text-muted font-sans max-w-xl leading-relaxed font-light">
              We offer customizable packages for brides, trendy hair cuts, nourishing spa sessions, and certified skill development classes.
            </p>
          </div>

          {/* Show top 3 services in frosted glass cards */}
          <ServiceGrid limit={3} />

          {/* Call to action button */}
          <div className="mt-16 text-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold font-sans tracking-widest uppercase rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer select-none gap-2 group"
            >
              <span>View All Services</span>
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Before After Slider Comparison */}
      <BeforeAfter />

      {/* 5. Staggered Why Choose Us counters */}
      <WhyChooseUs />

      {/* 6. High-end Booking Banner */}
      <BookingCTA />

      {/* 7. Client Reviews Wall */}
      <Testimonials />

      {/* 8. Accordion Support Panel */}
      <FAQ />

      {/* 9. Contact / Inquiry Integration block */}
      <section className="py-28 bg-[#111111]/60 border-t border-white/5" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

            {/* Left Column Contact detail cards */}
            <div className="lg:col-span-5 flex flex-col space-y-8">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-8 h-[1px] bg-primary"></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary font-sans">Get in Touch</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
                  Visit Us or Make <br />an Inquiry
                </h2>
                <p className="text-sm sm:text-base text-muted font-sans leading-relaxed font-light">
                  Have a custom bridal makeup requirement or want to join our courses? Complete the inquiry form or connect with us directly via phone or Instagram.
                </p>
              </div>

              <ContactInfo />
            </div>

            {/* Right Column Inquiry Form */}
            <div className="lg:col-span-7">
              <InquiryForm />
            </div>

          </div>
        </div>
      </section>
    </motion.div>
  );
}
