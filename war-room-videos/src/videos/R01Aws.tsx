// VIDEO 1A · R01-AWS · 40 s — "AWS · RECUPERACIÓN NARANJA"
// Idea: Del error 503 a un checkout nuevamente operativo.
// Servicios: Amazon EC2 / balanceador / Auto Scaling / Amazon RDS Multi-AZ / Amazon S3
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { ThreePoliciesConflict } from "../shared/Cliffhangers";
import { Flow, Note, ServiceNode, Zone } from "../shared/Diagram";
import { StoreWindow } from "../shared/GlobalCommerceUI";
import { CheckRow } from "../shared/Hud";
import { STAGGER } from "../shared/motion";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { DotMap } from "../shared/WorldMap";
import { VideoProps } from "./types";

const B = "aws" as const;
const C = theme.colors.aws;

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 6,
    label: "ERROR / URGENCIA",
    onscreen: "503 · CHECKOUT NO DISPONIBLE",
    vo: "Los clientes no pueden pagar. Cada segundo aumenta el riesgo operativo.",
    tone: "danger",
    camera: { kind: "push", to: 1.05 },
    sfx: [
      { at: 0.4, kind: "glitch" },
      { at: 0.4, kind: "impact", volume: 0.4 },
    ],
    visual: <StoreWindow x={370} y={262} w={1180} h={560} state="live" errorAt={0.4} accent={C} showPending pendingFrom={37} pendingTo={214} errorLabel="CHECKOUT NO DISPONIBLE" />,
  },
  {
    from: 6,
    to: 14,
    label: "ARQUITECTURA",
    onscreen: "ELASTIC LOAD BALANCING → EC2 / AUTO SCALING",
    vo: "AWS propone distribuir la aplicación para evitar depender de una sola instancia.",
    camera: { kind: "pull", from: 1.06 },
    sfx: [
      { at: 1.2, kind: "click" },
      { at: 5.2, kind: "shimmer", volume: 0.18 },
    ],
    visual: (
      <AbsoluteFill>
        <DotMap at={0} opacity={0.35} />
        <ServiceNode x={240} y={540} w={260} h={110} title="Clientes" sub="TRÁFICO WEB" icon="user" brand={B} tone="neutral" at={0.4} />
        <ServiceNode x={640} y={540} w={360} h={130} title="Elastic Load Balancing" sub="BALANCEADOR" icon="lb" brand={B} tone="hero" at={1.1} titleSize={28} />
        <Zone x={900} y={272} w={920} h={250} label="ZONA DE DISPONIBILIDAD A" color={C} at={1.6} />
        <Zone x={900} y={562} w={920} h={250} label="ZONA DE DISPONIBILIDAD B" color={C} at={1.6 + STAGGER.block} />
        {[0, 1].map((z) =>
          [0, 1].map((k) => (
            <ServiceNode
              key={`${z}-${k}`}
              x={1070 + k * 300}
              y={397 + z * 290}
              w={270}
              h={100}
              title="Amazon EC2"
              sub={`INSTANCIA ${z === 0 ? "A" : "B"}${k + 1}`}
              icon="compute"
              brand={B}
              tone="brand"
              at={2.4 + (z * 2 + k) * STAGGER.item}
              seed={z * 2 + k}
              titleSize={24}
            />
          )),
        )}
        {[0, 1].map((z) => (
          <ServiceNode
            key={`as${z}`}
            x={1670}
            y={397 + z * 290}
            w={250}
            h={100}
            title="Amazon EC2"
            sub="+ ESCALADO"
            icon="scale"
            brand={B}
            tone="brand"
            at={5.0 + z * STAGGER.item}
            badge="AUTO SCALING"
            seed={5 + z}
            titleSize={24}
          />
        ))}
        <Flow from={[370, 540]} to={[460, 540]} at={1.3} color={theme.colors.textDim} packets={2} bend="none" />
        {[0, 1].map((z) => (
          <Flow key={z} from={[820, 540]} to={[935, 397 + z * 290]} at={3.0 + z * 0.15} color={C} packets={3} bend="h" />
        ))}
        <Note x={1365} y={826} text="CONFIGURACIÓN Y PRUEBAS REQUERIDAS" at={6.2} />
      </AbsoluteFill>
    ),
  },
  {
    from: 14,
    to: 23,
    label: "DATOS",
    onscreen: "AMAZON RDS MULTI-AZ · AMAZON S3",
    vo: "Los pedidos requieren una base transaccional; las imágenes, almacenamiento de objetos.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 1.0, kind: "click" },
      { at: 3.4, kind: "click", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={300} y={410} w={330} h={120} title="Pedidos" sub="CHECKOUT · EC2" icon="cart" brand={B} tone="neutral" at={0.2} />
        <ServiceNode x={300} y={690} w={330} h={120} title="Fotos de producto" sub="CATÁLOGO" icon="image" brand={B} tone="neutral" at={0.2 + STAGGER.item} />
        <ServiceNode x={980} y={410} w={400} h={130} title="Amazon RDS" sub="PRIMARIA · ZONA A" icon="db" brand={B} tone="hero" at={0.9} />
        <ServiceNode x={1580} y={410} w={380} h={130} title="RDS en espera" sub="ZONA B · MULTI-AZ" icon="db" brand={B} tone="brand" at={2.0} />
        <ServiceNode x={980} y={690} w={400} h={130} title="Amazon S3" sub="ALMACENAMIENTO DE OBJETOS" icon="storage" brand={B} tone="neutral" at={3.2} titleSize={30} />
        <Flow from={[465, 410]} to={[780, 410]} at={1.2} color={C} packets={4} bend="none" label="TRANSACCIONES" />
        <Flow from={[1180, 410]} to={[1390, 410]} at={2.4} color={C} packets={2} bend="none" dashed label="RÉPLICA MULTI-AZ" />
        <Flow from={[465, 690]} to={[780, 690]} at={3.5} color={theme.colors.textDim} packets={3} bend="none" label="OBJETOS" />
        <Note x={1580} y={660} text="PEDIDOS ≠ ARCHIVOS" at={5.2} color={theme.colors.textDim} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "RECUPERACIÓN SIMULADA",
    onscreen: "PRUEBA SIMULADA: PAGO / PEDIDO / INVENTARIO",
    vo: "La recuperación se valida con transacciones de prueba; no basta con que abra la página.",
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
          <CheckRow label="Pago" icon="coin" state="ok" at={2.0} resolveAt={3.4} width={670} />
          <CheckRow label="Pedido" icon="cart" state="ok" at={2.0 + STAGGER.item} resolveAt={4.2} width={670} />
          <CheckRow label="Inventario" icon="folder" state="ok" at={2.0 + STAGGER.item * 2} resolveAt={5.0} width={670} />
          <CheckRow label="Monitoreo" icon="monitor" state="review" stateLabel="ACTIVO" at={5.8} resolveAt={6.4} width={670} />
        </div>
      </AbsoluteFill>
    ),
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "ALERTA: TRES POLÍTICAS EN CONFLICTO",
    vo: "La web volvió. ¿Cuál de estas políticas de devolución es la correcta?",
    camera: { kind: "push", to: 1.05 },
    sfx: [{ at: 4.4, kind: "click" }],
    visual: <ThreePoliciesConflict brand={B} question="Quiero devolver mi pedido. ¿Qué política aplica?" />,
  },
];

export const R01Aws: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="R01-AWS" tag="AWS · RONDA 1 · VIDEO 1A" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
