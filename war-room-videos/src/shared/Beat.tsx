// Beat — sub-escena temporal dentro de una toma larga. Tiempos internos relativos al beat.
// Entrada spring (escala + opacidad + desenfoque) y salida rápida (~0.3 s).
import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { CLAMP } from "./motion";

const BeatFrame: React.FC<{ dur: number; exit: boolean; children: React.ReactNode }> = ({ dur, exit, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = interpolate(frame, [0, 0.4 * fps], [0, 1], { ...CLAMP, easing: theme.ease.out });
  const outP = exit ? interpolate(frame, [dur - 0.3 * fps, dur], [0, 1], { ...CLAMP, easing: theme.ease.in }) : 0;
  const blur = (1 - inP) * 8 + outP * 6;
  return (
    <AbsoluteFill
      style={{
        opacity: inP * (1 - outP),
        transform: `scale(${interpolate(inP, [0, 1], [1.03, 1]) * interpolate(outP, [0, 1], [1, 0.97])})`,
        filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Beat: React.FC<{ from: number; to: number; exit?: boolean; children: React.ReactNode }> = ({ from, to, exit = true, children }) => {
  const { fps } = useVideoConfig();
  const dur = Math.round((to - from) * fps);
  return (
    <Sequence from={Math.round(from * fps)} durationInFrames={dur} layout="none">
      <BeatFrame dur={dur} exit={exit}>
        {children}
      </BeatFrame>
    </Sequence>
  );
};
