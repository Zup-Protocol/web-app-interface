import { z } from "zod";
import { ThemeMode } from "../../lib/theme-mode";

export const themeModeSchema = z.nativeEnum(ThemeMode);
