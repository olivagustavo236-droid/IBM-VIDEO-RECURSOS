// VIDEO 12 · 12-Expediente-Azure · 60 s — "El expediente Azure"
// El marcador de las cinco votaciones se muestra intacto (prop `votes`, nunca inventado);
// la adjudicación se justifica por requisitos de integración de esta empresa ficticia.
import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha, theme } from "../theme";
import { Flow, Note, ServiceNode } from "../shared/Diagram";
import { fonts } from "../shared/fonts";
import { Dossier, Scoreboard, Stamp } from "../shared/Hud";
import { Icon, IconKind } from "../shared/Icons";
import { enterStyle, useBreathe, useSpringAt } from "../shared/motion";
import { BigStatement } from "../shared/Opening";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VideoProps } from "./types";

const B = "neutral" as const;
const AZ = theme.colors.azure;

const ReqCard: React.FC<{ y: number; at: number; icon: IconKind; title: string; sub: string; seed: number }> = ({ y, at, icon, title, sub, seed }) => {
  const p = useSpringAt(at, theme.spring.snappy);
  const b = useBreathe(seed, 2.5);
  return (
    <div
      style={{
        position: "absolute",
        left: 900,
        top: y,
        width: 920,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "20px 26px",
        boxSizing: "border-box",
        borderRadius: 18,
        background: theme.colors.panel,
        border: `2px solid ${alpha(AZ, 0.55)}`,
        ...enterStyle(p, 30, 0.94, "x"),
        transform: `${enterStyle(p, 30, 0.94, "x").transform} translateY(${b.y}px)`,
      }}
    >
      <div style={{ width: 74, height: 74, borderRadius: 16, background: alpha(AZ, 0.14), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon kind={icon} size={44} color={AZ} />
      </div>
      <div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 16, letterSpacing: "0.14em", color: theme.colors.textDim }}>REQUISITO OBLIGATORIO</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 34, color: theme.colors.text }}>{title}</div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 17, color: AZ, marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
};

