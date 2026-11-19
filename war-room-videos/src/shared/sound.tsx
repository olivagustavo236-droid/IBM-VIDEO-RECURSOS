// Diseño sonoro centralizado (video-shotcraft · sound-design.md):
// las escenas no incrustan audio; cada video declara un registro de cues relativo a sus tomas.
import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./motion";

export type SfxKind = "whoosh" | "click" | "impact" | "riser" | "glitch" | "alert" | "tick" | "shimmer" | "stamp" | "typing";

export type SfxCue = { at: number; kind: SfxKind; volume?: number };

/** Volumen base por tipo (multiplicador; la mezcla final se revisa en el render). */
const BASE_VOLUME: Record<SfxKind, number> = {
  whoosh: 0.32,
  click: 0.4,
  impact: 0.55,
  riser: 0.3,
  glitch: 0.35,
  alert: 0.28,
  tick: 0.25,
  shimmer: 0.26,
  stamp: 0.6,
  typing: 0.3,
};

/** Retardo del pico de energía dentro de cada archivo sintetizado (segundos). */
const PEAK_LAG: Record<SfxKind, number> = {
  whoosh: 0.18,
  click: 0,
  impact: 0.005,
  riser: 1.58, // el riser culmina en el golpe
  glitch: 0.01,
  alert: 0.01,
  tick: 0,
  shimmer: 0.05,
  stamp: 0.004,
  typing: 0.02,
};

/**
 * Desfase de la pista de salida (priming del codificador AAC ≈ 1024–2048 muestras).
 * sound-design.md §4.6: se mide por pipeline (Remotion 4.0.543 + AAC + 48 kHz + MP4).
 * Valor de partida; re-medir con correlación cruzada si cambia el pipeline.
 */
const OUTPUT_AUDIO_OFFSET_SEC = 2048 / 48000;

/** Sequence.from = pico objetivo − retardo del pico − desfase de salida. */
export const cueFrame = (atSec: number, kind: SfxKind, fps: number) =>
  Math.max(0, Math.round((atSec - PEAK_LAG[kind] - OUTPUT_AUDIO_OFFSET_SEC) * fps));

export const SfxTrack: React.FC<{ cues: SfxCue[] }> = ({ cues }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {cues.map((c, i) => (
        <Sequence key={`${c.kind}-${i}`} from={cueFrame(c.at, c.kind, fps)} durationInFrames={Math.round(fps * 2.2)} layout="none">
          <Audio src={staticFile(`sfx/${c.kind}.wav`)} volume={c.volume ?? BASE_VOLUME[c.kind]} />
        </Sequence>
      ))}
    </>
  );
};

/** Cama musical original (pad sintetizado) con fade de entrada y salida. Controlada por la prop `bgm`. */
export const MusicBed: React.FC<{ enabled: boolean; volume?: number }> = ({ enabled, volume = 0.16 }) => {
  const { fps, durationInFrames } = useVideoConfig();
  if (!enabled) return null;
  return (
    <Audio
      src={staticFile("sfx/pad.wav")}
      loop
      volume={(f) =>
        volume *
        interpolate(f, [0, fps * 1.5, durationInFrames - fps * 1.5, durationInFrames], [0, 1, 1, 0], { ...CLAMP, easing: theme.ease.inOut })
      }
    />
  );
};
