// Mapa abstracto de puntos (no es un mapa real) + visitantes que viajan hacia un origen.
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { CLAMP } from "./motion";

const BLOBS = [
  { cx: 420, cy: 430, rx: 260, ry: 170 },
  { cx: 560, cy: 700, rx: 120, ry: 150 },
  { cx: 980, cy: 400, rx: 170, ry: 120 },
  { cx: 1020, cy: 640, rx: 140, ry: 170 },
  { cx: 1400, cy: 430, rx: 330, ry: 160 },
  { cx: 1600, cy: 720, rx: 130, ry: 80 },
];

export const DotMap: React.FC<{ at?: number; opacity?: number; tint?: string }> = ({ at = 0, opacity = 0.5, tint = theme.colors.textDim }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dots = useMemo(() => {
    const out: { x: number; y: number; d: number }[] = [];
    for (let x = 120; x < 1820; x += 26) {
      for (let y = 280; y < 830; y += 26) {
        const inside = BLOBS.some((b) => ((x - b.cx) / b.rx) ** 2 + ((y - b.cy) / b.ry) ** 2 < 1 - random(`m${x}-${y}`) * 0.35);
        if (inside) out.push({ x, y, d: random(`d${x}-${y}`) });
      }
    }
    return out;
  }, []);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080}>
        {dots.map((p, i) => {
          const a = interpolate(frame, [(at + p.d * 0.8) * fps, (at + p.d * 0.8 + 0.4) * fps], [0, 1], { ...CLAMP, easing: theme.ease.out });
          return <circle key={i} cx={p.x} cy={p.y} r={3.2} fill={tint} opacity={a * opacity * (0.6 + 0.4 * Math.sin(frame / 25 + p.d * 6))} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Visitantes: puntos que salen de posiciones del mapa y convergen en `target` (pico de tráfico). */
export const Visitors: React.FC<{
  target: [number, number];
  at?: number;
  count?: number;
  color: string;
  /** destinos alternativos (bordes de CDN): una fracción del tráfico termina ahí */
  edges?: [number, number][];
  edgeShareAt?: number;
  period?: number;
}> = ({ target, at = 0, count = 70, color, edges = [], edgeShareAt, period = 1.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - at;
  if (t < 0) return null;
  const share = edgeShareAt !== undefined ? interpolate(t + at, [edgeShareAt, edgeShareAt + 1], [0, 0.75], { ...CLAMP, easing: theme.ease.inOut }) : 0;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080}>
        {Array.from({ length: count }).map((_, i) => {
          const b = BLOBS[i % BLOBS.length];
          const ang = random(`va${i}`) * Math.PI * 2;
          const rr = Math.sqrt(random(`vr${i}`));
          const sx = b.cx + Math.cos(ang) * b.rx * rr * 0.9;
          const sy = b.cy + Math.sin(ang) * b.ry * rr * 0.9;
          const ph = random(`vp${i}`);
          const cyc = (t / period + ph) % 1;
          const ramp = Math.min(1, t / 1.2); // el tráfico crece
          if (random(`vo${i}`) > ramp) return null;
          const toEdge = edges.length > 0 && random(`ve${i}`) < share;
          let tx = target[0];
          let ty = target[1];
          if (toEdge) {
            // borde más cercano
            let best = edges[0];
            let bd = Infinity;
            edges.forEach((e) => {
              const d = Math.hypot(e[0] - sx, e[1] - sy);
              if (d < bd) {
                bd = d;
                best = e;
              }
            });
            [tx, ty] = best;
          }
          const k = theme.ease.soft(cyc);
          const x = sx + (tx - sx) * k;
          const y = sy + (ty - sy) * k;
          const fade = Math.min(1, cyc * 5, (1 - cyc) * 5);
          return (
            <g key={i} opacity={fade}>
              <line x1={x} y1={y} x2={x - (tx - sx) * 0.05} y2={y - (ty - sy) * 0.05} stroke={alpha(toEdge ? theme.colors.ok : color, 0.5)} strokeWidth={3} strokeLinecap="round" />
              <circle cx={x} cy={y} r={4.5} fill={toEdge ? theme.colors.ok : color} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Medidor de carga del origen (sin cifras: solo nivel relativo ilustrativo). */
export const LoadMeter: React.FC<{ x: number; y: number; level: number; label: string; color: string }> = ({ x, y, level, label, color }) => {
  const frame = useCurrentFrame();
  const jitter = Math.sin(frame / 3) * 0.02;
  const lv = Math.max(0, Math.min(1, level + jitter));
  const c = lv > 0.75 ? theme.colors.danger : lv > 0.5 ? theme.colors.warn : color;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300 }}>
      <div style={{ fontFamily: "inherit", fontWeight: 800, fontSize: 17, letterSpacing: "0.12em", color: theme.colors.textDim, marginBottom: 8 }}>{label}</div>
      <div style={{ height: 22, borderRadius: 11, background: alpha(theme.colors.text, 0.08), overflow: "hidden" }}>
        <div style={{ width: `${lv * 100}%`, height: "100%", borderRadius: 11, background: c, boxShadow: `0 0 20px ${alpha(c, 0.6)}` }} />
      </div>
    </div>
  );
};
