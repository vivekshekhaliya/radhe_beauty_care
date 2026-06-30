import { Link } from "react-router-dom";
import { FaPhoneAlt } from "react-icons/fa";

export default function BookingCTA() {
  return (
    <section id="bridal-makeup" className="relative py-16 overflow-hidden booking-cta-section text-white">
      {/* Background image wash overlay */}
      <div className="absolute inset-0 bg-dark bg-cover bg-center" style={{ backgroundImage: "linear-gradient(rgba(5, 5, 5, 0.94), rgba(5, 5, 5, 0.94)), url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200')" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center text-white flex flex-col items-center">
        <span className="text-primary text-xs sm:text-sm font-bold uppercase tracking-widest font-sans mb-4">
          Experience Elegance & Glamour
        </span>
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif mb-6 max-w-3xl leading-tight text-white">
          Ready to Elevate Your Look for the Next Big Event?
        </h2>
        
        <p className="text-sm sm:text-base text-muted font-sans max-w-xl mb-8 leading-relaxed">
          Book a customized makeup consultation or skin treatment session today. We specialize in bridal makeovers, hair smoothening, and premium skin therapies.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-peacock text-black hover:text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer text-center"
          >
            Book An Appointment
          </Link>
          <a
            href="tel:+919328412418"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-widest rounded transition-transform hover:scale-103 flex items-center justify-center gap-2"
          >
            <FaPhoneAlt className="w-3.5 h-3.5" />
            <span>Call +91 9328412418</span>
          </a>
        </div>
      </div>
    </section>
  );
}
