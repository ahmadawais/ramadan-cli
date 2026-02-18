# Ramadan CLI Spec

## 1. Purpose

`ramadan-cli` is a Ramadan-only CLI that reports:

- Sehar timings (`Fajr`)
- Iftar timings (`Maghrib`)
- roza numbering and Ramadan-day context

It prioritizes low-friction defaults (auto setup, saved config) with deterministic CLI behavior.

## 2. Scope

In scope:

- Ramadan-focused timing views (`today`, `--all`, `--number`)
- First-run interactive setup
- Location and prayer-setting persistence
- Country-based method and school recommendation
- Countdown highlights for current/next Sehar or Iftar
- Custom first roza date override

Out of scope:

- Full non-Ramadan prayer suite as primary output
- Qibla, methods listing, or month views unrelated to Ramadan rows

## 3. CLI Contract

Executable names:

- `ramadan-cli`
- `ramzan`
- `ramazan`
- `ramadan`
- `roza`

Main command:

- `ramadan-cli [city] [options]`

Subcommands:

- `ramadan-cli reset`

Flags:

- `-a, --all`
- `-n, --number <1-30>`
- `-p, --plain`
- `-j, --json`
- `--first-roza-date <YYYY-MM-DD>`
- `--clear-first-roza-date`
- `-v, --version`
- `-h, --help`

## 4. Data Semantics

- Sehar is derived from `timings.Fajr`.
- Iftar is derived from `timings.Maghrib`.
- Display format is 12-hour clock (`AM/PM`) in text output.
- Ramadan row shape:
  - `roza`
  - `sehar`
  - `iftar`
  - `date`
  - `hijri`

## 5. First-Run Setup

When no saved location exists and command is interactive (TTY), CLI must prompt for:

- city
- country
- calculation method
- Asr school
- timezone preference (detected/custom/skip)

Setup saves config for future runs.

If `--json` is used, CLI must skip interactive setup.

## 6. Query Resolution Rules

Order when city arg is not provided:

1. Use saved location/settings if available.
2. If interactive and no saved config, run first-run setup.
3. Fallback to IP geo auto-detection and save.
4. If geo detection fails, return actionable error.

When city arg is provided:

- Treat as one-off query.
- Do not overwrite saved default location.
- Apply country-aware recommendation for this request only when possible.

## 7. Recommendation Rules

- Method recommendation is country-based.
- School recommendation is country-based.
- Existing explicit non-default user settings are preserved during recommendation logic.

## 8. Roza Numbering Rules

Default mode:

- If Hijri month is Ramadan, use current Hijri day as roza number.
- If not in Ramadan, show day 1 of target Ramadan calendar year.

Custom first roza mode:

- `--first-roza-date` sets persisted start date.
- roza number is computed from Gregorian day difference.
- `--clear-first-roza-date` removes override and returns to API Ramadan date behavior.

## 9. Output Modes

Text mode:

- banner (unless plain)
- row table
- highlight section (`Current`, `Next`, countdown)

JSON mode:

- structured object with `mode`, `location`, `hijriYear`, `rows`
- no interactive prompt flow

## 10. Reset Behavior

`ramadan-cli reset` clears saved Ramadan CLI configuration, including:

- location
- method
- school
- timezone
- custom first roza date

## 11. Engineering Constraints

- TypeScript strict mode with `noUncheckedIndexedAccess`
- Zod at runtime boundaries
- Functional style only (no classes)
- Commander for CLI
- Clack for interactive prompts
- Vitest tests
- tsup build
- pnpm package manager

## 12. Validation Commands

Required local checks:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm lint`
