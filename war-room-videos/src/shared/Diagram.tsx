// Diagramas de arquitectura: tarjetas de servicio, flujos con paquetes y zonas.
// Coordenadas absolutas en el lienzo 1920×1080 (x, y = centro de la tarjeta).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, Brand, brandColor, brandGlow, theme } from "../theme";
import { fonts } from "./fonts";
import { Icon, IconKind } from "./Icons";
import { CLAMP, enterStyle, useBreathe, useSpringAt } from "./motion";

export type NodeTone = "hero" | "brand" | "neutral" | "danger" | "ok" | "warn" | "muted";

export const toneColor = (tone: NodeTone, brand: Brand): string => {
  switch (tone) {
    case "hero":
    case "brand":
      return brandColor(brand);
    case "danger":
      return theme.colors.danger;
    case "ok":
      return theme.colors.ok;
    case "warn":
      return theme.colors.warn;
    case "muted":
      return theme.colors.textMute;
    default:
      return theme.colors.textDim;
  }
};

/** Tarjeta de servicio / componente. Solo `tone="hero"` brilla (un protagonista por escena). */
export const ServiceNode: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  icon?: IconKind;
  brand: Brand;
  tone?: NodeTone;
  at?: number;
  seed?: number;
  /** segundos en que la tarjeta pasa a otro tono (p. ej. de danger a ok) */
  switchAt?: number;
  switchTone?: NodeTone;
  dimAt?: number;
  badge?: string;
  titleSize?: number;
}> = ({ x, y, w = 340, h = 120, title, sub, icon, brand, tone = "brand", at = 0, seed = 0, switchAt, switchTone, dimAt, badge, titleSize = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.snappy);
  const b = useBreathe(seed, 2.5);
  const switched = switchAt !== undefined && frame >= switchAt * fps;
  const t = switched && switchTone ? switchTone : tone;
  const c = toneColor(t, brand);
  const flash = switchAt !== undefined ? interpolate(frame, [switchAt * fps, switchAt * fps + 12], [1, 0], { ...CLAMP, easing: theme.ease.out }) : 0;
  const dim = dimAt !== undefined ? interpolate(frame, [dimAt * fps, dimAt * fps + 12], [1, 0.32], { ...CLAMP, easing: theme.ease.out }) : 1;
  const isHero = t === "hero";
  const e = enterStyle(p, 34, 0.9);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        ...e,
        opacity: (e.opacity as number) * dim,
        transform: `${e.transform} translateY(${b.y}px)`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 18,
          background: `linear-gradient(160deg, ${theme.colors.panelHi}, ${theme.colors.panel})`,
          border: `2px solid ${alpha(c, isHero ? 1 : t === "neutral" || t === "muted" ? 0.35 : 0.7)}`,
          boxShadow: isHero
            ? `0 0 50px ${t === "hero" ? brandGlow(brand) : "transparent"}, 0 30px 60px -24px rgba(0,0,0,0.8)`
            : `0 30px 60px -24px rgba(0,0,0,0.8)${flash > 0 ? `, 0 0 ${60 * flash}px ${alpha(c, 0.6)}` : ""}`,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 22px",
          boxSizing: "border-box",
        }}
      >
        {icon ? (
          <div
            style={{
              flexShrink: 0,
              width: h * 0.56,
              height: h * 0.56,
              borderRadius: 14,
              background: alpha(c, 0.14),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon kind={icon} size={h * 0.36} color={c} />
          </div>
        ) : null}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: titleSize, lineHeight: 1.05, color: theme.colors.text }}>{title}</div>
          {sub ? (
            <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, marginTop: 6, letterSpacing: "0.06em", color: alpha(c, 0.95) }}>{sub}</div>
          ) : null}
        </div>
      </div>
      {badge ? (
        <div
          style={{
            position: "absolute",
            top: -16,
            right: 18,
            padding: "4px 12px",
            borderRadius: 7,
            background: theme.colors.bg,
            border: `2px solid ${alpha(c, 0.8)}`,
            color: c,
            fontFamily: fonts.mono,
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.1em",
          }}
        >
          {badge}
        </div>
      ) : null}
    </div>
  );
};

type Pt = [number, number];

const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

const controls = (a: Pt, b: Pt, bend: "h" | "v" | "none"): [Pt, Pt] => {
  if (bend === "h") {
    const mx = (a[0] + b[0]) / 2;
    return [
      [mx, a[1]],
      [mx, b[1]],
    ];
  }
  if (bend === "v") {
    const my = (a[1] + b[1]) / 2;
    return [
      [a[0], my],
      [b[0], my],
    ];
  }
  return [
    [a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3],
    [a[0] + ((b[0] - a[0]) * 2) / 3, a[1] + ((b[1] - a[1]) * 2) / 3],
  ];
};

