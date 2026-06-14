# Optimize

M3U player for LG webOS TVs. Playlists are user-provided.

## One-Command Setup (Mac Mini)

```bash
git clone <repo-url> && cd webos-iptv && ./setup.sh
```

That single command does everything:

1. Installs **Bun**, **Node.js** deps, **webOS CLI tools**
2. Discovers your **LG TV** on the local network (SSDP + port scan)
3. Connects via **WebSocket** and pairs (accept once on TV screen)
4. **Enables Developer Mode** automatically
5. Registers the TV and fetches SSH keys
6. **Builds, packages, and deploys** the app
7. **Launches** the app on the TV

No manual TV menu navigation needed. Just accept the one-time pairing prompt.

### Prerequisites

- **Mac Mini** on the same network as the TV
- **Developer Mode** app installed on the TV (free, from LG Content Store)
- TV must be powered on

### If you know your TV's IP

```bash
./setup.sh 192.168.1.x
```

## Mit VS Code auf den TV übertragen

Das Projekt bringt eine fertige VS-Code-Integration mit (`.vscode/`), sodass du
die App direkt aus dem Editor auf den TV überträgst – ohne Terminal-Befehle.

### Einmalige Einrichtung

1. Öffne den Projektordner in VS Code (`code .`).
2. Bestätige unten rechts die **empfohlenen Erweiterungen** (LG webOS Studio + Bun).
3. Falls der TV noch nicht eingerichtet ist: Befehlspalette
   (`Cmd/Ctrl+Shift+P`) → **Tasks: Run Task** → **webOS: Setup TV (Discover + Deploy)**.
   Das findet den TV, aktiviert den Dev-Mode, registriert ihn als Gerät `lgtv`
   und installiert die App. Den Pairing-Hinweis am TV einmal bestätigen.

### App übertragen

- **Schnellster Weg:** `Cmd/Ctrl+Shift+B` – baut, paketiert und installiert die
  App auf dem Gerät und startet sie (Standard-Build-Task „webOS: Deploy to TV").
- **Oder per Tastendruck `F5`** – startet die Konfiguration „Deploy to TV".
- **Oder über die Befehlspalette:** **Tasks: Run Task** und einen Task wählen:

  | Task | Funktion |
  |------|----------|
  | webOS: Setup TV (Discover + Deploy) | TV suchen, Dev-Mode, registrieren, deployen |
  | webOS: Deploy to TV | Bauen, paketieren, installieren, starten |
  | webOS: Deploy + DevTools (Inspect) | Wie oben, öffnet danach den Chrome-Inspector |
  | webOS: Build | Nur bündeln (`dist/webos-app`) |
  | webOS: Package (.ipk) | `.ipk`-Paket erzeugen |
  | webOS: List Devices | Registrierte TV-Geräte anzeigen |

Beim Deploy fragt VS Code nach dem **Gerätenamen** (Standard `lgtv`). Hast du den
TV über das Setup eingerichtet, einfach mit Enter bestätigen.

> Voraussetzung: webOS-CLI-Tools (`ares-*`). Werden vom Setup automatisch
> installiert, alternativ manuell: `npm install -g @webos-tools/cli`.

## Remote Control

| Key | Action |
|-----|--------|
| OK / Enter | Open channel list |
| Up / Down | Zap channels |
| 0-9 | Direct channel number (auto-tunes after 3s) |
| Red | Toggle favorite |
| Green | Programme guide (EPG) |
| Yellow | Channel info |
| Blue | Settings |
| Back | Previous channel / Exit |
| Ch+/Ch- | Next / previous channel |

## Manual Commands

```bash
bun run setup                        # Full automated setup
bun run build                        # Bundle the app
bun run scripts/package.ts           # Create .ipk
bun run scripts/deploy.ts <device>   # Deploy to TV
bun run scripts/dev.ts <device>      # Deploy + open debugger
bun test                             # Run tests
```

## Playlists

No playlists are bundled. Add your own M3U/M3U8 playlists in the Settings panel (Blue button on remote).
