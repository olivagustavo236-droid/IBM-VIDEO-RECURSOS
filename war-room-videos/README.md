# Operación Código Rojo · La batalla por el RAG

13 composiciones Remotion (1920×1080, 30 fps) generadas a partir de
`../04_Biblia_Audiovisual_10_Escenarios_RAG.html` (Modo 2 de `CLAUDE.md`).

| ID | Duración | Archivo |
|---|---|---|
| `00-Apertura-CodigoRojo` | 75 s | `src/videos/V00AperturaCodigoRojo.tsx` |
| `R01-AWS` / `R01-AZURE` | 40 s c/u | `src/videos/R01Aws.tsx` / `R01Azure.tsx` |
| `R02-AWS` / `R02-AZURE` | 40 s c/u | `src/videos/R02Aws.tsx` / `R02Azure.tsx` |
| `R03-AWS` / `R03-AZURE` | 40 s c/u | `src/videos/R03Aws.tsx` / `R03Azure.tsx` |
| `R04-AWS` / `R04-AZURE` | 40 s c/u | `src/videos/R04Aws.tsx` / `R04Azure.tsx` |
| `R05-AWS` / `R05-AZURE` | 40 s c/u | `src/videos/R05Aws.tsx` / `R05Azure.tsx` |
| `11-Momento-STAR` | 45 s | `src/videos/V11MomentoStar.tsx` |
| `12-Expediente-Azure` | 60 s | `src/videos/V12ExpedienteAzure.tsx` |

## Comandos

```bash
npm run dev                     # Remotion Studio
npm run render:all              # las 13, una por una → out/<ID>.mp4
npm run render:all -- R01-AWS R01-AZURE   # solo las indicadas
npm run stills -- R01-AWS 3,10,18          # verificación por fotogramas → out/check/
npm run sfx                     # regenera el kit de sonido sintetizado (public/sfx/)
```

## Props

Todas las composiciones aceptan `--props` (o `RENDER_PROPS` en `render:all`):

- `bgm` (`true` por defecto): cama musical; `false` entrega la versión solo con SFX.
- `votes`: resultados reales de las 5 rondas para `R05-*` y `12-Expediente-Azure`.
  Por defecto cada ronda muestra **VOTO REGISTRADO**: el video nunca inventa ni altera ganadores.

```bash
RENDER_PROPS='{"votes":["AWS","AZURE","AWS","AZURE","AZURE"]}' npm run render:all -- 12-Expediente-Azure
```

## Arquitectura

```
src/
  theme.ts            tokens únicos: AWS #FF9B34, Azure #3BA9ED, fondo #070B14, curvas, springs
  Root.tsx            registra las 13 composiciones desde videos/registry.ts
  videos/             un archivo por video: tabla de tomas (tiempos, PANTALLA, locución, SFX)
  shared/
    Stage.tsx         pila de 5 capas (BgMesh → contenido → Grade → Grain + Vignette) + HUD
    ShotTimeline.tsx  tomas → <Sequence>, cámara (push/pull/drift/crash-zoom), transiciones, SFX
    captions.tsx      leyenda PANTALLA (titular HUD) y locución como subtítulo grande de proyector
    GlobalCommerceUI  tienda ficticia (live / error / ok) · Error503.tsx (glitch + pulso rojo)
    Diagram.tsx       tarjetas de servicio, flujos con paquetes, zonas, notas
    Docs.tsx Chat.tsx Search.tsx Hud.tsx Vectors.tsx WorldMap.tsx Opening.tsx Beat.tsx
    RoundScenes.tsx   tomas de apertura compartidas por cada pareja AWS/Azure
    Cliffhangers.tsx  ganchos comunes (mismo último fotograma conceptual en ambas rutas)
    sound.tsx         registro central de SFX con compensación de pico + cama musical
```

La locución de la biblia se muestra como subtítulo (no hay voz grabada); para añadir
voz, coloca los audios en `public/vo/` y agrégalos en cada video con `<Audio>` de `@remotion/media`.

## Sonido

`public/sfx/` contiene un kit **sintetizado** por `scripts/make-sfx.mjs` (whoosh, click, impact,
riser, glitch, alert, tick, shimmer, stamp, typing y un pad musical original). Determinista y sin
licencias de terceros. El desfase de salida AAC (`OUTPUT_AUDIO_OFFSET_SEC` en `sound.tsx`) es un
valor de partida: re-medirlo si cambia el pipeline (ver `video-shotcraft/references/sound-design.md` §4.6).
