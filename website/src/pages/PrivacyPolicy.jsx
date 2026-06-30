import { useEffect } from "react";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";

export default function PrivacyPolicy() {
  useEffect(() => {
    updateSEO({
      title: "Privacy Policy | Radhe Beauty Care",
      description: "Understand how Radhe Beauty Care collects, handles, and protects your scheduling and contact details.",
      keywords: "privacy policy Radhe Beauty Care, data protection salon",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 min-h-screen font-sans bg-dark text-white"
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-primary mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-sm sm:text-base text-muted leading-relaxed">
          <p>
            At Radhe Beauty Care (accessible from Yogi Chowk, Surat), one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Radhe Beauty Care and how we use it.
          </p>

          <h2 className="text-xl font-serif font-bold text-white mt-8 mb-4">Information We Collect</h2>
          <p>
            When you complete our online booking inquiry form, we ask for your name, phone number, email address, city, preferred booking date, and preferred appointment time. This information is used solely to contact you regarding your styling requests and to organize session timings.
          </p>

          <h2 className="text-xl font-serif font-bold text-white mt-8 mb-4">How We Use Your Information</h2>
          <p>
            We use the collected details to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Communicate directly with you regarding booking slots and pricing estimates.</li>
            <li>Send confirmations, changes, or updates regarding scheduled sessions.</li>
            <li>Maintain customer booking archives for billing.</li>
            <li>Improve and secure the performance of our website.</li>
          </ul>

          <h2 className="text-xl font-serif font-bold text-white mt-8 mb-4">Consent</h2>
          <p>
            By using our website and submitting booking forms, you hereby consent to our Privacy Policy and agree to its terms. If you wish to request deletion of your booking records, please contact us directly at +91 9328412418.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
