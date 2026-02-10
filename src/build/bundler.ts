import { resolve, join } from "node:path";
import { cpSync, mkdirSync, existsSync } from "node:fs";
import { build } from "esbuild";

const EXTENSION_ROOT = resolve(import.meta.dirname, "../..");
const WEBOS_APP_SRC = join(EXTENSION_ROOT, "webos-app");

/**
 * Bundle the webOS app source into a deployable directory.
 * Copies static assets and the pre-bundled JS to dist/webos-app/.
 */
export async function bundleWebOSApp(outDir?: string): Promise<string> {
  const dist = outDir || join(EXTENSION_ROOT, "dist", "webos-app");

  // Create output directory
  mkdirSync(dist, { recursive: true });

  // Copy all static files from webos-app/
  const staticDirs = ["css", "lib"];
  const staticFiles = [
    "appinfo.json",
    "index.html",
    "icon.png",
    "largeIcon.png",
    "splash.png",
  ];

  for (const dir of staticDirs) {
    const src = join(WEBOS_APP_SRC, dir);
    if (existsSync(src)) {
      cpSync(src, join(dist, dir), { recursive: true });
    }
  }

  for (const file of staticFiles) {
    const src = join(WEBOS_APP_SRC, file);
    if (existsSync(src)) {
      cpSync(src, join(dist, file));
    }
  }

  // Bundle TypeScript for the webOS app (IIFE for ares-package minifier compatibility)
  const jsSrc = join(WEBOS_APP_SRC, "js");
  if (existsSync(jsSrc)) {
    mkdirSync(join(dist, "js"), { recursive: true });

    await build({
      entryPoints: [join(jsSrc, "app.ts")],
      bundle: true,
      platform: "browser",
      format: "iife",
      target: ["es2017"],
      outfile: join(dist, "js", "app.js"),
    });
  }

  return dist;
}
