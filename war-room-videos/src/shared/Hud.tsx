// Elementos HUD de War Room: retícula, sello, checklist, métricas, marcador, expediente y perfiles.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { fonts } from "./fonts";
import { Icon, IconKind } from "./Icons";
import { CLAMP, enterStyle, useBreathe, useSpringAt } from "./motion";

/** fui-hud-moves · reticle-lock-on: cuatro esquinas que entran desde fuera, sobreimpulso y fijación. */
export const Reticle: React.FC<{ x: number; y: number; w: number; h: number; at: number; color: string; label?: string }> = ({ x, y, w, h, at, color, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fly = interpolate(frame, [at * fps, at * fps + 10], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const shrink = spring({ frame: frame - at * fps - 6, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const sc = interpolate(shrink, [0, 1], [2.2, 1]);
  if (frame < at * fps) return null;
  const L = 34;
  const off = (1 - fly) * 700;
  const corners = [
    { sx: -1, sy: -1 },
    { sx: 1, sy: -1 },
    { sx: 1, sy: 1 },
    { sx: -1, sy: 1 },
  ];
  const lockP = interpolate(frame, [at * fps + 14, at * fps + 22], [0, 1], { ...CLAMP, easing: theme.ease.out });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      {corners.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.sx * (w / 2) * sc + c.sx * off - (c.sx > 0 ? L : 0),
            top: c.sy * (h / 2) * sc + c.sy * off - (c.sy > 0 ? L : 0),
            width: L,
            height: L,
            opacity: fly,
            borderTop: c.sy < 0 ? `5px solid ${color}` : "none",
            borderBottom: c.sy > 0 ? `5px solid ${color}` : "none",
            borderLeft: c.sx < 0 ? `5px solid ${color}` : "none",
            borderRight: c.sx > 0 ? `5px solid ${color}` : "none",
            filter: `drop-shadow(0 0 10px ${alpha(color, 0.6)})`,
          }}
        />
      ))}
      {label ? (
        <div
          style={{
            position: "absolute",
            left: -w / 2,
            top: h / 2 + 14,
            opacity: lockP,
            transform: `scale(${0.7 + 0.3 * lockP})`,
            transformOrigin: "left top",
            fontFamily: fonts.mono,
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: "0.12em",
            padding: "4px 10px",
            borderRadius: 6,
            background: color,
            color: theme.colors.bg,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Sello que cae con spring "bouncy" (escala 1.9 → 1) y golpe. `x, y` = centro. */
export const Stamp: React.FC<{ x: number; y: number; text: string; sub?: string; at: number; color: string; rotate?: number; size?: number }> = ({
  x,
  y,
  text,
  sub,
  at,
  color,
  rotate = -8,
  size = 54,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at * fps, fps, config: { damping: 12, stiffness: 260, mass: 0.8 } });
  if (frame < at * fps) return null;
  const sc = interpolate(p, [0, 1], [1.9, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${sc})`,
        opacity: Math.min(1, p * 1.6),
        border: `6px solid ${color}`,
        borderRadius: 14,
        padding: "12px 30px",
        color,
        fontFamily: fonts.display,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "0.06em",
        textAlign: "center",
        lineHeight: 1,
        background: alpha(theme.colors.bg, 0.6),
        boxShadow: `0 0 40px ${alpha(color, 0.35)}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
      {sub ? <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: size * 0.34, letterSpacing: "0.14em", marginTop: 8 }}>{sub}</div> : null}
    </div>
  );
};

export type CheckState = "ok" | "pending" | "review" | "fail" | "blocked";

const CHECK: Record<CheckState, { c: string; icon: IconKind | null; label: string }> = {
  ok: { c: theme.colors.ok, icon: "check", label: "VERIFICADO (SIM.)" },
  pending: { c: theme.colors.textDim, icon: null, label: "PENDIENTE" },
  review: { c: theme.colors.warn, icon: "clock", label: "EN REVISIÓN" },
  fail: { c: theme.colors.danger, icon: "x", label: "NO CONFORME" },
  blocked: { c: theme.colors.danger, icon: "lock", label: "DENEGADO" },
};

/** Fila de checklist que pasa de "pendiente" a su estado final en `resolveAt`. */
export const CheckRow: React.FC<{
  label: string;
  at: number;
  resolveAt?: number;
  state: CheckState;
  stateLabel?: string;
  width?: number;
  icon?: IconKind;
}> = ({ label, at, resolveAt, state, stateLabel, width = 760, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.snappy);
  const resolved = resolveAt === undefined || frame >= resolveAt * fps;
  const s = CHECK[resolved ? state : "pending"];
  const pop = resolveAt !== undefined ? spring({ frame: frame - resolveAt * fps, fps, config: theme.spring.bouncy }) : 1;
  const spin = (frame / fps) * 360;
  return (
    <div
      style={{
        width,
        display: "flex",
        alignItems: "center",
        gap: 20,
        padding: "16px 22px",
        borderRadius: 14,
        background: theme.colors.panel,
        border: `2px solid ${alpha(s.c, resolved ? 0.6 : 0.25)}`,
        ...enterStyle(p, 26, 0.95, "x"),
      }}
    >
      {icon ? <Icon kind={icon} size={34} color={theme.colors.textDim} /> : null}
      <div style={{ flex: 1, fontFamily: fonts.display, fontWeight: 800, fontSize: 30, color: theme.colors.text }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.08em", color: s.c }}>
        {resolved && s.icon ? (
          <div style={{ transform: `scale(${pop})` }}>
            <Icon kind={s.icon} size={32} color={s.c} stroke={4.5} />
          </div>
        ) : (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              border: `3px solid ${alpha(s.c, 0.3)}`,
              borderTopColor: s.c,
              transform: `rotate(${spin}deg)`,
            }}
          />
        )}
        {resolved ? stateLabel ?? s.label : "PENDIENTE"}
      </div>
    </div>
  );
};

/** Métrica sin cifras inventadas: muestra "—" y una traza de marcador de posición. */
export const MetricTile: React.FC<{ label: string; unit?: string; value?: string; at: number; w?: number; h?: number; accent: string; icon?: IconKind; seed?: number }> = ({
  label,
  unit = "",
  value = "—",
  at,
  w = 400,
  h = 230,
  accent,
  icon,
  seed = 0,
}) => {
  const frame = useCurrentFrame();
  const p = useSpringAt(at, theme.spring.snappy);
  const b = useBreathe(seed, 2);
  const pts = Array.from({ length: 24 }).map((_, i) => {
    const yy = 40 + Math.sin(i * 0.8 + seed + frame / 18) * 10 + Math.sin(i * 0.31 + seed * 2) * 8;
    return `${(i / 23) * (w - 48)},${yy}`;
  });
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 18,
        padding: 24,
        boxSizing: "border-box",
        background: theme.colors.panel,
        border: `2px solid ${alpha(accent, 0.35)}`,
        ...enterStyle(p, 30, 0.94),
        transform: `${enterStyle(p, 30, 0.94).transform} translateY(${b.y}px)`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.1em", color: theme.colors.textDim }}>
        {icon ? <Icon kind={icon} size={24} color={accent} stroke={3.5} /> : null}
        {label}
      </div>
      <div style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 70, color: theme.colors.text, fontVariantNumeric: "tabular-nums", marginTop: 6 }}>
        {value}
        <span style={{ fontSize: 30, color: theme.colors.textDim, marginLeft: 10 }}>{unit}</span>
      </div>
      <svg width={w - 48} height={70} style={{ marginTop: 2 }}>
        <polyline points={pts.join(" ")} fill="none" stroke={alpha(accent, 0.55)} strokeWidth={3} strokeDasharray="8 8" />
      </svg>
    </div>
  );
};

