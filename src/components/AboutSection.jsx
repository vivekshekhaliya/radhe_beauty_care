import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaAward, FaCertificate, FaGraduationCap } from "react-icons/fa";

export default function AboutSection() {
  const stats = [
    { value: "8+", label: "Years Experience" },
    { value: "1000+", label: "Happy Brides" },
    { value: "500+", label: "Academy Students" },
    { value: "100%", label: "Satisfaction" },
  ];

  return (
    <section className="py-24 bg-dark text-white border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Visual Grid of Images */}
          <div className="lg:col-span-5 relative grid grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="col-span-2 aspect-[16/10] rounded-[28px] overflow-hidden shadow-lg border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800"
                alt="Radhe Beauty Care Academy Classroom"
                className="w-full h-full object-cover hover:scale-103 duration-500"
                loading="lazy"
              />
            </div>
            
            {/* Secondary Image */}
            <div className="aspect-square rounded-[24px] overflow-hidden shadow-lg border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400"
                alt="Bridal detailing by Kajal"
                className="w-full h-full object-cover hover:scale-105 duration-500"
                loading="lazy"
              />
            </div>

            {/* Tertiary Image */}
            <div className="aspect-square rounded-[24px] overflow-hidden shadow-lg border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400"
                alt="Skin therapy setup"
                className="w-full h-full object-cover hover:scale-105 duration-500"
                loading="lazy"
              />
            </div>

            {/* Floating Gold Border Highlight */}
            <div className="absolute -z-10 -bottom-4 -left-4 w-40 h-40 border-b-4 border-l-4 border-primary/30 rounded-bl-[28px]" />
          </div>

          {/* Description Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="flex items-center space-x-2">
              <span className="w-10 h-[1px] bg-primary"></span>
              <span className="text-sm font-bold uppercase tracking-widest text-primary font-sans">
                About The Artist
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white leading-tight">
              Meet Kajal Shekhaliya
              <span className="block text-lg font-sans text-muted font-normal mt-1.5">
                Owner, Certified Bridal Makeup Specialist & Educator
              </span>
            </h2>

            <p className="text-sm sm:text-base text-muted font-sans leading-relaxed">
              **Radhe Beauty Care**, founded by lead cosmetologist **Kajal Shekhaliya**, is built on a passion for elevating confidence through personalized luxury aesthetics. As an industry expert in high-definition bridal styling and skin treatment therapies, Kajal brings over eight years of experience.
            </p>

            <p className="text-sm sm:text-base text-muted font-sans leading-relaxed">
              In addition to client styling, Kajal Shekhaliya hosts a premium **Beauty Training Academy**, empowering the next generation of stylists with structured coursework and certifications in makeup, hairstyling, skin therapy, and nail art.
            </p>

            {/* Key Qualifications - Dark Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3.5 rounded-[16px]">
                <FaCertificate className="text-primary w-5 h-5 shrink-0" />
                <span className="text-xs font-bold font-sans text-white uppercase tracking-wider">
                  Certified Artist
                </span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3.5 rounded-[16px]">
                <FaAward className="text-primary w-5 h-5 shrink-0" />
                <span className="text-xs font-bold font-sans text-white uppercase tracking-wider">
                  Bridal Expert
                </span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3.5 rounded-[16px]">
                <FaGraduationCap className="text-primary w-5 h-5 shrink-0" />
                <span className="text-xs font-bold font-sans text-white uppercase tracking-wider">
                  Academy Mentor
                </span>
              </div>
            </div>

            {/* Stats Counter Overlay */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/5">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center sm:text-left">
                  <span className="block text-2xl sm:text-3xl font-bold text-primary font-serif">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted uppercase font-sans tracking-widest font-semibold mt-1 block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex">
              <Link
                to="/about"
                className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black text-sm font-bold font-sans tracking-widest uppercase rounded-full shadow transition-all duration-300 select-none text-center cursor-pointer active:scale-95"
              >
                Read Full Story
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
