# Ramadan CLI Agent Skill

Spec reference: `skills/spec.md`

## Goal

Run, validate, and debug `ramadan-cli` safely and reproducibly.

## What This CLI Is

`ramadan-cli` is a Ramadan-first CLI that shows:

- Sehar (`Fajr`) and Iftar (`Maghrib`) times
- today view, full month (`-a`), and specific roza (`-n`)
- first-run setup with saved config (city/country/method/school/timezone)

## Basics Usage

```bash
ramadan-cli
ramadan-cli sf
ramadan-cli -a
ramadan-cli -n 10
ramadan-cli reset
ramadan-cli config --show
```

Alias support:

- `roza` (same CLI)
- `sf` city alias resolves to `San Francisco`

First run notes:

- Interactive setup appears on first run in TTY mode.
- `--json` skips interactive setup by design.

Non-interactive config:

```bash
ramadan-cli config --city "San Francisco" --country "United States" --method 2 --school 0 --timezone "America/Los_Angeles"
ramadan-cli config --show
ramadan-cli config --clear
```

## Canonical Run Strategy

Prefer running the CLI command directly:

```bash
ramadan-cli --help
ramadan-cli
ramadan-cli sf -a
ramadan-cli -n 10
ramadan-cli reset
```

Use `roza` as an alias where desired.
Use `npx ramadan-cli` when testing package-exec behavior.
Use `node dist/cli.js` only as a local fallback during development/debugging.

## Isolated Config Runs (Recommended for Agents)

Always isolate config in automation to avoid polluting user/global state:

```bash
TMP_CFG="/tmp/ramadan-cli-agent"
mkdir -p "$TMP_CFG"
RAMADAN_CLI_CONFIG_DIR="$TMP_CFG" ramadan-cli --help
RAMADAN_CLI_CONFIG_DIR="$TMP_CFG" ramadan-cli sf
```

Reset isolated state:

```bash
RAMADAN_CLI_CONFIG_DIR="$TMP_CFG" ramadan-cli reset
```

## First-Run Setup Testing

Interactive setup requires TTY.

Manual TTY check:

```bash
RAMADAN_CLI_CONFIG_DIR="$TMP_CFG" ramadan-cli
```

Expected:

- Setup intro appears.
- Prompts for city/country/method/school/timezone.

## Behavior Checks

### Default location persistence

1. Run without city and complete setup.
2. Run with one-off city (`ramadan-cli sf`).
3. Run without city again.
4. Confirm default remains saved geodata/setup location (city query is one-off).

### Roza modes

- `ramadan-cli` (today/default)
- `ramadan-cli -a` (all days)
- `ramadan-cli -n 10` (specific roza)
- `ramadan-cli --first-roza-date 2026-02-19`
- `ramadan-cli --clear-first-roza-date`

### Output modes

- `ramadan-cli sf --json`
- `ramadan-cli sf --plain`
- `ramadan-cli sf -a` (includes `← current` / `← next` row annotations)
