"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

interface StateDisplayProps {
  image?: string | { src: string };
  title: React.ReactNode;
  description?: React.ReactNode;
  button?: React.ReactNode;
  className?: string;
  imageClassName?: string;
}

export function StateDisplay({
  image,
  title,
  description,
  button,
  className,
  imageClassName,
}: StateDisplayProps) {
  const imageSrc = React.useMemo(() => {
    if (!image) return null;
    return typeof image === "string" ? image : image.src;
  }, [image]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center w-full px-4",
        className,
      )}
    >
      {imageSrc && (
        <div className={cn("relative mb-6", imageClassName)}>
          <img
            src={imageSrc}
            alt={typeof title === "string" ? title : "State Illustration"}
            className="w-32 h-32 object-contain"
          />
        </div>
      )}
      <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">
        {title}
      </h3>
      {description && (
        <p className="text-[#9CA3AF] text-base max-w-[280px]">{description}</p>
      )}
      {button && <div className="mt-6">{button}</div>}
    </motion.div>
  );
}
