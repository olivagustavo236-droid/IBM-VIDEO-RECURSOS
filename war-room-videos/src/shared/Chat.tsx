// Interfaz de chat del prototipo de asistente (Global Commerce · uso interno, datos sintéticos).
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { fonts } from "./fonts";
import { Icon, IconKind } from "./Icons";
import { enterStyle, Typewriter, useSpringAt, WordReveal } from "./motion";

export type ChatMsg = {
  role: "user" | "assistant" | "system";
  text: string;
  at: number; // segundos relativos a la toma
  who?: string;
  cite?: string;
  citeTone?: "ok" | "danger" | "warn";
  tone?: "normal" | "danger" | "warn" | "ok";
  icon?: IconKind;
};

const Bubble: React.FC<{ m: ChatMsg; accent: string; fontSize: number }> = ({ m, accent, fontSize }) => {
  const p = useSpringAt(m.at, theme.spring.snappy);
  const citeP = useSpringAt(m.at + 0.9, theme.spring.snappy);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < m.at * fps) return null;
  const isUser = m.role === "user";
  const toneC =
    m.tone === "danger" ? theme.colors.danger : m.tone === "warn" ? theme.colors.warn : m.tone === "ok" ? theme.colors.ok : isUser ? theme.colors.textDim : accent;
  const citeC = m.citeTone === "danger" ? theme.colors.danger : m.citeTone === "warn" ? theme.colors.warn : theme.colors.ok;
  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", ...enterStyle(p, 24, 0.96) }}>
      <div
        style={{
          maxWidth: "86%",
          padding: "16px 22px",
          borderRadius: 18,
          borderTopRightRadius: isUser ? 4 : 18,
          borderTopLeftRadius: isUser ? 18 : 4,
          background: isUser ? theme.colors.panelHi : alpha(toneC, 0.1),
          border: `2px solid ${alpha(toneC, isUser ? 0.3 : 0.6)}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontFamily: fonts.mono, fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", color: toneC }}>
          <Icon kind={m.icon ?? (isUser ? "user" : m.role === "system" ? "shield" : "model")} size={20} color={toneC} stroke={3.5} />
          {m.who ?? (isUser ? "USUARIO" : m.role === "system" ? "SISTEMA" : "ASISTENTE · PROTOTIPO")}
        </div>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize, lineHeight: 1.28, color: theme.colors.text }}>
          {isUser ? <Typewriter text={m.text} at={m.at + 0.15} cps={30} /> : <WordReveal text={m.text} at={m.at + 0.1} per={0.05} gap={10} />}
        </div>
        {m.cite ? (
          <div
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 12px",
              borderRadius: 8,
              border: `2px solid ${alpha(citeC, 0.75)}`,
              background: alpha(citeC, 0.12),
              fontFamily: fonts.mono,
              fontWeight: 800,
              fontSize: 16,
              color: citeC,
              opacity: Math.min(1, citeP),
              transform: `scale(${0.9 + 0.1 * Math.min(1, citeP)})`,
            }}
          >
            <Icon kind="doc" size={20} color={citeC} stroke={3.5} />
            {m.cite}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** Ventana de chat. `x, y` = esquina superior izquierda. */
export const ChatWindow: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  accent: string;
  messages: ChatMsg[];
  at?: number;
  fontSize?: number;
}> = ({ x, y, w, h, title = "ASISTENTE DE SOPORTE · PROTOTIPO", accent, messages, at = 0, fontSize = 30 }) => {
  const p = useSpringAt(at, theme.spring.smooth);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...enterStyle(p, 40, 0.95) }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 22,
          background: alpha(theme.colors.panel, 0.96),
          border: `2px solid ${alpha(accent, 0.4)}`,
          boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 58,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 24px",
            borderBottom: `1px solid ${theme.colors.line}`,
            fontFamily: fonts.mono,
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: "0.12em",
            color: theme.colors.textDim,
          }}
        >
          <Icon kind="chat" size={24} color={accent} stroke={3.5} />
          {title}
        </div>
        <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 18, justifyContent: "flex-start" }}>
          {messages.map((m, i) => (
            <Bubble key={i} m={m} accent={accent} fontSize={fontSize} />
          ))}
        </div>
      </div>
    </div>
  );
};
