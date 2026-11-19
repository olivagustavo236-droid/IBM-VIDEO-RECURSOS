// ASSET COMPLEMENTARIO · ANTES DE RONDA 1 — 00-Apertura-CodigoRojo · 75 s
// Objetivo: presentar a la empresa, generar urgencia y abrir el interrogante que llevará al RAG.
// Regla: no gastar el misterio — expediente cerrado, sin anunciar ganador ni usar el RAG como solución.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, theme } from "../theme";
import { Beat } from "../shared/Beat";
import { Flow, Note, ServiceNode } from "../shared/Diagram";
import { DocCard } from "../shared/Docs";
import { fonts } from "../shared/fonts";
import { MiniScreen, StoreWindow } from "../shared/GlobalCommerceUI";
import { Dossier } from "../shared/Hud";
import { CLAMP, enterStyle, STAGGER, useSpringAt } from "../shared/motion";
import { Datacenter, FiveDecisions, OpsPanel, OrderToast, TicketFlood, VersusSplit } from "../shared/Opening";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VideoProps } from "./types";

const B = "neutral" as const;
const C = theme.colors.neutral;

/** "Cada pedido conecta tecnología, personas e información" — tres pilares sobre la operación. */
const Pillars: React.FC<{ at: number }> = ({ at }) => {
  const words = ["TECNOLOGÍA", "PERSONAS", "INFORMACIÓN"];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", gap: 30 }}>
      {words.map((w, i) => (
        <Pill key={w} text={w} at={at + i * STAGGER.block * 2} hero={i === 2} />
      ))}
    </div>
  );
};

const Pill: React.FC<{ text: string; at: number; hero: boolean }> = ({ text, at, hero }) => {
  const p = useSpringAt(at, theme.spring.bouncy);
  return (
    <div
      style={{
        padding: "22px 40px",
        borderRadius: 18,
        background: alpha(theme.colors.bg, 0.94),
        border: `3px solid ${hero ? C : alpha(theme.colors.text, 0.4)}`,
        boxShadow: hero ? `0 0 50px ${theme.colors.neutralGlow}` : "0 30px 60px -20px rgba(0,0,0,0.8)",
        fontFamily: fonts.display,
        fontWeight: 900,
        fontSize: 56,
        letterSpacing: "0.03em",
        color: hero ? C : theme.colors.text,
        ...enterStyle(p, 40, 0.8),
      }}
    >
      {text}
    </div>
  );
};

/** Sistemas desconectados: la información queda repartida. */
const ScatteredSystems: React.FC = () => {
  const nodes = [
    { x: 330, y: 380, t: "ERP", s: "PEDIDOS", i: "db" as const },
    { x: 960, y: 330, t: "CRM", s: "CLIENTES", i: "user" as const },
    { x: 1590, y: 400, t: "Manuales PDF", s: "PROCEDIMIENTOS", i: "doc" as const },
    { x: 560, y: 690, t: "Correo", s: "ACUERDOS", i: "chat" as const },
    { x: 1360, y: 700, t: "Hojas de cálculo", s: "INVENTARIO", i: "folder" as const },
  ];
  return (
    <AbsoluteFill>
      {nodes.map((n, k) => (
        <ServiceNode key={k} x={n.x} y={n.y} w={340} h={110} title={n.t} sub={n.s} icon={n.i} brand={B} tone="neutral" at={0.2 + k * STAGGER.item} seed={k} titleSize={28} />
      ))}
      <Flow from={[500, 380]} to={[790, 330]} at={1.2} color={theme.colors.danger} packets={0} dashed blocked bend="h" />
      <Flow from={[1130, 330]} to={[1420, 400]} at={1.4} color={theme.colors.danger} packets={0} dashed blocked bend="h" />
      <Flow from={[730, 690]} to={[1190, 700]} at={1.6} color={theme.colors.danger} packets={0} dashed blocked bend="h" />
      <Note x={960} y={520} text="SISTEMAS Y MANUALES SIN CONEXIÓN" at={2.2} color={theme.colors.danger} />
    </AbsoluteFill>
  );
};

