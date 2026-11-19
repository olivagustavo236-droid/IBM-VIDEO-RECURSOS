// VIDEO 3B · R03-AZURE · 40 s — "AZURE · ESCUDO AZUL"
// Idea: La identidad corporativa acompaña cada búsqueda.
// Servicios: Microsoft Entra ID / Azure RBAC / Azure Key Vault / Azure Monitor / filtro documental en la app
import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha, theme } from "../theme";
import { LegalFragment } from "../shared/Cliffhangers";
import { Flow, Note, ServiceNode } from "../shared/Diagram";
import { ChunkCard } from "../shared/Docs";
import { fonts } from "../shared/fonts";
import { Icon } from "../shared/Icons";
import { Entrance, STAGGER, Typewriter } from "../shared/motion";
import { RoleTest, ThreatQuery } from "../shared/RoundScenes";
import { Shot, ShotTimeline } from "../shared/ShotTimeline";
import { Stage } from "../shared/Stage";
import { VideoProps } from "./types";

const B = "azure" as const;
const C = theme.colors.azure;

/** Inicio de sesión corporativo (ilustrativo, cuenta ficticia). */
const SignIn: React.FC = () => (
  <Entrance at={0.2} style={{ position: "absolute", left: 110, top: 290, width: 560 }}>
    <div style={{ borderRadius: 20, padding: 28, background: theme.colors.panel, border: `2px solid ${C}`, boxShadow: `0 0 50px ${theme.colors.azureGlow}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.display, fontWeight: 800, fontSize: 32 }}>
        <Icon kind="identity" size={44} color={C} /> Microsoft Entra ID
      </div>
      <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 16, color: theme.colors.textDim, letterSpacing: "0.1em", marginTop: 6 }}>INICIO DE SESIÓN · ILUSTRATIVO</div>
      <div style={{ marginTop: 22, height: 62, borderRadius: 12, background: theme.colors.bg, border: `1px solid ${theme.colors.line}`, display: "flex", alignItems: "center", padding: "0 18px", fontFamily: fonts.mono, fontWeight: 700, fontSize: 22 }}>
        <Typewriter text="empleado@globalcommerce.demo" at={0.7} cps={30} />
      </div>
      <div style={{ marginTop: 14, height: 62, borderRadius: 12, background: alpha(C, 0.18), border: `2px solid ${C}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: fonts.display, fontWeight: 900, fontSize: 22, color: C }}>
        <Icon kind="check" size={26} color={C} stroke={4.5} /> SESIÓN INICIADA
      </div>
    </div>
  </Entrance>
);

