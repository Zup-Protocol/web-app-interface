import { BlockchainAddress } from "@hydric/gateway";
import LZString from "lz-string";
import { z } from "zod";
import type { IBasketUrlParam, IMultiChainTokenUrlParam, ISingleChainTokenUrlParam } from "../interfaces/asset-url-param.interface";

const basketUrlParamSchema: z.ZodType<IBasketUrlParam> = z.object({
  type: z.literal("basket"),
  id: z.string(),
});

const singleChainTokenUrlParamSchema: z.ZodType<ISingleChainTokenUrlParam> = z.object({
  type: z.literal("single-chain-token"),
  chainId: z.number(),
  address: z.string(),
});

const multiChainTokenUrlParamSchema: z.ZodType<IMultiChainTokenUrlParam> = z.object({
  type: z.literal("multi-chain-token"),
  addresses: z.array(
    z.object({
      chainId: z.number(),
      address: z.string(),
    }),
  ) as z.ZodType<BlockchainAddress[]>,
});

export const assetUrlParamSchema = z.union([basketUrlParamSchema, singleChainTokenUrlParamSchema, multiChainTokenUrlParamSchema]);

export const assetUrlParamHashSchema = z.string().refine((value) => {
  if (!value) return true;
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(value);
    if (!decompressed) return false;
    const decoded = JSON.parse(decompressed);
    return assetUrlParamSchema.safeParse(decoded).success;
  } catch {
    return false;
  }
}, "Invalid compressed search data");
