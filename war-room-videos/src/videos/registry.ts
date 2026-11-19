// Registro único de las 13 composiciones (IDs exactos de la biblia audiovisual).
// El mismo orden se usa en scripts/render-all.mjs.
import React from "react";
import { R01Aws } from "./R01Aws";
import { R01Azure } from "./R01Azure";
import { R02Aws } from "./R02Aws";
import { R02Azure } from "./R02Azure";
import { R03Aws } from "./R03Aws";
import { R03Azure } from "./R03Azure";
import { R04Aws } from "./R04Aws";
import { R04Azure } from "./R04Azure";
import { R05Aws } from "./R05Aws";
import { R05Azure } from "./R05Azure";
import { VideoProps } from "./types";
import { V00AperturaCodigoRojo } from "./V00AperturaCodigoRojo";
import { V11MomentoStar } from "./V11MomentoStar";
import { V12ExpedienteAzure } from "./V12ExpedienteAzure";

export type VideoEntry = { id: string; durationSec: number; component: React.FC<VideoProps> };

export const VIDEOS: VideoEntry[] = [
  { id: "00-Apertura-CodigoRojo", durationSec: 75, component: V00AperturaCodigoRojo },
  { id: "R01-AWS", durationSec: 40, component: R01Aws },
  { id: "R01-AZURE", durationSec: 40, component: R01Azure },
  { id: "R02-AWS", durationSec: 40, component: R02Aws },
  { id: "R02-AZURE", durationSec: 40, component: R02Azure },
  { id: "R03-AWS", durationSec: 40, component: R03Aws },
  { id: "R03-AZURE", durationSec: 40, component: R03Azure },
  { id: "R04-AWS", durationSec: 40, component: R04Aws },
  { id: "R04-AZURE", durationSec: 40, component: R04Azure },
  { id: "R05-AWS", durationSec: 40, component: R05Aws },
  { id: "R05-AZURE", durationSec: 40, component: R05Azure },
  { id: "11-Momento-STAR", durationSec: 45, component: V11MomentoStar },
  { id: "12-Expediente-Azure", durationSec: 60, component: V12ExpedienteAzure },
];