const SHOTS: Shot[] = [
  {
    from: 0,
    to: 6,
    label: "AMENAZA",
    onscreen: "CONSULTA NO AUTORIZADA",
    vo: "Un documento correcto puede ser peligroso en manos de un usuario incorrecto.",
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
    onscreen: "ENTRA ID · RBAC · KEY VAULT · MONITOR",
    vo: "Azure puede autenticar, administrar secretos y observar eventos, según configuración.",
    camera: { kind: "pull", from: 1.05 },
    sfx: [
      { at: 0.7, kind: "typing", volume: 0.2 },
      { at: 2.4, kind: "click" },
      { at: 2.9, kind: "click", volume: 0.3 },
      { at: 3.4, kind: "click", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <SignIn />
        <ServiceNode x={1000} y={360} w={420} h={120} title="Azure RBAC" sub="PERMISOS A RECURSOS" icon="lock" brand={B} tone="brand" at={2.3} />
        <ServiceNode x={1000} y={520} w={420} h={120} title="Azure Key Vault" sub="SECRETOS Y CLAVES" icon="key" brand={B} tone="brand" at={2.3 + STAGGER.block * 2} />
        <ServiceNode x={1000} y={680} w={420} h={120} title="Azure Monitor" sub="EVENTOS Y ALERTAS" icon="monitor" brand={B} tone="brand" at={2.3 + STAGGER.block * 4} />
        <Flow from={[670, 460]} to={[790, 360]} at={2.4} color={C} packets={2} bend="h" />
        <Flow from={[670, 500]} to={[790, 520]} at={2.7} color={C} packets={2} bend="h" />
        <Flow from={[670, 540]} to={[790, 680]} at={3.0} color={C} packets={2} bend="h" />
        <Entrance at={4.4} style={{ position: "absolute", left: 1290, top: 380, width: 530 }}>
          <div style={{ padding: "22px 26px", borderRadius: 16, border: `2px dashed ${theme.colors.warn}`, fontFamily: fonts.display, fontWeight: 800, fontSize: 30, lineHeight: 1.2 }}>
            RBAC de recursos
            <div style={{ color: theme.colors.warn, fontSize: 44, margin: "6px 0" }}>≠</div>
            permiso al contenido de cada documento
          </div>
        </Entrance>
      </AbsoluteFill>
    ),
  },
  {
    from: 14,
    to: 23,
    label: "FILTRADO",
    onscreen: "FILTRO DE SEGURIDAD EN LA CONSULTA",
    vo: "La aplicación transmite el contexto de autorización y excluye fragmentos restringidos.",
    camera: { kind: "drift", dx: 40 },
    sfx: [
      { at: 1.4, kind: "typing", volume: 0.2 },
      { at: 3.8, kind: "stamp", volume: 0.35 },
      { at: 4.2, kind: "stamp", volume: 0.3 },
    ],
    visual: (
      <AbsoluteFill>
        <ServiceNode x={290} y={340} w={360} h={110} title="Identidad" sub="GRUPO: CLIENTES" icon="identity" brand={B} tone="neutral" at={0.2} />
        <ServiceNode x={290} y={560} w={360} h={130} title="Aplicación" sub="CONTEXTO DE AUTORIZACIÓN" icon="shield" brand={B} tone="hero" at={0.7} titleSize={28} />
        <Flow from={[290, 395]} to={[290, 495]} at={0.5} color={C} packets={2} bend="v" />
        <Entrance at={1.2} style={{ position: "absolute", left: 600, top: 290, width: 1220 }}>
          <div style={{ borderRadius: 14, padding: "16px 22px", background: theme.colors.bg, border: `2px solid ${alpha(C, 0.6)}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: theme.colors.text }}>
            <span style={{ color: theme.colors.textDim }}>AZURE AI SEARCH · consulta </span>
            <Typewriter text={"search='reembolso'  $filter=grupos/any(g: g eq 'clientes')"} at={1.4} cps={40} />
          </div>
        </Entrance>
        <ChunkCard x={600} y={400} w={1220} source="POLITICA_PUBLICA · §7.3" text="Reversión del cargo cuando no exista orden confirmada." tags={[{ k: "grupos", v: "clientes", tone: "ok" }]} accent={C} at={2.6} glow />
        <ChunkCard x={600} y={540} w={1220} source="PROCEDIMIENTO_INTERNO · §2" text="Escalar a conciliación interna en 24 h." tags={[{ k: "grupos", v: "soporte", tone: "danger" }]} accent={C} at={2.6 + STAGGER.item} lockAt={3.8} />
        <ChunkCard x={600} y={680} w={1220} source="CONTRATO_ANDINA · §9" text="Descuento negociado con proveedor: ██ %" tags={[{ k: "grupos", v: "compras", tone: "danger" }]} accent={C} at={2.6 + STAGGER.item * 2} lockAt={4.2} />
        <Flow from={[470, 560]} to={[600, 330]} at={1.0} color={C} packets={0} bend="h" />
        <Note x={290} y={660} text="FILTRO DEFINIDO POR LA APP" at={5.0} color={C} />
      </AbsoluteFill>
    ),
  },
  {
    from: 23,
    to: 32,
    label: "PRUEBA",
    onscreen: "FUENTES PERMITIDAS · PRUEBA FICTICIA",
    vo: "La respuesta no puede citar un documento que el usuario no tiene permitido consultar.",
    camera: { kind: "push", to: 1.03 },
    sfx: [
      { at: 1.2, kind: "click" },
      { at: 2.0, kind: "click", volume: 0.3 },
      { at: 3.2, kind: "stamp", volume: 0.4 },
    ],
    visual: <RoleTest brand={B} managerLabel="Administrador" showDenied />,
  },
  {
    from: 32,
    to: 40,
    label: "GANCHO COMÚN",
    onscreen: "SIGUIENTE RETO: RESPONDER CON EVIDENCIA",
    vo: "Los accesos están controlados. Falta convertir evidencia en una respuesta entendible.",
    camera: { kind: "push", to: 1.05 },
    sfx: [{ at: 1.2, kind: "typing", volume: 0.22 }],
    visual: <LegalFragment brand={B} question="¿Qué hago si ya me cobraron?" />,
  },
];

export const R03Azure: React.FC<VideoProps> = ({ bgm }) => (
  <Stage brand={B} videoId="R03-AZURE" tag="AZURE · RONDA 3 · VIDEO 3B" bgm={bgm}>
    <ShotTimeline brand={B} shots={SHOTS} />
  </Stage>
);
