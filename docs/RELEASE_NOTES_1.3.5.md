![Kivun Terminal](https://raw.githubusercontent.com/noambrand/kivun-terminal-wsl/main/Kivun_Terminal_Hero.png)

## Windows

1. Download **Kivun_Terminal_Setup.exe** below.
2. Run the installer — follow the wizard.
3. Double-click the **Kivun Terminal** desktop shortcut.

> **First launch** can take 5–10 minutes — the installer pulls Ubuntu (WSL2), Konsole, and Claude Code on its own.

## Linux

Download **kivun-terminal-linux-1.3.5.tar.gz** below.

```bash
tar -xzf kivun-terminal-linux-1.3.5.tar.gz
cd kivun-terminal-linux-1.3.5
./install.sh
```

---

## What's new in v1.3.5

### Folder picker dialog

Double-clicking the desktop shortcut now opens a folder picker with two clearly numbered options:

- **Type or paste a Windows path** (e.g. `C:\Users\you\projects\my-app`) and click **Launch Kivun Terminal**.
- **Browse Folder Tree** to pick a folder visually.

The same dialog has an **Edit Default Flags** button that opens `config.txt` so you can change the Claude flags, response language, and other settings without leaving the launcher. Cancel falls back silently to your home folder. Right-click "Open with Kivun Terminal" still opens that folder directly, skipping the picker.

### Default Claude flags

You can now set Claude flags that apply to every launch. Edit `%LOCALAPPDATA%\Kivun-WSL\config.txt`:

```ini
CLAUDE_FLAGS=--model opus --continue
```

The full reference list of supported flags lives at the bottom of `config.txt` for easy lookup.

### Single Claude window only

Earlier versions could open two Claude windows on slower machines. v1.3.5 fixes this — only one Claude window opens, every time.

### Two-line statusline

The statusline at the bottom of every Claude session now correctly shows two lines (model + context %, weekly + session limits) instead of squashing into one.

---

## Current Features

| Feature | Windows | Linux |
|---|---|---|
| **Folder picker dialog** | ✅ Type path or browse tree | — |
| **Right-click "Open with Kivun Terminal"** | ✅ | — |
| **Default Claude flags** | ✅ via `config.txt` | ✅ via `config.txt` |
| **Hebrew / Arabic / Persian / Urdu RTL** | ✅ | ✅ |
| **Alt+Shift keyboard switch** | ✅ via VcXsrv | ✅ |
| **Light-blue Kivun Konsole theme** | ✅ | ✅ |
| **Statusline (model, context, usage)** | ✅ | ✅ |
| **BiDi wrapper for bullet lines** | ✅ | ✅ |
| **23 supported RTL / mixed-script languages** | ✅ | ✅ |
| **Auto-install Claude on first launch** | ✅ | ✅ |

### Included components

- **WSL2 + Ubuntu** *(Windows only)* — required for the Linux Konsole rendering layer
- **Konsole** — KDE terminal emulator with native BiDi support
- **Claude Code** — installed via Anthropic's official curl installer
- **kivun-claude-bidi** — Node.js wrapper that fixes Hebrew/Arabic rendering bugs in Claude's terminal output
- **VcXsrv** *(optional, manual install)* — needed only for Alt+Shift keyboard switching

---

## First time?

You'll need a Claude Pro/Max subscription or an [Anthropic API key](https://console.anthropic.com). Claude will prompt for it on first launch.

Need help? See the [installation guide](https://github.com/noambrand/kivun-terminal-wsl/blob/main/docs/README_INSTALLATION.md) and [troubleshooting](https://github.com/noambrand/kivun-terminal-wsl/blob/main/docs/TROUBLESHOOTING.md).

See the [CHANGELOG](https://github.com/noambrand/kivun-terminal-wsl/blob/main/docs/CHANGELOG.md) for full version history.
