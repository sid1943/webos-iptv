import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function loadIndexHtml(): string {
  const root = resolve(import.meta.dirname, "../..");
  const file = resolve(root, "webos-app", "index.html");
  return readFileSync(file, "utf-8");
}

describe("Optimize UI smoke", () => {
  it("renders required UI containers", () => {
    const html = loadIndexHtml();
    const requiredIds = [
      "player-container",
      "video-player",
      "info-bar",
      "channel-sidebar",
      "channel-list",
      "epg-container",
      "settings-panel",
      "toast-container",
      "loading",
    ];

    for (const id of requiredIds) {
      expect(html).toContain(`id=\"${id}\"`);
    }
  });

  it("references core styles and scripts", () => {
    const html = loadIndexHtml();
    const requiredCss = [
      "css/main.css",
      "css/player.css",
      "css/channel-list.css",
      "css/epg.css",
      "css/settings.css",
    ];
    const requiredScripts = [
      "lib/webOSTV.js",
      "lib/shaka-player.compiled.js",
      "lib/spatial-navigation.js",
      "js/app.js",
    ];

    for (const href of requiredCss) {
      expect(html).toContain(href);
    }
    for (const src of requiredScripts) {
      expect(html).toContain(src);
    }
  });

  it("has the correct title", () => {
    const html = loadIndexHtml();
    expect(html).toContain("<title>Optimize</title>");
  });
});
