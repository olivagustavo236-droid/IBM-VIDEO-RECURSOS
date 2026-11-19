// Stage — contenedor raíz de cada video: pila de 5 capas + HUD + cama musical + fundidos.
import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha, Brand, brandColor, theme } from "../theme";
import { fonts } from "./fonts";
import { BgMesh, FadeInOut, Grade, Grain, HudGrid, Vignette } from "./layers";
import { useClock, useSpringAt } from "./motion";
import { MusicBed } from "./sound";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Marca ficticia de Global Commerce (monograma geométrico, sin logos reales). */
export const GCMark: React.FC<{ size?: number; color?: string }> = ({ size = 34, color = theme.colors.text }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="3" y="3" width="42" height="42" rx="11" stroke={color} strokeWidth="3.5" />
    <path d="M31 17a10 10 0 100 14h-7v-6" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** HUD fijo: identidad del evento, video, ronda, aviso de simulación y timecode. */
const HudChrome: React.FC<{ brand: Brand; videoId: string; tag: string; disclaimer: string }> = ({ brand, videoId, tag, disclaimer }) => {
  const { frame, fps } = useClock();
  const p = useSpringAt(0.05, theme.spring.smooth);
  const hero = brandColor(brand);
  const secs = Math.floor(frame / fps);
  const blink = Math.floor(frame / (fps * 0.5)) % 2 === 0;
  const hud: React.CSSProperties = {
    fontFamily: fonts.mono,
    fontSize: theme.type.hud,
    fontWeight: 700,
    letterSpacing: "0.14em",
    color: theme.colors.textDim,
  };
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p) }}>
      <div style={{ position: "absolute", top: 40, left: theme.layout.gutter, display: "flex", alignItems: "center", gap: 14, ...hud }}>
        <GCMark size={30} />
        <span style={{ color: theme.colors.text }}>GLOBAL COMMERCE</span>
        <span>· OPERACIÓN CÓDIGO ROJO</span>
      </div>
      <div style={{ position: "absolute", top: 36, right: theme.layout.gutter, display: "flex", alignItems: "center", gap: 14, ...hud }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 14px",
            borderRadius: 8,
            border: `2px solid ${alpha(hero, 0.7)}`,
            color: hero,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 5, background: hero, opacity: blink ? 1 : 0.35 }} />
          {tag}
        </span>
        <span style={{ padding: "7px 14px", borderRadius: 8, border: `2px solid ${theme.colors.line}` }}>SIMULACIÓN</span>
      </div>
      <div style={{ position: "absolute", bottom: 26, left: theme.layout.gutter, display: "flex", gap: 18, ...hud, fontSize: 16 }}>
        <span style={{ color: theme.colors.text }}>{videoId}</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          T+{pad2(Math.floor(secs / 60))}:{pad2(secs % 60)}
        </span>
      </div>
      <div style={{ position: "absolute", bottom: 26, right: theme.layout.gutter, ...hud, fontSize: 16, color: theme.colors.textMute }}>{disclaimer}</div>
      {/* esquinas HUD */}
      {[
        { top: 22, left: 22, r: 0 },
        { top: 22, right: 22, r: 90 },
        { bottom: 22, right: 22, r: 180 },
        { bottom: 22, left: 22, r: 270 },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...c,
            width: 26,
            height: 26,
            borderTop: `2px solid ${alpha(theme.colors.text, 0.35)}`,
            borderLeft: `2px solid ${alpha(theme.colors.text, 0.35)}`,
            transform: `rotate(${c.r}deg)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{
  brand: Brand;
  videoId: string;
  tag: string;
  bgm?: boolean;
  disclaimer?: string;
  children: React.ReactNode;
}> = ({ brand, videoId, tag, bgm = true, disclaimer = "RESULTADO FICTICIO / CONCEPTUAL · NO ES EVIDENCIA DE DESPLIEGUE REAL", children }) => (
  <AbsoluteFill style={{ background: theme.colors.bg, fontFamily: fonts.body, color: theme.colors.text, overflow: "hidden" }}>
    {/* 1 · fondo */}
    <BgMesh brand={brand} />
    <HudGrid />
    {/* 2–3 · assets + gráficos/tipografía */}
    {children}
    <HudChrome brand={brand} videoId={videoId} tag={tag} disclaimer={disclaimer} />
    {/* 4 · etalonaje */}
    <Grade brand={brand} />
    {/* 5 · grano + viñeta */}
    <Grain />
    <Vignette />
    <FadeInOut />
    <MusicBed enabled={bgm} />
  </AbsoluteFill>
);
