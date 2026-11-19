// UI ficticia de la tienda Global Commerce (datos sintéticos). Estados: live / error / ok.
import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { Error503 } from "./Error503";
import { fonts } from "./fonts";
import { Icon } from "./Icons";
import { CLAMP, Counter, enterStyle, useBreathe, useSpringAt } from "./motion";
import { GCMark } from "./Stage";

export type StoreState = "live" | "error" | "ok";

const PRODUCTS = [
  { name: "Audífonos Nova", price: "$1,299", hue: "#4C6FFF" },
  { name: "Mochila Urbana", price: "$849", hue: "#2FB58C" },
  { name: "Reloj Pulse", price: "$2,190", hue: "#E3734B" },
  { name: "Lámpara Arc", price: "$560", hue: "#B07CE8" },
];

const ProductCard: React.FC<{ i: number; at: number; frozen: boolean; narrow: boolean }> = ({ i, at, frozen, narrow }) => {
  const pr = PRODUCTS[i];
  const p = useSpringAt(at + i * 0.12, theme.spring.snappy);
  const b = useBreathe(i, 2);
  return (
    <div
      style={{
        borderRadius: 14,
        background: theme.colors.panelHi,
        border: `1px solid ${theme.colors.line}`,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        filter: frozen ? "grayscale(0.85) brightness(0.6)" : undefined,
        ...enterStyle(p, 24, 0.94),
        transform: `${enterStyle(p, 24, 0.94).transform} translateY(${frozen ? 0 : b.y}px)`,
      }}
    >
      <div style={{ height: 96, borderRadius: 10, background: `linear-gradient(135deg, ${alpha(pr.hue, 0.9)}, ${alpha(pr.hue, 0.35)})`, position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 46, height: 46, borderRadius: i % 2 ? 10 : 23, background: "rgba(255,255,255,0.75)", transform: "translate(-50%,-50%)" }} />
      </div>
      <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: narrow ? 18 : 21, color: theme.colors.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pr.name}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, color: theme.colors.textDim }}>{pr.price}</span>
        {narrow ? null : (
          <span style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 14, padding: "3px 8px", borderRadius: 6, background: alpha(theme.colors.text, 0.08), color: theme.colors.textDim }}>
            AGREGAR
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Ventana de navegador con la tienda. `x, y` = esquina superior izquierda.
 * `errorAt` / `okAt` cambian el estado dentro de la toma (segundos relativos).
 */
