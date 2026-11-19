// Documentos sintéticos de Global Commerce (PDF / manuales / contratos) y fragmentos indexados.
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { fonts } from "./fonts";
import { Icon } from "./Icons";
import { CLAMP, enterStyle, useBreathe, useSpringAt } from "./motion";

export type DocStatus = "vigente" | "vencido" | "conflicto" | "restringido" | "publico" | "pendiente" | "demo" | "none";

const STATUS: Record<DocStatus, { label: string; color: string }> = {
  vigente: { label: "VIGENTE", color: theme.colors.ok },
  vencido: { label: "VENCIDO", color: theme.colors.danger },
  conflicto: { label: "EN CONFLICTO", color: theme.colors.warn },
  restringido: { label: "RESTRINGIDO", color: theme.colors.danger },
  publico: { label: "PÚBLICO", color: theme.colors.ok },
  pendiente: { label: "PENDIENTE", color: theme.colors.warn },
  demo: { label: "DEMO", color: theme.colors.textDim },
  none: { label: "", color: theme.colors.textDim },
};

export const StatusPill: React.FC<{ status: DocStatus; at?: number; size?: number; label?: string }> = ({ status, at = 0, size = 16, label }) => {
  const p = useSpringAt(at, theme.spring.bouncy);
  const s = STATUS[status];
  if (status === "none") return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: `${size * 0.3}px ${size * 0.7}px`,
        borderRadius: 7,
        background: alpha(s.color, 0.16),
        border: `2px solid ${alpha(s.color, 0.85)}`,
        color: s.color,
        fontFamily: fonts.mono,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.1em",
        opacity: Math.min(1, p),
        transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`,
        whiteSpace: "nowrap",
      }}
    >
      {status === "restringido" ? <Icon kind="lock" size={size * 1.1} color={s.color} stroke={4} /> : null}
      {label ?? s.label}
    </span>
  );
};

/** Tarjeta de documento sintético. `x, y` = esquina superior izquierda. */
export const DocCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  title: string;
  kind?: "PDF" | "DOCX" | "MANUAL" | "CONTRATO" | "CORREO";
  meta?: string;
  status?: DocStatus;
  statusAt?: number;
  lines?: string[];
  fillerLines?: number;
  highlight?: number; // índice de línea resaltada
  highlightColor?: string;
  highlightAt?: number;
  at?: number;
  seed?: number;
  glow?: string;
  dimAt?: number;
  exitAt?: number;
  exitDx?: number;
}> = ({
  x,
  y,
  w = 380,
  h = 470,
  rotate = 0,
  title,
  kind = "PDF",
  meta,
  status = "none",
  statusAt,
  lines = [],
  fillerLines = 5,
  highlight,
  highlightColor = theme.colors.warn,
  highlightAt = 0,
  at = 0,
  seed = 0,
  glow,
  dimAt,
  exitAt,
  exitDx = 900,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.smooth);
  const b = useBreathe(seed, 3, 34);
  const hl = interpolate(frame, [highlightAt * fps, highlightAt * fps + 10], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const dim = dimAt !== undefined ? interpolate(frame, [dimAt * fps, dimAt * fps + 12], [1, 0.3], { ...CLAMP, easing: theme.ease.out }) : 1;
  const ex = exitAt !== undefined ? interpolate(frame, [exitAt * fps, exitAt * fps + 14], [0, 1], { ...CLAMP, easing: theme.ease.in }) : 0;
  const e = enterStyle(p, 60, 0.9);
  const kindColor = kind === "CONTRATO" ? theme.colors.danger : kind === "DOCX" ? "#7DA7E8" : kind === "CORREO" ? theme.colors.neutral : "#E58A6E";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: (e.opacity as number) * dim * (1 - ex),
        transform: `${e.transform} translate(${ex * exitDx}px, ${b.y}px) rotate(${rotate + Math.sin((frame + seed * 13) / 50) * 0.6}deg)`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          background: "linear-gradient(170deg, #F4F1EA, #E3DED3)",
          color: "#1B2230",
          boxShadow: `0 40px 80px -24px rgba(0,0,0,0.85)${glow ? `, 0 0 60px ${glow}` : ""}`,
          padding: 26,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: fonts.mono,
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: "0.1em",
              color: "#fff",
              background: kindColor,
              padding: "4px 10px",
              borderRadius: 6,
            }}
          >
            {kind}
          </span>
          <StatusPill status={status} at={statusAt ?? at + 0.3} size={15} />
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: w < 300 ? 19 : 26, lineHeight: 1.1, overflowWrap: "anywhere" }}>{title}</div>
        {meta ? <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 16, color: "#4A5568" }}>{meta}</div> : null}
        <div style={{ height: 2, background: "#CFC8BA", margin: "4px 0" }} />
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 20,
              lineHeight: 1.3,
              padding: "4px 8px",
              margin: "0 -8px",
              borderRadius: 6,
              background: highlight === i ? alpha(highlightColor, 0.35 * hl) : "transparent",
              boxShadow: highlight === i ? `inset 4px 0 0 ${alpha(highlightColor, hl)}` : "none",
            }}
          >
            {l}
          </div>
        ))}
        {Array.from({ length: fillerLines }).map((_, i) => (
          <div key={`f${i}`} style={{ height: 10, borderRadius: 5, background: "#CFC8BA", width: `${92 - ((i * 17 + seed * 7) % 34)}%` }} />
        ))}
      </div>
    </div>
  );
};

/** Fragmento (chunk) indexado con metadatos. `x, y` = esquina superior izquierda. */
export const ChunkCard: React.FC<{
  x: number;
  y: number;
  w?: number;
  source: string;
  text: string;
  tags?: { k: string; v: string; tone?: "ok" | "warn" | "danger" | "neutral" }[];
  accent: string;
  at?: number;
  score?: string;
  dimAt?: number;
  lockAt?: number;
  glow?: boolean;
  lockLabel?: string;
}> = ({ x, y, w = 520, source, text, tags = [], accent, at = 0, score, dimAt, lockAt, glow = false, lockLabel = "EXCLUIDO POR ACL" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.snappy);
  const dim = dimAt !== undefined ? interpolate(frame, [dimAt * fps, dimAt * fps + 12], [1, 0.28], { ...CLAMP, easing: theme.ease.out }) : 1;
  const lock = lockAt !== undefined ? interpolate(frame, [lockAt * fps, lockAt * fps + 10], [0, 1], { ...CLAMP, easing: theme.ease.out }) : 0;
  const e = enterStyle(p, 30, 0.94, "x");
  const tagColor = (t?: string) => (t === "ok" ? theme.colors.ok : t === "warn" ? theme.colors.warn : t === "danger" ? theme.colors.danger : theme.colors.textDim);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        ...e,
        opacity: (e.opacity as number) * dim,
      }}
    >
      <div
        style={{
          borderRadius: 14,
          padding: "16px 20px",
          background: theme.colors.panel,
          border: `2px solid ${alpha(lock > 0 ? theme.colors.danger : accent, glow ? 1 : 0.5)}`,
          boxShadow: glow ? `0 0 44px ${alpha(accent, 0.45)}` : "0 24px 50px -20px rgba(0,0,0,0.8)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.08em", color: accent }}>{source}</span>
          {score ? <span style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 16, color: theme.colors.textDim, fontVariantNumeric: "tabular-nums" }}>{score}</span> : null}
        </div>
        <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 21, lineHeight: 1.3, color: theme.colors.text, filter: lock > 0 ? `blur(${lock * 6}px)` : undefined }}>
          {text}
        </div>
        {tags.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {tags.map((t, i) => (
              <span
                key={i}
                style={{
                  fontFamily: fonts.mono,
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "3px 9px",
                  borderRadius: 6,
                  border: `1.5px solid ${alpha(tagColor(t.tone), 0.6)}`,
                  color: tagColor(t.tone),
                }}
              >
                {t.k}: {t.v}
              </span>
            ))}
          </div>
        ) : null}
        {lock > 0 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: alpha(theme.colors.bg, 0.55 * lock),
              opacity: lock,
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: "0.08em",
              color: theme.colors.danger,
            }}
          >
            <Icon kind="lock" size={36} color={theme.colors.danger} stroke={4} />
            {lockLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
};
