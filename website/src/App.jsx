import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import ScrollToTop from "./components/ScrollToTop";

// Global Luxury Enhancements
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import BackgroundGrid from "./components/BackgroundGrid";

// Page Imports
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import BridalMakeup from "./pages/BridalMakeup";
import Academy from "./pages/Academy";
import GalleryPage from "./pages/GalleryPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-dark text-white relative">
        {/* Top Scroll Indicator */}
        <ScrollProgress />

        {/* Global Mesh Gradient blobs */}
        <BackgroundGrid />

        {/* Custom mouse trail pointer */}
        <CustomCursor />

        {/* Floating pill navigation */}
        <Navbar />

        {/* Scroll resetting helper */}
        <ScrollToTop />

        {/* Floating whatsapp / call buttons */}
        <FloatingButtons />

        {/* Main routing contents wrapper */}
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/bridal-makeup" element={<BridalMakeup />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<Terms />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Sticky footer */}
        <Footer />
      </div>
    </Router>
  );
}
