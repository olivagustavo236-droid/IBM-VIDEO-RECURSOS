// stills.mjs — verificación visual por fotogramas (regla 10 de remotion-motion-graphics).
// Empaqueta una sola vez y renderiza varios fotogramas por composición.
// Uso: node scripts/stills.mjs <ID>[,<ID>...] <seg>[,<seg>...]
//   ej. node scripts/stills.mjs R01-AWS,R01-AZURE 3,10,18,27,36
// Salida: out/check/<ID>_<seg>s.png
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [idsArg, secsArg] = process.argv.slice(2);
if (!idsArg || !secsArg) {
  console.error("Uso: node scripts/stills.mjs <ID>[,<ID>...] <seg>[,<seg>...]");
  process.exit(1);
}
const outDir = join(root, "out", "check");
mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: join(root, "src", "index.ts") });
const comps = await getCompositions(serveUrl);
const ids = idsArg === "all" ? comps.map((c) => c.id) : idsArg.split(",");
for (const id of ids) {
  const composition = comps.find((c) => c.id === id);
  if (!composition) {
    console.error(`No existe la composición ${id}`);
    process.exitCode = 1;
    continue;
  }
  for (const s of secsArg.split(",").map(Number)) {
    const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
    const output = join(outDir, `${id}_${String(s).replace(".", "_")}s.png`);
    await renderStill({ composition, serveUrl, output, frame, overwrite: true });
    console.log(`✓ ${id} @ ${s}s → ${output}`);
  }
}
