// Error 503 con glitch corto + pulso rojo (sin datos reales).
import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { fonts } from "./fonts";
import { CLAMP, useSpringAt } from "./motion";

export const Error503: React.FC<{ at?: number; label?: string; compact?: boolean }> = ({ at = 0, label = "SERVICIO NO DISPONIBLE", compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - at * fps;
  const p = useSpringAt(at, theme.spring.bouncy);
  // glitch fuerte los primeros 0.4 s, luego réplicas esporádicas
  const burst = local < fps * 0.4 || random(`g${Math.floor(frame / 4)}`) > 0.9;
  const slices = burst ? 5 : 0;
  const pulse = 0.55 + Math.sin(frame / 6) * 0.45;
  const veil = interpolate(local, [0, fps * 0.25], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const size = compact ? 92 : 210;
  const text = (dx: number, color: string, mix: React.CSSProperties["mixBlendMode"]) => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateX(${dx}px)`,
        mixBlendMode: mix,
        color,
        fontFamily: fonts.display,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "-0.03em",
        lineHeight: 1,
      }}
    >
      503
    </div>
  );
  const rgb = burst ? (random(`r${frame}`) - 0.5) * 18 : 0;
  return (
    <AbsoluteFill style={{ background: alpha("#14070A", 0.86 * veil), zIndex: 2 }}>
      <AbsoluteFill style={{ boxShadow: `inset 0 0 ${compact ? 60 : 160}px ${alpha(theme.colors.danger, 0.45 * pulse)}` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: size * 1.1,
          transform: `translateY(-62%) scale(${interpolate(p, [0, 1], [1.25, 1])})`,
          opacity: Math.min(1, p * 1.4),
        }}
      >
        {text(-rgb, "#FF3B5C", "screen")}
        {text(rgb, "#38E1FF", "screen")}
        {text(0, theme.colors.text, "normal")}
        {Array.from({ length: slices }).map((_, i) => {
          const top = random(`st${frame}-${i}`) * 100;
          const hh = 4 + random(`sh${frame}-${i}`) * 14;
          const dx = (random(`sx${frame}-${i}`) - 0.5) * 80;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${top}%`,
                height: hh,
                transform: `translateX(${dx}px)`,
                background: alpha(theme.colors.danger, 0.55),
                mixBlendMode: "screen",
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `calc(50% + ${compact ? 34 : 86}px)`,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontWeight: 800,
          fontSize: compact ? 16 : 30,
          letterSpacing: "0.18em",
          color: theme.colors.danger,
          opacity: Math.min(1, p) * (0.7 + 0.3 * pulse),
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
