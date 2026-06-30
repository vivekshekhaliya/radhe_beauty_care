import { FaWhatsapp, FaPhoneAlt, FaCalendarCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function FloatingButtons() {
  const whatsappUrl = "https://wa.me/919328412418?text=Hello%20Radhe%20Beauty%20Care,%20I%20would%20like%20to%20inquire%20about%20your%20beauty%20services!";
  const phoneUrl = "tel:+919328412418";

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 group relative"
        aria-label="Contact on WhatsApp"
      >
        <span className="absolute left-14 bg-dark text-white text-xs px-2.5 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          WhatsApp Us
        </span>
        <span className="absolute -z-10 w-full h-full bg-green-500 rounded-full animate-ping opacity-25"></span>
        <FaWhatsapp className="w-6 h-6" />
      </a>

      {/* Call Button */}
      <a
        href={phoneUrl}
        className="flex items-center justify-center w-12 h-12 bg-accent hover:bg-accent-hover text-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 group relative"
        aria-label="Call Us"
      >
        <span className="absolute left-14 bg-dark text-white text-xs px-2.5 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Call +91 9328412418
        </span>
        <span className="absolute -z-10 w-full h-full bg-accent rounded-full animate-ping opacity-25"></span>
        <FaPhoneAlt className="w-5 h-5" />
      </a>

      {/* Quick Booking CTA Link */}
      <Link
        to="/contact"
        className="flex items-center justify-center w-12 h-12 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 group relative"
        aria-label="Book Appointment"
      >
        <span className="absolute left-14 bg-dark text-white text-xs px-2.5 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          Book Appointment
        </span>
        <FaCalendarCheck className="w-5 h-5" />
      </Link>
    </div>
  );
}
