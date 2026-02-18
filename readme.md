# ramadan-cli

![ramadan-cli cover](https://raw.githubusercontent.com/ahmadawais/ramadan-cli/refs/heads/main/.github/cover.png)

Ramadan-first CLI for Sehar and Iftar timings.

Primary audience: humans and scripts.

## Features

- Ramadan-only output focused on Sehar/Iftar
- Auto first-run setup (city, country, method, school, timezone)
- Auto-detect location via IP provider fallbacks
- Auto-recommend method and school by country
- Auto timezone detection for accurate countdowns
- Highlights current state + next Sehar/Iftar with countdown
- `-a, --all` for complete Ramadan month
- `-n, --number` for a specific roza day
- Custom first roza date override (`--first-roza-date`)
- Config reset command (`reset`)

## Install

```bash
pnpm add -g ramadan-cli
```

or use without install:

```bash
npx ramadan-cli
```

## Quick Usage

```bash
# Use saved default/geodata setup.
npx ramadan-cli
roza

# One-off city lookup (does NOT overwrite your saved default).
npx ramadan-cli "San Francisco"
roza "San Francisco"
roza sf

# Full Ramadan month.
roza "San Francisco" --all
roza sf -a

# Specific roza.
roza -n 10
roza "dera ghazi khan" -n 10

# Set custom first roza date (stored).
roza --first-roza-date 2026-02-19

# Clear custom first roza date.
roza --clear-first-roza-date

# Reset saved config (location + settings + overrides).
roza reset

# Non-interactive config (no prompts).
ramadan-cli config --city "San Francisco" --country "United States" --method 2 --school 0 --timezone "America/Los_Angeles"
ramadan-cli config --show
ramadan-cli config --clear
```

## CLI Surface

```bash
ramadan-cli [city] [options]
ramadan-cli reset
ramadan-cli config [options]
```

Notes:

- There is no `today` subcommand. `ramadan-cli` default run is the today view.
- Passing a city is a one-off query and does not replace saved default location.

## Agent Usage

Install this as an agent skill package:

```bash
npx skills add ahmadawais/ramadan-cli
```

## Output Semantics

- `Sehar` = `Fajr`
- `Iftar` = `Maghrib`
- Time output is 12-hour (`AM/PM`)

## Flags and Arguments

Global/main command flags (`ramadan-cli [city]`):

| Flag | Type | Default | Behavior |
| --- | --- | --- | --- |
| `[city]` | `string` | saved location | One-off lookup; does not overwrite saved default |
| `-c, --city <city>` | `string` | none | Same as city arg |
| `-a, --all` | `boolean` | `false` | Show all Ramadan rows |
| `-n, --number <1-30>` | `number` | none | Show specific roza |
| `-p, --plain` | `boolean` | `false` | Plain text output without ASCII banner |
| `-j, --json` | `boolean` | `false` | JSON-only output for scripts |
| `--first-roza-date <YYYY-MM-DD>` | `string` | stored/API | Persist custom first roza date |
| `--clear-first-roza-date` | `boolean` | `false` | Clear custom first roza date and use API Ramadan date |
| `-v, --version` | `boolean` | n/a | Print version only |
| `-h, --help` | `boolean` | n/a | Show help |

Config flags (`ramadan-cli config`):

| Flag | Type | Behavior |
| --- | --- | --- |
| `--city <city>` | `string` | Save city |
| `--country <country>` | `string` | Save country |
| `--latitude <latitude>` | `number` | Save latitude (`-90..90`) |
| `--longitude <longitude>` | `number` | Save longitude (`-180..180`) |
| `--method <id>` | `number` | Save method (`0..23`) |
| `--school <id>` | `number` | Save school (`0=Shafi`, `1=Hanafi`) |
| `--timezone <timezone>` | `string` | Save timezone |
| `--show` | `boolean` | Print saved config |
| `--clear` | `boolean` | Clear saved config |

Reset command:

- `ramadan-cli reset` clears saved location, method, school, timezone, and custom first roza date.

## Aliases

- `ramadan-cli`
- `ramzan`
- `ramazan`
- `ramadan`
- `roza`

## I/O Contract

- `stdout`:
  - primary data output (table/plain/json)
  - version output (`-v`) prints version only
- `stderr`:
  - runtime and validation errors
- `--json`:
  - prints structured JSON only to `stdout` on success
  - prints error text to `stderr` on failure
- Exit codes:
  - `0` success
  - `1` runtime/validation/network/data failure
  - invalid usage parsing is handled by Commander defaults

## Interactivity and Safety

- On first run (TTY), CLI launches interactive setup with Clack prompts.
- If `--json` is used and no config exists, interactive setup is skipped.
- Config changes are explicit via `config`, `reset`, and first-roza flags.
- No stdin input contract yet. Input is args/flags only.

## Config and Precedence

Data sources:

- flags/args (`city`, `--first-roza-date`, `--clear-first-roza-date`, mode flags)
- saved config (from first-run setup or `ramadan-cli config`)
- IP geolocation fallback when no saved config

Resolution behavior:

- One-off city arg/flag wins for that invocation but is not persisted.
- `--clear-first-roza-date` takes precedence over `--first-roza-date` if both are provided.
- Recommended method/school are auto-applied when using default/unset settings.
- `RAMADAN_CLI_CONFIG_DIR` controls where config is stored (useful for agent/test isolation).

## Development

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm lint
```

## License

MIT - [Ahmad Awais](https://x.com/MrAhmadAwais)