/** Documentos dispersos que convergen hacia el expediente cerrado. */
const ConvergingDocs: React.FC<{ convergeAt: number }> = ({ convergeAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = interpolate(frame, [convergeAt * fps, (convergeAt + 1.4) * fps], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
  const docs = [
    { x: 120, y: 290, r: -10, t: "Politica_Devoluciones.pdf", k: "PDF" as const },
    { x: 520, y: 520, r: 7, t: "Manual_Soporte_v3.pdf", k: "MANUAL" as const },
    { x: 1450, y: 280, r: 9, t: "Acuerdo_proveedor.docx", k: "DOCX" as const },
    { x: 1560, y: 560, r: -6, t: "RE: reembolso urgente", k: "CORREO" as const },
    { x: 300, y: 600, r: 4, t: "FAQ_envios.docx", k: "DOCX" as const },
    { x: 1150, y: 560, r: -12, t: "Pagos_y_cargos.pdf", k: "PDF" as const },
  ];
  return (
    <AbsoluteFill>
      {docs.map((d, i) => {
        const cx = 960 - 120;
        const cy = 540 - 130;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${(cx - d.x) * k}px, ${(cy - d.y) * k}px) scale(${1 - 0.55 * k})`,
              transformOrigin: `${d.x + 120}px ${d.y + 130}px`,
              opacity: 1 - k * 0.95,
            }}
          >
            <DocCard x={d.x} y={d.y} w={240} h={260} rotate={d.r} title={d.t} kind={d.k} at={0.2 + i * STAGGER.item} seed={i} fillerLines={3} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 15,
    label: "MUNDO EN MARCHA",
    onscreen: "GLOBAL COMMERCE · OPERACIÓN ACTIVA",
    vo: "La empresa vende sin detenerse. Cada pedido conecta tecnología, personas e información.",
    camera: { kind: "push", to: 1.04 },
    sfx: [
      { at: 0.4, kind: "whoosh" },
      { at: 1.6, kind: "click", volume: 0.3 },
      { at: 3.4, kind: "click", volume: 0.25 },
      { at: 5.0, kind: "click", volume: 0.25 },
      { at: 6.6, kind: "click", volume: 0.25 },
      { at: 9.6, kind: "impact", volume: 0.3 },
      { at: 10.4, kind: "impact", volume: 0.25 },
      { at: 11.2, kind: "impact", volume: 0.3 },
      { at: 11.3, kind: "shimmer", volume: 0.2 },
    ],
    visual: (
      <AbsoluteFill>
        <StoreWindow x={96} y={272} w={1080} h={540} state="live" accent={C} url="tienda.globalcommerce.demo" />
        <OpsPanel x={1220} y={272} w={604} h={168} title="VENTAS HOY" icon="cart" at={1.4} counterTo={12480} unit="PEDIDOS" seed={1} color={C} />
        <OpsPanel x={1220} y={458} w={604} h={168} title="INVENTARIO" icon="folder" at={1.4 + STAGGER.block} counterTo={3812} unit="SKU" seed={2} color={C} />
        <OpsPanel x={1220} y={644} w={604} h={168} title="CONSULTAS" icon="chat" at={1.4 + STAGGER.block * 2} counterTo={946} unit="TICKETS" seed={3} color={C} />
        {[3.2, 4.8, 6.4, 8.0].map((t, i) => (
          <OrderToast key={i} x={130} y={735} at={t} text={`PEDIDO #GC-${48190 + i * 7} CONFIRMADO`} dur={1.3} />
        ))}
        <Note x={1522} y={226} text="DATOS SINTÉTICOS · GRÁFICA ILUSTRATIVA" at={2.6} />
        <Beat from={9.4} to={15} exit={false}>
          <AbsoluteFill style={{ background: alpha(theme.colors.bg, 0.55) }} />
          <Pillars at={0.2} />
        </Beat>
      </AbsoluteFill>
    ),
  },
  {
    from: 15,
    to: 35,
    label: "CAÍDA",
    onscreen: "CÓDIGO ROJO · SERVICIO INTERRUMPIDO",
    vo: "El servicio cae. La venta se detiene. Y la información queda repartida entre sistemas y manuales.",
    tone: "danger",
    camera: { kind: "crash", at: 1.0, x: 960, y: 520, zoom: 1.45, hold: 3.4 },
    headlineTone: "alert",
    sfx: [
      { at: 0.3, kind: "glitch" },
      { at: 1.0, kind: "impact" },
      { at: 6.3, kind: "glitch", volume: 0.25 },
      { at: 6.6, kind: "glitch", volume: 0.22 },
      { at: 6.9, kind: "glitch", volume: 0.2 },
      { at: 11.3, kind: "click", volume: 0.3 },
      { at: 11.9, kind: "click", volume: 0.3 },
      { at: 12.5, kind: "click", volume: 0.3 },
      { at: 13.0, kind: "impact", volume: 0.35 },
      { at: 16.2, kind: "glitch", volume: 0.2 },
    ],
    visual: (
      <AbsoluteFill>
        <Beat from={0} to={6}>
          <StoreWindow x={370} y={262} w={1180} h={560} state="live" errorAt={0.3} accent={C} errorLabel="SERVICIO NO DISPONIBLE" />
        </Beat>
        <Beat from={6} to={11}>
          <MiniScreen x={110} y={300} w={540} h={330} title="WEB" icon="globe" at={0.1} errorAt={0.3} />
          <MiniScreen x={690} y={300} w={540} h={330} title="APP MÓVIL" icon="chat" at={0.1 + STAGGER.item} errorAt={0.6} />
          <MiniScreen x={1270} y={300} w={540} h={330} title="PANEL DE PEDIDOS" icon="monitor" at={0.1 + STAGGER.item * 2} errorAt={0.9} />
          <Note x={960} y={700} text="WEB · APP · PANEL DE PEDIDOS: 503" at={1.6} color={theme.colors.danger} />
        </Beat>
        <Beat from={11} to={16}>
          <Datacenter x={110} y={300} at={0.1} offAt={2.0} />
          <TicketFlood x={1290} y={292} at={0.3} tickets={["No puedo pagar mi carrito", "¿Dónde está mi pedido?", "¿Me cobraron dos veces?", "La app no abre", "¿Sigue vigente mi devolución?"]} />
        </Beat>
        <Beat from={16} to={20} exit={false}>
          <ScatteredSystems />
        </Beat>
      </AbsoluteFill>
    ),
  },
  {
    from: 35,
    to: 55,
    label: "DOS CANDIDATOS",
    onscreen: "AWS vs AZURE · CINCO DECISIONES",
    vo: "Se convoca a dos proveedores. Cada ronda el Consejo elegirá una propuesta de respuesta.",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 0.4, kind: "riser", volume: 0.22 },
      { at: 0.95, kind: "impact" },
      { at: 0.95, kind: "stamp", volume: 0.4 },
      { at: 6.0, kind: "click", volume: 0.3 },
      { at: 6.16, kind: "click", volume: 0.28 },
      { at: 6.32, kind: "click", volume: 0.26 },
      { at: 6.48, kind: "click", volume: 0.24 },
      { at: 6.64, kind: "click", volume: 0.22 },
    ],
    noAutoWhoosh: true,
    visual: (
      <AbsoluteFill>
        <VersusSplit at={0.6} leftItems={["Infraestructura", "Datos", "Seguridad"]} rightItems={["Infraestructura", "Datos", "Seguridad"]} />
        <FiveDecisions at={6.0} y={700} />
        <Note x={960} y={808} text="EL CONSEJO (PÚBLICO) VOTA CADA RONDA · NADA ESTÁ DECIDIDO" at={9.0} color={C} />
      </AbsoluteFill>
    ),
  },
  {
    from: 55,
    to: 75,
    label: "SECRETO DE TRAMA",
    onscreen: "SU VOTO DECIDE CADA RONDA · CONTRATO CON REQUISITOS",
    vo: "Recuperar servidores no será suficiente. Al final habrá que recuperar el conocimiento de la empresa.",
    camera: { kind: "push", to: 1.06 },
    sfx: [
      { at: 6.0, kind: "whoosh" },
      { at: 7.6, kind: "impact", volume: 0.4 },
      { at: 8.2, kind: "stamp" },
      { at: 12.0, kind: "click", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <ConvergingDocs convergeAt={6.0} />
        <Dossier x={960} y={540} at={7.4} title="EXPEDIENTE · CONDICIONES DEL CONTRATO" stamp="SELLADO" w={680} h={440} glow={theme.colors.neutralGlow} />
        <Note x={960} y={790} text="SE ABRIRÁ DESPUÉS DE LA RONDA 5" at={12.0} color={C} />
      </AbsoluteFill>
    ),
  },
];

export const V00AperturaCodigoRojo: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="00-APERTURA" tag="APERTURA · CÓDIGO ROJO" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
