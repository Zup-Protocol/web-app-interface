import { motion } from "framer-motion";

export const BrandLogo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.1,
      }}
      className="mb-4"
    >
      <img
        src="/images/zup-logo.svg"
        alt="Zup Protocol"
        className="w-32 h-auto"
      />
    </motion.div>
  );
};
