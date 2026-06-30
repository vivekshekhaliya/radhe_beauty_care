import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";
import ServiceCard from "./ServiceCard";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceGrid({ limit = null }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([{ value: "all", label: "All Services" }]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch categories
        const catRes = await apiFetch("/categories/active");
        if (catRes.success) {
          const mappedCats = catRes.data.map(cat => ({
            value: cat.slug,
            label: cat.name
          }));
          setCategories([{ value: "all", label: "All Services" }, ...mappedCats]);
        }

        // Fetch services
        const svcRes = await apiFetch("/services");
        if (svcRes.success) {
          // If response is paginated (data.data), else a direct array (data)
          const servicesList = svcRes.data.data || svcRes.data || [];
          // Filter to only active services on public site
          setServices(servicesList.filter(s => s.status === 'active'));
        }
      } catch (error) {
        console.error("Failed to load public services data", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter items based on active category slug
  const filteredServices = activeFilter === "all"
    ? services
    : services.filter((svc) => svc.category?.slug === activeFilter);

  // Apply visual limits for home aggregation
  const displayedServices = limit ? filteredServices.slice(0, limit) : filteredServices;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3"></div>
        <p className="text-xs uppercase tracking-widest font-sans font-bold text-muted">Loading treatments...</p>
      </div>
    );
  }

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