export type Vote = "AWS" | "AZURE" | "EMPATE" | null;

/**
 * Marcador de las cinco rondas. NUNCA inventa ganadores: sin `votes` (null) muestra
 * "VOTO REGISTRADO". El operador puede inyectar los resultados reales con --props.
 */
export const Scoreboard: React.FC<{ votes: Vote[]; at: number; x: number; y: number; w?: number; compact?: boolean }> = ({ votes, at, x, y, w = 1300, compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.smooth);
  const cell = (w - 4 * 18) / 5;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, ...enterStyle(p, 30, 0.96) }}>
      <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: theme.colors.textDim, marginBottom: 14 }}>
        MARCADOR DEL CONSEJO · CINCO RONDAS
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const v = votes[i] ?? null;
          const c = v === "AWS" ? theme.colors.aws : v === "AZURE" ? theme.colors.azure : theme.colors.textDim;
          const cp = spring({ frame: frame - (at + 0.25 + i * 0.16) * fps, fps, config: theme.spring.snappy });
          return (
            <div
              key={i}
              style={{
                width: cell,
                height: compact ? 116 : 150,
                borderRadius: 16,
                background: theme.colors.panel,
                border: `2px solid ${alpha(c, v ? 0.8 : 0.3)}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                ...enterStyle(cp, 24, 0.9),
              }}
            >
              <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.14em", color: theme.colors.textDim }}>RONDA {i + 1}</div>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 900,
                  fontSize: v ? (compact ? 34 : 46) : compact ? 18 : 24,
                  lineHeight: 1.1,
                  textAlign: "center",
                  padding: "0 10px",
                  color: v ? c : theme.colors.textDim,
                  letterSpacing: "0.04em",
                }}
              >
                {v ?? "VOTO REGISTRADO"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Expediente sellado (sobre). `openAt` levanta la solapa. `x, y` = centro. */
export const Dossier: React.FC<{ x: number; y: number; at: number; openAt?: number; title: string; stamp?: string; w?: number; h?: number; glow?: string }> = ({
  x,
  y,
  at,
  openAt,
  title,
  stamp = "CONFIDENCIAL",
  w = 620,
  h = 420,
  glow,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.smooth);
  const b = useBreathe(3, 3, 36);
  const open = openAt !== undefined ? interpolate(frame, [openAt * fps, openAt * fps + 24], [0, 1], { ...CLAMP, easing: theme.ease.inOut }) : 0;
  const stampP = spring({ frame: frame - (at + 0.6) * fps, fps, config: { damping: 12, stiffness: 260, mass: 0.8 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        perspective: 1400,
        ...enterStyle(p, 60, 0.9),
        transform: `${enterStyle(p, 60, 0.9).transform} translateY(${b.y}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 16,
          background: "linear-gradient(165deg, #C9A56A, #A8854B)",
          boxShadow: `0 50px 90px -30px rgba(0,0,0,0.9)${glow ? `, 0 0 70px ${glow}` : ""}`,
        }}
      />
      {/* hoja interior que asoma al abrir */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 30 - open * 80,
          height: h - 70,
          borderRadius: 10,
          background: "#F2EEE5",
          opacity: open,
          padding: 26,
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.12em", color: "#7A2E2E" }}>GLOBAL COMMERCE · EXPEDIENTE</div>
        {[80, 92, 70, 86].map((wd, i) => (
          <div key={i} style={{ height: 10, borderRadius: 5, background: "#D3CCBE", width: `${wd}%`, marginTop: 16 }} />
        ))}
      </div>
      {/* solapa */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: h * 0.4,
          transformOrigin: "50% 0%",
          transform: `rotateX(${open * 170}deg)`,
          background: "linear-gradient(180deg, #B8935A, #A07D45)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          borderRadius: 16,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 46, textAlign: "center", fontFamily: fonts.display, fontWeight: 900, fontSize: 32, color: "#2A1D0C", padding: "0 40px" }}>
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          right: 34,
          top: h * 0.42,
          transform: `rotate(-10deg) scale(${interpolate(stampP, [0, 1], [1.9, 1])})`,
          opacity: frame >= (at + 0.6) * fps ? Math.min(1, stampP * 1.5) : 0,
          border: `5px solid ${theme.colors.danger}`,
          color: theme.colors.danger,
          padding: "8px 18px",
          borderRadius: 10,
          fontFamily: fonts.display,
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: "0.08em",
        }}
      >
        {stamp}
      </div>
    </div>
  );
};

