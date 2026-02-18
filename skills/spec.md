# Ramadan CLI Spec

## 1. Purpose

`ramadan-cli` is a Ramadan-only CLI that reports:

- Sehar timings (`Fajr`)
- Iftar timings (`Maghrib`)
- roza numbering and Ramadan-day context

It prioritizes low-friction defaults (auto setup, saved config) with deterministic CLI behavior.

Primary user: humans and scripts.

## 2. Scope

In scope:

- Ramadan-focused timing views (default invocation, `--all`, `--number`)
- First-run interactive setup
- Location and prayer-setting persistence
- Country-based method and school recommendation
- Countdown highlights for current/next Sehar or Iftar
- Custom first roza date override

Out of scope:

- Full non-Ramadan prayer suite as primary output
- Qibla, methods listing, or month views unrelated to Ramadan rows

## 3. CLI Surface Area

Executable names:

- `ramadan-cli`
- `ramzan`
- `ramazan`
- `ramadan`
- `roza`
- city alias: `sf` => `San Francisco`

USAGE synopsis:

- `ramadan-cli [city] [options]`

Subcommands:

- `ramadan-cli reset`
- `ramadan-cli config`

Important:

- There is no `today` subcommand.
- Default run (`ramadan-cli`) is the today view.

Global/main flags:

- `-a, --all`
- `-n, --number <1-30>`
- `-p, --plain`
- `-j, --json`
- `--first-roza-date <YYYY-MM-DD>`
- `--clear-first-roza-date`
- `-v, --version`
- `-h, --help`

Main argument:

- `[city]` (string, optional): one-off location input.

Config flags (`ramadan-cli config`):

- `--city <city>`
- `--country <country>`
- `--latitude <latitude>`
- `--longitude <longitude>`
- `--method <id>`
- `--school <id>`
- `--timezone <timezone>`
- `--show`
- `--clear`

## 3.1 Flag Semantics

- `-h, --help` always prints help.
- `-v, --version` prints only version.
- `--all` and `--number` are mutually exclusive.
- `--clear-first-roza-date` clears persisted first roza override immediately.
- City argument/`--city` on main command is one-off and does not persist as default.

## 3.2 Input Sources

- Args and flags are the primary input interface.
- No stdin input contract is currently defined.
- No secret input is expected by this CLI.

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

## 9. Output Modes and I/O Contract

Text mode:

- banner (unless plain)
- row table
- highlight section (`Status`, `Up next`, countdown)
- in `--all` mode, right-side row annotations mark `← current` and `← next`

JSON mode:

- structured object with `mode`, `location`, `hijriYear`, `rows`
- no interactive prompt flow

Streams:

- primary data to `stdout`
- error diagnostics to `stderr` (notably in `--json` failures)

## 10. Reset Behavior

`ramadan-cli reset` clears saved Ramadan CLI configuration, including:

- location
- method
- school
- timezone
- custom first roza date

## 10.1 Non-Interactive Config

All core setup fields must be configurable without prompts through `ramadan-cli config` flags:

- location (`city` / `country` / `latitude` / `longitude`)
- method
- school
- timezone

`--show` must print saved values.
`--clear` must clear saved configuration.

## 11. Exit Codes and Errors

- `0`: success
- `1`: runtime failure (network/API/validation/data)
- invalid usage parse errors currently follow Commander defaults

Top failure modes:

- invalid API payload
- unresolved location (no city and geo failure)
- invalid first roza date format
- incompatible flags (`--all` with `--number`)

## 12. Interactivity and Safety

- Prompts are allowed only when command is interactive (TTY) and `--json` is not set.
- In non-interactive/script flows, use flags (`config`, `--json`, explicit city input).
- Destructive state changes are explicit:
  - `reset`
  - `config --clear`
  - `--clear-first-roza-date`

## 13. Config and Precedence

Configuration stack:

1. invocation flags/args
2. saved user config
3. auto-detected geolocation fallback

Additional rules:

- Method/school recommendations are applied when settings are default/unset.
- Explicit non-default user settings are preserved.
- `RAMADAN_CLI_CONFIG_DIR` changes storage location for config state.

## 14. Shell Completion

- Not implemented in current CLI surface.

## 15. Engineering Constraints

- TypeScript strict mode with `noUncheckedIndexedAccess`
- Zod at runtime boundaries
- Functional style only (no classes)
- Commander for CLI
- Clack for interactive prompts
- Vitest tests
- tsup build
- pnpm package manager

## 16. Validation Commands

Required local checks:

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm lint`
