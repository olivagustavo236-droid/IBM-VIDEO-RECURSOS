// Tomas de apertura compartidas por cada pareja AWS/Azure ("Iniciar con el mismo material de crisis")
// y bloques que se repiten con variaciones mínimas entre rutas.
import React from "react";
import { AbsoluteFill } from "remotion";
import { alpha, Brand, brandColor, theme } from "../theme";
import { ChatWindow } from "./Chat";
import { Note, ServiceNode } from "./Diagram";
import { ChunkCard, DocCard } from "./Docs";
import { fonts } from "./fonts";
import { CheckRow, ProfileCard, Stamp } from "./Hud";
import { Icon } from "./Icons";
import { Entrance, STAGGER, useEaseBetween } from "./motion";
import { DotMap, LoadMeter, Visitors } from "./WorldMap";

/** R02 · toma 1 — dos problemas paralelos: pico de tráfico (izq.) y documentos dispersos (der.). */
export const DemandPeak: React.FC<{ brand: Brand; folders?: boolean }> = ({ brand, folders = false }) => {
  const c = brandColor(brand);
  const load = useEaseBetween(0.5, 3.5, theme.ease.inOut);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: "inset(0 790px 0 0)" }}>
        <DotMap at={0} opacity={0.45} />
        <Visitors target={[900, 560]} at={0.3} count={80} color={c} />
      </AbsoluteFill>
      <ServiceNode x={900} y={560} w={250} h={100} title="Origen" sub="SERVIDOR WEB" icon="server" brand={brand} tone="danger" at={0.2} titleSize={26} />
      <LoadMeter x={760} y={640} level={0.3 + load * 0.65} label="CARGA DEL ORIGEN (ILUSTRATIVA)" color={c} />
      <div style={{ position: "absolute", left: 1140, top: 280, width: 2, height: 540, background: alpha(theme.colors.text, 0.15) }} />
      {[
        { t: "Manual_Soporte.pdf", k: "PDF" as const, x: 1190, y: 300, r: -9 },
        { t: "Devoluciones_2024.docx", k: "DOCX" as const, x: 1400, y: 280, r: 6 },
        { t: "Pagos_y_cargos.pdf", k: "MANUAL" as const, x: 1570, y: 420, r: -4 },
        { t: "FAQ_envios.docx", k: "DOCX" as const, x: 1250, y: 520, r: 8 },
        { t: "Politica_v2_final.pdf", k: "PDF" as const, x: 1440, y: 560, r: -7 },
      ].map((d, i) => (
        <DocCard key={i} x={d.x} y={d.y} w={240} h={240} rotate={d.r} title={d.t} kind={d.k} at={0.6 + i * STAGGER.item} seed={i} fillerLines={3} />
      ))}
      {folders
        ? [
            { x: 1205, y: 470, l: "/soporte" },
            { x: 1640, y: 250, l: "/legal/viejo" },
            { x: 1650, y: 690, l: "/correo" },
          ].map((f, i) => (
            <Entrance key={i} at={1.6 + i * STAGGER.item} style={{ position: "absolute", left: f.x, top: f.y }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: fonts.mono, fontWeight: 800, fontSize: 17, color: theme.colors.warn, background: alpha(theme.colors.bg, 0.9), padding: "4px 10px", borderRadius: 8 }}>
                <Icon kind="folder" size={24} color={theme.colors.warn} /> {f.l}
              </div>
            </Entrance>
          ))
        : null}
      <Note x={560} y={800} text="PROBLEMA 1 · TRÁFICO ALTO" at={1.4} color={c} />
      <Note x={1500} y={800} text={folders ? "PROBLEMA 2 · DOCUMENTOS DISPERSOS" : "PROBLEMA 2 · ARCHIVOS DISPERSOS"} at={1.4 + STAGGER.item} color={theme.colors.warn} />
    </AbsoluteFill>
  );
};

