import { build } from "esbuild";

await build({
  entryPoints: ["src/server.ts"], // your API entry
  bundle: true,                   // include all deps
  platform: "node",               // Node.js target
  target: "node18",               // modern Node features
  outdir: "dist",
  sourcemap: true,
  minify: true
});