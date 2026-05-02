'use strict';

// HEAVY §5: terminal detection. The wrapper exists to compensate for
// terminals that LACK BiDi paragraph reordering — Konsole at v1 ship, and
// Apple Terminal on macOS. Terminals that have a working native BiDi
// engine (iTerm2, WezTerm) are intentionally excluded: wrapping their
// output with RLE/PDF marks causes double-application and Hebrew comes
// out mirrored. See `kivun-terminal-rtl-debug.v2.md` §2.5.
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
  {
    name: 'apple-terminal',
    matches: (env) => env.TERM_PROGRAM === 'Apple_Terminal',
    profile: (env) => env.TERM_PROGRAM_VERSION || null,
  },
];

// Native-BiDi terminals: the wrapper is REJECTED here because their own
// BiDi engine already reorders Hebrew runs. Double-application produces
// mirrored Hebrew. Detected so we can return a clear error message
// telling the launcher (or the user) to disable the wrapper.
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
    reason: 'not running in a supported terminal (Konsole or Apple Terminal)',
  };
}

module.exports = { detectTerminal, KNOWN_TERMINALS, NATIVE_BIDI_TERMINALS };
