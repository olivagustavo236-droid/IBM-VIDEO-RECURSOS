// VIDEO 4A · R04-AWS · 40 s — "AWS · RAG NARANJA"
// Idea: El modelo no "sabe"; consulta evidencia antes de responder.
// Servicios: Amazon Bedrock Knowledge Bases / recuperación / modelo compatible / citas y abstención
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { ChatWindow } from "../shared/Chat";
import { ExpiredSource } from "../shared/Cliffhangers";
import { Flow, Note, ServiceNode } from "../shared/Diagram";
import { ChunkCard, DocCard } from "../shared/Docs";
import { Reticle } from "../shared/Hud";
import { STAGGER } from "../shared/motion";
import { QuestionChat } from "../shared/RoundScenes";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VideoProps } from "./types";

const B = "aws" as const;
const C = theme.colors.aws;

const LIBRARY = [
  { s: "Manual de Pagos · §4.2 · v3", t: "Cargo capturado sin orden confirmada…", hit: true },
  { s: "Política de Devoluciones · §2 · v2", t: "Las devoluciones se solicitan desde…", hit: false },
  { s: "Manual de Pagos · §4.3 · v3", t: "Conciliación con la pasarela en 24 h…", hit: true },
  { s: "FAQ de Envíos · §1 · v5", t: "Tiempos de entrega por región…", hit: false },
];

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 6,
    label: "PREGUNTA",
    onscreen: "PREGUNTA EN LENGUAJE NATURAL",
    vo: "No queremos una respuesta improvisada. Necesitamos consultar el procedimiento.",
    camera: { kind: "push", to: 1.04 },
    sfx: [{ at: 0.55, kind: "typing", volume: 0.26 }],
    visual: <QuestionChat brand={B} title="ASISTENTE DE SOPORTE · PROTOTIPO" />,
  },
  {
    from: 6,
    to: 14,
    label: "RECUPERACIÓN",
    onscreen: "AMAZON BEDROCK KNOWLEDGE BASES",
    vo: "La base de conocimiento recupera evidencia relevante antes de generar la respuesta.",
    camera: { kind: "pull", from: 1.05 },
    sfx: [
      { at: 0.8, kind: "click" },
      { at: 3.6, kind: "tick" },
      { at: 4.0, kind: "tick" },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={300} y={420} w={380} h={120} title="Consulta" sub="¿COBRO SIN PEDIDO?" icon="chat" brand={B} tone="neutral" at={0.2} />
        <ServiceNode x={760} y={540} w={420} h={150} title="Bedrock Knowledge Bases" sub="RECUPERACIÓN" icon="search" brand={B} tone="hero" at={0.7} titleSize={28} />
        <Flow from={[490, 420]} to={[550, 540]} at={0.9} color={C} packets={2} bend="h" />
        {LIBRARY.map((d, i) => (
          <ChunkCard
            key={i}
            x={1100}
            y={280 + i * 132}
            w={720}
            source={d.s}
            text={d.t}
            accent={C}
            at={1.6 + i * STAGGER.item}
            glow={false}
            dimAt={d.hit ? undefined : 3.8}
          />
        ))}
        <Flow from={[970, 540]} to={[1100, 330]} at={2.6} color={C} packets={2} bend="h" />
        <Flow from={[970, 540]} to={[1100, 594]} at={2.8} color={C} packets={2} bend="h" />
        <Reticle x={1460} y={330} w={740} h={118} at={3.6} color={C} label="RELEVANTE" />
        <Note x={760} y={680} text="NO SE ENTRENA UN MODELO NUEVO" at={4.8} color={theme.colors.textDim} />
      </AbsoluteFill>
    ),
  },
  {
    from: 14,
    to: 23,
    label: "CONTEXTO",
    onscreen: "FRAGMENTOS + PREGUNTA → MODELO",
    vo: "Solo enviamos fragmentos pertinentes y autorizados al modelo.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 0.4, kind: "click" },
      { at: 3.4, kind: "whoosh", volume: 0.25 },
      { at: 4.2, kind: "impact", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <ChunkCard
          x={110}
          y={290}
          w={720}
          source="Manual de Pagos y Cargos"
          text="§4.2 Cargo capturado sin orden confirmada: verificar la captura en la pasarela antes de reembolsar."
          tags={[
            { k: "título", v: "Manual de Pagos", tone: "neutral" },
            { k: "versión", v: "v3", tone: "ok" },
            { k: "sección", v: "4.2", tone: "neutral" },
          ]}
          accent={C}
          at={0.3}
        />
        <ChunkCard
          x={110}
          y={500}
          w={720}
          source="Manual de Pagos y Cargos"
          text="§4.3 Si no existe orden, abrir caso de conciliación e informar plazo al cliente."
          tags={[
            { k: "versión", v: "v3", tone: "ok" },
            { k: "sección", v: "4.3", tone: "neutral" },
            { k: "ACL", v: "soporte", tone: "ok" },
          ]}
          accent={C}
          at={0.3 + STAGGER.item}
        />
        <ServiceNode x={1080} y={730} w={360} h={110} title="Pregunta" sub="LENGUAJE NATURAL" icon="chat" brand={B} tone="neutral" at={1.4} />
        <ServiceNode x={1560} y={560} w={420} h={160} title="Modelo compatible" sub="AMAZON BEDROCK" icon="model" brand={B} tone="hero" at={3.8} />
        <Flow from={[830, 360]} to={[1350, 540]} at={2.6} color={C} packets={3} bend="h" />
        <Flow from={[830, 580]} to={[1350, 580]} at={2.8} color={C} packets={3} bend="h" />
        <Flow from={[1260, 730]} to={[1460, 640]} at={3.0} color={theme.colors.textDim} packets={2} bend="h" />
        <Note x={1540} y={300} text="METADATOS VISIBLES · SOLO FUENTES AUTORIZADAS" at={5.0} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "RESPUESTA",
    onscreen: "RESPUESTA + FUENTE · DEMO",
    vo: "El modelo redacta una explicación verificable; la cita permite auditarla.",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 0.6, kind: "typing", volume: 0.18 },
      { at: 2.2, kind: "click" },
      { at: 3.0, kind: "whoosh", volume: 0.25 },
    ],
    visual: (
      <AbsoluteFill>
        <ChatWindow
          x={110}
          y={280}
          w={1020}
          h={520}
          accent={C}
          title="ASISTENTE DE SOPORTE · PROTOTIPO · DEMO"
          messages={[
            { role: "user", who: "EMPLEADO", text: "¿Qué hago si me cobraron y no salió pedido?", at: 0.1 },
            {
              role: "assistant",
              text: "1. Verifica la captura del cargo en la pasarela. 2. Si no hay orden, abre un caso de conciliación. 3. Informa al cliente el plazo de revisión.",
              at: 1.0,
              cite: "Manual de Pagos y Cargos · §4.2–4.3 · v3",
              citeTone: "ok",
            },
          ]}
          fontSize={29}
        />
        <DocCard
          x={1220}
          y={300}
          w={600}
          h={460}
          rotate={2}
          kind="MANUAL"
          title="Manual de Pagos y Cargos"
          meta="v3 · SECCIÓN 4.2"
          status="demo"
          lines={["4.2 Cargo capturado sin orden confirmada", "Verificar la captura antes de reembolsar."]}
          highlight={0}
          highlightAt={3.6}
          highlightColor={theme.colors.ok}
          at={3.0}
          fillerLines={4}
        />
        <Note x={1520} y={790} text="DOCUMENTO INVENTADO · SIN AFIRMAR EXACTITUD" at={4.6} />
      </AbsoluteFill>
    ),
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "ALERTA: FUENTE CADUCADA",
    vo: "Una respuesta con cita también puede estar equivocada si la fuente está vencida.",
    camera: { kind: "push", to: 1.05 },
    sfx: [
      { at: 0.3, kind: "typing", volume: 0.2 },
      { at: 3.6, kind: "glitch", volume: 0.22 },
    ],
    visual: <ExpiredSource brand={B} citeLabel="Politica_Devoluciones · v1 · VERSIÓN ANTERIOR" />,
  },
];

export const R04Aws: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="R04-AWS" tag="AWS · RONDA 4 · VIDEO 4A" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
