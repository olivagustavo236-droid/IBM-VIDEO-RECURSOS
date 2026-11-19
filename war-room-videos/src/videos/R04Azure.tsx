// VIDEO 4B · R04-AZURE · 40 s — "AZURE · RAG AZUL"
// Idea: La arquitectura que preparará la demostración en clase.
// Servicios: Azure AI Search / fragmentación / embeddings / búsqueda híbrida / modelo en Azure o Microsoft Foundry
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { ChatWindow } from "../shared/Chat";
import { ExpiredSource } from "../shared/Cliffhangers";
import { Flow, Note, ServiceNode } from "../shared/Diagram";
import { ChunkCard, DocCard } from "../shared/Docs";
import { fonts } from "../shared/fonts";
import { Entrance, STAGGER } from "../shared/motion";
import { QuestionChat } from "../shared/RoundScenes";
import { ResultRow } from "../shared/Search";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VectorField } from "../shared/Vectors";
import { VideoProps } from "./types";

const B = "azure" as const;
const C = theme.colors.azure;

const ColumnTitle: React.FC<{ x: number; y: number; text: string; at: number; color?: string }> = ({ x, y, text, at, color = theme.colors.textDim }) => (
  <Entrance at={at} style={{ position: "absolute", left: x, top: y }}>
    <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 19, letterSpacing: "0.14em", color }}>{text}</div>
  </Entrance>
);

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 6,
    label: "PREGUNTA",
    onscreen: "PREGUNTA EN LENGUAJE NATURAL",
    vo: "Responder no es adivinar: primero buscamos evidencia de la empresa.",
    camera: { kind: "push", to: 1.04 },
    sfx: [{ at: 0.55, kind: "typing", volume: 0.26 }],
    visual: <QuestionChat brand={B} title="CHAT INTERNO · PROTOTIPO GLOBAL COMMERCE" />,
  },
  {
    from: 6,
    to: 14,
    label: "PREPARACIÓN",
    onscreen: "CHUNKING · METADATOS · EMBEDDINGS",
    vo: "Los documentos se fragmentan y pueden representarse con vectores para encontrar significado.",
    camera: { kind: "pull", from: 1.05 },
    sfx: [
      { at: 1.0, kind: "click" },
      { at: 1.3, kind: "tick" },
      { at: 1.6, kind: "tick" },
      { at: 1.9, kind: "tick" },
      { at: 3.6, kind: "shimmer", volume: 0.18 },
    ],
    visual: (
      <AbsoluteFill>
        <DocCard x={110} y={300} w={330} h={460} kind="MANUAL" title="Manual de Pagos y Cargos" meta="v3" status="vigente" fillerLines={9} at={0.2} />
        {[
          { s: "§4.1", t: "Captura y autorización del cargo" },
          { s: "§4.2", t: "Cargo capturado sin orden confirmada" },
          { s: "§4.3", t: "Conciliación con la pasarela" },
          { s: "§4.4", t: "Reembolsos y plazos" },
        ].map((c, i) => (
          <ChunkCard
            key={i}
            x={520}
            y={286 + i * 132}
            w={560}
            source={`FRAGMENTO ${i + 1} · ${c.s}`}
            text={c.t}
            tags={[
              { k: "v", v: "3", tone: "neutral" },
              { k: "permisos", v: "soporte", tone: "ok" },
            ]}
            accent={C}
            at={1.0 + i * STAGGER.item * 2}
          />
        ))}
        <Flow from={[440, 520]} to={[520, 520]} at={0.9} color={C} packets={2} bend="none" />
        <VectorField x={1160} y={290} w={660} h={460} at={2.4} clusterAt={3.2} color={C} />
        <Flow from={[1080, 520]} to={[1160, 520]} at={2.6} color={C} packets={3} bend="none" label="EMBEDDINGS" />
        <Note x={1490} y={772} text="VECTORES ≈ SIGNIFICADO, NO COPIA EXACTA" at={5.2} />
      </AbsoluteFill>
    ),
  },
  {
    from: 14,
    to: 23,
    label: "RECUPERACIÓN",
    onscreen: "AZURE AI SEARCH → FRAGMENTOS",
    vo: "Combinamos coincidencia textual y similitud semántica cuando la solución está configurada para ello.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 0.4, kind: "click" },
      { at: 3.8, kind: "whoosh", volume: 0.25 },
      { at: 4.4, kind: "tick" },
      { at: 4.6, kind: "tick" },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={300} y={380} w={400} h={140} title="Azure AI Search" sub="BÚSQUEDA HÍBRIDA" icon="search" brand={B} tone="hero" at={0.2} />
        <Note x={300} y={490} text="CONFIGURADA PARA ELLO" at={1.0} color={C} />
        <ColumnTitle x={110} y={570} text="COINCIDENCIA TEXTUAL" at={1.2} />
        <ColumnTitle x={110} y={690} text="SIMILITUD SEMÁNTICA" at={1.6} />
        <Entrance at={1.4} style={{ position: "absolute", left: 110, top: 605, fontFamily: fonts.mono, fontWeight: 700, fontSize: 20, color: theme.colors.text }}>
          “cobraron” · “pedido”
        </Entrance>
        <Entrance at={1.8} style={{ position: "absolute", left: 110, top: 725, fontFamily: fonts.mono, fontWeight: 700, fontSize: 20, color: theme.colors.text }}>
          ≈ “cargo sin orden confirmada”
        </Entrance>
        <ColumnTitle x={780} y={286} text="RANKING HÍBRIDO · DIDÁCTICO" at={3.2} color={C} />
        <div style={{ position: "absolute", left: 780, top: 330, display: "flex", flexDirection: "column", gap: 14 }}>
          <ResultRow title="Manual de Pagos · §4.2 Cargo sin orden" meta="FUENTE · v3 · SECCIÓN 4.2" tag="#1" at={3.8} accent={C} w={1040} highlight />
          <ResultRow title="Manual de Pagos · §4.3 Conciliación" meta="FUENTE · v3 · SECCIÓN 4.3" tag="#2" at={3.8 + STAGGER.item} accent={C} w={1040} />
          <ResultRow title="FAQ Pedidos · ¿Dónde está mi pedido?" meta="FUENTE · v5 · SECCIÓN 1" tag="#3" at={3.8 + STAGGER.item * 2} accent={C} w={1040} />
        </div>
        <Flow from={[500, 380]} to={[780, 380]} at={3.2} color={C} packets={3} bend="h" />
        <Note x={1300} y={720} text="RANKING ILUSTRATIVO · SIN PUNTUACIONES REALES" at={5.4} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "GENERACIÓN",
    onscreen: "MODELO + CONTEXTO → RESPUESTA CITADA",
    vo: "La respuesta se construye con ese contexto y muestra de dónde viene.",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 0.3, kind: "click" },
      { at: 1.6, kind: "typing", volume: 0.18 },
      { at: 3.0, kind: "click" },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={300} y={360} w={400} h={140} title="Modelo en Azure" sub="AZURE · MICROSOFT FOUNDRY" icon="model" brand={B} tone="hero" at={0.2} titleSize={28} />
        <ServiceNode x={300} y={600} w={400} h={120} title="Contexto" sub="CONSULTA + FRAGMENTOS" icon="doc" brand={B} tone="neutral" at={0.5} />
        <Flow from={[300, 540]} to={[300, 430]} at={0.8} color={C} packets={3} bend="v" />
        <Flow from={[500, 360]} to={[620, 420]} at={1.2} color={C} packets={2} bend="h" />
        <ChatWindow
          x={620}
          y={280}
          w={1200}
          h={520}
          accent={C}
          title="CHAT INTERNO · PROTOTIPO"
          at={1.0}
          messages={[
            { role: "user", who: "EMPLEADO", text: "¿Qué hago si me cobraron y no salió pedido?", at: 1.2 },
            {
              role: "assistant",
              text: "1. Confirma la captura del cargo en la pasarela. 2. Si no existe orden, abre un caso de conciliación. 3. Comunica al cliente el plazo de revisión.",
              at: 2.4,
              cite: "Manual de Pagos y Cargos · §4.2 Cargo sin orden confirmada",
              citeTone: "ok",
            },
          ]}
          fontSize={29}
        />
      </AbsoluteFill>
    ),
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "ALERTA: DOCUMENTO VENCIDO",
    vo: "Un RAG sin control de vigencia todavía puede fallar.",
    camera: { kind: "push", to: 1.05 },
    sfx: [
      { at: 0.3, kind: "typing", volume: 0.2 },
      { at: 3.6, kind: "glitch", volume: 0.22 },
    ],
    visual: <ExpiredSource brand={B} citeLabel="Politica_Devoluciones · v1 · §2" />,
  },
];

export const R04Azure: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="R04-AZURE" tag="AZURE · RONDA 4 · VIDEO 4B" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
