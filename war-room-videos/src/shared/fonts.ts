// Tipografías cargadas con @remotion/google-fonts (bloquean el render hasta estar listas).
// Los nombres de familia coinciden con theme.fonts.
import { loadFont as loadDisplay } from "@remotion/google-fonts/InterTight";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const display = loadDisplay("normal", { weights: ["700", "800", "900"], subsets: ["latin", "latin-ext"] });
const body = loadBody("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin", "latin-ext"] });
const mono = loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const fonts = {
  display: display.fontFamily,
  body: body.fontFamily,
  mono: mono.fontFamily,
} as const;
