# Ramadan CLI Agent Skill

Spec reference: `skills/spec.md`

## Goal

Run, validate, and debug `ramadan-cli` safely and reproducibly.

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
