import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight === 0) {
        setScrollProgress(0);
        return;
      }
      const scrollVal = (window.scrollY / totalHeight) * 100;
      setScrollProgress(scrollVal);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-dark/40 z-50 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
