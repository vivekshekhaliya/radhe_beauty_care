import { useEffect } from "react";
import { motion } from "framer-motion";
import { updateSEO } from "../utils/seo";
import { FaRegHeart, FaStar, FaRegHandshake } from "react-icons/fa";

export default function About() {
  useEffect(() => {
    updateSEO({
      title: "About Kajal Shekhaliya | Founder of Radhe Beauty Care",
      description: "Learn about Kajal Shekhaliya, a certified bridal makeup expert, skin analyst, hair designer, and lead educator at Radhe Beauty Academy.",
      keywords: "Kajal Shekhaliya biography, Radhe Beauty Care history, certified cosmetologist Surat",
    });
  }, []);

  const principles = [
    {
      icon: FaRegHeart,
      title: "Hygienic Styling",
      text: "We prioritize complete sanitization of brushes, tools, and surfaces. Your health and comfort are our primary concerns."
    },
    {
      icon: FaStar,
      title: "Premium luxury base",
      text: "We make zero compromises on product lines. Our inventory features high-end global brands to protect skin texture."
    },
    {
      icon: FaRegHandshake,
      title: "Honest consultation",
      text: "We suggest colors and treatments based strictly on your natural skin tone and hair strength, ensuring clean, organic beauty."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 min-h-screen bg-dark text-white"
    >
      {/* Luxury Hero Banner */}
      <section className="bg-[#111111] py-16 mb-16 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-primary font-sans text-xs font-bold uppercase tracking-widest">
            Radhe Beauty Care
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-serif text-white mt-2 mb-4">
            Our Story & Founder
          </h1>
          <p className="text-muted font-sans text-sm sm:text-base max-w-2xl mx-auto">
            Discover the dedication, passion, and training behind Surat's premium bridal styling salon and training academy.
          </p>
        </div>
      </section>

      {/* Main Biography Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          {/* Left: Artist Photo */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] rounded-[20px] overflow-hidden shadow-2xl border-4 border-primary/20 gold-glow">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800"
                alt="Kajal Shekhaliya Lead Stylist"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Certificate overlay card */}
            <div className="absolute -bottom-6 -right-6 bg-[#111111] p-5 rounded-[20px] border border-primary/25 shadow-lg max-w-[200px]">
              <span className="block text-2xl font-bold text-primary font-serif">8+ Years</span>
              <span className="block text-xs text-muted uppercase tracking-wider font-sans mt-1">Professional Client Experience</span>
            </div>
          </div>

          {/* Right: Bio Details */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Meet Kajal Shekhaliya
            </h2>
            <p className="text-sm sm:text-base text-muted font-sans leading-relaxed">
              Kajal Shekhaliya founded **Radhe Beauty Care** with a simple dream: to establish a luxury beauty space that blends custom attention with modern beauty techniques. As a graduate cosmetologist and certified bridal makeup expert, she specializes in analyzing complex skin concerns to deliver matching makeup.
            </p>
            <p className="text-sm sm:text-base text-muted font-sans leading-relaxed">
              Her signature styles are known for being elegant yet lightweight. Whether it's high-definition (HD) bridal makeup, reception party makeup, or hair rebonding and keratin treatments, Kajal believes in highlighting natural features rather than creating mask-like coverage.
            </p>
            <p className="text-sm sm:text-base text-muted font-sans leading-relaxed">
              To keep up with international beauty trends, Kajal regularly completes workshops with globally recognized makeup artists, bringing the latest contouring, draping, and airbrushing techniques to clients in Gujarat.
            </p>
          </div>
        </div>

        {/* Vision & Mission Row - Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card p-8 bg-[#111111]/85">
            <h3 className="text-xl font-serif font-bold text-primary mb-4">Our Vision</h3>
            <p className="text-sm text-muted font-sans leading-relaxed">
              To be the premier beauty care brand recognized for quality standards and authentic client relationships. We aim to inspire confidence in women, helping them feel beautiful inside and out.
            </p>
          </div>
          <div className="glass-card p-8 bg-[#111111]/85">
            <h3 className="text-xl font-serif font-bold text-primary mb-4">Our Mission</h3>
            <p className="text-sm text-muted font-sans leading-relaxed">
              To deliver premium makeup, hair treatment, and skin therapies using safe, high-end products. We combine our expertise with a welcoming atmosphere, while educating future beauty professionals with correct, industry-ready skills.
            </p>
          </div>
        </div>

        {/* Core Principles Section */}
        <div className="border-t border-white/5 pt-16">
          <h3 className="text-2xl font-serif font-bold text-white text-center mb-12">
            Our Styling Philosophy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((pr, index) => {
              const Icon = pr.icon;
              return (
                <div key={index} className="text-center flex flex-col items-center p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white mb-2">{pr.title}</h4>
                  <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed">{pr.text}</p>
                </div>
              );
            })}
          </div>
        </div>

      </section>
    </motion.div>
  );
}
