import { Link } from "react-router-dom";
import { FaClock, FaTag } from "react-icons/fa";

export default function ServiceCard({ service }) {
  const { title, description, image, price, duration, category } = service;

  return (
    <div className="frosted-glass overflow-hidden transition-all duration-400 flex flex-col justify-between group h-full hover:-translate-y-2 gold-glow-hover">
      {/* Visual Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
        {/* Category badge - Gold */}
        <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary text-black text-[9px] font-sans font-bold uppercase tracking-widest rounded-full shadow-md">
          {category}
        </span>
      </div>

      {/* Info Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold text-white mb-2.5 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted font-sans leading-relaxed mb-6 font-light line-clamp-3">
            {description}
          </p>
        </div>

        {/* Pricing & Duration details */}
        <div className="border-t border-white/5 pt-4 mt-2">
          <div className="flex items-center justify-between text-xs font-sans text-muted mb-5">
            <div className="flex items-center space-x-1.5">
              <FaTag className="text-primary shrink-0" />
              <span className="font-bold text-primary">{price}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <FaClock className="text-primary shrink-0" />
              <span>{duration}</span>
            </div>
          </div>

          {/* Booking Link - Gold border, hover gold background */}
          <Link
            to="/contact"
            className="block w-full text-center py-3 bg-transparent hover:bg-primary text-primary hover:text-black border border-primary/40 hover:border-primary font-sans font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 cursor-pointer select-none active:scale-95"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
