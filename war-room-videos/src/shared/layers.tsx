// Rendimiento: sin filter:blur en capas grandes (se recalcula por frame); los gradientes ya son suaves.
// Pila de 5 capas: BgMesh (1) → assets (2) → gráficos/tipografía (3) → Grade (4) → Grain + Vignette (5).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, Brand, brandColor, theme } from "../theme";
import { CLAMP } from "./motion";

/** Capa 1 — malla de fondo con dos manchas de luz en deriva (nunca un fondo plano). */
export const BgMesh: React.FC<{ brand: Brand }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const hero = brandColor(brand);
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: theme.colors.bg }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          top: -560,
          left: -360 + d1,
          background: `radial-gradient(circle, ${alpha(hero, 0.2)}, ${alpha(hero, 0.08)} 35%, transparent 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          bottom: -520,
          right: -260 - d2,
          background: `radial-gradient(circle, ${alpha("#2E5B8F", 0.26)}, ${alpha("#2E5B8F", 0.1)} 35%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Retícula HUD tenue con deriva lenta (pertenece a la capa de fondo). */
export const HudGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const off = (frame * 0.35) % 64;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${theme.colors.lineSoft} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.lineSoft} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        backgroundPosition: `${off}px ${off}px`,
        opacity: 0.35,
        maskImage: "radial-gradient(ellipse at 50% 45%, black 30%, transparent 78%)",
        WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 30%, transparent 78%)",
      }}
    />
  );
};

/** Lavado de tono por toma: rojo para crisis, verde moderado para estado validado. */
export const ToneWash: React.FC<{ tone: "danger" | "ok" | "warn"; intensity?: number }> = ({ tone, intensity = 1 }) => {
  const frame = useCurrentFrame();
  const c = tone === "danger" ? theme.colors.danger : tone === "ok" ? theme.colors.ok : theme.colors.warn;
  const pulse = tone === "danger" ? 0.75 + Math.sin(frame / 7) * 0.25 : 1;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: intensity * pulse,
        background: `radial-gradient(ellipse at 50% 40%, ${alpha(c, 0.16)}, transparent 60%), radial-gradient(ellipse at 50% 110%, ${alpha(c, 0.14)}, transparent 55%)`,
      }}
    />
  );
};

/** Capa 4 — etalonaje unificador. */
export const Grade: React.FC<{ brand: Brand }> = ({ brand }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: brandColor(brand), mixBlendMode: "soft-light", opacity: 0.12 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.18), transparent 26%, transparent 74%, rgba(0,0,0,0.26))" }} />
  </AbsoluteFill>
);

/** Capa 5a — grano procedural (sin archivos). */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: noise,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />
  );
};

/** Capa 5b — viñeta (la más alta de la pila visual). */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.42) 100%)" }} />
);

/** Entrada desde negro breve y "remate": fundido a negro de `outSec` segundos al final. */
export const FadeInOut: React.FC<{ inSec?: number; outSec?: number }> = ({ inSec = 0.4, outSec = 1 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, inSec * fps], [1, 0], { ...CLAMP, easing: theme.ease.out });
  const fadeOut = interpolate(frame, [durationInFrames - outSec * fps, durationInFrames - 1], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  return <AbsoluteFill style={{ pointerEvents: "none", background: theme.colors.black, opacity: Math.max(fadeIn, fadeOut) }} />;
};