/** Flujo de datos: línea que se dibuja + paquetes que viajan (flyline). */
export const Flow: React.FC<{
  from: Pt;
  to: Pt;
  at?: number;
  draw?: number; // segundos que tarda en dibujarse
  color: string;
  packets?: number;
  period?: number; // segundos por viaje de paquete
  bend?: "h" | "v" | "none";
  dashed?: boolean;
  width?: number;
  label?: string;
  stopAt?: number; // los paquetes dejan de fluir
  blocked?: boolean; // muestra un corte (X) a mitad del trayecto
}> = ({ from, to, at = 0, draw = 0.6, color, packets = 3, period = 1.6, bend = "h", dashed = false, width = 4, label, stopAt, blocked = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [c1, c2] = controls(from, to, bend);
  const d = `M ${from[0]} ${from[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${to[0]} ${to[1]}`;
  let len = 0;
  let prev = from;
  for (let i = 1; i <= 40; i++) {
    const p = bez(from, c1, c2, to, i / 40);
    len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    prev = p;
  }
  const prog = interpolate(frame, [at * fps, (at + draw) * fps], [0, 1], { ...CLAMP, easing: theme.ease.soft });
  if (prog <= 0) return null;
  const flowing = prog >= 1 && (stopAt === undefined || frame < stopAt * fps);
  const local = (frame - (at + draw) * fps) / (period * fps);
  const mid = bez(from, c1, c2, to, 0.5);
  const labelP = interpolate(frame, [(at + draw * 0.6) * fps, (at + draw * 0.6 + 0.4) * fps], [0, 1], { ...CLAMP, easing: theme.ease.out });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={theme.layout.width} height={theme.layout.height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={d} stroke={alpha(color, 0.18)} strokeWidth={width * 4} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - prog)} />
        <path
          d={d}
          stroke={color}
          strokeWidth={width}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dashed ? "10 12" : len}
          strokeDashoffset={dashed ? -frame * 0.8 : len * (1 - prog)}
          opacity={dashed ? prog : 1}
        />
        {flowing && !blocked
          ? Array.from({ length: packets }).map((_, i) => {
              const raw = (((local + i / packets) % 1) + 1) % 1;
              const tt = theme.ease.soft(raw);
              const [px, py] = bez(from, c1, c2, to, tt);
              const fade = Math.min(1, raw * 6, (1 - raw) * 6);
              return (
                <g key={i} opacity={fade}>
                  <circle cx={px} cy={py} r={width * 3.6} fill={alpha(color, 0.25)} />
                  <circle cx={px} cy={py} r={width * 1.4} fill={theme.colors.text} />
                </g>
              );
            })
          : null}
        {blocked && prog >= 1 ? (
          <g transform={`translate(${mid[0]}, ${mid[1]})`}>
            <circle r={26} fill={theme.colors.bg} stroke={theme.colors.danger} strokeWidth={4} />
            <path d="M -10 -10 L 10 10 M 10 -10 L -10 10" stroke={theme.colors.danger} strokeWidth={5} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: mid[0],
            top: mid[1] - 44,
            transform: `translateX(-50%) translateY(${(1 - labelP) * 10}px)`,
            opacity: labelP,
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: "0.08em",
            color: theme.colors.textDim,
            background: alpha(theme.colors.bg, 0.85),
            padding: "3px 10px",
            borderRadius: 6,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** Zona punteada (p. ej. zona de disponibilidad, grupo de autoescalado). */
export const Zone: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
  at?: number;
  dashed?: boolean;
}> = ({ x, y, w, h, label, color, at = 0, dashed = true }) => {
  const p = useSpringAt(at, theme.spring.smooth);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 26,
        border: `2px ${dashed ? "dashed" : "solid"} ${alpha(color, 0.55)}`,
        background: alpha(color, 0.04 + Math.sin(frame / 40) * 0.01),
        opacity: Math.min(1, p),
        transform: `scale(${interpolate(p, [0, 1], [0.96, 1])})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -15,
          left: 26,
          padding: "2px 12px",
          background: theme.colors.bg,
          fontFamily: fonts.mono,
          fontWeight: 800,
          fontSize: 17,
          letterSpacing: "0.12em",
          color: alpha(color, 0.95),
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** Etiqueta flotante de anotación (nota de producción visible: "según configuración", etc.). */
export const Note: React.FC<{ x: number; y: number; text: string; at?: number; color?: string; align?: "left" | "center" }> = ({
  x,
  y,
  text,
  at = 0,
  color = theme.colors.textDim,
  align = "center",
}) => {
  const p = useSpringAt(at, theme.spring.snappy);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translateX(${align === "center" ? "-50%" : "0"}) translateY(${(1 - p) * 14}px) scale(${0.95 + 0.05 * p})`,
        opacity: Math.min(1, p),
        fontFamily: fonts.mono,
        fontWeight: 700,
        fontSize: 19,
        letterSpacing: "0.06em",
        color,
        padding: "6px 14px",
        borderRadius: 8,
        border: `1.5px solid ${alpha(color, 0.45)}`,
        background: alpha(theme.colors.bg, 0.85),
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
