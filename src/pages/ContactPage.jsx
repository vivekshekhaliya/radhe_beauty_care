import { useEffect } from "react";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";
import ContactInfo from "../components/ContactInfo";
import InquiryForm from "../components/InquiryForm";

export default function ContactPage() {
  useEffect(() => {
    updateSEO({
      title: "Contact Us & Book Appointment | Radhe Beauty Care Yogi Chowk",
      description: "Get in touch with Kajal Shekhaliya at Radhe Beauty Care. Find directions to our Royal Arcade Yogi Chowk Surat salon, phone number, and booking form.",
      keywords: "salon location Yogi Chowk, contact Radhe Beauty Care, beauty parlor Surat contact number",
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
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">
            Reserve Your Session
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-white mt-2 mb-4">
            Contact & Bookings
          </h1>
          <p className="text-muted font-sans text-sm sm:text-base max-w-2xl mx-auto">
            Ready to experience premium makeup and beauty care? Fill out our inquiry form or reach out directly via call or WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Left Column: Info & Map */}
          <div className="lg:col-span-5 flex flex-col space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white mb-4">Get In Touch</h2>
              <p className="text-sm text-muted font-sans leading-relaxed">
                Connect with our team to lock down your wedding dates, schedule pre-bridal skincare sessions, or join our training batches.
              </p>
            </div>

            <ContactInfo />
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <InquiryForm />
          </div>

        </div>

        {/* Google Map Embed Section */}
        <div className="border border-primary/25 rounded-[20px] overflow-hidden shadow-lg h-[400px] w-full relative gold-glow">
          <iframe
            title="Radhe Beauty Care Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.3496924192663!2d72.88560067605995!3d21.21798368132034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f693240212f%3A0xe543b593eb42323e!2sYogi%20Chowk%20Surat!5e0!3m2!1sen!2sin!4v1718670000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          ></iframe>
        </div>

      </section>
    </motion.div>
  );
}
