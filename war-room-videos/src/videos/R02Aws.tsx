// VIDEO 2A · R02-AWS · 40 s — "AWS · BIBLIOTECA NARANJA"
// Idea: Del pico de tráfico a un índice documental.
// Servicios: Amazon CloudFront / Amazon S3 / AWS Lambda / Amazon OpenSearch Service
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { LiteralSearchMiss } from "../shared/Cliffhangers";
import { Flow, Note, ServiceNode } from "../shared/Diagram";
import { ChunkCard, DocCard } from "../shared/Docs";
import { STAGGER, useEaseBetween } from "../shared/motion";
import { DemandPeak } from "../shared/RoundScenes";
import { ResultRow, SearchBar } from "../shared/Search";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { DotMap, LoadMeter, Visitors } from "../shared/WorldMap";
import { VideoProps } from "./types";

const B = "aws" as const;
const C = theme.colors.aws;

const EDGES: [number, number][] = [
  [470, 430],
  [1000, 390],
  [560, 700],
  [1030, 650],
  [1380, 430],
];

/** CloudFront acerca contenido cacheable a los usuarios; el origen descarga parte de las solicitudes. */
const Distribution: React.FC = () => {
  const relief = useEaseBetween(1.8, 4.2, theme.ease.inOut);
  return (
    <AbsoluteFill>
      <DotMap at={0} opacity={0.4} />
      <Visitors target={[1640, 560]} at={0} count={90} color={C} edges={EDGES} edgeShareAt={1.8} />
      {EDGES.map((e, i) => (
        <ServiceNode key={i} x={e[0]} y={e[1]} w={190} h={70} title="Borde" sub="CACHÉ" icon="cdn" brand={B} tone="brand" at={1.0 + i * STAGGER.item} seed={i} titleSize={20} />
      ))}
      <ServiceNode x={760} y={290} w={420} h={100} title="Amazon CloudFront" sub="RED DE ENTREGA DE CONTENIDO" icon="cdn" brand={B} tone="hero" at={0.5} titleSize={28} />
      <ServiceNode x={1640} y={560} w={260} h={100} title="Origen" sub="SERVIDOR WEB" icon="server" brand={B} tone="neutral" at={0.2} titleSize={26} />
      <LoadMeter x={1490} y={630} level={0.95 - relief * 0.5} label="CARGA DEL ORIGEN (ILUSTRATIVA)" color={C} />
      <Note x={1580} y={724} text="INVENTARIO Y PAGOS: EN EL ORIGEN" at={4.4} color={theme.colors.textDim} />
      <Note x={760} y={800} text="IMÁGENES Y CONTENIDO CACHEABLE · SEGÚN CONFIGURACIÓN" at={3.0} color={C} />
    </AbsoluteFill>
  );
};

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 6,
    label: "PICO DE DEMANDA",
    onscreen: "TRÁFICO ALTO · ARCHIVOS DISPERSOS",
    vo: "La tienda resiste, pero soporte sigue buscando respuestas entre miles de documentos.",
    tone: "warn",
    camera: { kind: "push", to: 1.04 },
    sfx: [{ at: 0.3, kind: "riser", volume: 0.16 }],
    visual: <DemandPeak brand={B} />,
  },
  {
    from: 6,
    to: 14,
    label: "DISTRIBUCIÓN",
    onscreen: "AMAZON CLOUDFRONT",
    vo: "CloudFront ayuda a distribuir contenido y disminuir carga sobre el origen, según la configuración.",
    camera: { kind: "pull", from: 1.05 },
    sfx: [
      { at: 0.5, kind: "click" },
      { at: 1.8, kind: "shimmer", volume: 0.16 },
    ],
    visual: <Distribution />,
  },
  {
    from: 14,
    to: 23,
    label: "INGESTA",
    onscreen: "S3 → PROCESAMIENTO → METADATOS",
    vo: "S3 guarda documentos; una canalización los prepara con texto, versiones y metadatos.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 1.0, kind: "click" },
      { at: 2.4, kind: "click", volume: 0.3 },
      { at: 4.0, kind: "tick" },
    ],
    visual: (
      <AbsoluteFill>
        {[0, 1, 2].map((i) => (
          <DocCard key={i} x={110 + i * 26} y={360 + i * 40} w={250} h={300} rotate={-6 + i * 5} title={["Manual_Soporte.pdf", "Pagos_y_cargos.pdf", "Devoluciones.docx"][i]} kind={i === 2 ? "DOCX" : "PDF"} status="none" at={0.1 + i * STAGGER.item} seed={i} fillerLines={4} />
        ))}
        <Note x={240} y={760} text="SOLO FUENTES AUTORIZADAS" at={0.8} />
        <ServiceNode x={640} y={540} w={320} h={120} title="Amazon S3" sub="DOCUMENTOS" icon="storage" brand={B} tone="brand" at={0.6} />
        <ServiceNode x={1060} y={540} w={340} h={120} title="AWS Lambda" sub="EVENTO → PREPARACIÓN" icon="func" brand={B} tone="hero" at={1.8} />
        <Flow from={[420, 540]} to={[480, 540]} at={0.9} color={theme.colors.textDim} packets={2} bend="none" />
        <Flow from={[800, 540]} to={[890, 540]} at={2.0} color={C} packets={3} bend="none" label="EVENTO" />
        <Flow from={[1230, 540]} to={[1300, 540]} at={3.0} color={C} packets={3} bend="none" />
        <ChunkCard
          x={1300}
          y={400}
          w={520}
          source="Pagos_y_cargos.pdf · §4.2"
          text="Cargo capturado sin orden confirmada: verificar en pasarela."
          tags={[
            { k: "texto", v: "extraído", tone: "ok" },
            { k: "fecha", v: "15/01/2025", tone: "neutral" },
            { k: "versión", v: "v3", tone: "neutral" },
            { k: "permisos", v: "PENDIENTE DE VALIDACIÓN", tone: "warn" },
          ]}
          accent={C}
          at={3.4}
        />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "BÚSQUEDA",
    onscreen: "AMAZON OPENSEARCH SERVICE · ÍNDICE",
    vo: "Un índice puede recuperar archivos, pero aún no interpreta todo el lenguaje de una pregunta.",
    camera: { kind: "push", to: 1.04 },
    sfx: [
      { at: 0.9, kind: "typing", volume: 0.22 },
      { at: 2.6, kind: "click" },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={330} y={420} w={420} h={140} title="Amazon OpenSearch Service" sub="ÍNDICE DOCUMENTAL" icon="search" brand={B} tone="hero" at={0.2} titleSize={28} />
        <Note x={330} y={540} text="RESULTADOS DE EJEMPLO · DEMO" at={1.0} />
        <SearchBar x={650} y={290} w={1170} query="politica devoluciones" at={0.7} accent={C} />
        <div style={{ position: "absolute", left: 650, top: 400, display: "flex", flexDirection: "column", gap: 14 }}>
          <ResultRow title="Politica_Devoluciones_v2.pdf" meta="COINCIDENCIA EXACTA · TÍTULO" at={2.4} accent={C} w={1170} highlight />
          <ResultRow title="Manual_Soporte_v3.pdf" meta="COINCIDENCIA EXACTA · SECCIÓN 6" at={2.4 + STAGGER.item} accent={C} w={1170} />
          <ResultRow title="FAQ_envios.docx" meta="COINCIDENCIA PARCIAL" at={2.4 + STAGGER.item * 2} accent={C} w={1170} />
        </div>
        <Note x={1235} y={760} text="DEVUELVE ARCHIVOS · NO UNA RESPUESTA REDACTADA" at={4.4} color={theme.colors.warn} />
      </AbsoluteFill>
    ),
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "ALERTA: LA BÚSQUEDA LITERAL NO BASTA",
    vo: "La pregunta y la política se refieren al mismo incidente, pero no usan las mismas palabras.",
    camera: { kind: "push", to: 1.05 },
    sfx: [
      { at: 0.4, kind: "typing", volume: 0.22 },
      { at: 2.6, kind: "glitch", volume: 0.2 },
    ],
    visual: <LiteralSearchMiss brand={B} variant="aws" />,
  },
];

export const R02Aws: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="R02-AWS" tag="AWS · RONDA 2 · VIDEO 2A" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
