// ShotTimeline — convierte la tabla de tomas de la biblia en <Sequence>s:
// cámara (catálogo video-shotcraft) + transición de toma + leyenda PANTALLA + locución + SFX.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Brand, theme } from "../theme";
import { HeadlineTone, OnScreenTitle, Subtitle, toneFromOnscreen } from "./captions";
import { ToneWash } from "./layers";
import { CLAMP } from "./motion";
import { SfxCue, SfxTrack } from "./sound";

/** Movimientos de cámara (references/shots/camera): empuje lento, alejamiento, deriva, crash-zoom. */
export type CameraMove =
  | { kind: "push"; to?: number }
  | { kind: "pull"; from?: number }
  | { kind: "drift"; dx?: number }
  | { kind: "crash"; at: number; x: number; y: number; zoom?: number; hold?: number }
  | { kind: "none" };

export type Shot = {
  from: number; // segundos (inicio de toma según la biblia)
  to: number; // segundos (fin)
  label: string; // nombre de toma: "ERROR / URGENCIA"
  onscreen?: string; // leyenda PANTALLA (sin el prefijo)
  vo?: string; // locución (se muestra como subtítulo)
  visual: React.ReactNode; // escena; sus tiempos internos son relativos a la toma
  camera?: CameraMove;
  tone?: "danger" | "ok" | "warn";
  headlineTone?: HeadlineTone;
  sfx?: SfxCue[]; // tiempos relativos a la toma
  noAutoWhoosh?: boolean;
};

type ShotCtx = { durationSec: number; index: number; brand: Brand };
const ShotContext = createContext<ShotCtx>({ durationSec: 1, index: 0, brand: "neutral" });
/** Duración de la toma actual (segundos) para escenas que necesitan programar su salida. */
export const useShot = () => useContext(ShotContext);

const pad2 = (n: number) => String(n).padStart(2, "0");

