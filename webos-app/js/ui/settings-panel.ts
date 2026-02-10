import { storageGet, storageSet } from "../storage.ts";

export type PlaylistConfig = {
  name: string;
  url: string;
  epgUrl?: string;
};

export type AppSettings = {
  playlists: PlaylistConfig[];
  refreshIntervalMinutes: number;
  lastChannel?: string;
};

const DEFAULT_SETTINGS: AppSettings = {
  playlists: [],
  refreshIntervalMinutes: 60,
};

let currentSettings: AppSettings | null = null;
let playlistModalAutoShown = false;

function $(id: string): HTMLElement | null {
  return document.getElementById(id);
}

function getSpatialNav(): { makeFocusable(): void; focus(section?: string): void } | null {
  const SN = (window as unknown as Record<string, unknown>).SpatialNavigation as
    | { makeFocusable(): void; focus(section?: string): void }
    | undefined;
  return SN || null;
}

/** Load settings from localStorage, applying defaults. */
export function loadSettings(): AppSettings {
  currentSettings = storageGet<AppSettings>("settings", DEFAULT_SETTINGS);
  return currentSettings;
}

/** Save settings to localStorage. */
export function saveSettings(settings: AppSettings): void {
  currentSettings = settings;
  storageSet("settings", settings);
}

/** Get current settings (in memory). */
export function getSettings(): AppSettings {
  if (!currentSettings) return loadSettings();
  return currentSettings;
}

/** Show the settings panel. */
export function showSettings(): void {
  const panel = $("settings-panel");
  if (panel) panel.classList.remove("hidden");
  renderSettings();
}

/** Hide the settings panel. */
export function hideSettings(): void {
  const panel = $("settings-panel");
  if (panel) panel.classList.add("hidden");
}

function renderSettings(): void {
  const container = $("settings-sections");
  if (!container) return;
  const settings = getSettings();

  container.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title">Playlists</div>
      ${settings.playlists
        .map(
          (pl, i) => `
        <div class="playlist-entry">
          <div class="playlist-entry-name">${escapeHtml(pl.name)}</div>
          <div class="playlist-entry-url">${escapeHtml(pl.url)}</div>
          <button class="settings-btn danger focusable" data-action="remove-playlist" data-index="${i}">Remove</button>
        </div>
      `,
        )
        .join("")}
      <div style="margin-top: 16px;">
        <button class="settings-btn focusable" data-action="add-playlist">Add Playlist</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title">Refresh</div>
      <div class="settings-field">
        <div>
          <div class="settings-field-label">Auto-refresh interval</div>
          <div class="settings-field-desc">How often to re-fetch playlists (minutes)</div>
        </div>
        <div class="settings-field-value">
          <input type="number" class="settings-input focusable" id="settings-refresh"
                 value="${settings.refreshIntervalMinutes}" min="5" max="1440" />
        </div>
      </div>
    </div>

    <div class="settings-help">
      <div class="settings-help-title">Remote Control Shortcuts</div>
      <div class="settings-help-row"><span class="settings-help-key">OK / Enter</span><span class="settings-help-action">Open channel list</span></div>
      <div class="settings-help-row"><span class="settings-help-key">Up / Down</span><span class="settings-help-action">Zap channels</span></div>
      <div class="settings-help-row"><span class="settings-help-key">0-9</span><span class="settings-help-action">Direct channel number</span></div>
      <div class="settings-help-row"><span class="settings-help-key">Red</span><span class="settings-help-action">Toggle favorite</span></div>
      <div class="settings-help-row"><span class="settings-help-key">Green</span><span class="settings-help-action">Programme guide (EPG)</span></div>
      <div class="settings-help-row"><span class="settings-help-key">Yellow</span><span class="settings-help-action">Channel info</span></div>
      <div class="settings-help-row"><span class="settings-help-key">Blue</span><span class="settings-help-action">Settings</span></div>
      <div class="settings-help-row"><span class="settings-help-key">Back</span><span class="settings-help-action">Go back / Exit</span></div>
    </div>
  `;

  // Bind events
  container.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", handleSettingsAction);
  });

  const refreshInput = document.getElementById("settings-refresh") as HTMLInputElement | null;
  if (refreshInput) {
    refreshInput.addEventListener("change", () => {
      const val = Number.parseInt(refreshInput.value, 10);
      if (val >= 5 && val <= 1440) {
        const s = getSettings();
        saveSettings({ ...s, refreshIntervalMinutes: val });
      }
    });
  }

  bindPlaylistModal();
  maybeAutoShowPlaylistModal(settings);
}

function handleSettingsAction(e: Event): void {
  const btn = e.currentTarget as HTMLElement;
  const action = btn.dataset.action;
  const settings = getSettings();

  switch (action) {
    case "remove-playlist": {
      const idx = Number.parseInt(btn.dataset.index || "0", 10);
      settings.playlists.splice(idx, 1);
      saveSettings(settings);
      renderSettings();
      break;
    }
    case "add-playlist": {
      showPlaylistModal();
      break;
    }
    case "cancel-playlist": {
      hidePlaylistModal();
      break;
    }
    case "save-playlist": {
      const nameInput = document.getElementById("playlist-name") as HTMLInputElement | null;
      const urlInput = document.getElementById("playlist-url") as HTMLInputElement | null;
      const epgInput = document.getElementById("playlist-epg") as HTMLInputElement | null;
      const name = nameInput?.value?.trim() || "Custom";
      const url = urlInput?.value?.trim() || "";
      const epgUrl = epgInput?.value?.trim() || "";
      if (url) {
        settings.playlists.push({ name, url, epgUrl: epgUrl || undefined });
        saveSettings(settings);
        renderSettings();
        hidePlaylistModal();
      }
      break;
    }
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showPlaylistModal(): void {
  const modal = $("playlist-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.style.display = "flex";
  modal.style.opacity = "1";
  modal.style.transform = "none";
  modal.style.pointerEvents = "auto";
  const nameInput = document.getElementById("playlist-name") as HTMLInputElement | null;
  const urlInput = document.getElementById("playlist-url") as HTMLInputElement | null;
  const epgInput = document.getElementById("playlist-epg") as HTMLInputElement | null;
  if (nameInput) nameInput.value = "";
  if (urlInput) urlInput.value = "";
  if (epgInput) epgInput.value = "";
  const SN = getSpatialNav();
  if (SN) {
    SN.makeFocusable();
    SN.focus("settings");
  }
  setTimeout(() => {
    nameInput?.focus();
  }, 0);
}

function hidePlaylistModal(): void {
  const modal = $("playlist-modal");
  if (!modal) return;
  modal.classList.add("hidden");
}

function bindPlaylistModal(): void {
  const modal = $("playlist-modal");
  if (!modal) return;
  modal.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", handleSettingsAction);
  });
  document.addEventListener("keydown", (e) => {
    if (e.keyCode !== 461) return; // BACK
    const modalEl = $("playlist-modal");
    if (!modalEl || modalEl.classList.contains("hidden")) return;
    hidePlaylistModal();
    e.preventDefault();
    e.stopPropagation();
  });
}

function maybeAutoShowPlaylistModal(settings: AppSettings): void {
  if (playlistModalAutoShown) return;
  if (settings.playlists.length > 0) return;
  playlistModalAutoShown = true;
  showPlaylistModal();
}
