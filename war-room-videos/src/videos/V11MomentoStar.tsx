// VIDEO 11 · 11-Momento-STAR · 45 s — "La respuesta que casi arruina la empresa"
// Nota de la biblia: la detección debe presentarse como regla implementada o escena simulada,
// no como capacidad automática inherente.
import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha, theme } from "../theme";
import { ChatWindow } from "../shared/Chat";
import { Note } from "../shared/Diagram";
import { DocCard, StatusPill } from "../shared/Docs";
import { fonts } from "../shared/fonts";
import { CheckRow, ProfileCard, Stamp } from "../shared/Hud";
import { Icon } from "../shared/Icons";
import { Entrance, STAGGER, useClock, useEaseBetween } from "../shared/motion";
import { BigStatement } from "../shared/Opening";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VideoProps } from "./types";

const B = "neutral" as const;

const WarningSign: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const { frame } = useClock();
  const pulse = 0.7 + Math.sin(frame / 5) * 0.3;
  return (
    <Entrance at={at} style={{ position: "absolute", left: x, top: y }} fromScale={0.6}>
      <div style={{ filter: `drop-shadow(0 0 ${30 * pulse}px ${theme.colors.dangerGlow})` }}>
        <Icon kind="warn" size={190} color={theme.colors.danger} stroke={3.2} />
      </div>
    </Entrance>
  );
};

