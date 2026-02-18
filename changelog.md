# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1] - 2026-02-18

### feat
- Full rewrite to TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`)
- Rebuilt `ramadan-cli` as a composable wrapper around the real `azaan` CLI
- Added Ramadan compatibility mode on top:
  - `ramadan-cli "<city>"`
  - `ramadan-cli "<city>" --all`
  - `ramadan-cli --all` with auto location detection

### chore
- Switched tooling to pnpm + Biome + Vitest + tsup
- Added Zod validation at external API boundaries
- Added tests for API validation and Ramadan year targeting logic
