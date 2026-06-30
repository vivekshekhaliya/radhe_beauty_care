import { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaInstagram } from "react-icons/fa";
import { apiFetch } from "../utils/api";

export default function ContactInfo() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await apiFetch("/settings");
        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error("Failed to load contact settings", error);
      }
    }
    loadSettings();
  }, []);

  const phone = settings?.phone_number || "+91 9328412418";
  const whatsapp = settings?.whatsapp_number || "+91 9328412418";
  const email = settings?.email || "info@radhebeautycare.com";
  const instagram = settings?.instagram || "https://www.instagram.com/radhe_beauty_care03/";
  const address = settings?.address || "1st Floor, Royal Arcade, Yogi Chowk, Surat, Gujarat 395010";
  const mapLink = settings?.google_map_link || "https://maps.google.com/?q=Yogi+Chowk+Surat+Gujarat";
  const hours = settings?.business_hours || "Mon - Sat: 10:00 AM - 08:00 PM | Sun: 10:00 AM - 02:00 PM";

  const contactDetails = [
    {
      icon: FaPhoneAlt,
      title: "Call / WhatsApp",
      description: "Direct call for booking & academy inquiries.",
      value: phone,
      link: `tel:${phone.replace(/\s+/g, '')}`
    },
    {
      icon: FaInstagram,
      title: "Instagram",
      description: "Follow us to view daily looks & student works.",
      value: instagram.replace(/\/$/, "").split("/").pop() ? `@${instagram.replace(/\/$/, "").split("/").pop()}` : "@radhe_beauty_care03",
      link: instagram
    },
    {
      icon: FaEnvelope,
      title: "Email Support",
      description: "Send us your business or outstation inquiries.",
      value: email,
      link: `mailto:${email}`
    },
    {
      icon: FaMapMarkerAlt,
      title: "Salon Location",
      description: address,
      value: "Get Directions",
      link: mapLink
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-white">
      
      {/* Contact detail cards */}
      {contactDetails.map((detail, index) => {
        const IconComponent = detail.icon;
        return (
          <a
            key={index}
            href={detail.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start p-6 frosted-glass bg-white/5 border border-white/10 hover:border-primary/30 rounded-[24px] transition-all duration-300 group shadow-lg gold-glow-hover"
          >
            <div className="w-11 h-11 rounded-[16px] bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-black transition-colors duration-300 shrink-0 mr-4">
              <IconComponent className="w-5 h-5" />
            </div>
            
            <div className="flex flex-col">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-sans mb-1.5">
                {detail.title}
              </h4>
              <p className="text-[11px] text-muted font-sans mb-3 leading-relaxed font-light line-clamp-2">
                {detail.description}
              </p>
              <span className="text-sm font-serif font-bold text-primary group-hover:text-white transition-colors break-all">
                {detail.value}
              </span>
            </div>
          </a>
        );
      })}

      {/* Business Timings Card */}
      <div className="sm:col-span-2 flex items-start p-6 frosted-glass bg-white/5 border border-white/10 rounded-[24px] shadow-lg">
        <div className="w-11 h-11 rounded-[16px] bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 mr-4">
          <FaClock className="w-5 h-5" />
        </div>
        
        <div className="flex flex-col w-full">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white font-sans mb-2">
            Business Hours
          </h4>
          <p className="text-sm font-sans text-muted font-light leading-relaxed">
            {hours}
          </p>
        </div>
      </div>

    </div>
  );
}