/** Perfil de usuario (avatar geométrico + rol). `x, y` = esquina superior izquierda. */
export const ProfileCard: React.FC<{
  x: number;
  y: number;
  name: string;
  role: string;
  color: string;
  at: number;
  w?: number;
  icon?: IconKind;
  badge?: string;
  badgeColor?: string;
}> = ({ x, y, name, role, color, at, w = 420, icon = "user", badge, badgeColor }) => {
  const p = useSpringAt(at, theme.spring.snappy);
  const b = useBreathe(at * 10, 2.5);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 22px",
        borderRadius: 18,
        background: theme.colors.panel,
        border: `2px solid ${alpha(color, 0.6)}`,
        boxSizing: "border-box",
        ...enterStyle(p, 30, 0.93),
        transform: `${enterStyle(p, 30, 0.93).transform} translateY(${b.y}px)`,
      }}
    >
      <div style={{ width: 70, height: 70, borderRadius: 35, background: alpha(color, 0.18), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon kind={icon} size={42} color={color} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 28, color: theme.colors.text }}>{name}</div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 17, letterSpacing: "0.08em", color }}>{role}</div>
      </div>
      {badge ? (
        <div
          style={{
            marginLeft: "auto",
            fontFamily: fonts.mono,
            fontWeight: 800,
            fontSize: 15,
            padding: "4px 10px",
            borderRadius: 6,
            border: `2px solid ${badgeColor ?? color}`,
            color: badgeColor ?? color,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </div>
      ) : null}
    </div>
  );
};
