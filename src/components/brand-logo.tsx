import { motion } from "framer-motion";
import { ScaleClickAnimation } from "./ui/animations/scale-click-animation";

export const BrandLogo = () => {
  return (
    <ScaleClickAnimation asChild scale={0.97}>
      <a
        href="/"
        className="flex items-center cursor-pointer hover:opacity-40 transition-opacity"
      >
        <motion.div className="flex items-center justify-center translate-y-[1.5px]">
          {/* Full Logo - Desktop */}
          <img
            src="/images/zup-logo.svg"
            alt="Zup Protocol"
            className="hidden sm:block dark:sm:hidden w-20 h-auto"
          />
          <img
            src="/images/zup-logo-dark-mode.svg"
            alt="Zup Protocol"
            className="hidden dark:sm:block w-20 h-auto"
          />

          {/* Logomark - Mobile */}
          <img
            src="/images/zup-logormark.svg"
            alt="Zup Protocol"
            className="sm:hidden w-8 h-auto"
          />
        </motion.div>
      </a>
    </ScaleClickAnimation>
  );
};
