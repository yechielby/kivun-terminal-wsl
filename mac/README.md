# Kivun Terminal - macOS Quickstart

A macOS `.pkg` installer that bundles Claude Code with a Kivun-themed Terminal.app configuration and an Automator right-click entry in Finder.

## What the installer does

1. Installs Xcode Command Line Tools (if missing).
2. Installs Homebrew (if missing) - in `.pkg` non-TTY context, uses a self-cleaning temporary passwordless-sudo entry for the install only.
3. Installs Node.js, Git, and Claude Code CLI (each skipped if already present).
4. **Installs WezTerm** via `brew install --cask wezterm` (skipped if already present). WezTerm is the only macOS terminal in our matrix that renders Hebrew correctly out of the box - Apple Terminal lacks BiDi paragraph reordering, and iTerm2 3.6.x has a broken BiDi engine that mirrors Hebrew. The user does not have to install it manually.
5. Copies `statusline.mjs` to `/usr/local/share/kivun-terminal/statusline.mjs` and registers it in Claude Code's `~/.claude/settings.json`.
6. Creates (or migrates) `~/Library/Application Support/Kivun-Terminal/config.txt` with `MAC_TERMINAL=wezterm` and `KIVUN_BIDI_WRAPPER=off` - the only combo that produces correct RTL on macOS. Pre-existing configs are backed up to `config.txt.bak.pre-v1.2.2` before being migrated.
7. Deploys the **`kivun-claude-bidi` wrapper** to `/usr/local/share/kivun-terminal/kivun-claude-bidi/` and runs `npm install --production` once during postinstall (as the real user, so `node-pty` builds against your actual arch - Intel vs Apple Silicon). The wrapper is shipped but **not active by default** because WezTerm has native BiDi; the wrapper is reserved for users who manually switch to `MAC_TERMINAL=terminal`.
8. Creates a desktop launcher `~/Desktop/Kivun Terminal.command` that pops a Finder folder picker and launches Claude Code inside WezTerm (via `wezterm start --cwd`).
9. Installs a Finder Quick Action at `~/Library/Services/Open with Kivun Terminal.workflow` so you can right-click any folder → Services → "Open with Kivun Terminal".

## Install

Download `Kivun_Terminal_Setup_mac.pkg` from the [latest GitHub release](https://github.com/noambrand/kivun-terminal-wsl/releases/latest).

The installer is currently unsigned, so macOS blocks it on first attempt. Bypass:

1. Double-click the downloaded `.pkg` file (usually in Downloads).
2. Close the security warning dialog.
3. Click the Apple menu ( in the top-left corner of your screen) → **System Settings** → **Privacy & Security**.
4. Scroll down and click **Allow Anyway** next to the blocked app.
5. Double-click the `.pkg` again to run the installer.

macOS will ask for your admin password during install — that's normal (the installer needs to install Homebrew and Claude Code system-wide).

Install log lives at `/tmp/kivun_install.log` - check there if something goes wrong.

## Config file

`~/Library/Application Support/Kivun-Terminal/config.txt`:

- `RESPONSE_LANGUAGE` - one of 23 values (english, hebrew, arabic, persian, urdu, kurdish, pashto, sindhi, yiddish, syriac, dhivehi, nko, adlam, mandaic, samaritan, dari, uyghur, balochi, kashmiri, shahmukhi, azeri-south, jawi, turoyo)
- `MAC_TERMINAL` - `wezterm` (default; auto-installed by the .pkg), `terminal`, or `iterm2`. Apple Terminal cannot do RTL paragraph alignment and iTerm2 3.6.x's BiDi is broken; only WezTerm renders Hebrew correctly.
- `TERMINAL_COLOR` - `kivun` (light-blue theme applied via osascript) or `default`
- `FOLDER_PICKER` - `true` (default on macOS; shortcut pops a folder picker) or `false`
- `CLAUDE_FLAGS` - optional flags passed to every `claude` invocation (e.g. `--continue`)
- `KIVUN_BIDI_WRAPPER` - `off` (default). Set to `on` only if you've also set `MAC_TERMINAL=terminal` (Apple Terminal). On WezTerm/iTerm2 the wrapper would double-apply BiDi marks and mirror Hebrew.

## Build from source

Requires macOS with Xcode Command Line Tools.

```bash
chmod +x mac/build.sh
./mac/build.sh            # uses version from VERSION file
./mac/build.sh 1.0.6      # explicit version
```

Output: `build/Kivun_Terminal_Setup_mac.pkg`.

## Uninstall

```bash
sudo /usr/local/share/kivun-terminal/uninstall.sh
```

Or from the source repo:

```bash
./mac/uninstall.sh
```

Removes the desktop shortcut, the Finder Quick Action, the shell-rc `CLAUDE_CODE_STATUSLINE` export, the Kivun statusLine entry from `~/.claude/settings.json`, the `/usr/local/share/kivun-terminal/` tree, and the `com.kivun.terminal` pkg receipt. Prompts before removing the config file. Leaves Homebrew, Node, Git, and Claude Code in place - remove those yourself if desired.

## CI build

`.github/workflows/build-mac.yml` builds the `.pkg` on `macos-latest` on every tag push (`v*`) and on manual workflow dispatch. It uploads the `.pkg` as a workflow artifact, and on tag push also attaches it to the GitHub Release.

## Known limitations

- **Hebrew RTL on macOS requires WezTerm.** Apple Terminal cannot do RTL paragraph alignment at all (no BiDi engine). iTerm2 3.6.x has a broken BiDi engine that mirrors Hebrew. Only WezTerm renders Hebrew correctly, which is why the .pkg auto-installs it and sets `MAC_TERMINAL=wezterm` as the default. If you choose to use Apple Terminal, the bundled `kivun-claude-bidi` wrapper still helps with the bullet-line direction bug ([anthropics/claude-code#39881](https://github.com/anthropics/claude-code/issues/39881)) but RTL paragraph alignment will not work.
- **Code-signing / notarization** - the `.pkg` is currently unsigned, so macOS Gatekeeper blocks it on first run. See the [Install](#install) section above for the System Settings → Privacy & Security bypass.
- **Intel vs Apple Silicon** - the postinstall auto-detects `uname -m` and installs Homebrew at `/opt/homebrew` (arm64) or `/usr/local/Homebrew` (x86_64).
