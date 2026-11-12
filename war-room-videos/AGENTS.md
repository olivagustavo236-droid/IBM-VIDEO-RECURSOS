# Guía Maestra de Generación de Videos (SaaS + Presentaciones Interactivas)

Este repositorio unifica dos skills (`video-shotcraft` y `remotion-motion-graphics`) para generar dos tipos de proyectos en Remotion:

## Modo 1: Lanzamientos Comerciales SaaS
- Usa `video-shotcraft` completo (capturas reales 2x del producto, narrativa gancho-problema-demo-CTA) combinado con `remotion-motion-graphics` para acabados visuales.

## Modo 2: Visuales Interactivos, Explicativos y Fondos de Presentación (Clases / War Room)
Cuando se soliciten videos educativos, diagramas de arquitectura (ej. AWS vs. Azure), fondos en bucle (HUDs) o videos narrativos sin una app web local que capturar:
1. **De `video-shotcraft`:** Usa ÚNICAMENTE su catálogo de movimientos de cámara (`references/shots/`), composición de pantalla dividida (*split-screen*), ritmo y sincronización de efectos sonoros (`references/sound-design.md`). **Omite** la captura de pantallas de navegador o plantillas de venta SaaS.
2. **De `remotion-motion-graphics`:** Aplica estrictamente las 10 reglas de calidad (físicas `spring`, `WordReveal` escalonado, contadores numéricos con `tabular-nums`, pila de 5 capas con `BgMesh` + `Grade` + `Grain` + `Vignette`, y verificación visual por fotogramas).

## Reglas Visuales para Presentaciones en Vivo
- **Legibilidad en proyector:** Usa alto contraste (fondos oscuros `#0A0A0F` o `#070B14`), tipografía gruesa (≥700) y evita saturar la pantalla con párrafos largos; prioriza diagramas animados, flujos de datos y marcadores tipo HUD.
- **Paletas temáticas:** Si el guion enfrenta dos tecnologías (ej. AWS vs. Azure), define tokens claros en `src/theme.ts` (ej. AWS `#FF9900` Naranja Táctico vs. Azure `#0078D4` / `#22D3EE` Azul Cian) manteniendo un solo elemento brillante protagonista por escena.