export const StoreWindow: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  state: StoreState;
  errorAt?: number;
  okAt?: number;
  at?: number;
  url?: string;
  accent: string;
  pendingFrom?: number;
  pendingTo?: number;
  testPurchaseAt?: number;
  showPending?: boolean;
  errorLabel?: string;
}> = ({
  x,
  y,
  w = 1180,
  h = 560,
  state,
  errorAt,
  okAt,
  at = 0,
  url = "tienda.globalcommerce.demo/checkout",
  accent,
  pendingFrom = 0,
  pendingTo = 0,
  testPurchaseAt,
  showPending = false,
  errorLabel,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.smooth);
  const s: StoreState = errorAt !== undefined && frame >= errorAt * fps ? "error" : okAt !== undefined && frame >= okAt * fps ? "ok" : state;
  const isErr = s === "error";
  const isOk = s === "ok";
  const narrow = w < 1100;
  const errStart = errorAt ?? 0;
  // carrito congelado: microtemblor determinista mientras hay error
  const jitter = isErr ? (random(`j${Math.floor(frame / 3)}`) - 0.5) * 3 : 0;
  const buy = testPurchaseAt !== undefined ? interpolate(frame, [testPurchaseAt * fps, (testPurchaseAt + 1.4) * fps], [0, 1], { ...CLAMP, easing: theme.ease.inOut }) : 0;
  const payLabel = isErr ? "NO DISPONIBLE" : isOk ? (buy >= 1 ? "PRUEBA OK" : buy > 0 ? "PROCESANDO…" : "PAGAR") : "PAGAR";
  const payColor = isErr ? theme.colors.textMute : isOk ? (buy >= 1 ? theme.colors.ok : accent) : accent;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...enterStyle(p, 50, 0.95) }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 22,
          overflow: "hidden",
          background: theme.colors.bgAlt,
          border: `2px solid ${isErr ? alpha(theme.colors.danger, 0.65) : alpha(theme.colors.text, 0.12)}`,
          boxShadow: `0 50px 100px -30px rgba(0,0,0,0.9)${isErr ? `, 0 0 60px ${alpha(theme.colors.danger, 0.25)}` : ""}`,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* barra del navegador */}
        <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: theme.colors.panel, borderBottom: `1px solid ${theme.colors.line}` }}>
          {["#E5484D", "#E8B341", "#46B98A"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: alpha(c, 0.8) }} />
          ))}
          <div
            style={{
              marginLeft: 16,
              flex: 1,
              height: 30,
              borderRadius: 8,
              background: theme.colors.bg,
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              fontFamily: fonts.mono,
              fontSize: 16,
              fontWeight: 500,
              color: theme.colors.textDim,
            }}
          >
            https://{url}
          </div>
        </div>
        {/* encabezado de la tienda */}
        <div style={{ height: 66, display: "flex", alignItems: "center", gap: 14, padding: "0 28px", borderBottom: `1px solid ${theme.colors.line}` }}>
          <GCMark size={34} color={theme.colors.text} />
          <span style={{ fontFamily: fonts.display, fontWeight: 900, fontSize: 26, letterSpacing: "0.04em" }}>GLOBAL COMMERCE</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 26, fontFamily: fonts.body, fontWeight: 700, fontSize: 18, color: theme.colors.textDim }}>
            <span>Catálogo</span>
            <span>Pedidos</span>
            <span>Soporte</span>
          </div>
        </div>
        {/* cuerpo */}
        <div style={{ flex: 1, display: "flex", gap: 22, padding: 22 }}>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, alignContent: "start" }}>
            {PRODUCTS.map((_, i) => (
              <ProductCard key={i} i={i} at={at + 0.3} frozen={isErr} narrow={narrow} />
            ))}
          </div>
          <div
            style={{
              width: narrow ? 260 : 300,
              borderRadius: 16,
              background: theme.colors.panel,
              border: `1px solid ${theme.colors.line}`,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              transform: `translateX(${jitter}px)`,
              filter: isErr ? "saturate(0.3)" : undefined,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.display, fontWeight: 800, fontSize: 22 }}>
              <Icon kind="cart" size={26} color={theme.colors.text} /> Carrito
            </div>
            {["Audífonos Nova", "Reloj Pulse"].map((n) => (
              <div key={n} style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.body, fontWeight: 600, fontSize: 17, color: theme.colors.textDim }}>
                <span>{n}</span>
                <span>×1</span>
              </div>
            ))}
            <div style={{ height: 1, background: theme.colors.line }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.display, fontWeight: 800, fontSize: 20 }}>
              <span>Total</span>
              <span>$3,489</span>
            </div>
            <div
              style={{
                marginTop: "auto",
                height: 56,
                borderRadius: 12,
                background: isErr ? alpha(theme.colors.text, 0.06) : alpha(payColor, 0.2),
                border: `2px solid ${alpha(payColor, 0.9)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                fontFamily: fonts.display,
                fontWeight: 900,
                fontSize: 20,
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
                color: payColor,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {buy > 0 && buy < 1 ? <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${buy * 100}%`, background: alpha(accent, 0.25) }} /> : null}
              {buy >= 1 ? <Icon kind="check" size={26} color={payColor} stroke={4.5} /> : null}
              <span style={{ position: "relative" }}>{payLabel}</span>
            </div>
          </div>
        </div>
        {/* pedidos pendientes */}
        {showPending ? (
          <div
            style={{
              position: "absolute",
              left: 22,
              bottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 18px",
              borderRadius: 12,
              background: alpha(theme.colors.bg, 0.92),
              border: `2px solid ${alpha(theme.colors.danger, 0.7)}`,
              fontFamily: fonts.mono,
              fontWeight: 800,
              fontSize: 20,
              color: theme.colors.text,
              zIndex: 3,
            }}
          >
            PEDIDOS PENDIENTES
            <Counter from={pendingFrom} to={pendingTo} at={errStart + 0.3} style={{ color: theme.colors.danger, fontSize: 30 }} />
          </div>
        ) : null}
        {isErr ? <Error503 at={errStart} label={errorLabel} /> : null}
      </div>
    </div>
  );
};

/** Mini-pantalla (web / app / panel) para la toma de caída múltiple. */
export const MiniScreen: React.FC<{ x: number; y: number; w: number; h: number; title: string; icon: "globe" | "chat" | "monitor"; at: number; errorAt: number }> = ({
  x,
  y,
  w,
  h,
  title,
  icon,
  at,
  errorAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useSpringAt(at, theme.spring.snappy);
  const err = frame >= errorAt * fps;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, ...enterStyle(p, 30, 0.92) }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
          background: theme.colors.bgAlt,
          border: `2px solid ${err ? alpha(theme.colors.danger, 0.7) : theme.colors.line}`,
        }}
      >
        <div style={{ height: 44, display: "flex", alignItems: "center", gap: 10, padding: "0 16px", background: theme.colors.panel, fontFamily: fonts.mono, fontWeight: 800, fontSize: 17, letterSpacing: "0.1em", color: theme.colors.textDim }}>
          <Icon kind={icon} size={22} color={theme.colors.textDim} stroke={3.5} />
          {title}
        </div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {[90, 70, 80, 60].map((wd, i) => (
            <div key={i} style={{ height: 14, borderRadius: 7, width: `${wd}%`, background: alpha(theme.colors.text, 0.08) }} />
          ))}
        </div>
        {err ? <Error503 at={errorAt} compact /> : null}
      </div>
    </div>
  );
};
