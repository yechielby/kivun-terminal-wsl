'use strict';

// HEAVY §5: terminal detection. Konsole was the v1 sole entry; macOS
// terminals were added once the wrapper architecture proved out — they
// all set TERM_PROGRAM, so the predicate is uniform.
//
// To widen the allowlist later, append entries to KNOWN_TERMINALS — each
// entry needs a name, a predicate on the env, and an integration-gate
// test result filed in docs/research/.

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
  {
    name: 'iterm2',
    matches: (env) => env.TERM_PROGRAM === 'iTerm.app',
    profile: (env) => env.TERM_PROGRAM_VERSION || null,
  },
  {
    name: 'wezterm',
    matches: (env) => env.TERM_PROGRAM === 'WezTerm',
    profile: (env) => env.TERM_PROGRAM_VERSION || null,
  },
];

function detectTerminal(env = process.env) {
  for (const t of KNOWN_TERMINALS) {
    if (t.matches(env)) {
      return { ok: true, name: t.name, profile: t.profile(env) };
    }
  }
  return {
    ok: false,
    reason: 'not running in a supported terminal (Konsole, Apple Terminal, iTerm2, or WezTerm)',
  };
}

module.exports = { detectTerminal, KNOWN_TERMINALS };
