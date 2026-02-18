# Ramadan CLI Agent Skill

Spec reference: `skills/spec.md`

## Goal

Run, validate, and debug `ramadan-cli` safely and reproducibly.

## Prerequisites

- Node.js `>=20`
- `pnpm`
- Repo built at least once (`pnpm build`)

## Canonical Run Strategy

Prefer running the built CLI directly:

```bash
node dist/cli.js --help
node dist/cli.js
node dist/cli.js sf -a
node dist/cli.js -n 10
node dist/cli.js reset
```

Use `npx ramadan-cli` only when testing package-exec behavior.

## Isolated Config Runs (Recommended for Agents)

Always isolate config in automation to avoid polluting user/global state:

```bash
TMP_CFG="/tmp/ramadan-cli-agent"
mkdir -p "$TMP_CFG"
RAMADAN_CLI_CONFIG_DIR="$TMP_CFG" node dist/cli.js --help
RAMADAN_CLI_CONFIG_DIR="$TMP_CFG" node dist/cli.js sf
```

Reset isolated state:

```bash
RAMADAN_CLI_CONFIG_DIR="$TMP_CFG" node dist/cli.js reset
```

## First-Run Setup Testing

Interactive setup requires TTY.

Manual TTY check:

```bash
RAMADAN_CLI_CONFIG_DIR="$TMP_CFG" node dist/cli.js
```

Expected:

- Setup intro appears.
- Prompts for city/country/method/school/timezone.

## Behavior Checks

### Default location persistence

1. Run without city and complete setup.
2. Run with one-off city (`node dist/cli.js sf`).
3. Run without city again.
4. Confirm default remains saved geodata/setup location (city query is one-off).

### Roza modes

- `node dist/cli.js` (today/default)
- `node dist/cli.js -a` (all days)
- `node dist/cli.js -n 10` (specific roza)
- `node dist/cli.js --first-roza-date 2026-02-19`
- `node dist/cli.js --clear-first-roza-date`

### Output modes

- `node dist/cli.js sf --json`
- `node dist/cli.js sf --plain`
- `node dist/cli.js sf -a` (includes `← current` / `← next` row annotations)

## Dev Validation Loop

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm lint
```

If lint fails because `biome` binary is missing locally, run other checks and report lint as blocked by environment.

## Common Failure Notes

- If API/network is blocked, city/timing fetch will fail.
- `--json` mode skips interactive setup by design.
- Global binary conflicts (`npm link`/`/usr/local/bin/*`) are avoided by using `node dist/cli.js`.
