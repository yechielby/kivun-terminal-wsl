# Kivun Terminal v1.4.0

## Highlights

**Named profiles in the folder picker.** Save folder + model + flags + startup commands + env vars per project, switch between them from a dropdown at the top of the launch dialog. No more re-typing the same combo every time.

**Per-profile environment variables.** New `KEY=VAL` textbox in the picker for `ANTHROPIC_API_KEY` switching, `DEBUG` flags, custom `MCP_*`, etc. Values are **masked in the resolved-command preview by default** for screenshot safety; click `👁 show values` to reveal.

**Richer resolved-command preview.** The picker's preview row used to show only the flags. It now shows the full `$ claude …` invocation, plus secondary lines for startup slash-commands (`↳ then types: /voicemode:converse, /model opus`) and env-vars (`↳ with env (masked): ANTHROPIC_API_KEY=…(set)`). Catch "wait, I forgot to remove `--continue`" before it bites.

## Compatibility

- **Existing users:** First launch on v1.4.0 migrates your current `CLAUDE_FLAGS=` line from `config.txt` into a "Default" profile in the new `%LOCALAPPDATA%\Kivun-WSL\profiles.json` (Linux: `~/.config/kivun-terminal/profiles.json`). No flags lost.
- **`config.txt`:** Keeps the BiDi tunables and language settings. The `CLAUDE_FLAGS=` line is still written for backwards compat with anything scraping `config.txt`, but `profiles.json` is the source of truth from v1.4.0 onwards.
- **Linux:** No picker yet on Linux, so profiles are Windows-only for now. Linux users who want per-session env vars can drop a `~/.config/kivun-terminal/kivun-env.txt` (`KEY=VAL` per line); `kivun-launch.sh` will source it on launch.

## Security notes

- Env-var values are **masked by default** in the preview (only the keys are shown, with `=…(set)` after each). Click the `👁 show values` toggle if you want to see them — but assume any screenshot you take with values revealed will leak.
- The Linux launcher reads `kivun-env.txt` with a `while read` loop and `export "$key=$val"`, **not** `source`. Without this, `$(…)` and backticks inside user-typed values would be re-evaluated by the shell on every launch — same RCE class the existing `CLAUDE_FLAGS` `printf %q` hardening guards against. Keys are re-validated on read on both platforms (`[A-Za-z_][A-Za-z0-9_]*`) because hand-edited files don't go through the picker's validation.
- The Windows side propagates env vars across the Windows→WSL boundary via `WSLENV`. Without that, cmd.exe-set vars never reach the bash process — they'd silently do nothing. CI coverage for the round-trip is on the v1.4.x roadmap.

## Inspiration / credit

The named-profiles UX was inspired by [talayash/claude-terminal](https://github.com/talayash/claude-terminal) (MIT). That project is a Tauri + React + Zustand desktop shell, fundamentally different stack — no code was copied. Schema field names and UX language were transcribed (`name`, `customFlags`, `envVars`, etc.) so a future migration tool between the two could be a one-evening script. Both projects are MIT-licensed.

## What's NOT in v1.4.0

- Multi-terminal grid view, tabs, file explorer, editor, git pane — all present in claude-terminal but require a full rewrite as a Tauri app. Out of scope for an RTL launcher.
- Auto-update (item #2 from the planning round). Independent feature; targeted for v1.4.1.
- A new `picker.png` showing the profile bar. The current screenshot still shows the v1.3.5 picker; a refresh ships in v1.4.1 once the new dialog has had real-world testing.

## Files changed

- `payload/folder-picker.hta` — profile bar, env-vars section, masked preview, JSON profile storage, first-run migration.
- `payload/kivun-terminal.bat` — `kivun-env.txt` reader, `:ADDENV` subroutine, `WSLENV` propagation.
- `linux/kivun-launch.sh` — env-var sourcing in the inner `LAUNCHEOF` script.
- `VERSION`, `docs/CHANGELOG.md` — version bump + changelog entry.
- `README.md` — new bullet under "What's included out of the box."
