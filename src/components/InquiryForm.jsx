import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

export default function InquiryForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    city: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    agreeToPolicy: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // States to monitor focus for floating labels
  const [focusedField, setFocusedField] = useState({});

  const servicesList = [
    { value: "bridal-makeup", label: "Bridal Makeup Package" },
    { value: "hd-makeup", label: "HD / Airbrush Makeup" },
    { value: "party-makeup", label: "Party Makeup & Hair Styling" },
    { value: "hair-treatment", label: "Hair Smoothening / Keratin" },
    { value: "facial-skincare", label: "Hydra Facial & Skin Care" },
    { value: "nails", label: "Nail Extensions & Art" },
    { value: "academy-makeup", label: "Academy Course: Makeup Artist" },
    { value: "academy-hair-nail", label: "Academy Course: Hair / Skin / Nails" },
  ];

  const handleFocus = (field) => {
    setFocusedField((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field, val) => {
    if (!val) {
      setFocusedField((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = "Full name is required";
    
    if (!formData.mobileNumber.trim()) {
      tempErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/[\s-+]/g, "").slice(-10))) {
      tempErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }

    if (!formData.service) tempErrors.service = "Please select a service";
    if (!formData.preferredDate) tempErrors.preferredDate = "Please choose a preferred date";
    if (!formData.agreeToPolicy) tempErrors.agreeToPolicy = "You must agree to the privacy policy";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Mock API Submission (Backend-ready structure)
    setTimeout(() => {
      console.log("Submitting booking inquiry to API Endpoint: /api/bookings", {
        client: {
          name: formData.fullName,
          phone: formData.mobileNumber,
          email: formData.email,
          city: formData.city,
        },
        booking: {
          service: formData.service,
          date: formData.preferredDate,
          time: formData.preferredTime,
          message: formData.message,
        },
        metadata: {
          createdAt: new Date().toISOString(),
          status: "pending",
        }
      });

      setIsSubmitting(false);
      setShowPopup(true);
      
      // Clear form
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        city: "",
        service: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
        agreeToPolicy: false,
      });
      setFocusedField({});
    }, 1500);
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="frosted-glass p-8 sm:p-10 shadow-2xl relative overflow-hidden text-white bg-[#111111]/80 gold-glow">
        {/* Elegant top border highlight */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary via-accent to-primary" />

        <h3 className="text-2xl font-serif font-bold text-center text-white mb-2">Book Your Session</h3>
        <p className="text-sm text-center text-muted font-sans mb-10 font-light">Fill out the details below, and Kajal Shekhaliya or our team will get in touch with you shortly.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Full Name */}
          <div className="flex flex-col relative pt-5">
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              onFocus={() => handleFocus("fullName")}
              onBlur={(e) => handleBlur("fullName", e.target.value)}
              className="w-full px-1 py-3 bg-transparent border-b border-white/10 text-white outline-none focus:border-primary transition-colors text-sm font-sans"
            />
            <label
              htmlFor="fullName"
              className={`absolute left-1 pointer-events-none transition-all duration-300 font-sans text-xs tracking-wider uppercase font-semibold ${
                focusedField.fullName || formData.fullName
                  ? "top-0 text-[10px] text-primary"
                  : "top-8 text-muted text-sm"
              }`}
            >
              Full Name *
            </label>
            {errors.fullName && <span className="text-red-500 text-xs mt-1 font-sans">{errors.fullName}</span>}
          </div>

          {/* Mobile Number */}
          <div className="flex flex-col relative pt-5">
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              onFocus={() => handleFocus("mobileNumber")}
              onBlur={(e) => handleBlur("mobileNumber", e.target.value)}
              className="w-full px-1 py-3 bg-transparent border-b border-white/10 text-white outline-none focus:border-primary transition-colors text-sm font-sans"
            />
            <label
              htmlFor="mobileNumber"
              className={`absolute left-1 pointer-events-none transition-all duration-300 font-sans text-xs tracking-wider uppercase font-semibold ${
                focusedField.mobileNumber || formData.mobileNumber
                  ? "top-0 text-[10px] text-primary"
                  : "top-8 text-muted text-sm"
              }`}
            >
              Mobile Number *
            </label>
            {errors.mobileNumber && <span className="text-red-500 text-xs mt-1 font-sans">{errors.mobileNumber}</span>}
          </div>

          {/* Email */}
          <div className="flex flex-col relative pt-5">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => handleFocus("email")}
              onBlur={(e) => handleBlur("email", e.target.value)}
              className="w-full px-1 py-3 bg-transparent border-b border-white/10 text-white outline-none focus:border-primary transition-colors text-sm font-sans"
            />
            <label
              htmlFor="email"
              className={`absolute left-1 pointer-events-none transition-all duration-300 font-sans text-xs tracking-wider uppercase font-semibold ${
                focusedField.email || formData.email
                  ? "top-0 text-[10px] text-primary"
                  : "top-8 text-muted text-sm"
              }`}
            >
              Email Address
            </label>
            {errors.email && <span className="text-red-500 text-xs mt-1 font-sans">{errors.email}</span>}
          </div>

          {/* City */}
          <div className="flex flex-col relative pt-5">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              onFocus={() => handleFocus("city")}
              onBlur={(e) => handleBlur("city", e.target.value)}
              className="w-full px-1 py-3 bg-transparent border-b border-white/10 text-white outline-none focus:border-primary transition-colors text-sm font-sans"
            />
            <label
              htmlFor="city"
              className={`absolute left-1 pointer-events-none transition-all duration-300 font-sans text-xs tracking-wider uppercase font-semibold ${
                focusedField.city || formData.city
                  ? "top-0 text-[10px] text-primary"
                  : "top-8 text-muted text-sm"
              }`}
            >
              City / Area
            </label>
          </div>

          {/* Select Service */}
          <div className="flex flex-col md:col-span-2 pt-2">
            <label htmlFor="service" className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 font-sans">Select Service *</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className="w-full px-3 py-3 bg-[#050505] border border-white/10 text-white outline-none focus:border-primary transition-all rounded-[12px] text-sm font-sans cursor-pointer"
            >
              <option value="" className="text-muted">-- Select A Service / Course --</option>
              {servicesList.map((svc) => (
                <option key={svc.value} value={svc.value} className="text-white bg-[#050505]">
                  {svc.label}
                </option>
              ))}
            </select>
            {errors.service && <span className="text-red-500 text-xs mt-1 font-sans">{errors.service}</span>}
          </div>

          {/* Preferred Date */}
          <div className="flex flex-col pt-2">
            <label htmlFor="preferredDate" className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 font-sans">Preferred Date *</label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              className="w-full px-3 py-3 bg-[#050505] border border-white/10 text-white outline-none focus:border-primary transition-all rounded-[12px] text-sm font-sans"
            />
            {errors.preferredDate && <span className="text-red-500 text-xs mt-1 font-sans">{errors.preferredDate}</span>}
          </div>

          {/* Preferred Time */}
          <div className="flex flex-col pt-2">
            <label htmlFor="preferredTime" className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 font-sans">Preferred Time</label>
            <input
              type="time"
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              className="w-full px-3 py-3 bg-[#050505] border border-white/10 text-white outline-none focus:border-primary transition-all rounded-[12px] text-sm font-sans"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col md:col-span-2 relative pt-5">
            <textarea
              id="message"
              name="message"
              rows="3"
              value={formData.message}
              onChange={handleInputChange}
              onFocus={() => handleFocus("message")}
              onBlur={(e) => handleBlur("message", e.target.value)}
              className="w-full px-1 py-3 bg-transparent border-b border-white/10 text-white outline-none focus:border-primary transition-colors text-sm font-sans resize-none"
            ></textarea>
            <label
              htmlFor="message"
              className={`absolute left-1 pointer-events-none transition-all duration-300 font-sans text-xs tracking-wider uppercase font-semibold ${
                focusedField.message || formData.message
                  ? "top-0 text-[10px] text-primary"
                  : "top-8 text-muted text-sm"
              }`}
            >
              Message / Special Notes
            </label>
          </div>

          {/* Terms Checkbox */}
          <div className="flex flex-col md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeToPolicy"
                name="agreeToPolicy"
                checked={formData.agreeToPolicy}
                onChange={handleInputChange}
                className="w-4.5 h-4.5 text-primary border-white/20 rounded focus:ring-primary cursor-pointer bg-dark"
              />
              <label htmlFor="agreeToPolicy" className="ml-2.5 text-xs text-muted font-sans select-none cursor-pointer">
                I agree to the privacy policy and terms of service.
              </label>
            </div>
            {errors.agreeToPolicy && <span className="text-red-500 text-xs mt-1 font-sans">{errors.agreeToPolicy}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full py-4.5 bg-primary hover:bg-peacock disabled:bg-primary/60 text-black hover:text-white font-sans font-bold uppercase tracking-widest rounded-full shadow-lg transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer select-none active:scale-95"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin w-5 h-5 text-black" />
              <span>Processing Inquiry...</span>
            </>
          ) : (
            <span>Send Booking Request</span>
          )}
        </button>
      </form>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111111] p-8 rounded-[28px] shadow-2xl max-w-md w-full border border-primary/25 text-center relative overflow-hidden text-white"
            >
              <div className="absolute top-0 left-0 w-full h-[5px] bg-primary" />
              
              <FaCheckCircle className="text-primary w-16 h-16 mx-auto mb-5 animate-bounce" />
              
              <h4 className="text-2xl font-serif font-bold text-white mb-3">Inquiry Sent Successfully!</h4>
              
              <p className="text-sm text-muted font-sans leading-relaxed mb-6">
                Thank you for contacting Radhe Beauty Care. Your request has been recorded. Kajal Shekhaliya or a team member will reach out to you within 24 hours.
              </p>

              <button
                onClick={() => setShowPopup(false)}
                className="w-full py-3.5 bg-primary hover:bg-peacock text-black hover:text-white font-sans font-semibold rounded-full transition-colors cursor-pointer select-none"
              >
                Close Window
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
