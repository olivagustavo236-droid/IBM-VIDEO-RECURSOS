// Piezas de la apertura: operación en marcha, avalancha de tickets, centro de datos y pantalla dividida.
import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { fonts } from "./fonts";
import { Icon, IconKind } from "./Icons";
import { CLAMP, Counter, enterStyle, STAGGER, useBreathe, useSpringAt, WordReveal } from "./motion";

/** Panel de operación ilustrativo (datos sintéticos) con mini-gráfica viva. */
export const OpsPanel: React.FC<{ x: number; y: number; w: number; h: number; title: string; icon: IconKind; at: number; counterTo: number; unit: string; seed: number; color: string }> = ({
  x,
  y,
  w,
  h,
  title,
  icon,
  at,
  counterTo,
  unit,
  seed,
  color,
}) => {
  const frame = useCurrentFrame();
  const p = useSpringAt(at, theme.spring.snappy);
  const b = useBreathe(seed, 2.5);
  const bars = 16;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 18,
        padding: 22,
        boxSizing: "border-box",
        background: theme.colors.panel,
        border: `2px solid ${alpha(color, 0.35)}`,
        ...enterStyle(p, 30, 0.94),
        transform: `${enterStyle(p, 30, 0.94).transform} translateY(${b.y}px)`,
      }}
    >
      <div style={{ display: "flex", height: "100%", gap: 20, alignItems: "stretch" }}>
      <div style={{ width: 230, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.12em", color: theme.colors.textDim }}>
          <Icon kind={icon} size={24} color={color} stroke={3.5} />
          {title}
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 50, lineHeight: 1, marginTop: 10, whiteSpace: "nowrap" }}>
          <Counter to={counterTo} at={at + 0.2} />
        </div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.12em", color: theme.colors.textDim, marginTop: 6 }}>{unit}</div>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6, height: "100%" }}>
        {Array.from({ length: bars }).map((_, i) => {
          const v = 0.35 + 0.5 * Math.abs(Math.sin(i * 0.7 + seed + frame / 16)) + random(`b${seed}-${i}`) * 0.15;
          const grow = interpolate(p, [0, 1], [0, 1]);
          return <div key={i} style={{ flex: 1, height: `${Math.min(1, v) * 100 * grow}%`, borderRadius: 4, background: i === bars - 1 ? color : alpha(color, 0.35) }} />;
        })}
      </div>
      </div>
    </div>
  );
};

/** Notificación de pedido que entra y sale (operación activa). */
export const OrderToast: React.FC<{ x: number; y: number; at: number; text: string; dur?: number }> = ({ x, y, at, text, dur = 1.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.snappy);
  const out = interpolate(frame, [(at + dur) * fps, (at + dur + 0.3) * fps], [0, 1], { ...CLAMP, easing: theme.ease.in });
  if (frame < at * fps || out >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 18px",
        borderRadius: 12,
        background: alpha(theme.colors.bg, 0.92),
        border: `2px solid ${alpha(theme.colors.ok, 0.6)}`,
        fontFamily: fonts.mono,
        fontWeight: 800,
        fontSize: 18,
        color: theme.colors.text,
        opacity: Math.min(1, p) * (1 - out),
        transform: `translateX(${(1 - p) * 40 + out * -20}px) scale(${0.95 + 0.05 * p})`,
      }}
    >
      <Icon kind="check" size={22} color={theme.colors.ok} stroke={4.5} />
      {text}
    </div>
  );
};

/** Tickets de soporte que llegan en avalancha. */
export const TicketFlood: React.FC<{ x: number; y: number; at: number; tickets: string[] }> = ({ x, y, at, tickets }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", gap: 12 }}>
    {tickets.map((t, i) => (
      <Ticket key={i} text={t} at={at + i * STAGGER.block * 1.5} i={i} />
    ))}
  </div>
);

