// Visualización didáctica de embeddings: nube de puntos que se agrupa por significado.
import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { fonts } from "./fonts";
import { CLAMP, enterStyle, useSpringAt } from "./motion";

export const VectorField: React.FC<{ x: number; y: number; w: number; h: number; at: number; clusterAt: number; color: string; queryAt?: number }> = ({
  x,
  y,
  w,
  h,
  at,
  clusterAt,
  color,
  queryAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.smooth);
  const k = interpolate(frame, [clusterAt * fps, (clusterAt + 1.6) * fps], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  const q = queryAt !== undefined ? interpolate(frame, [queryAt * fps, (queryAt + 0.8) * fps], [0, 1], { ...CLAMP, easing: theme.ease.out }) : 0;
  const centers = [
    { cx: w * 0.28, cy: h * 0.35, label: "PAGOS / CARGOS" },
    { cx: w * 0.7, cy: h * 0.3, label: "DEVOLUCIONES" },
    { cx: w * 0.5, cy: h * 0.75, label: "ENVÍOS" },
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...enterStyle(p, 30, 0.95) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: alpha(theme.colors.bg, 0.8), border: `2px solid ${alpha(color, 0.35)}` }} />
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 54 }).map((_, i) => {
          const c = centers[i % 3];
          const rx = random(`vx${i}`) * w;
          const ry = random(`vy${i}`) * h;
          const ang = random(`va${i}`) * Math.PI * 2;
          const rad = 18 + random(`vr${i}`) * 52;
          const tx = c.cx + Math.cos(ang) * rad;
          const ty = c.cy + Math.sin(ang) * rad * 0.7;
          const px = rx + (tx - rx) * k + Math.sin(frame / 20 + i) * 2;
          const py = ry + (ty - ry) * k + Math.cos(frame / 24 + i) * 2;
          const isHit = i % 3 === 0;
          return <circle key={i} cx={px} cy={py} r={isHit && q > 0 ? 7 : 5} fill={isHit && q > 0 ? color : alpha(theme.colors.text, 0.55)} />;
        })}
        {queryAt !== undefined && q > 0 ? (
          <g opacity={q}>
            <circle cx={centers[0].cx + 10} cy={centers[0].cy} r={14} fill={theme.colors.text} />
            <circle cx={centers[0].cx + 10} cy={centers[0].cy} r={30 + q * 60} fill="none" stroke={alpha(color, 0.8 * (1 - q * 0.6))} strokeWidth={3} />
          </g>
        ) : null}
      </svg>
      {centers.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.cx,
            top: c.cy + 72,
            transform: "translateX(-50%)",
            opacity: k,
            fontFamily: fonts.mono,
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "0.1em",
            color: theme.colors.textDim,
            whiteSpace: "nowrap",
          }}
        >
          {c.label}
        </div>
      ))}
    </div>
  );
};
