// Ganchos comunes: cada pareja AWS/Azure termina en el MISMO fotograma conceptual
// (biblia: "Mismo último fotograma conceptual que AWS"). Aquí viven las escenas compartidas.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Brand, brandColor, theme } from "../theme";
import { ChatWindow } from "./Chat";
import { Flow, Note } from "./Diagram";
import { ChunkCard, DocCard } from "./Docs";
import { fonts } from "./fonts";
import { Dossier, Reticle, Scoreboard, Vote } from "./Hud";
import { Icon } from "./Icons";
import { Entrance, useSpringAt } from "./motion";

/** R01 · Tres PDF con el mismo nombre y versiones distintas + pregunta del cliente. */
export const ThreePoliciesConflict: React.FC<{ brand: Brand; question: string }> = ({ brand, question }) => (
  <AbsoluteFill>
    {[
      { v: "v1 · MAR 2024", l: ["Devoluciones: 30 días naturales", "Reembolso al método de pago"], r: -6 },
      { v: "v2 · ENE 2025", l: ["Devoluciones: 15 días hábiles", "Reembolso en saldo de tienda"], r: 1 },
      { v: "v3 · JUN 2025 (BORRADOR)", l: ["Ofertas: sin devolución", "Aplica a todo el catálogo"], r: 7 },
    ].map((d, i) => (
      <DocCard
        key={i}
        x={150 + i * 330}
        y={290 + (i === 1 ? -14 : 10)}
        w={360}
        h={440}
        rotate={d.r}
        title="Politica_Devoluciones.pdf"
        meta={d.v}
        status="conflicto"
        statusAt={1.4 + i * 0.25}
        lines={d.l}
        highlight={0}
        highlightAt={1.6 + i * 0.25}
        at={0.15 + i * 0.18}
        seed={i}
        fillerLines={6}
      />
    ))}
    <ChatWindow
      x={1250}
      y={320}
      w={580}
      h={330}
      accent={brandColor(brand)}
      title="SOPORTE · CONSULTA ENTRANTE"
      messages={[{ role: "user", who: "CLIENTE", text: question, at: 1.8 }]}
      fontSize={30}
    />
    <Reticle x={480 + 165} y={510} w={1060} h={480} at={4.4} color={theme.colors.danger} label="3 VERSIONES · 1 NOMBRE" />
  </AbsoluteFill>
);

/** R02 · La pregunta coloquial no coincide literalmente con el manual. */
export const LiteralSearchMiss: React.FC<{ brand: Brand; variant: "aws" | "azure" }> = ({ brand, variant }) => {
  const c = brandColor(brand);
  return (
    <AbsoluteFill>
      <ChatWindow
        x={110}
        y={290}
        w={760}
        h={300}
        accent={c}
        title="EMPLEADO DE SOPORTE · BÚSQUEDA"
        messages={[{ role: "user", who: "EMPLEADO", text: "me cobraron pero no tengo pedido", at: 0.3 }]}
        fontSize={34}
      />
      <SearchBox
        x={110}
        y={620}
        w={760}
        query={variant === "aws" ? "“me cobraron pero no tengo pedido”" : "“me cobraron pero no tengo pedido”"}
        result={variant === "aws" ? "0 COINCIDENCIAS EXACTAS" : "RESULTADOS POR TÍTULO · SIN RESPUESTA"}
        at={1.6}
        resultAt={2.6}
      />
      <DocCard
        x={1210}
        y={286}
        w={600}
        h={470}
        rotate={2}
        kind="MANUAL"
        title="Manual de Pagos y Cargos"
        meta="SECCIÓN 4.2 · v3"
        status="vigente"
        lines={["4.2 Cargo capturado sin orden confirmada", "Verificar captura en pasarela antes de reembolsar."]}
        highlight={0}
        highlightAt={3.2}
        highlightColor={theme.colors.warn}
        at={0.6}
        fillerLines={5}
      />
      <Flow from={[880, 430]} to={[1200, 420]} at={3.4} draw={0.7} color={theme.colors.warn} dashed packets={0} bend="h" label="¿MISMO INCIDENTE?" />
      <Note x={1040} y={800} text="PALABRAS DISTINTAS · MISMO SIGNIFICADO" at={4.4} color={theme.colors.warn} />
    </AbsoluteFill>
  );
};

