# 🎬 IBM-VIDEO-RECURSOS

Repositorio unificado de habilidades (*skills*), plantillas y reglas arquitectónicas para generar videos mediante código con **Remotion**, **Claude Code** y **OpenAI Codex CLI**.

Soporta dos flujos de trabajo:
1. **Modo 1 — Lanzamientos Comerciales SaaS:** Capturas reales 2x, guion comercial y movimientos de cámara (`video-shotcraft` + `remotion-motion-graphics`).
2. **Modo 2 — Visuales Interactivos y Fondos de Presentación:** Diagramas de arquitectura animados, pantallas divididas (*split-screen*), tableros HUD y gráficos educativos de alto contraste para proyectores.

## 📁 Estructura del Repositorio

* **`CLAUDE.md` / `AGENTS.md`**: Instrucciones maestras que configuran el Modo Dual para Claude Code y OpenAI Codex CLI.
* **`.claude/skills/` y `.agents/skills/`**: Habilidades activas (`video-shotcraft` y `remotion-motion-graphics`) detectadas automáticamente por los agentes.
* **`plantilla-remotion/`**: Estructura base (`src/theme.ts`, `src/scenes/`, `src/components/`, `public/`) lista para duplicar e iniciar cualquier video nuevo.
* **`skills/`**: Repositorios fuente archivados (`saas-shotcraft` y `remotion-pro`) con sus 124 tarjetas de toma, `workbench/` y ejemplos completos.
* **`.gitignore`**: Ignora `node_modules/` y archivos de render (`out/*.mp4`) para mantener el repositorio ligero.

## 🚀 Cómo iniciar un video en el futuro

1. Duplica la carpeta base: `cp -r plantilla-remotion mi-nuevo-video`
2. Entra a la carpeta e instala Remotion: `cd mi-nuevo-video && npm init -y && npm install remotion @remotion/cli react react-dom`
3. Regresa a la raíz (`cd ..`), abre `claude` o `codex` y pídele el video indicando el **Modo 1** o **Modo 2**.
