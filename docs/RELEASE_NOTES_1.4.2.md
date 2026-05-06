# Kivun Terminal v1.4.2

## Drop "Low effort" chip from the picker

User feedback: *"you put effort low as a default? use high"*. The chip was a one-click suggestion in the flag-chips row; even though Low wasn't auto-applied, presenting it as a suggested option read as endorsement of the lazy-Claude path.

- `+ Low effort` chip removed from the picker dialog.
- `+ High effort` chip stays.
- Power users can still type `--effort low` into the Custom flags field manually if needed; the chip just stops suggesting it.

## Refresh README badges (version + downloads)

Both shields.io badges in the README got a `&cb=v1.4.2` cachebust query param. GitHub's `camo.githubusercontent.com` proxy caches badge SVGs by URL hash; without a cachebust, the version badge can show a stale release tag for hours after a new release ships. The new query param changes the URL hash, so GitHub fetches a fresh image immediately on next page render.

Per `project_badge_resync_warning.md`, this is the **non-destructive** way to refresh badges — no asset clobbering, no download-count loss.

## Files changed

- `payload/folder-picker.hta` — drop `chip-effort-low` from `bindChips` template list and HTML
- `README.md` — add `&cb=v1.4.2` to version + downloads badge URLs
- `VERSION`, `docs/CHANGELOG.md` — version bump + changelog entry
- `docs/README.md`, `docs/README_INSTALLATION.md`, `docs/TROUBLESHOOTING.md` — version stamps via `tools/bump-version.sh`