const SearchBox: React.FC<{ x: number; y: number; w: number; query: string; result: string; at: number; resultAt: number }> = ({ x, y, w, query, result, at, resultAt }) => {
  const p = useSpringAt(at, theme.spring.snappy);
  const r = useSpringAt(resultAt, theme.spring.bouncy);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 20}px)` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          height: 76,
          borderRadius: 16,
          padding: "0 24px",
          background: theme.colors.panel,
          border: `2px solid ${theme.colors.line}`,
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 24,
          color: theme.colors.text,
        }}
      >
        <Icon kind="search" size={34} color={theme.colors.textDim} />
        {query}
      </div>
      <div
        style={{
          marginTop: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 16px",
          borderRadius: 10,
          border: `2px solid ${theme.colors.danger}`,
          color: theme.colors.danger,
          fontFamily: fonts.mono,
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: "0.08em",
          opacity: Math.min(1, r),
          transform: `scale(${0.7 + 0.3 * Math.min(1, r)})`,
          transformOrigin: "left center",
        }}
      >
        <Icon kind="x" size={24} color={theme.colors.danger} stroke={4.5} />
        {result}
      </div>
    </div>
  );
};

/** R03 · Un único fragmento autorizado en lenguaje legal + petición de explicación sencilla. */
export const LegalFragment: React.FC<{ brand: Brand; question: string }> = ({ brand, question }) => {
  const c = brandColor(brand);
  return (
    <AbsoluteFill>
      <ChunkCard
        x={110}
        y={300}
        w={900}
        source="POLITICA_PAGOS_PUBLICA.pdf · §7.3 · AUTORIZADO"
        text="Conforme a la cláusula 7.3, la reversión del cargo procederá únicamente cuando la captura del importe no derive en una orden confirmada dentro del plazo de conciliación establecido en el anexo C, sujeto a la verificación de la pasarela."
        tags={[
          { k: "ACL", v: "público", tone: "ok" },
          { k: "versión", v: "v4", tone: "neutral" },
        ]}
        accent={c}
        at={0.2}
        glow
      />
      <Note x={560} y={640} text="LENGUAJE LEGAL COMPLEJO" at={1.6} color={theme.colors.warn} />
      <ChatWindow x={1090} y={300} w={720} h={300} accent={c} title="CLIENTE · CHAT" messages={[{ role: "user", who: "CLIENTE", text: question, at: 1.2 }]} fontSize={32} />
      <Entrance at={3.6} style={{ position: "absolute", left: 1090, top: 640 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.display, fontWeight: 800, fontSize: 30, color: theme.colors.textDim }}>
          <Icon kind="model" size={40} color={c} /> ¿Explicar sin inventar?
        </div>
      </Entrance>
    </AbsoluteFill>
  );
};

/** R04 · Segunda consulta recupera una política caducada (cita "versión anterior"). */
export const ExpiredSource: React.FC<{ brand: Brand; citeLabel: string }> = ({ brand, citeLabel }) => {
  const c = brandColor(brand);
  return (
    <AbsoluteFill>
      <ChatWindow
        x={110}
        y={280}
        w={940}
        h={500}
        accent={c}
        messages={[
          { role: "user", who: "EMPLEADO", text: "¿Cuántos días tiene el cliente para devolver?", at: 0.2 },
          { role: "assistant", text: "El cliente tiene 30 días naturales para solicitar la devolución.", at: 2.2, cite: citeLabel, citeTone: "danger" },
        ]}
        fontSize={29}
      />
      <DocCard
        x={1200}
        y={290}
        w={600}
        h={460}
        rotate={-2}
        title="Politica_Devoluciones.pdf"
        meta="v1 · VIGENCIA HASTA 31/12/2024"
        status="vencido"
        statusAt={3.6}
        lines={["Devoluciones: 30 días naturales", "Vigencia: 01/03/2024 – 31/12/2024"]}
        highlight={1}
        highlightAt={3.8}
        highlightColor={theme.colors.danger}
        at={1.2}
        fillerLines={4}
        glow={theme.colors.dangerGlow}
      />
      <Reticle x={1520} y={515} w={600} h={56} at={4.2} color={theme.colors.danger} label="FECHA DE EXPIRACIÓN" />
    </AbsoluteFill>
  );
};

/** R05 · Marcador de cinco rondas + expediente sellado "Requisitos obligatorios del contrato". */
export const ScoreAndDossier: React.FC<{ brand: Brand; votes: Vote[]; openAt?: number }> = ({ votes, openAt }) => (
  <AbsoluteFill>
    <Scoreboard votes={votes} at={0.2} x={110} y={300} w={940} compact />
    <Entrance at={1.2} style={{ position: "absolute", left: 110, top: 520, width: 940 }}>
      <div style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 28, lineHeight: 1.35, color: theme.colors.textDim }}>
        Los resultados del Consejo quedan registrados tal como se votaron.
      </div>
    </Entrance>
    <Dossier x={1440} y={openAt !== undefined ? 590 : 530} at={2.2} openAt={openAt} title="REQUISITOS OBLIGATORIOS DEL CONTRATO" stamp="CONFIDENCIAL" w={640} h={openAt !== undefined ? 400 : 440} glow={theme.colors.dangerGlow} />
  </AbsoluteFill>
);