const Ticket: React.FC<{ text: string; at: number; i: number }> = ({ text, at, i }) => {
  const p = useSpringAt(at, theme.spring.snappy);
  const b = useBreathe(i, 2);
  return (
    <div
      style={{
        width: 520,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        borderRadius: 14,
        background: theme.colors.panel,
        border: `2px solid ${alpha(theme.colors.danger, 0.45)}`,
        ...enterStyle(p, 40, 0.94, "x"),
        transform: `${enterStyle(p, 40, 0.94, "x").transform} translateY(${b.y}px)`,
      }}
    >
      <Icon kind="chat" size={30} color={theme.colors.danger} />
      <div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 14, letterSpacing: "0.1em", color: theme.colors.textDim }}>TICKET #{4810 + i * 7} · URGENTE</div>
        <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 23, color: theme.colors.text }}>{text}</div>
      </div>
    </div>
  );
};

/** Centro de datos: racks cuyos LEDs se apagan secuencialmente. */
export const Datacenter: React.FC<{ x: number; y: number; at: number; offAt: number }> = ({ x, y, at, offAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.smooth);
  const racks = 6;
  const dark = interpolate(frame, [(offAt + 1.6) * fps, (offAt + 2.4) * fps], [0, 0.6], { ...CLAMP, easing: theme.ease.inOut });
  return (
    <div style={{ position: "absolute", left: x, top: y, ...enterStyle(p, 40, 0.95) }}>
      <div style={{ display: "flex", gap: 18, position: "relative" }}>
        {Array.from({ length: racks }).map((_, r) => {
          const off = frame >= (offAt + r * 0.22) * fps;
          return (
            <div key={r} style={{ width: 110, height: 420, borderRadius: 10, background: "#0E1522", border: `2px solid ${theme.colors.line}`, padding: 12, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
              {Array.from({ length: 12 }).map((__, u) => {
                const blink = random(`led${r}-${u}-${Math.floor(frame / 5)}`) > 0.3;
                const c = off ? theme.colors.danger : u % 4 === 0 ? theme.colors.warn : theme.colors.ok;
                const on = off ? (u === 0 ? (Math.floor(frame / 8) % 2 === 0 ? 1 : 0.2) : 0.05) : blink ? 1 : 0.4;
                return (
                  <div key={u} style={{ height: 22, borderRadius: 4, background: "#16202F", display: "flex", alignItems: "center", gap: 6, padding: "0 8px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: c, opacity: on, boxShadow: on > 0.5 ? `0 0 8px ${c}` : "none" }} />
                    <div style={{ flex: 1, height: 3, borderRadius: 2, background: alpha(theme.colors.text, 0.08) }} />
                  </div>
                );
              })}
            </div>
          );
        })}
        <div style={{ position: "absolute", inset: -20, background: theme.colors.black, opacity: dark, borderRadius: 16 }} />
      </div>
      <div style={{ marginTop: 16, fontFamily: fonts.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.14em", color: theme.colors.danger, opacity: dark > 0.1 ? 1 : 0 }}>CENTRO DE DATOS · SIN SERVICIO</div>
    </div>
  );
};

/**
 * transition-hidden-cut · B versus-slam: dos medias pantallas con costura diagonal ~78°
 * chocan desde fuera (ease-in 10 f), golpe con flash + temblor + sello "VS".
 */
export const VersusSplit: React.FC<{ at: number; leftItems: string[]; rightItems: string[] }> = ({ at, leftItems, rightItems }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = at * fps;
  const slam = interpolate(frame, [a, a + 10], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const impact = a + 10;
  const t = frame - impact;
  const shake = t >= 0 && t < 8 ? 16 * Math.exp(-t / 1.7) * Math.sin(t * 2.9) : 0;
  const flash = interpolate(frame, [impact, impact + 3], [0.55, 0], { ...CLAMP, easing: theme.ease.out }) * (frame >= impact ? 1 : 0);
  const vs = spring({ frame: frame - impact, fps, config: { damping: 12, stiffness: 260, mass: 0.8 } });
  const off = (1 - slam) * 1240;
  const panel = (side: "l" | "r") => {
    const isL = side === "l";
    const c = isL ? theme.colors.aws : theme.colors.azure;
    const items = isL ? leftItems : rightItems;
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${isL ? -off : off}px)`,
          clipPath: isL ? "polygon(0 0, 1075px 0, 845px 100%, 0 100%)" : "polygon(1075px 0, 100% 0, 100% 100%, 845px 100%)",
          background: `linear-gradient(${isL ? 135 : 225}deg, ${alpha(c, 0.28)}, ${alpha(theme.colors.bg, 0.95)} 70%)`,
        }}
      >
        <div style={{ position: "absolute", top: 300, left: isL ? 140 : 1150, width: 640 }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 20, letterSpacing: "0.16em", color: c }}>EQUIPO {isL ? "A" : "B"} · PROPUESTA</div>
          <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 150, lineHeight: 1, color: c, letterSpacing: "-0.02em", margin: "8px 0 18px" }}>{isL ? "AWS" : "AZURE"}</div>
          {items.map((it, i) => (
            <SplitItem key={i} text={it} at={at + 0.7 + i * STAGGER.item + (isL ? 0 : STAGGER.word)} color={c} />
          ))}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
      {panel("l")}
      {panel("r")}
      {frame >= impact ? (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            transform: `translate(-50%, -50%) scale(${interpolate(vs, [0, 1], [1.9, 1])}) rotate(-6deg)`,
            width: 170,
            height: 170,
            borderRadius: 85,
            background: theme.colors.bg,
            border: `6px solid ${theme.colors.text}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 900,
            fontSize: 72,
            color: theme.colors.text,
            boxShadow: `0 0 60px ${alpha(theme.colors.text, 0.3)}`,
          }}
        >
          VS
        </div>
      ) : null}
      <AbsoluteFill style={{ background: theme.colors.text, opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const SplitItem: React.FC<{ text: string; at: number; color: string }> = ({ text, at, color }) => {
  const p = useSpringAt(at, theme.spring.snappy);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12, ...enterStyle(p, 24, 0.95, "x") }}>
      <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
      <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: theme.colors.text }}>{text}</span>
    </div>
  );
};

/** Cinco casillas de decisión (sin anticipar temas ni resultados). */
export const FiveDecisions: React.FC<{ at: number; y: number }> = ({ at, y }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 22 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <DecisionSlot key={i} i={i} at={at + i * STAGGER.item} />
    ))}
  </div>
);

