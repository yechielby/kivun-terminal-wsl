# Kivun Terminal v1.4.3

Three fixes from continued v1.4.x user testing.

## 1. Existing profiles auto-clean `--effort low`

v1.4.2 dropped the `+ Low effort` chip but didn't touch profiles that already had `--effort low` baked into their custom flags. Users with `CLAUDE_FLAGS=--effort low` in their pre-v1.4.0 `config.txt` had it migrated into their Default profile and kept seeing it.

v1.4.3 adds a `scrubDeprecatedFlags()` pass on every profile load that strips `--effort low` from custom flags and persists the cleanup. One open of the picker = `--effort low` gone from all your profiles.

## 2. Profile chips render reliably

v1.4.1 swapped the broken `<select>` for chip buttons but built them with `document.createElement("button")` + `btn.onclick = function() {...}`. That pattern works for STATIC HTML elements (the existing flag chips), but is unreliable for DYNAMICALLY-created buttons in HTA — handlers sometimes don't fire even though the button visually renders. v1.4.3 builds the chip row as a single `innerHTML` string with inline `onclick="switchToProfile('Name')"` attributes, which lets IE parse the handler at render time. Profile names get HTML-entity escaped to keep names with quotes/ampersands safe.

## 3. Custom flags placeholder removed

The `placeholder` text on the Custom flags textbox (*"Click chips above, or type any flags here verbatim"*) was annoying. Empty now. The help line below still describes what the field does.

## Files changed

- `payload/folder-picker.hta` — chip render via innerHTML, scrubDeprecatedFlags, placeholder cleared
- `VERSION`, `docs/CHANGELOG.md` — version bump + changelog
- `docs/README.md`, `docs/README_INSTALLATION.md`, `docs/TROUBLESHOOTING.md` — version stamps

## Reinstall

Download `Kivun_Terminal_Setup.exe` from the v1.4.3 release page and run it. NSIS overwrites the existing install. On next picker open: `--effort low` will be gone from your Default profile, the chip row will render, and the Custom box won't have the hated placeholder.
