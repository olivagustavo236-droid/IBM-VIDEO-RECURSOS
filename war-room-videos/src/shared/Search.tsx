// Barra de búsqueda, filas de resultados y líneas de registro (auditoría / telemetría).
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { fonts } from "./fonts";
import { Icon, IconKind } from "./Icons";
import { enterStyle, Typewriter, useSpringAt } from "./motion";

export const SearchBar: React.FC<{
  x: number;
  y: number;
  w: number;
  query: string;
  at: number;
  result?: string;
  resultAt?: number;
  resultTone?: "danger" | "ok" | "warn" | "neutral";
  accent?: string;
  mono?: boolean;
  fontSize?: number;
}> = ({ x, y, w, query, at, result, resultAt = at + 1.4, resultTone = "danger", accent = theme.colors.line, mono = true, fontSize = 26 }) => {
  const p = useSpringAt(at, theme.spring.snappy);
  const r = useSpringAt(resultAt, theme.spring.bouncy);
  const rc = resultTone === "danger" ? theme.colors.danger : resultTone === "ok" ? theme.colors.ok : resultTone === "warn" ? theme.colors.warn : theme.colors.textDim;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, ...enterStyle(p, 20, 0.97) }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          minHeight: 76,
          borderRadius: 16,
          padding: "12px 24px",
          boxSizing: "border-box",
          background: theme.colors.panel,
          border: `2px solid ${alpha(accent, 0.7)}`,
          fontFamily: mono ? fonts.mono : fonts.body,
          fontWeight: 700,
          fontSize,
          color: theme.colors.text,
        }}
      >
        <Icon kind="search" size={34} color={theme.colors.textDim} />
        <Typewriter text={query} at={at + 0.2} cps={34} />
      </div>
      {result ? (
        <div
          style={{
            marginTop: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 16px",
            borderRadius: 10,
            border: `2px solid ${rc}`,
            color: rc,
            fontFamily: fonts.mono,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "0.08em",
            opacity: Math.min(1, r),
            transform: `scale(${0.7 + 0.3 * Math.min(1, r)})`,
            transformOrigin: "left center",
          }}
        >
          <Icon kind={resultTone === "ok" ? "check" : resultTone === "danger" ? "x" : "warn"} size={24} color={rc} stroke={4.5} />
          {result}
        </div>
      ) : null}
    </div>
  );
};

export const ResultRow: React.FC<{
  title: string;
  meta: string;
  at: number;
  icon?: IconKind;
  tag?: string;
  accent: string;
  w?: number;
  highlight?: boolean;
}> = ({ title, meta, at, icon = "doc", tag = "DEMO", accent, w = 900, highlight = false }) => {
  const p = useSpringAt(at, theme.spring.snappy);
  return (
    <div
      style={{
        width: w,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "14px 20px",
        borderRadius: 14,
        boxSizing: "border-box",
        background: highlight ? alpha(accent, 0.1) : theme.colors.panel,
        border: `2px solid ${alpha(accent, highlight ? 0.9 : 0.3)}`,
        boxShadow: highlight ? `0 0 36px ${alpha(accent, 0.35)}` : "none",
        ...enterStyle(p, 24, 0.96, "x"),
      }}
    >
      <Icon kind={icon} size={34} color={highlight ? accent : theme.colors.textDim} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 27, color: theme.colors.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 16, color: theme.colors.textDim, letterSpacing: "0.06em", marginTop: 3 }}>{meta}</div>
      </div>
      <span style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 15, padding: "4px 10px", borderRadius: 6, border: `1.5px solid ${theme.colors.line}`, color: theme.colors.textDim }}>{tag}</span>
    </div>
  );
};

/** Líneas de registro que aparecen de una en una (CloudTrail / Monitor / auditoría ilustrativos). */
export const LogLines: React.FC<{ x: number; y: number; w: number; lines: string[]; at: number; every?: number; accent: string; title: string }> = ({
  x,
  y,
  w,
  lines,
  at,
  every = 0.45,
  accent,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.smooth);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        borderRadius: 16,
        padding: "16px 20px",
        boxSizing: "border-box",
        background: alpha(theme.colors.bg, 0.9),
        border: `2px solid ${alpha(accent, 0.35)}`,
        ...enterStyle(p, 30, 0.96),
      }}
    >
      <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.14em", color: accent, marginBottom: 10 }}>{title}</div>
      {lines.map((l, i) => {
        const t0 = (at + 0.4 + i * every) * fps;
        if (frame < t0) return null;
        const lp = Math.min(1, (frame - t0) / 8);
        return (
          <div
            key={i}
            style={{
              fontFamily: fonts.mono,
              fontWeight: 600,
              fontSize: 17,
              lineHeight: 1.6,
              color: theme.colors.textDim,
              opacity: lp,
              transform: `translateX(${(1 - theme.ease.out(lp)) * -16}px)`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};
