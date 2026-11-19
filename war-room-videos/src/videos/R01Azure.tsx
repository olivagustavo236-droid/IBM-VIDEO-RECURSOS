// VIDEO 1B · R01-AZURE · 40 s — "AZURE · RECUPERACIÓN AZUL"
// Idea: La tienda vuelve sin reconstruir toda la organización.
// Servicios: Azure App Service / Application Gateway o Load Balancer / Azure SQL Database / Blob Storage
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { ThreePoliciesConflict } from "../shared/Cliffhangers";
import { Flow, Note, ServiceNode, Zone } from "../shared/Diagram";
import { StoreWindow } from "../shared/GlobalCommerceUI";
import { CheckRow, Reticle } from "../shared/Hud";
import { Entrance, STAGGER } from "../shared/motion";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { fonts } from "../shared/fonts";
import { VideoProps } from "./types";

const B = "azure" as const;
const C = theme.colors.azure;

/** Último pedido en estado incierto (trazabilidad). */
const UncertainOrder: React.FC = () => (
  <Entrance at={2.0} style={{ position: "absolute", left: 1290, top: 560 }}>
    <div
      style={{
        width: 440,
        padding: "18px 22px",
        borderRadius: 16,
        background: theme.colors.bg,
        border: `2px solid ${theme.colors.warn}`,
        fontFamily: fonts.mono,
        fontWeight: 800,
        fontSize: 20,
        color: theme.colors.text,
        boxShadow: `0 0 40px ${theme.colors.warnSoft}`,
      }}
    >
      <div style={{ color: theme.colors.textDim, fontSize: 16, letterSpacing: "0.12em" }}>ÚLTIMO PEDIDO</div>
      <div style={{ fontFamily: fonts.display, fontSize: 34, marginTop: 4 }}>#GC-48213</div>
      <div style={{ marginTop: 6, color: theme.colors.warn }}>ESTADO: INCIERTO</div>
    </div>
  </Entrance>
);

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 6,
    label: "ERROR / URGENCIA",
    onscreen: "503 · OPERACIÓN INTERRUMPIDA",
    vo: "La empresa no puede vender, pero tampoco puede perder la trazabilidad de sus pedidos.",
    tone: "danger",
    camera: { kind: "push", to: 1.05 },
    sfx: [
      { at: 0.4, kind: "glitch" },
      { at: 0.4, kind: "impact", volume: 0.4 },
      { at: 2.0, kind: "click" },
    ],
    visual: (
      <AbsoluteFill>
        <StoreWindow x={190} y={262} w={1180} h={560} state="live" errorAt={0.4} accent={C} errorLabel="OPERACIÓN INTERRUMPIDA" />
        <UncertainOrder />
        <Reticle x={1510} y={624} w={460} h={130} at={2.6} color={theme.colors.warn} label="TRAZABILIDAD EN RIESGO" />
      </AbsoluteFill>
    ),
  },
  {
    from: 6,
    to: 14,
    label: "ARQUITECTURA",
    onscreen: "APP SERVICE · DISTRIBUCIÓN DE TRÁFICO",
    vo: "Azure propone alojar la aplicación con capacidad administrada y diseñar redundancia.",
    camera: { kind: "pull", from: 1.06 },
    sfx: [
      { at: 1.1, kind: "click" },
      { at: 2.6, kind: "click", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={240} y={540} w={260} h={110} title="Clientes" sub="TRÁFICO WEB" icon="user" brand={B} tone="neutral" at={0.3} />
        <ServiceNode x={650} y={540} w={380} h={140} title="Application Gateway / Load Balancer" sub="DISTRIBUCIÓN" icon="lb" brand={B} tone="hero" at={1.0} titleSize={26} />
        <Zone x={960} y={290} w={860} h={500} label="AZURE APP SERVICE · PLAN ADMINISTRADO" color={C} at={1.6} />
        {[0, 1].map((k) => (
          <ServiceNode
            key={k}
            x={1240}
            y={430 + k * 220}
            w={420}
            h={120}
            title="Aplicación Global Commerce"
            sub={`INSTANCIA ${k + 1} · RÉPLICA`}
            icon="compute"
            brand={B}
            tone="brand"
            at={2.4 + k * STAGGER.item}
            seed={k}
            titleSize={24}
          />
        ))}
        <ServiceNode x={1640} y={540} w={260} h={120} title="Escalado" sub="SEGÚN DISEÑO" icon="scale" brand={B} tone="neutral" at={3.6} titleSize={26} />
        <Flow from={[370, 540]} to={[460, 540]} at={1.2} color={theme.colors.textDim} packets={2} bend="none" />
        {[0, 1].map((k) => (
          <Flow key={k} from={[840, 540]} to={[1030, 430 + k * 220]} at={3.0 + k * 0.15} color={C} packets={3} bend="h" />
        ))}
        <Note x={1390} y={808} text="REDUNDANCIA: SE DISEÑA, NO ES AUTOMÁTICA" at={5.0} color={theme.colors.warn} />
      </AbsoluteFill>
    ),
  },
  {
    from: 14,
    to: 23,
    label: "DATOS",
    onscreen: "AZURE SQL DATABASE · BLOB STORAGE",
    vo: "Las transacciones permanecen en una base diseñada para ellas; los objetos se almacenan aparte.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 1.0, kind: "click" },
      { at: 3.0, kind: "click", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={330} y={540} w={380} h={130} title="App Service" sub="CHECKOUT" icon="compute" brand={B} tone="neutral" at={0.2} />
        <ServiceNode x={1300} y={400} w={460} h={140} title="Azure SQL Database" sub="PEDIDOS · TRANSACCIONES" icon="db" brand={B} tone="hero" at={0.9} />
        <ServiceNode x={1300} y={690} w={460} h={140} title="Blob Storage" sub="CATÁLOGO · IMÁGENES" icon="storage" brand={B} tone="neutral" at={2.7} />
        <Flow from={[520, 520]} to={[1070, 400]} at={1.2} color={C} packets={4} bend="h" label="PEDIDOS" />
        <Flow from={[520, 560]} to={[1070, 690]} at={3.0} color={theme.colors.textDim} packets={3} bend="h" label="OBJETOS" />
        <Note x={1300} y={500} text="ROL: DATOS TRANSACCIONALES" at={4.4} color={C} />
        <Note x={1300} y={790} text="ROL: ARCHIVOS Y OBJETOS" at={4.4 + STAGGER.item} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "RECUPERACIÓN SIMULADA",
    onscreen: "PRUEBAS DEL PILOTO COMPLETADAS (SIMULACIÓN)",
    vo: "Verificamos la operación, los registros y el plan de reversión antes de declararla recuperada.",
    tone: "ok",
    camera: { kind: "push", to: 1.04 },
    sfx: [
      { at: 2.3, kind: "click" },
      { at: 3.4, kind: "tick" },
      { at: 4.2, kind: "tick" },
      { at: 5.0, kind: "tick" },
      { at: 5.1, kind: "shimmer", volume: 0.2 },
    ],
    visual: (
      <AbsoluteFill>
        <StoreWindow x={96} y={272} w={1000} h={530} state="ok" accent={C} testPurchaseAt={0.9} url="tienda.globalcommerce.demo/checkout?prueba=1" />
        <div style={{ position: "absolute", left: 1150, top: 300, display: "flex", flexDirection: "column", gap: 18 }}>
          <CheckRow label="Compra ficticia" icon="cart" state="ok" at={2.0} resolveAt={3.4} width={670} />
          <CheckRow label="Coherencia de datos" icon="db" state="ok" at={2.0 + STAGGER.item} resolveAt={4.2} width={670} />
          <CheckRow label="Registros" icon="audit" state="ok" at={2.0 + STAGGER.item * 2} resolveAt={5.0} width={670} />
          <CheckRow label="Plan de reversión" icon="shield" state="ok" at={2.0 + STAGGER.item * 3} resolveAt={5.8} width={670} />
        </div>
        <Note x={1485} y={720} text="SIN DISPONIBILIDAD GARANTIZADA · ESCENA ILUSTRATIVA" at={6.6} />
      </AbsoluteFill>
    ),
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "ALERTA: TRES POLÍTICAS EN CONFLICTO",
    vo: "La tienda volvió. Pero nadie sabe qué política de devolución sigue vigente.",
    camera: { kind: "push", to: 1.05 },
    sfx: [{ at: 4.4, kind: "click" }],
    visual: <ThreePoliciesConflict brand={B} question="Quiero devolver mi pedido. ¿Qué política aplica?" />,
  },
];

export const R01Azure: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="R01-AZURE" tag="AZURE · RONDA 1 · VIDEO 1B" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
