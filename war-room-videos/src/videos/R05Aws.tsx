// VIDEO 5A · R05-AWS · 40 s — "AWS · AUDITORÍA NARANJA"
// Idea: Medir primero, escalar después.
// Servicios: evaluación de recuperación y respuestas / telemetría / presupuestos / revisión humana
import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha, theme } from "../theme";
import { ChatWindow } from "../shared/Chat";
import { ScoreAndDossier } from "../shared/Cliffhangers";
import { Flow, Note } from "../shared/Diagram";
import { ChunkCard } from "../shared/Docs";
import { fonts } from "../shared/fonts";
import { MetricTile, ProfileCard } from "../shared/Hud";
import { Entrance, STAGGER } from "../shared/motion";
import { AcceptanceTests, FailedTest } from "../shared/RoundScenes";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VideoProps } from "./types";

const B = "aws" as const;
const C = theme.colors.aws;

const makeShots = (votes: VideoProps["votes"]): Shot[] => [
  {
    from: 0,
    to: 6,
    label: "PRUEBA FALLIDA",
    onscreen: "FALLO DE CALIDAD · DOCUMENTO VENCIDO",
    vo: "Una respuesta persuasiva no es suficiente si cita una política inválida.",
    tone: "danger",
    camera: { kind: "push", to: 1.04 },
    sfx: [{ at: 2.6, kind: "stamp" }],
    visual: <FailedTest brand={B} variant="aws" />,
  },
  {
    from: 6,
    to: 14,
    label: "PRUEBAS",
    onscreen: "EVIDENCIA · SEGURIDAD · ABSTENCIÓN · VIGENCIA",
    vo: "Definimos pruebas antes de decidir si el sistema está listo.",
    camera: { kind: "pull", from: 1.04 },
    sfx: [
      { at: 0.4, kind: "click" },
      { at: 0.56, kind: "click", volume: 0.3 },
      { at: 0.72, kind: "click", volume: 0.25 },
      { at: 0.88, kind: "click", volume: 0.2 },
    ],
    visual: <AcceptanceTests variant="aws" />,
  },
  {
    from: 14,
    to: 23,
    label: "TELEMETRÍA",
    onscreen: "LATENCIA · COSTO · CITAS · ERRORES",
    vo: "Monitorear significa detectar fallas, gastos y degradación de recuperación.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 0.4, kind: "tick" },
      { at: 0.6, kind: "tick" },
      { at: 0.8, kind: "tick" },
      { at: 1.0, kind: "tick" },
    ],
    visual: (
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 110, top: 290, display: "grid", gridTemplateColumns: "repeat(4, 410px)", gap: 22 }}>
          <MetricTile label="LATENCIA" unit="ms" at={0.3} accent={C} icon="clock" w={410} seed={1} />
          <MetricTile label="COSTO / CONSULTA" unit="USD" at={0.3 + STAGGER.item} accent={C} icon="coin" w={410} seed={2} />
          <MetricTile label="CITAS VERIFICABLES" unit="%" at={0.3 + STAGGER.item * 2} accent={C} icon="doc" w={410} seed={3} />
          <MetricTile label="ERRORES / ALERTAS" at={0.3 + STAGGER.item * 3} accent={C} icon="warn" w={410} seed={4} />
        </div>
        <Entrance at={2.4} style={{ position: "absolute", left: 110, top: 560, width: 1710 }}>
          <div style={{ padding: "20px 26px", borderRadius: 16, background: theme.colors.panel, border: `2px solid ${alpha(C, 0.35)}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.mono, fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: theme.colors.textDim }}>
              <span>PRESUPUESTO DEL PILOTO</span>
              <span>UMBRAL DE ALERTA: POR DEFINIR</span>
            </div>
            <div style={{ marginTop: 14, height: 24, borderRadius: 12, background: alpha(theme.colors.text, 0.06), border: `2px dashed ${alpha(C, 0.45)}` }} />
          </div>
        </Entrance>
        <Note x={960} y={760} text="SIN VALORES INVENTADOS · SE MIDEN DURANTE EL PILOTO" at={3.6} color={theme.colors.warn} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "CONTROL",
    onscreen: "REVISIÓN HUMANA ACTIVADA",
    vo: "Actualizamos el índice y enviamos los casos dudosos a revisión.",
    tone: "ok",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 1.4, kind: "whoosh", volume: 0.3 },
      { at: 3.6, kind: "click" },
      { at: 5.0, kind: "shimmer", volume: 0.18 },
    ],
    visual: (
      <AbsoluteFill>
        <Entrance at={0.1} style={{ position: "absolute", left: 110, top: 284 }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 19, letterSpacing: "0.14em", color: theme.colors.textDim }}>ÍNDICE DE FUENTES</div>
        </Entrance>
        <ChunkCard x={110} y={320} w={760} source="Politica_Devoluciones · v2 · VIGENTE" text="Devoluciones: 15 días hábiles." tags={[{ k: "estado", v: "vigente", tone: "ok" }]} accent={C} at={0.2} />
        <ChunkCard x={110} y={480} w={760} source="Manual_Devoluciones · v1 · VENCIDO" text="Devoluciones: 30 días naturales." tags={[{ k: "estado", v: "retirado del índice", tone: "danger" }]} accent={theme.colors.danger} at={0.3} dimAt={1.4} />
        <Note x={490} y={640} text="FUENTE VENCIDA RETIRADA DEL ÍNDICE" at={1.8} color={theme.colors.danger} />
        <ChatWindow
          x={980}
          y={284}
          w={840}
          h={300}
          accent={C}
          title="CONSULTA SENSIBLE"
          at={2.2}
          messages={[{ role: "assistant", text: "Confianza insuficiente en la evidencia. Caso enviado a revisión humana.", at: 2.6, tone: "warn" }]}
          fontSize={28}
        />
        <Flow from={[1400, 584]} to={[1400, 640]} at={3.4} color={theme.colors.ok} packets={2} bend="v" />
        <ProfileCard x={1130} y={650} name="Revisor humano" role="SOPORTE NIVEL 2" color={theme.colors.ok} at={3.6} w={560} icon="human" badge="ASIGNADO" />
        <Note x={490} y={700} text="SIN CURACIÓN AUTOMÁTICA FINGIDA" at={4.6} />
      </AbsoluteFill>
    ),
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "EXPEDIENTE CORPORATIVO: CONFIDENCIAL",
    vo: "La competencia terminó. Ahora falta revisar qué necesita integrar esta empresa.",
    camera: { kind: "push", to: 1.05 },
    sfx: [{ at: 2.8, kind: "stamp" }],
    visual: <ScoreAndDossier brand={B} votes={votes} />,
  },
];

export const R05Aws: React.FC<VideoProps> = ({ bgm, votes }) => (
  <Stage brand={B} videoId="R05-AWS" tag="AWS · RONDA 5 · VIDEO 5A" bgm={bgm}>
    <ShotTimeline brand={B} shots={makeShots(votes)} />
  </Stage>
);
