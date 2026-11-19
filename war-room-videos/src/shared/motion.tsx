// Primitivas de movimiento. Todos los tiempos de la API pública están en SEGUNDOS
// y se convierten a frames con el fps real de la composición (regla 8).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

type SpringCfg = { damping: number; stiffness: number; mass: number };

export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Escalonados estándar (segundos): palabras ~3f, ítems ~5f, bloques ~6f a 30 fps. */
export const STAGGER = { word: 0.09, item: 0.16, block: 0.2 } as const;

/** Reloj local: frame actual, fps y conversor segundos → frames. */
export const useClock = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);
  return { frame, fps, s, t: frame / fps };
};

/** Progreso de spring 0→1 que arranca en `at` segundos. */
export const useSpringAt = (at = 0, config: SpringCfg = theme.spring.smooth) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(at * fps), fps, config });
};

/** Progreso con curva bezier entre dos instantes (segundos), siempre con clamp. */
export const useEaseBetween = (start: number, end: number, easing = theme.ease.out) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [start * fps, Math.max(start * fps + 1, end * fps)], [0, 1], { ...CLAMP, easing });
};

/** Estilo de entrada premium: opacidad + subida + escala (3 propiedades). */
export const enterStyle = (p: number, dist = 40, fromScale = 0.94, axis: "y" | "x" = "y"): React.CSSProperties => {
  const d = interpolate(p, [0, 1], [dist, 0]);
  return {
    opacity: Math.min(1, Math.max(0, p)),
    transform: `${axis === "y" ? `translateY(${d}px)` : `translateX(${d}px)`} scale(${interpolate(p, [0, 1], [fromScale, 1])})`,
  };
};

export const Entrance: React.FC<{
  at?: number;
  dist?: number;
  fromScale?: number;
  axis?: "x" | "y";
  config?: SpringCfg;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at = 0, dist = 40, fromScale = 0.94, axis = "y", config = theme.spring.smooth, style, children }) => {
  const p = useSpringAt(at, config);
  const e = enterStyle(p, dist, fromScale, axis);
  return <div style={{ ...style, ...e, transform: `${style?.transform ?? ""} ${e.transform}` }}>{children}</div>;
};

/** Micro-movimiento senoidal para elementos que permanecen >2 s en pantalla (regla 7). */
export const useBreathe = (seed = 0, amp = 3, period = 30) => {
  const frame = useCurrentFrame();
  return {
    y: Math.sin((frame + seed * 17) / period) * amp,
    scale: 1 + Math.sin((frame + seed * 11) / (period * 0.75)) * 0.006,
  };
};

export const Breathe: React.FC<{ seed?: number; amp?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  seed = 0,
  amp = 3,
  children,
  style,
}) => {
  const b = useBreathe(seed, amp);
  return <div style={{ ...style, transform: `translateY(${b.y}px) scale(${b.scale})` }}>{children}</div>;
};

/** Revelado palabra por palabra con spring escalonado. */
export const WordReveal: React.FC<{
  text: string;
  at?: number;
  per?: number;
  style?: React.CSSProperties;
  wordStyle?: (word: string, i: number) => React.CSSProperties | undefined;
  gap?: number;
  justify?: React.CSSProperties["justifyContent"];
}> = ({ text, at = 0, per = STAGGER.word, style, wordStyle, gap = 14, justify = "flex-start" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: gap, rowGap: 4, justifyContent: justify, ...style }}>
      {words.map((w, i) => {
        const p = spring({ frame: frame - Math.round((at + i * per) * fps), fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(1, p),
              transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
              ...wordStyle?.(w, i),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Contador animado con tabular-nums (sin saltos de maquetación). */
export const Counter: React.FC<{
  from?: number;
  to: number;
  at?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ from = 0, to, at = 0, decimals = 0, prefix = "", suffix = "", style }) => {
  const p = useSpringAt(at, theme.spring.counter);
  const v = interpolate(p, [0, 1], [from, to]);
  const txt = v.toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {txt}
      {suffix}
    </span>
  );
};

/** Typewriter determinista (caracteres por segundo) con caret parpadeante. */
export const Typewriter: React.FC<{ text: string; at?: number; cps?: number; style?: React.CSSProperties; caretColor?: string }> = ({
  text,
  at = 0,
  cps = 26,
  style,
  caretColor = theme.colors.text,
}) => {
  const { frame, fps } = useClock();
  const n = Math.max(0, Math.min(text.length, Math.floor(((frame - at * fps) / fps) * cps)));
  const done = n >= text.length;
  const caretOn = !done || Math.floor(frame / (fps * 0.5)) % 2 === 0;
  if (frame < at * fps) return null;
  return (
    <span style={style}>
      {text.slice(0, n)}
      <span style={{ display: "inline-block", width: 4, height: "1em", marginLeft: 4, verticalAlign: "-0.12em", background: caretColor, opacity: caretOn ? 0.9 : 0 }} />
    </span>
  );
};

/** Desvanecimiento de salida rápido (≈ la mitad que la entrada), relativo a `end` segundos. */
export const useExit = (end: number, dur = 0.33) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [(end - dur) * fps, end * fps], [0, 1], { ...CLAMP, easing: theme.ease.in });
  return { opacity: 1 - p, y: -36 * p, scale: 1 - 0.03 * p, p };
};
