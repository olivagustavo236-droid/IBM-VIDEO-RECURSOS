// theme.ts — fuente única de verdad del proyecto "Operación Código Rojo · RAG".
// NUNCA declares colores, curvas ni springs dentro de los componentes.
import { Easing } from "remotion";

export type Brand = "aws" | "azure" | "neutral";

export const theme = {
  colors: {
    bg: "#070B14", // base para proyector (alto contraste)
    bgAlt: "#0D1424",
    panel: "#111A2B",
    panelHi: "#18233A",
    line: "#2A3950",
    lineSoft: "rgba(160, 190, 225, 0.14)",
    text: "#EDF5FF",
    textDim: "#A9BBD0",
    textMute: "#6E8199",

    aws: "#FF9B34", // AWS · naranja táctico
    awsGlow: "rgba(255, 155, 52, 0.42)",
    azure: "#3BA9ED", // Azure · azul
    azureGlow: "rgba(59, 169, 237, 0.42)",
    neutral: "#B9E4D5", // acento narrativo (apertura / cierre)
    neutralGlow: "rgba(185, 228, 213, 0.35)",

    danger: "#E5484D", // problemas: rojo tenue
    dangerSoft: "rgba(229, 72, 77, 0.16)",
    dangerGlow: "rgba(229, 72, 77, 0.45)",
    ok: "#46B98A", // validado: verde moderado
    okSoft: "rgba(70, 185, 138, 0.16)",
    warn: "#E8B341",
    warnSoft: "rgba(232, 179, 65, 0.16)",
    black: "#000000",
  },
  fonts: {
    // cargadas en src/shared/fonts.ts con @remotion/google-fonts
    display: "Inter Tight",
    body: "Inter",
    mono: "JetBrains Mono",
  },
  weight: { display: 800, strong: 700, body: 600 },
  // Curvas. Lineal está prohibido.
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1), // easeOutExpo — entradas
    inOut: Easing.bezier(0.83, 0, 0.17, 1), // easeInOutQuint — cámara / desplazamientos
    in: Easing.bezier(0.7, 0, 0.84, 0), // solo salidas
    soft: Easing.bezier(0.4, 0, 0.2, 1), // dibujo de líneas / flujos
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 }, // UI, palabras
    smooth: { damping: 20, stiffness: 90, mass: 1 }, // bloques grandes
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 }, // sellos, acentos
    counter: { damping: 30, stiffness: 60, mass: 1 },
  },
  layout: {
    width: 1920,
    height: 1080,
    gutter: 96, // margen seguro lateral
    headerY: 64,
    stageTop: 250,
    stageBottom: 820,
    subtitleY: 860,
  },
  type: {
    headline: 58, // leyenda "PANTALLA"
    subtitle: 46, // locución en pantalla
    label: 26,
    small: 22,
    hud: 18,
  },
} as const;

export const brandColor = (b: Brand): string =>
  b === "aws" ? theme.colors.aws : b === "azure" ? theme.colors.azure : theme.colors.neutral;

export const brandGlow = (b: Brand): string =>
  b === "aws" ? theme.colors.awsGlow : b === "azure" ? theme.colors.azureGlow : theme.colors.neutralGlow;

export const brandName = (b: Brand): string => (b === "aws" ? "AWS" : b === "azure" ? "AZURE" : "GLOBAL COMMERCE");

/** Mezcla hex + alfa (0–1) → rgba. Útil para tintes del color protagonista. */
export const alpha = (hex: string, a: number): string => {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
