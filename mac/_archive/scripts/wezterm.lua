-- Kivun Terminal — WezTerm config for correct Hebrew/Arabic/Persian rendering.
--
-- Loaded by the Kivun desktop shortcut via `wezterm --config-file`.
-- Your own ~/.config/wezterm/wezterm.lua is NOT touched and applies to
-- WezTerm sessions you start outside of Kivun.
--
-- Why this file exists: WezTerm 20240127+ supports BiDi paragraph
-- reordering, but ships with `bidi_enabled = false` by default.
-- Without enabling it, Hebrew/Arabic/Persian render LTR-mirrored
-- inside Claude Code. See kivun-terminal-rtl-debug.v2.md.

local wezterm = require 'wezterm'
local config = wezterm.config_builder()

-- BiDi paragraph reordering — required for RTL rendering.
config.bidi_enabled = true
config.bidi_direction = 'AutoLeftToRight'

-- Kivun light-blue color scheme (matches the Linux Konsole + Apple
-- Terminal builds — same colors the .pkg sets via osascript).
config.colors = {
    background    = '#C8E6FF',
    foreground    = '#000000',
    cursor_bg     = '#191919',
    cursor_fg     = '#FFFFFF',
    cursor_border = '#191919',
    selection_bg  = '#A0C0E0',
    selection_fg  = '#000000',
}

-- Don't prompt on Cmd+W / window close — claude exits cleanly.
config.window_close_confirmation = 'NeverPrompt'

-- Hide the tab bar when only one tab is open; less visual chrome.
config.hide_tab_bar_if_only_one_tab = true

return config