const DecisionSlot: React.FC<{ i: number; at: number }> = ({ i, at }) => {
  const p = useSpringAt(at, theme.spring.bouncy);
  return (
    <div
      style={{
        width: 200,
        height: 86,
        borderRadius: 14,
        background: alpha(theme.colors.bg, 0.92),
        border: `2px solid ${alpha(theme.colors.text, 0.35)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.display,
        fontWeight: 900,
        fontSize: 28,
        letterSpacing: "0.04em",
        color: theme.colors.text,
        ...enterStyle(p, 30, 0.8),
      }}
    >
      DECISIÓN {i + 1}
    </div>
  );
};

/** Gran texto central (título o pregunta final). */
export const BigStatement: React.FC<{ text: string; at: number; size?: number; color?: string; y?: number; highlight?: string; highlightColor?: string }> = ({
  text,
  at,
  size = 92,
  color = theme.colors.text,
  y = 360,
  highlight,
  highlightColor = theme.colors.neutral,
}) => (
  <div style={{ position: "absolute", left: 160, right: 160, top: y }}>
    <WordReveal
      text={text}
      at={at}
      per={0.12}
      gap={24}
      justify="center"
      style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: size, lineHeight: 1.08, letterSpacing: "-0.02em", color, textAlign: "center" }}
      wordStyle={(w) => (highlight && w.replace(/[¿?,.«»]/g, "").toLowerCase() === highlight.toLowerCase() ? { color: highlightColor, textShadow: `0 0 40px ${alpha(highlightColor, 0.45)}` } : undefined)}
    />
  </div>
);