const makeShots = (votes: VideoProps["votes"]): Shot[] => [
  {
    from: 0,
    to: 10,
    label: "RESULTADO DEL CONSEJO",
    onscreen: "EVALUACIÓN DEL CONSEJO · RESULTADOS INTACTOS",
    vo: "Las votaciones mostraron preferencias por capacidades.",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 0.45, kind: "click", volume: 0.3 },
      { at: 0.61, kind: "click", volume: 0.28 },
      { at: 0.77, kind: "click", volume: 0.26 },
      { at: 0.93, kind: "click", volume: 0.24 },
      { at: 1.09, kind: "click", volume: 0.22 },
      { at: 3.2, kind: "stamp" },
    ],
    visual: (
      <AbsoluteFill>
        <Scoreboard votes={votes} at={0.2} x={210} y={300} w={1500} />
        <Stamp x={960} y={640} text="EVALUACIÓN DEL CONSEJO" sub="GANADORES DE CADA RONDA SIN CAMBIOS" at={3.2} color={theme.colors.neutral} size={46} rotate={-3} />
        <Note x={960} y={770} text="EL MARCADOR NO SE MODIFICA" at={6.0} />
      </AbsoluteFill>
    ),
  },
  {
    from: 10,
    to: 20,
    label: "EXPEDIENTE",
    onscreen: "EXPEDIENTE GLOBAL COMMERCE · REQUISITOS",
    vo: "El contrato se decide por requisitos de integración específicos de esta empresa ficticia.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 0.6, kind: "whoosh" },
      { at: 2.0, kind: "click" },
      { at: 3.2, kind: "click" },
      { at: 4.4, kind: "click" },
    ],
    visual: (
      <AbsoluteFill>
        <Dossier x={460} y={590} at={0.1} openAt={0.6} title="REQUISITOS OBLIGATORIOS DEL CONTRATO" stamp="ABIERTO" w={640} h={400} />
        <ReqCard y={290} at={2.0} icon="identity" title="Identidad existente con Entra ID" sub="MICROSOFT ENTRA ID · YA EN USO" seed={1} />
        <ReqCard y={460} at={3.2} icon="folder" title="Repositorio Microsoft autorizado" sub="FUENTES DOCUMENTALES APROBADAS" seed={2} />
        <ReqCard y={630} at={4.4} icon="audit" title="Demostración documentada" sub="EVIDENCIA VERIFICABLE ANTE EL COMITÉ" seed={3} />
      </AbsoluteFill>
    ),
  },
  {
    from: 20,
    to: 38,
    label: "PILOTO RAG",
    onscreen: "PILOTO RAG · DOCUMENTOS → RESPUESTA CON FUENTES",
    camera: { kind: "pull", from: 1.05 },
    sfx: [
      { at: 0.5, kind: "click" },
      { at: 2.5, kind: "click" },
      { at: 4.5, kind: "impact", volume: 0.3 },
      { at: 7.0, kind: "click" },
      { at: 9.5, kind: "click" },
      { at: 12.0, kind: "click" },
      { at: 13.2, kind: "shimmer", volume: 0.2 },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={330} y={400} w={440} h={130} title="Documentos" sub="FUENTES AUTORIZADAS" icon="doc" brand="azure" tone="neutral" at={0.4} />
        <ServiceNode x={960} y={400} w={440} h={130} title="Extracción / fragmentos" sub="TEXTO · METADATOS" icon="split" brand="azure" tone="brand" at={2.4} titleSize={28} />
        <ServiceNode x={1590} y={400} w={440} h={130} title="Azure AI Search" sub="ÍNDICE" icon="search" brand="azure" tone="hero" at={4.4} />
        <ServiceNode x={330} y={680} w={440} h={130} title="Recuperación filtrada" sub="SEGÚN PERMISOS" icon="shield" brand="azure" tone="brand" at={6.9} titleSize={28} />
        <ServiceNode x={960} y={680} w={440} h={130} title="Modelo" sub="EN AZURE" icon="model" brand="azure" tone="brand" at={9.4} />
        <ServiceNode x={1590} y={680} w={440} h={130} title="Respuesta con fuentes" sub="CITAS VERIFICABLES" icon="chat" brand="azure" tone="ok" at={11.9} titleSize={28} />
        <Flow from={[550, 400]} to={[740, 400]} at={1.6} color={AZ} packets={3} bend="none" />
        <Flow from={[1180, 400]} to={[1370, 400]} at={3.6} color={AZ} packets={3} bend="none" />
        <Flow from={[1590, 465]} to={[330, 615]} at={5.8} draw={0.9} color={AZ} packets={4} bend="v" />
        <Flow from={[550, 680]} to={[740, 680]} at={8.6} color={AZ} packets={3} bend="none" />
        <Flow from={[1180, 680]} to={[1370, 680]} at={11.1} color={AZ} packets={3} bend="none" />
        <Note x={960} y={790} text="ARQUITECTURA DEL PILOTO · EL COMITÉ COMPROBARÁ SU EVIDENCIA EN VIVO" at={13.4} />
      </AbsoluteFill>
    ),
  },
  {
    from: 38,
    to: 50,
    label: "ADJUDICACIÓN",
    onscreen: "ADJUDICACIÓN DEL PILOTO: AZURE",
    vo: "Azure implementará el piloto RAG.",
    headlineTone: "ok",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 0.7, kind: "impact" },
      { at: 0.75, kind: "stamp" },
      { at: 1.0, kind: "shimmer", volume: 0.24 },
      { at: 3.4, kind: "whoosh", volume: 0.25 },
    ],
    visual: (
      <AbsoluteFill>
        <Stamp x={960} y={420} text="PILOTO RAG · AZURE" sub="ADJUDICACIÓN POR REQUISITOS DE INTEGRACIÓN" at={0.7} color={AZ} size={84} rotate={-3} />
        <Scoreboard votes={votes} at={3.2} x={310} y={590} w={1300} compact />
        <Note x={960} y={790} text="LAS VICTORIAS DE CADA RONDA SIGUEN VISIBLES" at={5.0} />
      </AbsoluteFill>
    ),
  },
  {
    from: 50,
    to: 60,
    label: "DEMOSTRACIÓN",
    vo: "El comité comprobará su evidencia.",
    camera: { kind: "push", to: 1.05 },
    sfx: [{ at: 0.6, kind: "impact", volume: 0.4 }],
    visual: (
      <AbsoluteFill>
        <BigStatement text="DEMOSTRACIÓN EN VIVO" at={0.5} size={130} y={330} highlight="VIVO" highlightColor={AZ} />
        <BigStatement text="CONSULTA Y EVIDENCIA" at={1.4} size={64} y={540} color={theme.colors.textDim} />
        <Note x={960} y={700} text="DOCUMENTOS SINTÉTICOS DE GLOBAL COMMERCE" at={3.4} />
      </AbsoluteFill>
    ),
  },
];

export const V12ExpedienteAzure: React.FC<VideoProps> = ({ bgm, votes }) => (
  <Stage brand={B} videoId="12-EXPEDIENTE-AZURE" tag="ADJUDICACIÓN · EXPEDIENTE" bgm={bgm}>
    <ShotTimeline brand={B} shots={makeShots(votes)} />
  </Stage>
);
