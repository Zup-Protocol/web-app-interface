import { AppNetworks, AppNetworksUtils } from "@/lib/app-networks";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";
import { Check } from "lucide-react";
import { useRef } from "react";

interface NetworkCardProps {
  network: AppNetworks;
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function NetworkCard({
  network,
  name,
  isSelected,
  onClick,
}: NetworkCardProps) {
  const Icon = AppNetworksUtils.logoOnBrandColor[network];
  const brandColor = AppNetworksUtils.brandColor[network];
  const textColor = AppNetworksUtils.textColorOnBrandColor[network];
  const controls = useAnimation();
  const isRotating = useRef(false);

  const handleHoverStart = async () => {
    if (isRotating.current) return;
    isRotating.current = true;
    await controls.start({
      rotate: 360,
      transition: { duration: 1.2, ease: "easeInOut" },
    });
    controls.set({ rotate: 0 });
    isRotating.current = false;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      onMouseEnter={handleHoverStart}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0, ease: "easeInOut" }}
      onClick={onClick}
      style={{ backgroundColor: brandColor, color: textColor }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 p-8 rounded-[26px] transition-all duration-300 w-full sm:w-full min-h-[250px] cursor-pointer",
        network === AppNetworks.ALL_NETWORKS && "border border-black/5",
      )}
    >
      <motion.div
        animate={controls}
        initial={{ rotate: 0 }}
        className="w-28 h-28 flex items-center justify-center mb-1"
      >
        {Icon ? (
          <div className="w-full h-full">
            <img
              src={typeof Icon === "string" ? Icon : Icon.src}
              alt={name}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-full bg-muted rounded-full" />
        )}
      </motion.div>
      <span className="text-base font-bold tracking-tight">{name}</span>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className={cn(
            "absolute top-5 right-5 w-7 h-7 rounded-full flex items-center justify-center shadow-lg",
            textColor === "#000000"
              ? "bg-primary text-white"
              : "bg-white text-black",
          )}
        >
          <Check size={16} strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}
