import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
      >
        <Button
          size="lg"
          className="text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-shadow duration-300"
          onClick={() => alert("Welcome to Zup Protocol!")}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Join the Future
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-sm text-muted-foreground"
      >
        (This is a Premium React Component with Spring Physics)
      </motion.p>
    </div>
  );
};
