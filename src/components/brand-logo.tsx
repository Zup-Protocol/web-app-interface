import { motion } from "framer-motion";
import { ScaleClickAnimation } from "./ui/animations/scale-click-animation";

export const BrandLogo = () => {
  return (
    <ScaleClickAnimation asChild scale={0.97}>
      <a href="/" className="inline-block cursor-pointer">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="flex items-center justify-center"
        >
          <img
            src="/images/zup-logo.svg"
            alt="Zup Protocol"
            className="w-20 h-auto"
          />
        </motion.div>
      </a>
    </ScaleClickAnimation>
  );
};
