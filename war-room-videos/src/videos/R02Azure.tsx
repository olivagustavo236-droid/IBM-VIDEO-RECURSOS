// VIDEO 2B · R02-AZURE · 40 s — "AZURE · BIBLIOTECA AZUL"
// Idea: Una búsqueda preparada para el futuro asistente RAG.
// Servicios: Azure Front Door / Azure Blob Storage / Azure Functions / Azure AI Search
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { LiteralSearchMiss } from "../shared/Cliffhangers";
import { Flow, Note, ServiceNode } from "../shared/Diagram";
import { ChunkCard, DocCard, StatusPill } from "../shared/Docs";
import { Entrance, STAGGER } from "../shared/motion";
import { DemandPeak } from "../shared/RoundScenes";
import { SearchBar } from "../shared/Search";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { DotMap, Visitors } from "../shared/WorldMap";
import { VideoProps } from "./types";

const B = "azure" as const;
const C = theme.colors.azure;

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 6,
    label: "PICO DE DEMANDA",
    onscreen: "TRÁFICO ALTO · DOCUMENTOS DISPERSOS",
    vo: "No sirve escalar la página si el conocimiento del negocio sigue disperso.",
    tone: "warn",
    camera: { kind: "push", to: 1.04 },
    sfx: [{ at: 0.3, kind: "riser", volume: 0.16 }],
    visual: <DemandPeak brand={B} folders />,
  },
  {
    from: 6,
    to: 14,
    label: "DISTRIBUCIÓN",
    onscreen: "AZURE FRONT DOOR",
    vo: "Front Door puede participar en el enrutamiento global según la arquitectura.",
    camera: { kind: "pull", from: 1.05 },
    sfx: [
      { at: 0.6, kind: "click" },
      { at: 2.8, kind: "click", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: "inset(0 820px 0 0)" }}>
          <DotMap at={0} opacity={0.4} />
          <Visitors target={[1000, 540]} at={0} count={80} color={C} />
        </AbsoluteFill>
        <ServiceNode x={1000} y={540} w={330} h={130} title="Azure Front Door" sub="ENRUTAMIENTO" icon="globe" brand={B} tone="hero" at={0.6} />
        <ServiceNode x={1600} y={400} w={360} h={110} title="Origen A" sub="APP SERVICE" icon="server" brand={B} tone="brand" at={1.6} badge="SALUD: OK" titleSize={26} />
        <ServiceNode x={1600} y={680} w={360} h={110} title="Origen B" sub="SEGÚN DISEÑO" icon="server" brand={B} tone="neutral" at={1.6 + STAGGER.item} badge="SALUD: —" titleSize={26} />
        <Flow from={[1165, 520]} to={[1420, 400]} at={2.6} color={C} packets={4} bend="h" label="RUTA ACTIVA" />
        <Flow from={[1165, 560]} to={[1420, 680]} at={2.9} color={theme.colors.textDim} packets={0} bend="h" dashed label="RUTA ALTERNATIVA" />
        <Note x={1300} y={790} text="TOPOLOGÍA ILUSTRATIVA · FAILOVER REQUIERE CONFIGURACIÓN" at={4.4} color={theme.colors.warn} />
      </AbsoluteFill>
    ),
  },
  {
    from: 14,
    to: 23,
    label: "INGESTA",
    onscreen: "BLOB STORAGE → AZURE FUNCTIONS",
    vo: "Las fuentes se organizan y se preparan: texto, metadatos, fecha y permisos.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 1.0, kind: "click" },
      { at: 2.4, kind: "click", volume: 0.3 },
      { at: 3.6, kind: "tick" },
    ],
    visual: (
      <AbsoluteFill>
        {[0, 1, 2].map((i) => (
          <DocCard key={i} x={110 + i * 26} y={360 + i * 40} w={250} h={300} rotate={-6 + i * 5} title={["Manual_Soporte.pdf", "Pagos_y_cargos.pdf", "Devoluciones.docx"][i]} kind={i === 2 ? "DOCX" : "PDF"} at={0.1 + i * STAGGER.item} seed={i} fillerLines={4} />
        ))}
        <Note x={240} y={760} text="FUENTES AUTORIZADAS" at={0.8} />
        <ServiceNode x={640} y={540} w={330} h={120} title="Blob Storage" sub="FUENTES CONCENTRADAS" icon="storage" brand={B} tone="brand" at={0.6} />
        <ServiceNode x={1060} y={540} w={350} h={120} title="Azure Functions" sub="DISPARA PREPARACIÓN" icon="func" brand={B} tone="hero" at={1.8} />
        <Flow from={[420, 540]} to={[475, 540]} at={0.9} color={theme.colors.textDim} packets={2} bend="none" />
        <Flow from={[805, 540]} to={[885, 540]} at={2.0} color={C} packets={3} bend="none" label="EVENTO" />
        <Flow from={[1235, 540]} to={[1300, 540]} at={3.0} color={C} packets={3} bend="none" />
        <ChunkCard
          x={1300}
          y={400}
          w={520}
          source="Pagos_y_cargos.pdf · §4.2"
          text="Cargo capturado sin orden confirmada: verificar en pasarela."
          tags={[
            { k: "texto", v: "extraído", tone: "ok" },
            { k: "metadatos", v: "título · sección", tone: "neutral" },
            { k: "fecha", v: "15/01/2025", tone: "neutral" },
            { k: "permisos", v: "soporte", tone: "warn" },
          ]}
          accent={C}
          at={3.2}
        />
        <Note x={1560} y={790} text="LA EXTRACCIÓN PUEDE REQUERIR COMPONENTES ADICIONALES" at={4.6} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "BÚSQUEDA",
    onscreen: "AZURE AI SEARCH · FRAGMENTOS",
    vo: "Azure AI Search permite construir el índice que después alimentará un RAG.",
    camera: { kind: "push", to: 1.04 },
    sfx: [
      { at: 0.9, kind: "typing", volume: 0.22 },
      { at: 2.4, kind: "click" },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={330} y={420} w={420} h={140} title="Azure AI Search" sub="ÍNDICE DE FRAGMENTOS" icon="search" brand={B} tone="hero" at={0.2} />
        <Entrance at={1.0} style={{ position: "absolute", left: 160, top: 520 }}>
          <StatusPill status="demo" label="REPRESENTACIÓN · NO ES LA CONSOLA OFICIAL" size={15} at={1.0} />
        </Entrance>
        <SearchBar x={650} y={290} w={1170} query="devolución cargo" at={0.6} accent={C} />
        {[
          { s: "Politica_Devoluciones.pdf · §2", t: "Las devoluciones se solicitan desde el portal de pedidos…", tags: [{ k: "versión", v: "v2" }, { k: "fecha", v: "01/2025" }] },
          { s: "Pagos_y_cargos.pdf · §4.2", t: "Cargo capturado sin orden confirmada: verificar en pasarela…", tags: [{ k: "versión", v: "v3" }, { k: "permisos", v: "soporte" }] },
        ].map((r, i) => (
          <ChunkCard key={i} x={650} y={400 + i * 175} w={1170} source={r.s} text={r.t} tags={r.tags} accent={C} at={2.2 + i * STAGGER.item * 2} score="RESULTADO DE EJEMPLO" />
        ))}
      </AbsoluteFill>
    ),
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "ALERTA: HACE FALTA RECUPERACIÓN SEMÁNTICA",
    vo: "Encontrar un archivo no es lo mismo que entender una necesidad.",
    camera: { kind: "push", to: 1.05 },
    sfx: [
      { at: 0.4, kind: "typing", volume: 0.22 },
      { at: 2.6, kind: "glitch", volume: 0.2 },
    ],
    visual: <LiteralSearchMiss brand={B} variant="azure" />,
  },
];

export const R02Azure: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="R02-AZURE" tag="AZURE · RONDA 2 · VIDEO 2B" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
