// Texto en pantalla para proyector: leyenda "PANTALLA" (titular HUD) y locución como subtítulo grande.
import React from "react";
import { alpha, Brand, brandColor, theme } from "../theme";
import { fonts } from "./fonts";
import { Icon } from "./Icons";
import { STAGGER, useClock, useSpringAt, WordReveal } from "./motion";

export type HeadlineTone = "normal" | "alert" | "next" | "ok";

/** Detecta el tono a partir de la propia leyenda de la biblia. */
export const toneFromOnscreen = (onscreen: string): HeadlineTone =>
  onscreen.startsWith("ALERTA") ? "alert" : onscreen.startsWith("SIGUIENTE RETO") ? "next" : "normal";

/** Marcador de toma (HUD) + leyenda PANTALLA. */
export const OnScreenTitle: React.FC<{
  text: string;
  brand: Brand;
  marker: string;
  tone?: HeadlineTone;
  at?: number;
}> = ({ text, brand, marker, tone = "normal", at = 0.12 }) => {
  const { frame } = useClock();
  const p = useSpringAt(at, theme.spring.snappy);
  const isAlert = tone === "alert";
  const accent = isAlert ? theme.colors.danger : tone === "ok" ? theme.colors.ok : brandColor(brand);
  const hasChip = (isAlert || tone === "next") && text.includes(":");
  const [chip, rest] = hasChip ? [text.split(":")[0], text.slice(text.indexOf(":") + 1).trim()] : [null, text];
  const pulse = isAlert ? 0.65 + Math.sin(frame / 5) * 0.35 : 1;
  // una sola línea siempre: el tamaño se ajusta al ancho disponible (≈0.62 em por carácter en mayúsculas)
  const avail = 1680 - (chip ? chip.length * 30 + 110 : 0);
  const fontSize = Math.max(40, Math.min(theme.type.headline, avail / (rest.length * 0.62)));
  return (
    <div style={{ position: "absolute", left: theme.layout.gutter, right: theme.layout.gutter, top: 104 }}>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: theme.type.hud,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: theme.colors.textDim,
          opacity: Math.min(1, p),
          transform: `translateX(${(1 - p) * -24}px)`,
          marginBottom: 12,
        }}
      >
        {marker}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div
          style={{
            width: 8,
            height: 60,
            borderRadius: 4,
            background: accent,
            opacity: pulse * Math.min(1, p),
            transform: `scaleY(${p})`,
            boxShadow: isAlert ? `0 0 26px ${theme.colors.dangerGlow}` : "none",
          }}
        />
        {chip ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 18px",
              borderRadius: 10,
              background: isAlert ? theme.colors.danger : "transparent",
              border: isAlert ? "none" : `3px solid ${accent}`,
              color: isAlert ? theme.colors.text : accent,
              fontFamily: fonts.display,
              fontWeight: 900,
              fontSize: 34,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              opacity: Math.min(1, p),
              transform: `scale(${0.8 + 0.2 * p})`,
              boxShadow: isAlert ? `0 0 ${30 * pulse}px ${theme.colors.dangerGlow}` : "none",
            }}
          >
            <Icon kind={isAlert ? "warn" : "chat"} size={34} color={isAlert ? theme.colors.text : accent} stroke={4} />
            {chip}
          </div>
        ) : null}
        <WordReveal
          text={rest}
          at={at + 0.08}
          per={STAGGER.word * 0.8}
          gap={16}
          style={{
            fontFamily: fonts.display,
            fontWeight: theme.weight.display,
            fontSize,
            lineHeight: 1.05,
            whiteSpace: "nowrap",
            flexWrap: "nowrap",
            letterSpacing: "-0.01em",
            color: theme.colors.text,
            textTransform: "uppercase",
          }}
        />
      </div>
    </div>
  );
};

/** Locución en pantalla: subtítulo grande, alto contraste, máximo 2 líneas. */
export const Subtitle: React.FC<{ text: string; brand: Brand; at?: number }> = ({ text, brand, at = 0.35 }) => {
  const p = useSpringAt(at, theme.spring.smooth);
  const clean = text.replace(/[“”"«»]/g, "").trim();
  const words = clean.split(/\s+/).length;
  const per = Math.min(0.07, 1.4 / Math.max(1, words));
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: theme.layout.subtitleY,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(1, p),
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1640,
          padding: "20px 40px 22px",
          borderRadius: 18,
          background: "rgba(5, 8, 15, 0.82)",
          border: `1px solid ${alpha(theme.colors.text, 0.1)}`,
          borderBottom: `3px solid ${alpha(brandColor(brand), 0.55)}`,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7)",
        }}
      >
        <WordReveal
          text={clean}
          at={at + 0.1}
          per={per}
          gap={13}
          justify="center"
          style={{
            fontFamily: fonts.body,
            fontWeight: theme.weight.strong,
            fontSize: theme.type.subtitle,
            lineHeight: 1.22,
            color: theme.colors.text,
            textAlign: "center",
          }}
        />
      </div>
    </div>
  );
};
