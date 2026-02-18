# ramadan-cli

![ramadan-cli cover](https://raw.githubusercontent.com/ahmadawais/ramadan-cli/refs/heads/main/.github/cover.png)

Ramadan-first CLI for Sehar and Iftar timings.

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

## Agent Usage

Install this as an agent skill package:

```bash
npx skills add ahmadawais/ramadan-cli
```

## Output Semantics

- `Sehar` = `Fajr`
- `Iftar` = `Maghrib`
- Time output is 12-hour (`AM/PM`)

## Commands

```bash
ramadan-cli [city] [options]
ramadan-cli reset
ramadan-cli config [options]
```

Options:

- `-a, --all` Show complete Ramadan month
- `-n, --number <1-30>` Show a specific roza day
- `-p, --plain` Plain output
- `-j, --json` JSON output
- `--first-roza-date <YYYY-MM-DD>` Set custom first roza date
- `--clear-first-roza-date` Clear custom first roza date
- `-v, --version` Print version only
- `-h, --help` Help

Config options (`ramadan-cli config`):

- `--city <city>`
- `--country <country>`
- `--latitude <latitude>`
- `--longitude <longitude>`
- `--method <id>`
- `--school <id>`
- `--timezone <timezone>`
- `--show`
- `--clear`

## Aliases

- `ramadan-cli`
- `ramzan`
- `ramazan`
- `ramadan`
- `roza`

## Behavior Notes

- On first run (TTY), CLI launches interactive setup with Clack prompts.
- If `--json` is used and no config exists, interactive setup is skipped.
- Passing a city is treated as a one-off query and does not replace saved default location.

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
