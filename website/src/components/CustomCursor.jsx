import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for direct mouse tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs for smooth follow lag trail
  const springConfig = { damping: 40, stiffness: 300, mass: 0.5 };
  const trailX = useSpring(cursorX, springConfig);
  const trailY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is desktop
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024 || "ontouchstart" in window);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Track hovers on interactive items
    const addHoverEvents = () => {
      const links = document.querySelectorAll("a, button, select, input, textarea, [role='button']");
      links.forEach((link) => {
        link.addEventListener("mouseenter", () => setIsHovered(true));
        link.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    // Initial attach
    addHoverEvents();

    // Re-attach hovers on DOM mutations (e.g. page changes)
    const observer = new MutationObserver(addHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
    };
  }, [isMobile, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* 1. Fast Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* 2. Smooth Lag Trail Circle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-primary pointer-events-none z-50"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 48 : 28,
          height: isHovered ? 48 : 28,
          backgroundColor: isHovered ? "rgba(200, 155, 60, 0.1)" : "rgba(200, 155, 60, 0)",
          borderColor: isHovered ? "#E2C36B" : "#C89B3C",
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
    </>
  );
}
