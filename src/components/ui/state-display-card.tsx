"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

export function StateDisplayCard({
  image,
  title,
  description,
  action,
  className,
  imageClassName,
}: {
  image?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  imageClassName?: string;
}) {
  const imageSrc = React.useMemo(() => {
    if (!image) return null;

    if (typeof image === "object" && "src" in (image as any)) {
      return (image as any).src;
    }
    return image;
  }, [image]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("flex flex-row items-center bg-card rounded-[24px] p-5 w-full gap-6", "border border-divider dark:border-transparent", className)}
    >
      {imageSrc && (
        <div className={cn("shrink-0", imageClassName)}>
          <img src={imageSrc} alt={typeof title === "string" ? title : "State Illustration"} className="w-16 h-16 object-contain" />
        </div>
      )}

      <div className="flex flex-col flex-1 items-start text-left min-w-0">
        <h3 className="text-[18px] font-semibold text-foreground leading-tight">{title}</h3>
        {description && <p className="text-mutated-text text-base mt-1">{description}</p>}
      </div>

      {action && <div className="shrink-0 ml-4">{action}</div>}
    </motion.div>
  );
}
