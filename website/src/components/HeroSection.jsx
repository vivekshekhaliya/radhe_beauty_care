import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import kajalImg from "../assets/IMG_5662.jpg";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-dark pt-28 pb-16">
      {/* Background cinematic media under dark overlay wash */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/85 to-dark z-10" />
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1600"
          alt="Luxury Beauty Studio"
          className="w-full h-full object-cover scale-[1.03] animate-[pulse_8s_ease-in-out_infinite]"
        />
      </div>

      {/* Decorative blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/8 filter blur-[100px] animate-blob-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald/5 filter blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* Left Col: Massive Typography & Action buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col space-y-8 text-center lg:text-left"
        >
          {/* Subtle gold design sub-banner */}
          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start space-x-2">
            <span className="w-8 h-[1px] bg-primary"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-primary font-sans">
              Elite Beauty Studio & Academy
            </span>
          </motion.div>

          {/* Luxury Large Heading (72px+) */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl lg:text-8xl font-serif font-black leading-tight text-white tracking-tight"
          >
            Enhance Your <br />
            <span className="gold-text-gradient font-serif italic">Beauty</span> With <br />
            Artistry
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-muted font-sans max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
          >
            Experience custom makeup transformations, expert skin treatments, and hair redesigns curated by certified specialist **Kajal Shekhaliya**.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold font-sans tracking-widest uppercase rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 text-center flex items-center justify-center gap-2 group cursor-pointer select-none"
            >
              <span>Book Appointment</span>
              <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-white/20 text-xs font-bold font-sans tracking-widest uppercase rounded-full shadow transition-all duration-300 hover:-translate-y-1 active:scale-95 text-center cursor-pointer select-none"
            >
              Explore Services
            </Link>
          </motion.div>

          {/* Animated Statistics counters */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 text-center lg:text-left"
          >
            <div>
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-primary">16+</span>
              <span className="text-[10px] text-muted uppercase tracking-widest font-sans font-semibold mt-1 block">Years Experience</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-primary">10K+</span>
              <span className="text-[10px] text-muted uppercase tracking-widest font-sans font-semibold mt-1 block">Happy Clients</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-serif font-bold text-primary">100+</span>
              <span className="text-[10px] text-muted uppercase tracking-widest font-sans font-semibold mt-1 block">National and international award</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Col: Floating glass cards & cinematic image framing */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          {/* Main Beauty Card Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full max-w-[400px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border border-white/10 gold-glow"
          >

            <img
              src={kajalImg}
              alt="Luxury Bridal Transformation"
              className="w-full h-[600px] object-cover scale-[1.00]"
              loading="eager"
            />

            {/* Soft dark wash at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            {/* Floating Social Proof tag inside the frame */}
            <div className="absolute bottom-6 left-6 right-6 p-4 frosted-glass border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-primary font-sans font-bold block">Lead Artist</span>
                <span className="text-sm font-serif font-bold text-white block">Kajal Shekhaliya</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex space-x-0.5 text-primary text-xs">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <span className="text-[8px] text-muted uppercase font-sans font-semibold mt-1 block">5.0 Star Rated</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Booking Card (Glass floater) */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute -right-6 top-10 hidden sm:block max-w-[190px] p-5 frosted-glass shadow-2xl border border-white/12 text-white animate-float select-none"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4 shrink-0">
              <FaCalendarAlt className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-xs font-serif font-bold text-white uppercase tracking-wider mb-1">Bridal D-Day</h3>
            <p className="text-[10px] text-muted font-sans leading-relaxed">Bookings open for the 2026/27 wedding season.</p>
          </motion.div>

          {/* Accent Gold Ring background */}
          <div className="absolute -z-10 -bottom-10 -left-10 w-44 h-44 rounded-full border border-primary/20 animate-[spin_40s_linear_infinite]" />
        </div>
      </div>
    </section>
  );
}
