import {
  currentAppNetworkStore,
  setAppNetwork,
} from "@/lib/stores/app-network-store";
import { useStore } from "@nanostores/react";

export function useAppNetwork() {
  const network = useStore(currentAppNetworkStore);

  return {
    network,
    setAppNetwork: setAppNetwork,
  };
}