/** R03 · toma 1 — perfil externo intenta consultar un contrato reservado (datos ficticios). */
export const ThreatQuery: React.FC<{ brand: Brand; question: string }> = ({ brand, question }) => (
  <AbsoluteFill>
    <ProfileCard x={110} y={290} name="Cliente externo" role="PERFIL: PÚBLICO" color={theme.colors.textDim} at={0.2} w={520} icon="user" />
    <ChatWindow x={110} y={430} w={820} h={330} accent={brandColor(brand)} title="ASISTENTE · CONSULTA" messages={[{ role: "user", who: "CLIENTE EXTERNO", text: question, at: 0.6 }]} fontSize={32} />
    <DocCard
      x={1180}
      y={286}
      w={600}
      h={480}
      rotate={3}
      kind="CONTRATO"
      title="Contrato de suministro · Proveedor Andina (ficticio)"
      meta="CLÁUSULA 9 · CONDICIONES COMERCIALES"
      status="restringido"
      statusAt={1.8}
      lines={["Descuento negociado: ██ %", "Uso interno — Dirección de Compras"]}
      highlight={0}
      highlightColor={theme.colors.danger}
      highlightAt={2.4}
      at={1.0}
      fillerLines={4}
      glow={theme.colors.dangerGlow}
    />
    <Note x={1480} y={790} text="DATOS TOTALMENTE FICTICIOS" at={2.8} />
  </AbsoluteFill>
);

/** R04 · toma 1 — pregunta en lenguaje natural, texto grande. */
export const QuestionChat: React.FC<{ brand: Brand; title: string }> = ({ brand, title }) => (
  <AbsoluteFill>
    <ChatWindow
      x={260}
      y={280}
      w={1400}
      h={500}
      accent={brandColor(brand)}
      title={title}
      messages={[{ role: "user", who: "EMPLEADO DE SOPORTE", text: "¿Qué hago si me cobraron y no salió pedido?", at: 0.4 }]}
      fontSize={52}
    />
    <Entrance at={3.4} style={{ position: "absolute", left: 300, top: 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.mono, fontWeight: 800, fontSize: 22, letterSpacing: "0.1em", color: theme.colors.textDim }}>
        <Icon kind="search" size={30} color={brandColor(brand)} /> ANTES DE RESPONDER: CONSULTAR EL PROCEDIMIENTO
      </div>
    </Entrance>
  </AbsoluteFill>
);

