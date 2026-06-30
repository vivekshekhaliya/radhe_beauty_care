import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart, FaFacebookF, FaYoutube } from "react-icons/fa";
import { apiFetch } from "../utils/api";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await apiFetch("/settings");
        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to load footer settings", error);
      }
    }
    loadSettings();
  }, []);

  const phone = settings?.phone_number || "+91 9328412418";
  const email = settings?.email || "info@radhebeautycare.com";
  const instagram = settings?.instagram || "https://www.instagram.com/radhe_beauty_care03/";
  const facebook = settings?.facebook || "https://facebook.com";
  const youtube = settings?.youtube || "https://youtube.com";
  const address = settings?.address || "1st Floor, Royal Arcade, Yogi Chowk, Surat, Gujarat 395010";
  const footerCopyright = settings?.footer_text || "Radhe Beauty Care. All Rights Reserved.";

  return (
    <footer className="bg-dark text-white pt-16 pb-8 border-t border-primary/25 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/3 filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        
        {/* Salon Logo and Pitch */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex flex-col select-none group">
            <span className="text-2xl font-bold font-serif tracking-wide text-primary transition-colors">
              Radhe Beauty <span className="text-white font-sans">Care</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-muted">
              By Kajal Shekhaliya
            </span>
          </Link>
          <p className="text-muted text-sm leading-relaxed font-sans font-light">
            A premium beauty studio providing luxury makeup artistry, custom skincare therapies, professional hair design, and a certified skill academy.
          </p>
          <div className="flex space-x-4 pt-2">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-black flex items-center justify-center transition-all duration-300 text-white cursor-pointer"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-black flex items-center justify-center transition-all duration-300 text-white cursor-pointer"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-black flex items-center justify-center transition-all duration-300 text-white cursor-pointer"
              aria-label="YouTube"
            >
              <FaYoutube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-serif font-semibold text-primary tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-primary">
            Quick Links
          </h3>
          <ul className="space-y-3 font-sans text-sm text-muted font-light">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-primary transition-colors">Our Services</Link>
            </li>
            <li>
              <Link to="/bridal-makeup" className="hover:text-primary transition-colors">Bridal Specialist</Link>
            </li>
            <li>
              <Link to="/academy" className="hover:text-primary transition-colors">Beauty Academy</Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-primary transition-colors">Portfolio Gallery</Link>
            </li>
          </ul>
        </div>

        {/* Popular Services */}
        <div>
          <h3 className="text-lg font-serif font-semibold text-primary tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-primary">
            Our Services
          </h3>
          <ul className="space-y-3 font-sans text-sm text-muted font-light">
            <li>
              <Link to="/bridal-makeup" className="hover:text-primary transition-colors">Bridal & HD Makeup</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-primary transition-colors">Engagement & Party Glam</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-primary transition-colors">Keratin Hair Smoothing</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-primary transition-colors">Hydra Facial & Skin Care</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-primary transition-colors">Gel Nail Art & Extensions</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-serif font-semibold text-primary tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-primary">
            Contact Us
          </h3>
          <ul className="space-y-4 font-sans text-sm text-muted font-light">
            <li className="flex items-start space-x-3">
              <FaMapMarkerAlt className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span>
                {address}
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <FaPhoneAlt className="w-4 h-4 text-primary shrink-0" />
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-primary transition-colors">
                {phone}
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <FaEnvelope className="w-4 h-4 text-primary shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                {email}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 text-center font-sans text-xs text-muted flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
        <div>
          &copy; {currentYear} {footerCopyright}
        </div>
        <div className="flex space-x-6">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms-conditions" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          Made with <FaHeart className="text-primary animate-pulse inline" /> for Kajal Shekhaliya.
        </div>
      </div>
    </footer>
  );
}
