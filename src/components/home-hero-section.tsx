import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { useTranslation } from "@/hooks/use-translation";
import { AppTranslationsKeys } from "@/i18n/app-translations-keys";
import { AnimationProvider } from "@/providers/animation-provider";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export const HomeHeroSection = () => {
  const { translate } = useTranslation();

  return (
    <AnimationProvider>
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
          <PrimaryButton
            size="lg"
            className="text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-shadow duration-300"
            onClick={() => alert(translate(AppTranslationsKeys.HERO_WELCOME))}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {translate(AppTranslationsKeys.HERO_TITLE)}
            <ArrowRight className="ml-2 h-5 w-5" />
          </PrimaryButton>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-sm text-muted-foreground"
        >
          {translate(AppTranslationsKeys.HERO_SUBTITLE)}
        </motion.p>
      </div>
    </AnimationProvider>
  );
};