/** R05 · toma 1 — respuesta que cita un documento vencido; evaluación "no conforme". */
export const FailedTest: React.FC<{ brand: Brand; variant: "aws" | "azure" }> = ({ brand, variant }) => {
  const c = brandColor(brand);
  return (
    <AbsoluteFill>
      <ChatWindow
        x={110}
        y={280}
        w={980}
        h={480}
        accent={c}
        title="PRUEBA DE ACEPTACIÓN · CASO 03"
        messages={[
          { role: "user", who: "CASO DE PRUEBA", text: "¿Plazo para devolver un producto en oferta?", at: 0.2 },
          {
            role: "assistant",
            text: "Tiene 30 días naturales para devolverlo.",
            at: 1.2,
            cite: variant === "aws" ? "Manual_Devoluciones · v1 · VENCIDO" : "Politica_Devoluciones · v1 · 2024",
            citeTone: "danger",
          },
        ]}
        fontSize={31}
      />
      {/* semáforo */}
      <Entrance at={0.6} style={{ position: "absolute", left: 1210, top: 300 }}>
        <div style={{ width: 120, padding: 16, borderRadius: 24, background: theme.colors.panel, border: `2px solid ${theme.colors.line}`, display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          {[theme.colors.danger, theme.colors.warn, theme.colors.ok].map((col, i) => (
            <div key={i} style={{ width: 70, height: 70, borderRadius: 35, background: i === 0 ? col : alpha(col, 0.15), boxShadow: i === 0 ? `0 0 40px ${theme.colors.dangerGlow}` : "none" }} />
          ))}
        </div>
      </Entrance>
      <ProfileCard x={1370} y={300} name="Evaluador" role="COMITÉ DE CALIDAD" color={theme.colors.textDim} at={1.0} w={440} icon="human" />
      {variant === "aws" ? (
        <Stamp x={1590} y={560} text="NO CONFORME" sub="FUENTE INVÁLIDA" at={2.6} color={theme.colors.danger} />
      ) : (
        <Entrance at={2.4} style={{ position: "absolute", left: 1370, top: 470, width: 440 }}>
          <div style={{ padding: "18px 22px", borderRadius: 16, border: `2px solid ${theme.colors.warn}`, background: theme.colors.warnSoft, fontFamily: fonts.display, fontWeight: 800, fontSize: 28, color: theme.colors.text }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: theme.colors.warn, fontFamily: fonts.mono, fontSize: 17, letterSpacing: "0.12em" }}>
              <Icon kind="clock" size={24} color={theme.colors.warn} /> ADVERTENCIA DE FECHA
            </div>
            La fuente citada venció el 31/12/2024
          </div>
        </Entrance>
      )}
    </AbsoluteFill>
  );
};

/** R03 · toma 4 — dos perfiles hacen la misma pregunta y reciben evidencia distinta. */
export const RoleTest: React.FC<{ brand: Brand; showDenied?: boolean; managerLabel: string }> = ({ brand, showDenied = false, managerLabel }) => {
  const c = brandColor(brand);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 958, top: 280, width: 2, height: 520, background: alpha(theme.colors.text, 0.15) }} />
      <ProfileCard x={110} y={280} name={managerLabel} role="ROL: INTERNO" color={c} at={0.2} w={780} icon="human" />
      <ProfileCard x={1030} y={280} name="Cliente" role="ROL: PÚBLICO" color={theme.colors.textDim} at={0.2 + STAGGER.item} w={780} icon="user" />
      <ChunkCard x={110} y={420} w={780} source="PROCEDIMIENTO_INTERNO · §2" text="Escalar a conciliación si el cargo no tiene orden en 24 h." tags={[{ k: "ACL", v: "interno", tone: "warn" }]} accent={c} at={1.2} />
      <ChunkCard x={110} y={590} w={780} source="POLITICA_PUBLICA · §7.3" text="Reversión del cargo cuando no exista orden confirmada." tags={[{ k: "ACL", v: "público", tone: "ok" }]} accent={c} at={1.2 + STAGGER.item} />
      <ChunkCard x={1030} y={420} w={780} source="POLITICA_PUBLICA · §7.3" text="Reversión del cargo cuando no exista orden confirmada." tags={[{ k: "ACL", v: "público", tone: "ok" }]} accent={c} at={2.0} />
      {showDenied ? (
        <ChunkCard
          x={1030}
          y={590}
          w={780}
          source="PROCEDIMIENTO_INTERNO · §2"
          text="Escalar a conciliación si el cargo no tiene orden en 24 h."
          tags={[{ k: "ACL", v: "interno", tone: "danger" }]}
          accent={theme.colors.danger}
          at={2.6}
          lockAt={3.2}
          lockLabel="INTENTO DENEGADO"
        />
      ) : (
        <Entrance at={2.6} style={{ position: "absolute", left: 1030, top: 600, width: 780 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 22px", borderRadius: 14, border: `2px dashed ${alpha(theme.colors.textDim, 0.5)}`, fontFamily: fonts.mono, fontWeight: 800, fontSize: 19, color: theme.colors.textDim }}>
            <Icon kind="lock" size={28} color={theme.colors.textDim} /> FUENTE INTERNA NO VISIBLE PARA ESTE ROL
          </div>
        </Entrance>
      )}
    </AbsoluteFill>
  );
};

/** R05 · toma 2 — cuatro pruebas de aceptación (sin marcar "aprobado" sin prueba real). */
export const AcceptanceTests: React.FC<{ variant: "aws" | "azure" }> = ({ variant }) => {
  const tests = [
    { label: "Pregunta normal", cat: "EVIDENCIA", icon: "chat" as const },
    { label: "Pago sin pedido", cat: "ABSTENCIÓN", icon: "coin" as const },
    { label: "Política vencida", cat: "VIGENCIA", icon: "clock" as const },
    { label: "Documento restringido", cat: "SEGURIDAD", icon: "lock" as const },
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 110, top: 330, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 22, rowGap: 60 }}>
        {tests.map((t, i) => (
          <CheckRow
            key={i}
            label={`${t.label} · ${t.cat}`}
            icon={t.icon}
            at={0.4 + i * STAGGER.item}
            state={variant === "aws" ? "pending" : i % 2 === 0 ? "review" : "pending"}
            resolveAt={variant === "aws" ? undefined : 2.4 + i * 0.4}
            width={840}
          />
        ))}
      </div>
      <Note x={960} y={700} text={variant === "aws" ? "PRUEBAS DEFINIDAS ANTES DE DECIDIR" : "SIN 'APROBADO' SIN PRUEBA REAL"} at={2.2} />
    </AbsoluteFill>
  );
};