/** Fundido a pantalla negra para la pregunta final. */
const BlackOut: React.FC = () => {
  const k = useEaseBetween(0, 1.2, theme.ease.inOut);
  return <AbsoluteFill style={{ background: theme.colors.black, opacity: 0.82 * k }} />;
};

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 10,
    label: "CONSULTA DE DEVOLUCIÓN",
    onscreen: "EL ASISTENTE PROTOTIPO CITA UNA POLÍTICA",
    vo: "Una respuesta puede sonar perfecta.",
    camera: { kind: "push", to: 1.04 },
    sfx: [
      { at: 0.6, kind: "typing", volume: 0.24 },
      { at: 3.4, kind: "click" },
      { at: 7.0, kind: "shimmer", volume: 0.16 },
    ],
    visual: (
      <AbsoluteFill>
        <ChatWindow
          x={260}
          y={280}
          w={1400}
          h={520}
          accent={theme.colors.neutral}
          title="ASISTENTE DE SOPORTE · PROTOTIPO"
          messages={[
            { role: "user", who: "CLIENTE", text: "Quiero devolver un producto de oferta, ¿cómo lo hago?", at: 0.4 },
            {
              role: "assistant",
              text: "¡Claro! Tienes 30 días naturales para devolverlo con reembolso completo a tu método de pago.",
              at: 3.2,
              cite: "Politica_Devoluciones · v1 · 2024",
              citeTone: "warn",
            },
          ]}
          fontSize={36}
        />
        <Entrance at={7.0} style={{ position: "absolute", left: 1420, top: 250 }}>
          <StatusPill status="vigente" label="RESPUESTA CONVINCENTE" size={18} at={7.0} />
        </Entrance>
      </AbsoluteFill>
    ),
  },
  {
    from: 10,
    to: 20,
    label: "LA FECHA",
    onscreen: "FECHA ANTIGUA · RIESGO DE DECISIÓN INCORRECTA",
    vo: "Si la fuente está vencida, no sirve.",
    tone: "danger",
    headlineTone: "alert",
    camera: { kind: "crash", at: 1.6, x: 820, y: 520, zoom: 1.45, hold: 2.4 },
    sfx: [
      { at: 1.6, kind: "impact" },
      { at: 4.6, kind: "glitch", volume: 0.24 },
    ],
    visual: (
      <AbsoluteFill>
        <DocCard
          x={310}
          y={290}
          w={1000}
          h={500}
          rotate={-1}
          title="Politica_Devoluciones.pdf"
          meta="v1 · DOCUMENTO CITADO POR EL ASISTENTE"
          status="vencido"
          statusAt={2.4}
          lines={["Devoluciones: 30 días naturales · reembolso completo", "Vigencia: 01/03/2024 – 31/12/2024", "Sustituida por v2 (ENE 2025)"]}
          highlight={1}
          highlightAt={1.4}
          highlightColor={theme.colors.danger}
          at={0.2}
          fillerLines={3}
        />
        <WarningSign at={4.4} x={1420} y={330} />
        <Note x={1515} y={570} text="RIESGO: REEMBOLSO INCORRECTO" at={5.2} color={theme.colors.danger} />
        <Note x={1515} y={620} text="POLÍTICA VIGENTE: v2 · 15 DÍAS HÁBILES" at={5.2 + STAGGER.item} />
      </AbsoluteFill>
    ),
  },
  {
    from: 20,
    to: 30,
    label: "AUDITOR",
    onscreen: "REVISIÓN HUMANA · EVIDENCIA INSUFICIENTE",
    vo: "La confianza se construye verificando evidencia, permisos y vigencia.",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 1.2, kind: "stamp" },
      { at: 3.0, kind: "tick" },
      { at: 3.6, kind: "tick" },
      { at: 4.2, kind: "tick" },
      { at: 5.6, kind: "stamp" },
    ],
    visual: (
      <AbsoluteFill>
        <Entrance at={0.1} style={{ position: "absolute", left: 110, top: 290, width: 760 }}>
          <div style={{ padding: "22px 26px", borderRadius: 18, background: alpha(theme.colors.panel, 0.6), border: `2px solid ${theme.colors.line}`, filter: "grayscale(0.6)", opacity: 0.6 }}>
            <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 15, letterSpacing: "0.1em", color: theme.colors.textDim }}>ASISTENTE · PROTOTIPO</div>
            <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 28, marginTop: 8 }}>Tienes 30 días naturales para devolverlo con reembolso completo…</div>
          </div>
        </Entrance>
        <Stamp x={490} y={400} text="RESPUESTA DETENIDA" at={1.2} color={theme.colors.danger} size={50} />
        <ProfileCard x={110} y={530} name="Auditor" role="COMITÉ · CONTROL DE CALIDAD" color={theme.colors.neutral} at={0.6} w={760} icon="human" badge="REVISIÓN HUMANA" badgeColor={theme.colors.warn} />
        <div style={{ position: "absolute", left: 960, top: 290, display: "flex", flexDirection: "column", gap: 16 }}>
          <CheckRow label="Evidencia" icon="doc" at={2.0} resolveAt={3.0} state="fail" stateLabel="INSUFICIENTE" width={860} />
          <CheckRow label="Permisos" icon="lock" at={2.0 + STAGGER.item} resolveAt={3.6} state="ok" stateLabel="CORRECTOS" width={860} />
          <CheckRow label="Vigencia" icon="clock" at={2.0 + STAGGER.item * 2} resolveAt={4.2} state="fail" stateLabel="VENCIDA" width={860} />
        </div>
        <Stamp x={1390} y={690} text="EVIDENCIA RECHAZADA" sub="SE SOLICITA REVISIÓN HUMANA" at={5.6} color={theme.colors.danger} size={44} rotate={-4} />
        <Note x={490} y={700} text="ESCENA SIMULADA · REGLA DE VIGENCIA IMPLEMENTADA" at={6.8} />
      </AbsoluteFill>
    ),
  },
  {
    from: 30,
    to: 45,
    label: "LA PREGUNTA",
    camera: { kind: "push", to: 1.05 },
    sfx: [
      { at: 1.2, kind: "impact", volume: 0.35 },
      { at: 6.0, kind: "shimmer", volume: 0.14 },
    ],
    visual: (
      <AbsoluteFill>
        <BlackOut />
        <BigStatement text="¿Puede una IA ser convincente y estar equivocada?" at={1.2} size={104} y={330} highlight="equivocada" highlightColor={theme.colors.danger} />
        <Entrance at={6.0} style={{ position: "absolute", left: 0, right: 0, top: 720, textAlign: "center" }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.2em", color: theme.colors.textDim }}>EVIDENCIA · PERMISOS · VIGENCIA</div>
        </Entrance>
      </AbsoluteFill>
    ),
  },
];

export const V11MomentoStar: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="11-MOMENTO-STAR" tag="CRISIS · MOMENTO STAR" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
