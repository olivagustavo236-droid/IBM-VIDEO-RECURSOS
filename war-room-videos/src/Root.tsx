import React from "react";
import { Composition } from "remotion";
import { theme } from "./theme";
import { VIDEOS } from "./videos/registry";
import { defaultVideoProps } from "./videos/types";

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={v.component}
        durationInFrames={Math.round(v.durationSec * FPS)}
        fps={FPS}
        width={theme.layout.width}
        height={theme.layout.height}
        defaultProps={defaultVideoProps}
      />
    ))}
  </>
);
