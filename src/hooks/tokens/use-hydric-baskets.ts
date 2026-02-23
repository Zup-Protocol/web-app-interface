import type { TokenBasket } from "@/core/types/token.types";
import { useHydric } from "@/providers/hydric-provider";
import { useQuery } from "@tanstack/react-query";

export function useHydricBaskets() {
  const hydric = useHydric();

  return useQuery({
    queryKey: ["hydric-baskets"],
    enabled: !!hydric,
    queryFn: async () => {
      if (!hydric) throw new Error("Hydric not initialized");
      const { baskets } = await hydric.tokenBaskets.list();
      return baskets.map(
        (basket) =>
          ({
            ...basket,
            type: "basket",
          }) as TokenBasket,
      );
    },
  });
}
