import { motion } from "framer-motion";
import { ScaleClickAnimation } from "./ui/animations/scale-click-animation";

export const BrandLogo = () => {
  return (
    <ScaleClickAnimation asChild scale={0.97}>
      <a
        href="/"
        data-astro-reload
        className="flex items-center cursor-pointer hover:opacity-40 transition-opacity"
      >
        <motion.div className="flex items-center justify-center translate-y-[1.5px]">
          {/* Full Logo - Desktop */}
          <img
            src="/logos/zup-logo.svg"
            alt="Zup Protocol"
            className="hidden sm:block dark:sm:hidden w-20 h-auto"
          />
          <img
            src="/logos/zup-logo-dark-mode.svg"
            alt="Zup Protocol"
            className="hidden dark:sm:block w-20 h-auto"
          />

          {/* Logomark - Mobile */}
          <img
            src="/logos/zup-logormark.svg"
            alt="Zup Protocol"
            className="sm:hidden w-8 h-auto"
          />
        </motion.div>
      </a>
    </ScaleClickAnimation>
  );
};
