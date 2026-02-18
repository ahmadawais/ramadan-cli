# Changelog

All notable changes to this project will be documented in this file.

## [6.0.0] - 2026-02-18 (PR #17)

### breaking
- Major Ramadan CLI rewrite with a Ramadan-first command surface.
- Default invocation is now Ramadan Sehar/Iftar focused (`ramadan-cli` / `roza`).
- One-off city lookups no longer overwrite saved default location.
- Config model and runtime behavior are now explicitly contract-driven for human + script usage.

### feat
- Added first-run guided setup (Clack) with:
  - city/country capture
  - recommended method/school selection
  - timezone handling
- Added robust geolocation flow with multi-provider fallback.
- Added Ramadan-focused output modes:
  - today/default view
  - full month (`-a, --all`)
  - specific roza (`-n, --number <1-30>`)
- Added row annotations in `--all` mode for `current` and `next`.
- Added city alias support: `sf` => `San Francisco`.
- Added persistent first-roza override:
  - `--first-roza-date <YYYY-MM-DD>`
  - `--clear-first-roza-date`
- Added non-interactive configuration subcommand:
  - `ramadan-cli config --city --country --latitude --longitude --method --school --timezone`
  - `ramadan-cli config --show`
  - `ramadan-cli config --clear`
- Added `reset` command to clear saved Ramadan CLI state.
- Added 12-hour Sehar/Iftar rendering and themed Ramadan terminal output.
- Added JSON output mode for script usage.

### fix
- Hardened API response parsing and validation with Zod at runtime boundaries.
- Fixed failure paths where API returned message strings instead of expected objects.
- Improved fetch fallbacks across address/city/coords query strategies.
- Ensured reset clears saved Ramadan config state consistently.
- Standardized `--json` failure output to structured error payload on `stderr`:
  - `{"ok":false,"error":{"code":"...","message":"..."}}`
- Improved help examples to show full city and alias usage:
  - `"San Francisco"` and `"sf"`

### docs
- Rewrote README with updated CLI contract and modern usage guidance.
- Added and linked new GitHub cover image.
- Restored a friendlier, high-signal README vibe with badges and clearer quick usage.
- Added/updated agent docs:
  - `skills/spec.md`
  - `skills/skill.md`
- Added explicit agent installation flow:
  - `npx skills add ahmadawais/ramadan-cli`

### test
- Expanded Vitest coverage for:
  - Ramadan date/roza calculations
  - recommendations
  - setup/config behavior
  - config parsing and validation
  - JSON error payload mapping

### chore
- Standardized stack for this rewrite:
  - TypeScript (`strict`, `noUncheckedIndexedAccess`)
  - Commander + Clack + Ora + Picocolors
  - Vitest + tsup + pnpm
- Updated CLI/spec/skill docs to reflect current command contract and behavior.

## [0.0.1] - 2026-02-18

### feat
- Initial rewrite milestone snapshot on the new TypeScript/Commander stack.
