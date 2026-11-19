// render-all.mjs — renderiza las 13 composiciones UNA POR UNA en out/<ID>.mp4 (H.264).
// Usa la CLI de Remotion (respeta remotion.config.ts).
// Uso: npm run render:all            (todas)
//      npm run render:all -- R01-AWS R01-AZURE   (solo las indicadas)
//      Props opcionales: RENDER_PROPS='{"votes":["AWS","AZURE",null,null,null]}' npm run render:all
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const IDS = [
  "00-Apertura-CodigoRojo",
  "R01-AWS",
  "R01-AZURE",
  "R02-AWS",
  "R02-AZURE",
  "R03-AWS",
  "R03-AZURE",
  "R04-AWS",
  "R04-AZURE",
  "R05-AWS",
  "R05-AZURE",
  "11-Momento-STAR",
  "12-Expediente-Azure",
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLI = join(root, "node_modules", "@remotion", "cli", "remotion-cli.js");
const requested = process.argv.slice(2);
const unknown = requested.filter((id) => !IDS.includes(id));
if (unknown.length) {
  console.error(`IDs desconocidos: ${unknown.join(", ")}\nVálidos: ${IDS.join(", ")}`);
  process.exit(1);
}
const ids = requested.length ? requested : IDS;
mkdirSync(join(root, "out"), { recursive: true });

const props = process.env.RENDER_PROPS ? [`--props=${process.env.RENDER_PROPS}`] : [];
const failed = [];
const t0 = Date.now();
ids.forEach((id, i) => {
  console.log(`\n▶ [${i + 1}/${ids.length}] ${id} → out/${id}.mp4`);
  const args = [CLI, "render", "src/index.ts", id, `out/${id}.mp4`, "--codec=h264", "--crf=17", ...props];
  // Se invoca el CLI de Remotion con el mismo node, sin shell: igual en Windows, macOS y Linux.
  const r = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`✗ Falló ${id} (código ${r.status})`);
    failed.push(id);
  }
});
const mins = ((Date.now() - t0) / 60000).toFixed(1);
if (failed.length) {
  console.error(`\n${ids.length - failed.length}/${ids.length} renderizados en ${mins} min. Fallaron: ${failed.join(", ")}`);
  process.exit(1);
}
console.log(`\n✓ ${ids.length} videos renderizados en out/ (${mins} min)`);
