/**
 * Optimize — Standalone webOS TV app
 *
 * This is a standalone app under apps/webos-iptv/.
 * Use the scripts in package.json to build, package, and deploy:
 *
 *   bun run build  — bundle the app for webOS
 *   bun run package— create .ipk installer
 *   bun run deploy — install and launch on TV
 *   bun run dev    — build + package + deploy + inspect
 *   bun test       — run unit tests
 */

export { parseM3u } from "./src/playlist/parser.js";
export { parseXmltv } from "./src/epg/xmltv-parser.js";
export { EpgStore } from "./src/epg/epg-store.js";
export { bundleWebOSApp } from "./src/build/bundler.js";
export { packageWebOSApp } from "./src/build/packager.js";
export { deployToTV, inspectApp, listDevices } from "./src/build/deployer.js";
