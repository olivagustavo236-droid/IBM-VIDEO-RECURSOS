// make-sfx.mjs — Kit de efectos sintetizados (WAV 16-bit, 48 kHz, mono).
// Determinista: misma semilla → mismos bytes. Sin descargas.
// Uso: node scripts/make-sfx.mjs   → escribe public/sfx/*.wav
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 48000;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sfx");
mkdirSync(OUT, { recursive: true });

// PRNG determinista (mulberry32)
const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const writeWav = (name, samples) => {
  // normaliza a -1 dBFS
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const gain = peak > 0 ? 0.89 / peak : 1;
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => {
    const v = Math.max(-1, Math.min(1, s * gain));
    data.writeInt16LE(Math.round(v * 32767), i * 2);
  });
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  writeFileSync(join(OUT, `${name}.wav`), Buffer.concat([h, data]));
  console.log(`  sfx/${name}.wav  ${(samples.length / SR).toFixed(2)}s`);
};

const make = (sec, fn) => Array.from({ length: Math.round(sec * SR) }, (_, i) => fn(i / SR, i));

// Filtro paso-bajo de un polo (para "colorear" ruido)
const lowpass = (input, cutoffAt) => {
  let y = 0;
  return input.map((x, i) => {
    const fc = cutoffAt(i / SR);
    const a = 1 - Math.exp((-2 * Math.PI * fc) / SR);
    y += a * (x - y);
    return y;
  });
};

// 1. whoosh — ruido con barrido de filtro, ataque a ~0.18 s
{
  const r = rng(11);
  const dur = 0.55;
  const noise = make(dur, () => r() * 2 - 1);
  const f = lowpass(noise, (t) => 300 + 5200 * Math.sin(Math.PI * Math.min(1, t / dur)));
  writeWav(
    "whoosh",
    f.map((s, i) => {
      const t = i / SR;
      const env = t < 0.18 ? Math.pow(t / 0.18, 2) : Math.exp(-(t - 0.18) * 9);
      return s * env;
    }),
  );
}

// 2. click — transitorio mecánico corto
{
  const r = rng(21);
  writeWav(
    "click",
    make(0.06, (t) => (r() * 2 - 1) * Math.exp(-t * 260) * 0.6 + Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t * 120) * 0.4),
  );
}

// 3. impact — golpe grave con caída de tono
{
  const r = rng(31);
  let phase = 0;
  writeWav(
    "impact",
    make(1.1, (t) => {
      const f = 38 + 70 * Math.exp(-t * 14);
      phase += (2 * Math.PI * f) / SR;
      const body = Math.sin(phase) * Math.exp(-t * 3.6);
      const snap = (r() * 2 - 1) * Math.exp(-t * 70) * 0.5;
      return body + snap;
    }),
  );
}

// 4. riser — ruido + seno ascendente de 1.6 s
{
  const r = rng(41);
  const dur = 1.6;
  let phase = 0;
  const noise = lowpass(make(dur, () => r() * 2 - 1), (t) => 400 + 6000 * (t / dur));
  writeWav(
    "riser",
    noise.map((n, i) => {
      const t = i / SR;
      const f = 180 + 900 * Math.pow(t / dur, 2);
      phase += (2 * Math.PI * f) / SR;
      const env = Math.pow(t / dur, 2.2) * (t > dur - 0.04 ? (dur - t) / 0.04 : 1);
      return (n * 0.7 + Math.sin(phase) * 0.35) * env;
    }),
  );
}

// 5. glitch — ráfagas digitales cuantizadas
{
  const r = rng(51);
  let hold = 0;
  let v = 0;
  writeWav(
    "glitch",
    make(0.45, (t, i) => {
      if (i % 220 === 0) hold = r() < 0.55 ? 1 : 0;
      if (i % (8 + Math.floor(r() * 40)) === 0) v = Math.round((r() * 2 - 1) * 4) / 4;
      return v * hold * Math.exp(-t * 3);
    }),
  );
}

// 6. alert — dos tonos suaves (solo transiciones críticas)
{
  writeWav(
    "alert",
    make(0.9, (t) => {
      const f = t < 0.22 ? 880 : t < 0.45 ? 660 : 0;
      if (f === 0) return 0;
      const local = t < 0.22 ? t : t - 0.22;
      const env = Math.min(1, local / 0.01) * Math.exp(-local * 6);
      return (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t)) * env;
    }),
  );
}

// 7. tick — tic para contadores
writeWav("tick", make(0.025, (t) => Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 300)));

// 8. shimmer — brillo para estados validados
{
  const freqs = [1320, 1760, 2217, 2640];
  writeWav(
    "shimmer",
    make(1.3, (t) =>
      freqs.reduce(
        (acc, f, k) =>
          acc + Math.sin(2 * Math.PI * f * t + Math.sin(2 * Math.PI * 6 * t) * 0.6) * Math.exp(-t * (2.2 + k)) * Math.min(1, t / (0.02 + k * 0.03)),
        0,
      ),
    ),
  );
}

// 9. stamp — golpe seco de sello
{
  const r = rng(91);
  const noise = lowpass(make(0.35, () => r() * 2 - 1), () => 1800);
  writeWav(
    "stamp",
    noise.map((n, i) => {
      const t = i / SR;
      return n * Math.exp(-t * 28) + Math.sin(2 * Math.PI * 85 * t) * Math.exp(-t * 16) * 0.8;
    }),
  );
}

// 10. typing — tecleo de 1.6 s
{
  const r = rng(101);
  const hits = [];
  let t0 = 0.02;
  while (t0 < 1.55) {
    hits.push(t0);
    t0 += 0.07 + r() * 0.09;
  }
  const r2 = rng(102);
  writeWav(
    "typing",
    make(1.65, (t) =>
      hits.reduce((acc, h) => {
        const d = t - h;
        return d >= 0 && d < 0.03 ? acc + (r2() * 2 - 1) * Math.exp(-d * 220) : acc;
      }, 0),
    ),
  );
}

// 11. pad — cama musical discreta y original (16 s, en bucle sin costura)
{
  const dur = 16;
  const chord = [55, 82.41, 110, 130.81, 164.81]; // La menor abierto
  writeWav(
    "pad",
    make(dur, (t) => {
      let s = 0;
      chord.forEach((f, k) => {
        // frecuencias múltiplo de 1/16 Hz → bucle continuo
        const det = Math.round(f * 16) / 16;
        const lfo = 0.6 + 0.4 * Math.sin((2 * Math.PI * t * (k + 1)) / dur);
        s += (Math.sin(2 * Math.PI * det * t) + 0.5 * Math.sin(2 * Math.PI * (det + 0.25) * t)) * lfo;
      });
      return s / chord.length;
    }),
  );
}

console.log("Kit SFX generado en public/sfx/");
