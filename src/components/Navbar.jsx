import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Bridal Spec", path: "/bridal-makeup" },
    { name: "Academy", path: "/academy" },
    { name: "Gallery", path: "/gallery" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className="fixed top-0 left-0 w-full z-45 flex justify-center py-6 px-4 pointer-events-none">
      <header
        className={`w-full max-w-7xl px-6 py-4 flex items-center justify-between transition-all duration-500 pointer-events-auto ${
          isScrolled
            ? "glass-nav rounded-[24px] lg:rounded-[32px] shadow-2xl py-3 border border-white/10"
            : "bg-transparent border border-transparent"
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col select-none group">
          <span className="text-xl sm:text-2xl font-bold font-serif tracking-wide text-primary transition-colors duration-300 group-hover:text-accent">
            Radhe Beauty <span className="text-white font-sans font-medium">Care</span>
          </span>
          <span className="text-[9px] uppercase tracking-widest text-muted group-hover:text-primary duration-300">
            By Kajal Shekhaliya
          </span>
        </Link>

        {/* Desktop Navigation links */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-semibold uppercase tracking-wider font-sans py-2 relative transition-colors duration-250 ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-white/80 hover:text-primary"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Book CTA Action Button */}
        <div className="hidden lg:block">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold font-sans tracking-widest rounded-full shadow-lg hover:shadow-primary/10 transition-all duration-350 cursor-pointer uppercase select-none active:scale-95"
          >
            Book Session
          </Link>
        </div>

        {/* Mobile menu hamburger */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-primary hover:text-accent focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer (Centred Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-4 top-24 z-50 glass-nav p-6 rounded-[28px] border border-white/10 shadow-2xl overflow-hidden pointer-events-auto lg:hidden"
          >
            <div className="space-y-2.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block px-4 py-3 rounded-[16px] text-base font-semibold transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary font-bold border-l-4 border-primary"
                        : "text-white hover:bg-white/5 hover:text-primary"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-white/5">
                <Link
                  to="/contact"
                  className="block w-full text-center px-4 py-3.5 bg-primary hover:bg-peacock text-black hover:text-white font-bold rounded-[16px] shadow uppercase tracking-widest transition-colors duration-300"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
