import type { Vote } from "../shared/Hud";

/** Props de todas las composiciones (se pueden inyectar con --props). */
export type VideoProps = {
  /** Cama musical (true por defecto). `false` entrega la versión solo con SFX. */
  bgm: boolean;
  /**
   * Resultados reales de las 5 votaciones (R05 / 12). Por defecto null = "VOTO REGISTRADO":
   * el video nunca inventa ni altera ganadores.
   */
  votes: Vote[];
};

export const defaultVideoProps: VideoProps = { bgm: true, votes: [null, null, null, null, null] };