const Camera: React.FC<{ move: CameraMove; durationSec: number; children: React.ReactNode }> = ({ move, durationSec, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const end = durationSec * fps;
  let scale = 1;
  let tx = 0;
  let ty = 0;
  if (move.kind === "push") {
    scale = interpolate(frame, [0, end], [1, move.to ?? 1.06], { ...CLAMP, easing: theme.ease.inOut });
  } else if (move.kind === "pull") {
    scale = interpolate(frame, [0, end], [move.from ?? 1.1, 1], { ...CLAMP, easing: theme.ease.inOut });
  } else if (move.kind === "drift") {
    tx = interpolate(frame, [0, end], [(move.dx ?? 40) / 2, -(move.dx ?? 40) / 2], { ...CLAMP, easing: theme.ease.inOut });
    scale = 1.02;
  } else if (move.kind === "crash") {
    // crash-zoom-punch: pre-recule 3 %, empuje ease-in de 6 f, sobreimpulso y retorno.
    const a = move.at * fps;
    const z = move.zoom ?? 1.9;
    const back = interpolate(frame, [a - 8, a], [1, 0.97], { ...CLAMP, easing: theme.ease.inOut });
    const punch = interpolate(frame, [a, a + 6], [0, 1], { ...CLAMP, easing: theme.ease.in });
    const settle = interpolate(frame, [a + 6, a + 12], [0, 1], { ...CLAMP, easing: theme.ease.out });
    const releaseAt = a + (move.hold ?? 2.2) * fps;
    const release = interpolate(frame, [releaseAt, releaseAt + 18], [0, 1], { ...CLAMP, easing: theme.ease.inOut });
    const zoomNow = (back + (z * 1.04 - back) * punch - z * 0.04 * settle) * (1 - release) + release;
    scale = zoomNow;
    // lleva el objetivo (x, y) al centro de cuadro a medida que crece el zoom
    const frac = Math.max(0, (zoomNow - 1) / (z - 1));
    tx = (theme.layout.width / 2 - move.x) * frac * z;
    ty = (theme.layout.height / 2 - move.y) * frac * z;
    // micro-temblor de llegada (撞停) que decae en ~6 f
    const tImpact = frame - (a + 6);
    if (tImpact >= 0 && tImpact < 8) {
      const amp = 10 * Math.exp(-tImpact / 1.8);
      tx += Math.sin(tImpact * 2.7) * amp;
      ty += Math.cos(tImpact * 3.1) * amp;
    }
  }
  const inner = (
    <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
  );
  // el crash-zoom se recorta bajo la franja del titular para no invadir el HUD
  return move.kind === "crash" ? <AbsoluteFill style={{ clipPath: `inset(${theme.layout.stageTop - 14}px 0 0 0)` }}>{inner}</AbsoluteFill> : inner;
};

/** Transición de toma: entrada spring (opacidad + escala + desenfoque), salida rápida ~0.3 s. */
const ShotFrame: React.FC<{ shot: Shot; brand: Brand; index: number; total: number }> = ({ shot, brand, index, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = (shot.to - shot.from) * fps;
  const inP = interpolate(frame, [0, 0.45 * fps], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const isLast = index === total - 1;
  // la última toma no sale: la cubre el fundido a negro de 1 s ("remate")
  const outP = isLast ? 0 : interpolate(frame, [dur - 0.3 * fps, dur], [0, 1], { ...CLAMP, easing: theme.ease.in });
  const opacity = inP * (1 - outP);
  const scale = interpolate(inP, [0, 1], [1.035, 1]) * interpolate(outP, [0, 1], [1, 0.975]);
  const blur = (1 - inP) * 10 + outP * 6;
  const marker = `TOMA ${pad2(index + 1)}/${pad2(total)} · ${shot.label} · ${pad2(shot.from)}–${pad2(shot.to)} s`;
  const headlineTone = shot.headlineTone ?? (shot.onscreen ? toneFromOnscreen(shot.onscreen) : "normal");
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined }}>
      {shot.tone ? <ToneWash tone={shot.tone} /> : null}
      <Camera move={shot.camera ?? { kind: "push", to: 1.035 }} durationSec={shot.to - shot.from}>
        {shot.visual}
      </Camera>
      {shot.onscreen ? <OnScreenTitle text={shot.onscreen} brand={brand} marker={marker} tone={headlineTone} /> : null}
      {shot.vo ? <Subtitle text={shot.vo} brand={brand} /> : null}
    </AbsoluteFill>
  );
};

export const ShotTimeline: React.FC<{ shots: Shot[]; brand: Brand; extraSfx?: SfxCue[] }> = ({ shots, brand, extraSfx = [] }) => {
  const { fps } = useVideoConfig();
  const cues: SfxCue[] = [...extraSfx];
  shots.forEach((s, i) => {
    if (i > 0 && !s.noAutoWhoosh) cues.push({ at: s.from + 0.08, kind: "whoosh" });
    const tone = s.headlineTone ?? (s.onscreen ? toneFromOnscreen(s.onscreen) : "normal");
    if (tone === "alert") cues.push({ at: s.from + 0.25, kind: "alert" });
    if (i === shots.length - 1 && i > 0) cues.push({ at: s.from, kind: "riser", volume: 0.22 });
    (s.sfx ?? []).forEach((c) => cues.push({ ...c, at: s.from + c.at }));
  });
  return (
    <>
      {shots.map((s, i) => (
        <Sequence key={i} from={Math.round(s.from * fps)} durationInFrames={Math.round((s.to - s.from) * fps)} name={`${pad2(i + 1)} ${s.label}`}>
          <ShotContext.Provider value={{ durationSec: s.to - s.from, index: i, brand }}>
            <ShotFrame shot={s} brand={brand} index={i} total={shots.length} />
          </ShotContext.Provider>
        </Sequence>
      ))}
      <SfxTrack cues={cues} />
    </>
  );
};
