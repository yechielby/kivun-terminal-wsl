'use strict';

// HEAVY §5: terminal detection. The wrapper exists to compensate for
// terminals that LACK BiDi paragraph reordering — Konsole at v1 ship.
//
// macOS deprecation (v1.2.4, 2026-05): Apple Terminal was previously in
// the allowlist (v1.2.1+), but the project deprecated macOS support
// entirely after v1.2.0–v1.2.3 confirmed no Mac terminal renders mixed
// Hebrew+English correctly. `apple-terminal` was removed from the
// allowlist on 2026-05-03. iTerm2 and WezTerm remain in the rejection
// list as defense-in-depth in case the wrapper is invoked on a Mac
// somehow (e.g. via the Linux build path).
//
// To add a terminal here, confirm: (a) it has no working BiDi engine, AND
// (b) it honors RLM at line start to flip paragraph direction. File the
// integration-gate test result in docs/research/.

const KNOWN_TERMINALS = [
  {
    name: 'konsole',
    matches: (env) => Boolean(env.KONSOLE_VERSION) || Boolean(env.KONSOLE_DBUS_SESSION),
    profile: (env) => env.KONSOLE_PROFILE_NAME || null,
  },
];

// Native-BiDi terminals: the wrapper is REJECTED here because their own
// BiDi engine already reorders Hebrew runs (or claims to — WezTerm's
// shaping is half-broken; iTerm2 3.6.x mirrors Hebrew). Double-application
// produces mirrored Hebrew either way. Detected so we can return a clear
// error message telling the launcher (or the user) to disable the wrapper.
const NATIVE_BIDI_TERMINALS = [
  { name: 'iterm2',  matches: (env) => env.TERM_PROGRAM === 'iTerm.app' },
  { name: 'wezterm', matches: (env) => env.TERM_PROGRAM === 'WezTerm' },
];

function detectTerminal(env = process.env) {
  for (const t of KNOWN_TERMINALS) {
    if (t.matches(env)) {
      return { ok: true, name: t.name, profile: t.profile(env) };
    }
  }
  for (const t of NATIVE_BIDI_TERMINALS) {
    if (t.matches(env)) {
      return {
        ok: false,
        nativeBidi: true,
        name: t.name,
        reason: `${t.name} has a native BiDi engine; wrapper would double-apply marks. Set KIVUN_BIDI_WRAPPER=off.`,
      };
    }
  }
  return {
    ok: false,
    reason: 'not running in a supported terminal (Konsole only since v1.2.4 — macOS deprecated)',
  };
}

module.exports = { detectTerminal, KNOWN_TERMINALS, NATIVE_BIDI_TERMINALS };
