import { z } from "zod";
import { AppLanguages } from "../../lib/app-languages";

export const appLanguagesSchema = z.nativeEnum(AppLanguages);
