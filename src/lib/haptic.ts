export const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof window !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Silently fail if vibration is not supported or blocked
    }
  }
};
