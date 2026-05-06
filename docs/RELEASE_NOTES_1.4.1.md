# Kivun Terminal v1.4.1

## Fix

**Profile bar now uses chip buttons instead of a dropdown.**

v1.4.0 shipped the profile bar with an HTML `<select>` dropdown. Under HTA / mshta, `<select onchange>` does not fire reliably — a known issue from the model-selection refactor earlier in the project. v1.4.0 was effectively a broken release for the headline feature: clicking a profile name in the dropdown wouldn't load it.

v1.4.1 replaces the dropdown with a horizontal row of clickable chip buttons, one per profile. The active profile is highlighted blue. Click any chip to switch — works reliably because chip `onclick` (a `<button>`) fires correctly under mshta, the same pattern used by the existing flag chips since v1.3.0.

## What changed

- Profile bar: `<select>` + `onchange` → row of `<button class="profile-chip">` elements
- "Save As…" → "+ New" (visual parity with the chip aesthetic)
- Rename / Delete buttons unchanged
- Active profile rendered with `.active` styling (filled blue, white text); inactive profiles render as light-gray outlined chips

## Compatibility

`profiles.json` schema unchanged from v1.4.0. Existing profile data persists across the update.

## Why this didn't catch in CI

The static-lint job verifies that the profile JSON parsing functions (`loadProfiles`, `parseEnvVars`, `writeEnvFile`) exist in the picker, but doesn't verify that the chosen UI widget actually fires events. Behavioral testing of an HTA dialog in CI requires a Windows runner with mshta, IE COM automation, and a way to simulate clicks — significant setup for a single widget choice. Project memory was the documented guard, and it was correct; I just didn't read it before designing the bar. Memory updated and the new feedback rule (`feedback_plan_means_ship.md`) now sits next to `project_kivun_picker_features.md` so future picker work runs the existing widget-choice gauntlet first.

## Files changed

- `payload/folder-picker.hta` — profile bar refactor (CSS + JS + HTML)
- `VERSION`, `docs/CHANGELOG.md` — version bump + changelog entry
- `docs/README.md`, `docs/README_INSTALLATION.md`, `docs/TROUBLESHOOTING.md` — version stamps via `tools/bump-version.sh`
