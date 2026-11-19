// VIDEO 3A · R03-AWS · 40 s — "AWS · ESCUDO NARANJA"
// Idea: Ningún fragmento privado llega al modelo por error.
// Servicios: AWS IAM / AWS KMS / AWS CloudTrail / autorización documental en la aplicación
import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { LegalFragment } from "../shared/Cliffhangers";
import { Flow, Note, ServiceNode } from "../shared/Diagram";
import { ChunkCard } from "../shared/Docs";
import { ProfileCard } from "../shared/Hud";
import { STAGGER } from "../shared/motion";
import { RoleTest, ThreatQuery } from "../shared/RoundScenes";
import { LogLines } from "../shared/Search";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VideoProps } from "./types";

const B = "aws" as const;
const C = theme.colors.aws;

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 6,
    label: "AMENAZA",
    onscreen: "CONSULTA NO AUTORIZADA",
    vo: "Un asistente rápido que filtra datos privados no es una solución: es un incidente.",
    tone: "danger",
    camera: { kind: "push", to: 1.04 },
    sfx: [
      { at: 0.6, kind: "typing", volume: 0.22 },
      { at: 1.8, kind: "alert", volume: 0.2 },
    ],
    visual: <ThreatQuery brand={B} question="¿Qué descuento confidencial le dan al proveedor Andina?" />,
  },
  {
    from: 6,
    to: 14,
    label: "IDENTIDAD",
    onscreen: "IAM · KMS · CLOUDTRAIL",
    vo: "IAM gestiona permisos a recursos; KMS protege claves; CloudTrail registra actividad compatible.",
    camera: { kind: "pull", from: 1.05 },
    sfx: [
      { at: 0.4, kind: "click" },
      { at: 0.4 + STAGGER.block * 3, kind: "click", volume: 0.3 },
      { at: 0.4 + STAGGER.block * 6, kind: "click", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={380} y={400} w={500} h={130} title="AWS IAM" sub="PERMISOS A RECURSOS" icon="identity" brand={B} tone="hero" at={0.3} />
        <ServiceNode x={960} y={400} w={500} h={130} title="AWS KMS" sub="PROTECCIÓN DE CLAVES" icon="key" brand={B} tone="brand" at={0.3 + STAGGER.block * 3} />
        <ServiceNode x={1540} y={400} w={500} h={130} title="AWS CloudTrail" sub="RUTA DE AUDITORÍA" icon="audit" brand={B} tone="brand" at={0.3 + STAGGER.block * 6} />
        <LogLines
          x={130}
          y={510}
          w={500}
          title="POLÍTICA (ILUSTRATIVA)"
          accent={C}
          at={1.8}
          lines={["rol: soporte-app", "permite: s3:GetObject", "recurso: bucket-docs/*", "≠ filtrar fragmentos"]}
        />
        <LogLines x={710} y={510} w={500} title="CIFRADO" accent={C} at={2.6} lines={["clave: kms/docs-gc", "uso: cifrar objetos", "rotación: según política"]} />
        <LogLines
          x={1290}
          y={510}
          w={500}
          title="EVENTOS REGISTRADOS"
          accent={C}
          at={3.4}
          lines={["10:42 GetObject · soporte-app", "10:42 Decrypt · kms/docs-gc", "10:43 AssumeRole · soporte", "10:43 GetObject · soporte-app"]}
        />
        <Note x={960} y={790} text="IAM NO FILTRA RESULTADOS DEL ASISTENTE AUTOMÁTICAMENTE" at={5.4} color={theme.colors.warn} />
      </AbsoluteFill>
    ),
  },
  {
    from: 14,
    to: 23,
    label: "FILTRADO",
    onscreen: "ACL DOCUMENTAL · FILTRADO PREVIO",
    vo: "La autorización documental se aplica antes de enviar contexto al modelo.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 1.2, kind: "click" },
      { at: 3.6, kind: "stamp", volume: 0.35 },
      { at: 4.0, kind: "stamp", volume: 0.3 },
      { at: 5.6, kind: "shimmer", volume: 0.16 },
    ],
    visual: (
      <AbsoluteFill>
        <ProfileCard x={110} y={300} name="Usuario" role="ROL: CLIENTE" color={theme.colors.textDim} at={0.2} w={340} />
        <ServiceNode x={290} y={560} w={360} h={130} title="Aplicación" sub="AUTORIZACIÓN DOCUMENTAL" icon="shield" brand={B} tone="hero" at={0.8} titleSize={28} />
        <Flow from={[280, 410]} to={[290, 495]} at={0.6} color={theme.colors.textDim} packets={2} bend="v" />
        <ChunkCard x={640} y={290} w={640} source="POLITICA_PUBLICA · §7.3" text="Reversión del cargo cuando no exista orden confirmada." tags={[{ k: "ACL", v: "público", tone: "ok" }]} accent={C} at={1.6} />
        <ChunkCard x={640} y={450} w={640} source="PROCEDIMIENTO_INTERNO · §2" text="Escalar a conciliación interna en 24 h." tags={[{ k: "ACL", v: "interno", tone: "danger" }]} accent={C} at={1.6 + STAGGER.item} lockAt={3.6} />
        <ChunkCard x={640} y={610} w={640} source="CONTRATO_ANDINA · §9" text="Descuento negociado con proveedor: ██ %" tags={[{ k: "ACL", v: "compras", tone: "danger" }]} accent={C} at={1.6 + STAGGER.item * 2} lockAt={4.0} />
        <Flow from={[470, 560]} to={[640, 340]} at={1.4} color={C} packets={0} bend="h" />
        <ServiceNode x={1610} y={350} w={380} h={130} title="Modelo" sub="SOLO CONTEXTO PERMITIDO" icon="model" brand={B} tone="neutral" at={4.6} />
        <Flow from={[1280, 350]} to={[1420, 350]} at={5.0} color={C} packets={3} bend="none" label="CONTEXTO" />
        <Note x={1610} y={470} text="FILTRO ANTES DE RECUPERAR FUENTES" at={5.8} color={C} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "PRUEBA",
    onscreen: "PRUEBA DE ROLES · SIMULACIÓN",
    vo: "Cada usuario obtiene únicamente la evidencia que le corresponde.",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 1.2, kind: "click" },
      { at: 2.0, kind: "click", volume: 0.3 },
      { at: 2.6, kind: "click", volume: 0.3 },
    ],
    visual: <RoleTest brand={B} managerLabel="Gerente de soporte" />,
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "SIGUIENTE RETO: RESPONDER CON EVIDENCIA",
    vo: "Ya controlamos quién puede leer. Ahora falta explicar sin inventar.",
    camera: { kind: "push", to: 1.05 },
    sfx: [{ at: 1.2, kind: "typing", volume: 0.22 }],
    visual: <LegalFragment brand={B} question="¿Me lo explicas fácil? ¿Qué hago?" />,
  },
];

export const R03Aws: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="R03-AWS" tag="AWS · RONDA 3 · VIDEO 3A" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
