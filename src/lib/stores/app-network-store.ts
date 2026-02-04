import { AppNetworks } from "@/lib/app-networks";
import { atom } from "nanostores";

export const currentAppNetworkStore = atom<AppNetworks>(
  AppNetworks.ALL_NETWORKS,
);

export const setAppNetwork = (network: AppNetworks) => {
  currentAppNetworkStore.set(network);
};
