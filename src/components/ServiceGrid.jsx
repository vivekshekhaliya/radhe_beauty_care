import { useState } from "react";
import { servicesData } from "../constants/servicesData";
import ServiceCard from "./ServiceCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceGrid({ limit = null }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const categories = [
    { value: "all", label: "All Services" },
    { value: "bridal", label: "Bridal Spec" },
    { value: "makeup", label: "Party Glam" },
    { value: "hair", label: "Hair Care" },
    { value: "skin", label: "Skin Care" },
    { value: "nails", label: "Nail Extensions" },
  ];

  // Filter items
  const filteredServices = activeFilter === "all"
    ? servicesData
    : servicesData.filter((svc) => svc.category === activeFilter);

  // Apply visual limits for home aggregation
  const displayedServices = limit ? filteredServices.slice(0, limit) : filteredServices;

  return (
    <div className="w-full">
      {/* Category Filters Bar */}
      {!limit && (
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-5 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border select-none ${
                activeFilter === cat.value
                  ? "bg-primary text-black border-primary shadow-md font-extrabold"
                  : "bg-transparent text-muted hover:text-primary border-white/10 hover:border-primary/35 hover:bg-primary/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Services Cards Grid Layout */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {displayedServices.map((service) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              key={service.id}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Grid Empty Fallback */}
      {displayedServices.length === 0 && (
        <div className="text-center py-16 font-sans text-muted">
          No services found in this category.
        </div>
      )}
    </div>
  );
}
