[![ramadan-cli](https://raw.githubusercontent.com/ahmadawais/ramadan-cli/refs/heads/main/.github/cover.png)](https://x.com/MrAhmadAwais/)

# ramadan-cli 🌙

[![DOWNLOADS](https://img.shields.io/npm/dt/ramadan-cli?label=npm&colorA=151B23&colorB=81F096&style=for-the-badge)](https://www.npmjs.com/package/ramadan-cli)
[![Node.js CLI](https://img.shields.io/badge/-NodeCLI.com-gray.svg?colorB=81F096&style=for-the-badge)](https://NodeCLI.com/?utm_source=FOSS)
[![Follow @MrAhmadAwais on X](https://img.shields.io/badge/FOLLOW%20%40MrAhmadAwais-gray.svg?colorA=151B23&colorB=81F096&style=for-the-badge)](https://x.com/mrahmadawais/)

> Ramadan-first CLI for Sehar and Iftar timings in your terminal.

Built for humans and agents.

## Why You'll Like It

- 🌙 Ramadan-only output focused on Sehar/Iftar
- 📍 Auto first-run setup (city, country, method, school, timezone)
- 🌐 Auto-detect location via IP provider fallbacks
- 🧭 Auto-recommend method and school by country
- ⏱ Auto timezone detection for accurate countdowns
- ✨ Highlights current + next Sehar/Iftar with countdown
- 🗓 `-a, --all` for complete Ramadan month
- 🔢 `-n, --number` for a specific roza day
- 📟 `-s, --status` single-line next event for status bars and coding agents
- 🧪 Custom first roza override (`--first-roza-date`)
- 🧹 One-command reset (`reset`)

## Video intro

[<img width="1400" height="784" alt="ramadan-thumbnail" src="https://github.com/user-attachments/assets/3a844fc5-dfb6-4d8c-86f9-abd587776a85" />](https://www.youtube.com/watch?v=a__CPd2bZVM)

[![ramadan-cli](https://raw.githubusercontent.com/ahmadawais/ramadan-cli/refs/heads/main/.github/ramadan.gif)](https://x.com/MrAhmadAwais/)


## Install

```sh
npx ramadan-cli

# or install globally and use alias
npm install -g ramadan-cli@latest
roza
```


## Agent Usage

Install this repo as an agent skill package:

```sh
npx skills add ahmadawais/ramadan-cli
```

## Usage

```sh
# Show Sehar and Iftar times for today.
npx ramadan-cli
roza

# City examples.
npx ramadan-cli sf
npx ramadan-cli "San Francisco"
npx ramadan-cli lahore
npx ramadan-cli vancouver

# Full Ramadan month.
npx ramadan-cli sf --all
roza "San Francisco" -a

# Specific roza.
roza -n 10
roza "dera ghazi khan" -n 10

# Status line (next event only — for status bars, coding agents).
roza -s
roza --status
roza -s --city Lahore

# Set custom first roza date (stored).
roza --first-roza-date 2026-02-19

# Clear custom first roza date.
roza --clear-first-roza-date

# Azan Watcher

Start an interactive azan watcher that automatically plays azan sounds at Fajr and Maghrib times, and allows manual triggering:

```sh
npx ramadan-cli --azan
```

Features:

- Automatic azan alerts at prayer times
- Manual triggers: Press 'f' for Fajr, 'm' for Maghrib
- Press Ctrl+C to stop

# Reset saved config (location + settings + overrides).
roza reset

# Non-interactive config (no prompts).
ramadan-cli config --city "San Francisco" --country "United States" --method 2 --school 0 --timezone "America/Los_Angeles"
ramadan-cli config --show
ramadan-cli config --clear
```

## CLI Surface

```sh
ramadan-cli [city] [options]
ramadan-cli reset
ramadan-cli config [options]
```

Notes:

- No `today` subcommand; default run is today view.
- Passing a city is one-off and does not replace saved default location.

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
| `-s, --status` | `boolean` | `false` | Single-line next event output for status bars and coding agents |
| `--azan` | `boolean` | `false` | Start interactive azan watcher with manual triggers |
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

- `roza` (same CLI)
- `ramadan-cli`
- `ramzan`
- `ramazan`
- `ramadan`

## I/O Contract

- `stdout`:
  - primary data output (table/plain/json)
  - version output (`-v`) prints version only
- `stderr`:
  - runtime and validation errors
- `--json`:
  - prints structured JSON only to `stdout` on success
  - prints structured JSON error payload to `stderr` on failure:
    - `{"ok":false,"error":{"code":"...","message":"..."}}`
- Exit codes:
  - `0` success
  - `1` runtime/validation/network/data failure
  - invalid usage parsing is handled by Commander defaults

## Interactivity and Safety

- On first run (TTY), CLI launches interactive setup with Clack prompts.
- If `--json` or `--status` is used and no config exists, interactive setup is skipped.
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

```sh
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm lint
```
## API

Powered by [Aladhan Prayer Times API](https://aladhan.com/prayer-times-api)

## License

MIT - [Ahmad Awais](https://x.com/MrAhmadAwais)
