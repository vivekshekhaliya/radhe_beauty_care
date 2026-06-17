import { motion } from "framer-motion";

export default function BackgroundGrid() {
  return (
    <div className="fixed inset-0 -z-30 w-full h-full bg-[#050505] overflow-hidden pointer-events-none select-none">
      {/* Glow Blob 1: Gold */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -100, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 -left-1/10 w-[45vw] h-[45vw] rounded-full bg-primary/4 filter blur-[120px] animate-blob-pulse"
      />

      {/* Glow Blob 2: Emerald Green */}
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 80, -90, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-1/4 -right-1/10 w-[50vw] h-[50vw] rounded-full bg-emerald/3 filter blur-[140px]"
      />

      {/* Glow Blob 3: Gold Light */}
      <motion.div
        animate={{
          x: [0, 60, -60, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
        className="absolute top-2/3 left-1/3 w-[35vw] h-[35vw] rounded-full bg-accent/3 filter blur-[100px]"
      />

      {/* Awwwards Subtle Noise overlay */}
      <div className="absolute inset-0 w-full h-full opacity-1 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
    </div>
  );
}
