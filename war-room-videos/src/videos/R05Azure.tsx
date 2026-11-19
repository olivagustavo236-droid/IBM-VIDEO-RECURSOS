// VIDEO 5B · R05-AZURE · 40 s — "AZURE · AUDITORÍA AZUL"
// Idea: Un asistente usable, no solo una demo bonita.
// Servicios: evaluación del RAG / control de documentos / monitorización / costos / revisión humana
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { ChatWindow } from "../shared/Chat";
import { ScoreAndDossier } from "../shared/Cliffhangers";
import { Note } from "../shared/Diagram";
import { DocCard } from "../shared/Docs";
import { MetricTile } from "../shared/Hud";
import { STAGGER } from "../shared/motion";
import { AcceptanceTests, FailedTest } from "../shared/RoundScenes";
import { LogLines } from "../shared/Search";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VideoProps } from "./types";

const B = "azure" as const;
const C = theme.colors.azure;

const makeShots = (votes: VideoProps["votes"]): Shot[] => [
  {
    from: 0,
    to: 6,
    label: "PRUEBA FALLIDA",
    onscreen: "ALERTA: FUENTE VENCIDA",
    vo: "El riesgo no es que el sistema se quede callado; es que se equivoque con seguridad.",
    tone: "danger",
    camera: { kind: "push", to: 1.04 },
    sfx: [{ at: 2.4, kind: "click" }],
    visual: <FailedTest brand={B} variant="azure" />,
  },
  {
    from: 6,
    to: 14,
    label: "PRUEBAS",
    onscreen: "PRUEBAS DE ACEPTACIÓN · PILOTO",
    vo: "Evaluamos respuestas y documentos, no solo la fluidez del modelo.",
    camera: { kind: "pull", from: 1.04 },
    sfx: [
      { at: 0.4, kind: "click" },
      { at: 2.4, kind: "tick" },
      { at: 3.2, kind: "tick" },
    ],
    visual: <AcceptanceTests variant="azure" />,
  },
  {
    from: 14,
    to: 23,
    label: "GOBIERNO",
    onscreen: "TRAZABILIDAD · COSTO · VERSIONES",
    vo: "Cada respuesta debe poder revisarse y cada costo debe poder explicarse.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 0.4, kind: "tick" },
      { at: 0.6, kind: "tick" },
      { at: 2.0, kind: "click" },
    ],
    visual: (
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 110, top: 290, display: "flex", flexDirection: "column", gap: 22 }}>
          <MetricTile label="LATENCIA" unit="ms" at={0.3} accent={C} icon="clock" w={520} h={230} seed={1} />
          <MetricTile label="GASTOS DEL PILOTO" unit="USD" at={0.3 + STAGGER.item} accent={C} icon="coin" w={520} h={230} seed={2} />
        </div>
        <LogLines
          x={680}
          y={290}
          w={560}
          title="FUENTES VERSIONADAS"
          accent={C}
          at={1.4}
          lines={["Politica_Devoluciones · v2 · vigente", "Politica_Devoluciones · v1 · vencida", "Manual_Pagos · v3 · vigente", "FAQ_Envios · v5 · vigente"]}
          every={0.35}
        />
        <LogLines
          x={1270}
          y={290}
          w={550}
          title="AUDITORÍA DE RESPUESTAS"
          accent={C}
          at={2.0}
          lines={["consulta #0142 · fuentes: 2 · citada", "consulta #0143 · abstención", "consulta #0144 · fuente vencida", "consulta #0145 · revisión humana"]}
          every={0.4}
        />
        <Note x={1250} y={700} text="DASHBOARD ILUSTRATIVO · MÉTRICAS SIN CIFRAS VERIFICADAS" at={4.2} color={theme.colors.warn} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "CONTROL",
    onscreen: "ABSTENCIÓN + REVISIÓN",
    vo: "En asuntos sensibles, abstenerse y escalar es una decisión correcta.",
    tone: "ok",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 1.2, kind: "stamp", volume: 0.35 },
      { at: 2.4, kind: "typing", volume: 0.16 },
      { at: 4.6, kind: "shimmer", volume: 0.18 },
    ],
    visual: (
      <AbsoluteFill>
        <DocCard
          x={110}
          y={290}
          w={560}
          h={460}
          rotate={-2}
          title="Politica_Devoluciones.pdf"
          meta="v1 · VIGENCIA HASTA 31/12/2024"
          status="pendiente"
          statusAt={1.2}
          lines={["Devoluciones: 30 días naturales", "Regla: vigencia vencida → no citar"]}
          highlight={1}
          highlightAt={1.4}
          at={0.2}
          fillerLines={4}
        />
        <Note x={390} y={770} text="MARCADO PARA ACTUALIZACIÓN · REGLA CONFIGURADA" at={1.8} color={theme.colors.warn} />
        <ChatWindow
          x={760}
          y={290}
          w={1060}
          h={460}
          accent={C}
          title="CHAT INTERNO · PROTOTIPO"
          at={0.6}
          messages={[
            { role: "user", who: "EMPLEADO", text: "¿Aplica la devolución de 30 días a este pedido?", at: 0.9 },
            { role: "system", who: "SISTEMA", text: "Requiere revisión humana: la fuente disponible está vencida.", at: 3.0, tone: "ok", icon: "human" },
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
    onscreen: "EXPEDIENTE CORPORATIVO: CONFIDENCIAL",
    vo: "La decisión final no depende solo del marcador: hay requisitos de integración.",
    camera: { kind: "push", to: 1.05 },
    sfx: [
      { at: 2.8, kind: "stamp" },
      { at: 4.6, kind: "whoosh", volume: 0.25 },
    ],
    visual: <ScoreAndDossier brand={B} votes={votes} openAt={4.6} />,
  },
];

export const R05Azure: React.FC<VideoProps> = ({ bgm, votes }) => (
  <Stage brand={B} videoId="R05-AZURE" tag="AZURE · RONDA 5 · VIDEO 5B" bgm={bgm}>
    <ShotTimeline brand={B} shots={makeShots(votes)} />
  </Stage>
);
