import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";
import { coursesData } from "../constants/coursesData";
import { FaGraduationCap, FaClock, FaAward, FaCheck } from "react-icons/fa";

export default function Academy() {
  useEffect(() => {
    updateSEO({
      title: "Radhe Beauty Academy | Professional Makeup & Hair Courses in Surat",
      description: "Join Radhe Beauty Academy led by Kajal Shekhaliya. Learn professional bridal makeup, hair designing, skin therapy, and nail art. Government registered certification.",
      keywords: "makeup school Surat, beauty academy Yogi Chowk, learn nail art, certified beautician course Surat",
      pageType: "academy",
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 min-h-screen bg-dark text-white"
    >
      {/* Academy Banner */}
      <section className="bg-[#111111]/70 py-16 mb-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <FaGraduationCap className="w-5 h-5 text-primary animate-pulse" />
            <span>Empower Your Career</span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-white mt-2 mb-4">
            Radhe Beauty Academy
          </h1>
          <p className="text-muted font-sans text-sm sm:text-base max-w-2xl mx-auto font-light">
            Become a certified beauty professional. Our training modules are designed by Kajal Shekhaliya to give you hands-on experience, marketing guidance, and career confidence.
          </p>
        </div>
      </section>

      {/* Courses Catalog list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className="frosted-glass p-8 bg-[#111111]/85 flex flex-col lg:flex-row gap-10 items-center hover:shadow-2xl transition-shadow duration-300 border border-white/10 gold-glow-hover"
            >
              {/* Left Column: Image */}
              <div className="w-full lg:w-2/5 aspect-[4/3] rounded-[24px] overflow-hidden shrink-0 shadow border border-white/5">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Right Column: Details */}
              <div className="w-full lg:w-3/5 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3 className="text-2xl font-serif font-bold text-white mb-3">
                    {course.title}
                  </h3>
                  
                  {/* Meta items */}
                  <div className="flex flex-wrap gap-4 text-xs font-sans text-muted mb-5">
                    <div className="flex items-center space-x-1.5 bg-dark border border-white/10 px-3 py-1.5 rounded-[8px]">
                      <FaClock className="text-primary" />
                      <span className="font-semibold text-white/90">{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-dark border border-white/10 px-3 py-1.5 rounded-[8px]">
                      <FaAward className="text-primary" />
                      <span className="font-semibold text-white/90">{course.certification}</span>
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-muted font-sans leading-relaxed mb-6 font-light">
                    {course.description}
                  </p>

                  {/* Course Syllabus/Curriculum */}
                  <h4 className="text-xs font-bold font-sans uppercase tracking-widest text-white mb-3">What You Will Learn</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                    {course.curriculum.map((item, cIdx) => (
                      <li key={cIdx} className="flex items-start text-xs sm:text-sm text-white/90 font-sans">
                        <FaCheck className="text-primary w-3.5 h-3.5 mr-2 shrink-0 mt-1" />
                        <span className="font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inquiry CTA */}
                <div className="border-t border-white/5 pt-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted font-sans uppercase tracking-widest">Course Fee Est.</span>
                    <span className="text-lg font-serif font-bold text-primary">{course.price}</span>
                  </div>
                  
                  {/* Gold rounded button */}
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-primary hover:bg-peacock text-black hover:text-white text-xs font-bold font-sans uppercase tracking-widest rounded-full shadow transition-all duration-300 hover:-translate-y-0.5 active:scale-95 select-none cursor-pointer"
                  >
                    Inquire for Batch Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Academy Highlights */}
      <section className="bg-[#111111]/70 py-16 mt-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">Academy Training Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm font-sans text-muted">
            <div className="frosted-glass p-6 bg-dark border border-white/10 hover:border-primary/35 duration-300">
              <h4 className="font-serif font-bold text-white text-base mb-2">100% Practical Focus</h4>
              <p className="font-light">Students practice techniques on live models under the direct supervision of Kajal Shekhaliya to master base application and contouring.</p>
            </div>
            <div className="frosted-glass p-6 bg-dark border border-white/10 hover:border-primary/35 duration-300">
              <h4 className="font-serif font-bold text-white text-base mb-2">Product Kit Guidance</h4>
              <p className="font-light">We provide extensive breakdowns on makeup products, brush kits, hair styling dryers, and nails tools needed to start your vanity setup.</p>
            </div>
            <div className="frosted-glass p-6 bg-dark border border-white/10 hover:border-primary/35 duration-300">
              <h4 className="font-serif font-bold text-white text-base mb-2">Social Media & Marketing</h4>
              <p className="font-light">Learn how to take professional photos of your looks, write engaging captions, edit portfolio pictures, and attract high-paying wedding clients.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
