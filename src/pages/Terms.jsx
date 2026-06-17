import { useEffect } from "react";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";

export default function Terms() {
  useEffect(() => {
    updateSEO({
      title: "Terms of Service | Radhe Beauty Care",
      description: "Review terms regarding appointments, booking deposits, outstation travel logs, and training academy cancellations at Radhe Beauty Care.",
      keywords: "terms of service salon Surat, cancellation policy Radhe Beauty Care",
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
        <h1 className="text-3xl font-serif font-bold text-primary mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-sm sm:text-base text-muted leading-relaxed">
          <p>
            Welcome to Radhe Beauty Care. By accessing or booking appointments through our website, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-xl font-serif font-bold text-white mt-8 mb-4">1. Appointment Booking & Deposits</h2>
          <p>
            For premium bridal makeup packages and bulk group bookings, a partial advance deposit is required to confirm and secure your booking date. Dates are not held until the deposit is received. The remaining amount is due on the day of service.
          </p>

          <h2 className="text-xl font-serif font-bold text-white mt-8 mb-4">2. Cancellation & Rescheduling</h2>
          <p>
            Advance deposits for wedding dates are non-refundable. If you need to reschedule your bridal session or general salon appointment, please notify us at least 48 hours in advance. We will do our best to accommodate alternate times based on availability.
          </p>

          <h2 className="text-xl font-serif font-bold text-white mt-8 mb-4">3. Outstation Travel</h2>
          <p>
            For bridal styling assignments outside Surat/Gujarat, additional charges for transport, meals, and hotel lodging for Kajal Shekhaliya and her assistants will apply as structured in your custom quote.
          </p>

          <h2 className="text-xl font-serif font-bold text-white mt-8 mb-4">4. Academy Admissions</h2>
          <p>
            Registration fees for Radhe Beauty Academy training batches are non-refundable. Course schedules, hours, and modules may be adjusted by Kajal Shekhaliya to support student learning progress.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
