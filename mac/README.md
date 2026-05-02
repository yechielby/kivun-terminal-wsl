# Kivun Terminal — macOS support deprecated as of v1.2.4

**Kivun Terminal no longer ships a macOS build.** v1.2.0 → v1.2.3 each tried a different Mac terminal (Apple Terminal → iTerm2 → WezTerm) and each failed at mixed Hebrew + English rendering. The category is broken: as of 2026-05, no native macOS terminal correctly renders bidirectional Hebrew+English text inside Claude Code.

Verified failure points:

- **Apple Terminal** — has no BiDi engine. Paragraph direction cannot be set; Hebrew runs render LTR.
- **iTerm2 3.6.x** — BiDi engine mirrors Hebrew even with `BiDi=1` plist set. See [Claude Code #34134](https://github.com/anthropics/claude-code/issues/34134).
- **WezTerm 20240127+** — `bidi_enabled = true` detects direction but [character shaping is broken](https://github.com/wezterm/wezterm/discussions/5423). Mixed Hebrew+English does not render correctly.
- **Kitty / Alacritty / Foot** — no BiDi support shipped. See [kitty #2109](https://github.com/kovidgoyal/kitty/issues/2109), [alacritty #663](https://github.com/alacritty/alacritty/issues/663), [foot #756](https://codeberg.org/dnkl/foot/issues/756).
- **"Ghostty RTL fork"** — does not exist as a maintained project. The GitHub mirror sometimes referenced is a stale copy with zero original commits. Upstream Ghostty has accepted RTL [in principle](https://github.com/ghostty-org/ghostty/discussions/9774) but has not shipped it.

For Hebrew (or any RTL language) work with Claude Code today, use the **Linux** or **Windows** builds — both render correctly via Konsole. See the [root README](../README.md) for downloads.

We will re-evaluate macOS when an upstream terminal ships verified working BiDi for mixed scripts. Track that effort at the [Ghostty RTL discussions](https://github.com/ghostty-org/ghostty/discussions/9774).

## Uninstalling a v1.2.x macOS install

If you previously installed `Kivun_Terminal_Setup_mac.pkg` (v1.2.0–v1.2.3), remove it with:

```bash
sudo /usr/local/share/kivun-terminal/uninstall.sh
```

If that script is missing, download a copy from `mac/_archive/uninstall.sh` in this repository.

The uninstaller removes the desktop shortcut, the Finder Quick Action, the `/usr/local/share/kivun-terminal/` tree, and the `com.kivun.terminal` pkg receipt. It deliberately leaves Homebrew, Node.js, Git, Claude Code, and (if installed by v1.2.2/v1.2.3) WezTerm in place — remove those manually if desired.

## What's archived under `mac/_archive/`

The v1.2.3 source is preserved under `mac/_archive/` for reference and for the rare user who wants to keep building from the deprecated path. None of these files are included in v1.2.4+ releases.

- `_archive/scripts/postinstall` — the v1.2.3 .pkg postinstall (auto-installed WezTerm + bundled wezterm.lua)
- `_archive/scripts/wezterm.lua` — the v1.2.3 WezTerm config (bidi_enabled=true + Kivun light-blue theme)
- `_archive/build.sh` — the v1.2.3 .pkg builder
- `_archive/uninstall.sh` — uninstall script (still works on v1.2.x installs)
- `_archive/README.md` — the v1.2.3 mac/README

## Rolling back to v1.2.3

The `Kivun_Terminal_Setup_mac.pkg` from the v1.2.3 GitHub Release is preserved for users who want to keep using the deprecated build (with its known Hebrew rendering issues). See the [v1.2.3 release page](https://github.com/noambrand/kivun-terminal-wsl/releases/tag/v1.2.3) — note the deprecation banner there.
