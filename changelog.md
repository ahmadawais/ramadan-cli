# Changelog

## [6.0.0](https://github.com/ahmadawais/ramadan-cli/compare/5.3.0...6.0.0) (2026-02-18)

### Features

* rewrite ramadan-cli with azan-style setup and ramadan UX ([#17](https://github.com/ahmadawais/ramadan-cli/issues/17)) v6 ([b35457e](https://github.com/ahmadawais/ramadan-cli/commit/b35457e18454d55a701219a147069184b9f98f88))

### Bug Fixes

* logs ([5d249ee](https://github.com/ahmadawais/ramadan-cli/commit/5d249ee1642020b3110680977fcfb57c140196a0))

All notable changes to this project will be documented in this file.

## [6.0.0] - 2026-02-16 (PR #17)

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

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [5.3.0](https://github.com/ahmadawais/ramadan-cli/compare/5.2.1...5.3.0)

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Get the correct today date [`4f9fe46`](https://github.com/ahmadawais/ramadan-cli/commit/4f9fe46fdce335c985a1bda93f621a4a08928d53) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [5.2.1](https://github.com/ahmadawais/ramadan-cli/compare/5.2.0...5.2.1)

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Highlight today roza [`e450e6e`](https://github.com/ahmadawais/ramadan-cli/commit/e450e6eaed96950a26432326aa01408f67ae5514) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`6c2ae6e`](https://github.com/ahmadawais/ramadan-cli/commit/6c2ae6edae23335fc45eb0b527ecf741c6cb5c10) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [5.2.0](https://github.com/ahmadawais/ramadan-cli/compare/5.1.1...5.2.0)

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`a934f96`](https://github.com/ahmadawais/ramadan-cli/commit/a934f965a46c26ea475a8b79567ff97b382507c1) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [5.1.1](https://github.com/ahmadawais/ramadan-cli/compare/5.1.0...5.1.1)

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 GIF or didnt happen [`b5d92d0`](https://github.com/ahmadawais/ramadan-cli/commit/b5d92d0bc99616cbf29580a8236fff3e61943458) <br>

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Docs [`41532c3`](https://github.com/ahmadawais/ramadan-cli/commit/41532c3ee463381e82a7a39dfb63446dab0c7d03) <br>
> 👌 Gif quality [`480e937`](https://github.com/ahmadawais/ramadan-cli/commit/480e9372057d208e2dc96ef94b1b5b081a4dad44) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`8b9787d`](https://github.com/ahmadawais/ramadan-cli/commit/8b9787d11d1c49543f5f32aaa851262862d69d50) <br>
> 📖 Examples [`5ccd29e`](https://github.com/ahmadawais/ramadan-cli/commit/5ccd29e9c1cc3fd5f7bfdad60b697d6cac4d48d7) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [5.1.0](https://github.com/ahmadawais/ramadan-cli/compare/5.0.1...5.1.0)

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Examples [`7aedc8b`](https://github.com/ahmadawais/ramadan-cli/commit/7aedc8b087b9315fd2b5d1dac85c07de74ccd751) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`7b25e44`](https://github.com/ahmadawais/ramadan-cli/commit/7b25e441c91031adfa83406b9a95bd0c43c3e0c6) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [5.0.1](https://github.com/ahmadawais/ramadan-cli/compare/5.0.0...5.0.1)

![🐛 FIX:](https://img.shields.io/badge/-FIX-gray.svg?colorB=ff6347)

> 🐛 Axios [`20e914f`](https://github.com/ahmadawais/ramadan-cli/commit/20e914f624e972f9452a01b59bc6757c24c9adb0) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`9aa62ca`](https://github.com/ahmadawais/ramadan-cli/commit/9aa62ca76b1baf64652d025b8d2c04dfb524f516) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [5.0.0](https://github.com/ahmadawais/ramadan-cli/compare/4.0.2...5.0.0)

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 API Based CLI [`37c6917`](https://github.com/ahmadawais/ramadan-cli/commit/37c6917664849fe42d5e19d5a7fe12af3ae1c196) <br>
> 📦 Sheilds [`ee9a84c`](https://github.com/ahmadawais/ramadan-cli/commit/ee9a84c6bebe75b4a8c56d46d68b693231e429b5) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`720b56b`](https://github.com/ahmadawais/ramadan-cli/commit/720b56b4a5915bedf4dc29ec1aa001317071e849) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [4.0.2](https://github.com/ahmadawais/ramadan-cli/compare/4.0.1...4.0.2)

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Lingo [`9cce843`](https://github.com/ahmadawais/ramadan-cli/commit/9cce8435ef01283c020265bf8f481db06ab13436) <br>
> 👌 COver [`addf2d9`](https://github.com/ahmadawais/ramadan-cli/commit/addf2d9698ec693a6d190d85985c8d2a2017b9ce) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`7cd5ca3`](https://github.com/ahmadawais/ramadan-cli/commit/7cd5ca3de2a354cc4404068519806c3a876ae72a) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [4.0.1](https://github.com/ahmadawais/ramadan-cli/compare/4.0.0...4.0.1)

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Lingo [`ae0b799`](https://github.com/ahmadawais/ramadan-cli/commit/ae0b79900094e958f933aa701112c4c20379f1a8) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`d95124c`](https://github.com/ahmadawais/ramadan-cli/commit/d95124cc63706039f2d9d1e10e9faf8bd8a27f15) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [4.0.0](https://github.com/ahmadawais/ramadan-cli/compare/3.3.0...4.0.0)

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 Spinner [`3ef7ac6`](https://github.com/ahmadawais/ramadan-cli/commit/3ef7ac68c0df86c218fbc5aab3428950c5ce67ed) <br>
> 📦 Aliases [`92c8bf3`](https://github.com/ahmadawais/ramadan-cli/commit/92c8bf3434f01f3d3a91b60c068bb46c10b4b864) <br>

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Welcome init [`20b8c00`](https://github.com/ahmadawais/ramadan-cli/commit/20b8c001897afd63f6001bb157574239bd9dc580) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`d3591ae`](https://github.com/ahmadawais/ramadan-cli/commit/d3591aef0424e8aa1fe7571759049a2b7ad2ceb1) <br>
> 📖 Ghotki [`0e6ff1b`](https://github.com/ahmadawais/ramadan-cli/commit/0e6ff1b2329764509d982a7aa497309ade2adacc) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [3.3.0](https://github.com/ahmadawais/ramadan-cli/compare/3.2.0...3.3.0)

![🐛 FIX:](https://img.shields.io/badge/-FIX-gray.svg?colorB=ff6347)

> 🐛 Name [`49ac72d`](https://github.com/ahmadawais/ramadan-cli/commit/49ac72daa2506ac37ee762bb590d40e5c9427236) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`96b22bb`](https://github.com/ahmadawais/ramadan-cli/commit/96b22bb9d8ec3765abf6790885153528f38839f9) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [3.2.0](https://github.com/ahmadawais/ramadan-cli/compare/3.1.1...3.2.0)

![🐛 FIX:](https://img.shields.io/badge/-FIX-gray.svg?colorB=ff6347)

> 🐛 Missing comma [`83ced9e`](https://github.com/ahmadawais/ramadan-cli/commit/83ced9ea76ff50c4ffd82061becaa06b87efb622) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`c8fb308`](https://github.com/ahmadawais/ramadan-cli/commit/c8fb308c2d84e6b5c3f3982c14903faf74922acc) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [3.1.1](https://github.com/ahmadawais/ramadan-cli/compare/3.1.0...3.1.1)

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`f12ea58`](https://github.com/ahmadawais/ramadan-cli/commit/f12ea58d13a604a4530f89899d2a0dcf646d7674) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [3.1.0](https://github.com/ahmadawais/ramadan-cli/compare/3.0.0...3.1.0)

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Dates [`4cfd2ee`](https://github.com/ahmadawais/ramadan-cli/commit/4cfd2eeaf03eedf53c86eae19815f33afa8ba3bd) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`1189833`](https://github.com/ahmadawais/ramadan-cli/commit/118983310e34597b5afc0652f361781760a9a796) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [3.0.0](https://github.com/ahmadawais/ramadan-cli/compare/2.0.1...3.0.0)

![BREAKING](https://img.shields.io/badge/-BREAKING%20CHANGES-gray.svg?colorB=F91800)

> ‼️ Date Diff [`e5e52fc`](https://github.com/ahmadawais/ramadan-cli/commit/e5e52fcf944e65ac7066ebf0174e23517da5cc46) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`d2b4cbc`](https://github.com/ahmadawais/ramadan-cli/commit/d2b4cbce52a508cc72c93873d8eb320c0dc82c90) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [2.0.1](https://github.com/ahmadawais/ramadan-cli/compare/2.0.0...2.0.1)

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 Nice name [`ef4d6fd`](https://github.com/ahmadawais/ramadan-cli/commit/ef4d6fd013be3628154cba7c13d60fdb48ffe979) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`fc83b1e`](https://github.com/ahmadawais/ramadan-cli/commit/fc83b1e68362ce74c6bf2ceae4f755ed932244a0) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [2.0.0](https://github.com/ahmadawais/ramadan-cli/compare/1.5.0...2.0.0)

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 peshawar [`c8884e6`](https://github.com/ahmadawais/ramadan-cli/commit/c8884e68268b88aa4cc208f5a9073d69785b7eaa) <br>
> 📦 Multan [`d300617`](https://github.com/ahmadawais/ramadan-cli/commit/d300617004eddc517ed6eadfba3826cb5d2ba55c) <br>
> 📦 sialkot [`eaa40d2`](https://github.com/ahmadawais/ramadan-cli/commit/eaa40d268ba3ae84018eda1bc1fd4c33dd91fe7b) <br>
> 📦 quetta [`0158fa6`](https://github.com/ahmadawais/ramadan-cli/commit/0158fa68b188e05552c914ef275521a94543fe01) <br>
> 📦 rawalpindi [`5d941d1`](https://github.com/ahmadawais/ramadan-cli/commit/5d941d1e74074df9d9497a54cbb135275d26fdfe) <br>
> 📦 gujranwala [`628cc8e`](https://github.com/ahmadawais/ramadan-cli/commit/628cc8ee158c38af8a7884bf6f40d8081ae21ef4) <br>
> 📦 faisalabad [`0de0b10`](https://github.com/ahmadawais/ramadan-cli/commit/0de0b1063eb3c8c58918175c7a8f126f0bb19287) <br>
> 📦 hyderabad [`45ec51b`](https://github.com/ahmadawais/ramadan-cli/commit/45ec51b19e8d0688bdf1d9b957c08a19e163086a) <br>
> 📦 Contribute [`98bed6e`](https://github.com/ahmadawais/ramadan-cli/commit/98bed6eec25f7aee51220fd69c2151d2e9b49095) <br>

![🐛 FIX:](https://img.shields.io/badge/-FIX-gray.svg?colorB=ff6347)

> 🐛 Isb [`aff8370`](https://github.com/ahmadawais/ramadan-cli/commit/aff8370823465dd0e13b2befc88018c00146b74b) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`99f069d`](https://github.com/ahmadawais/ramadan-cli/commit/99f069d07b2563339d57426458a5173c6c41ca61) <br>
> 📖 Features [`c9e5a72`](https://github.com/ahmadawais/ramadan-cli/commit/c9e5a72b57400c544d39d6b4fe845a2f7e4d8c02) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.5.0](https://github.com/ahmadawais/ramadan-cli/compare/1.4.0...1.5.0)

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 Karachi [`bbf639f`](https://github.com/ahmadawais/ramadan-cli/commit/bbf639f6da5e060861dcca4abae8a1ec8509701d) <br>

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 City refactor [`20ee9f9`](https://github.com/ahmadawais/ramadan-cli/commit/20ee9f9aa9f01515d4a6a04290430a895170e94a) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`c72740e`](https://github.com/ahmadawais/ramadan-cli/commit/c72740e9a69e5b98b3204089392e62ed812b8e36) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.4.0](https://github.com/ahmadawais/ramadan-cli/compare/1.3.0...1.4.0)

![🐛 FIX:](https://img.shields.io/badge/-FIX-gray.svg?colorB=ff6347)

> 🐛 log-symbols [`9e0bf92`](https://github.com/ahmadawais/ramadan-cli/commit/9e0bf92744dab579dde75f8cae8f28baa746f5d6) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`06dc18e`](https://github.com/ahmadawais/ramadan-cli/commit/06dc18eab652f2edf7892f7b14b45b856e1c1a94) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.3.0](https://github.com/ahmadawais/ramadan-cli/compare/1.2.0...1.3.0)

![🐛 FIX:](https://img.shields.io/badge/-FIX-gray.svg?colorB=ff6347)

> 🐛 cli-table3 [`e08fc22`](https://github.com/ahmadawais/ramadan-cli/commit/e08fc223848724d756c1d8c96857ef74e14e1b44) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`f801543`](https://github.com/ahmadawais/ramadan-cli/commit/f8015435ab52a53dca29f0acbc57860016169720) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.2.0](https://github.com/ahmadawais/ramadan-cli/compare/1.1.0...1.2.0)

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`942e5bf`](https://github.com/ahmadawais/ramadan-cli/commit/942e5bf9e1738b7b070e6d5b31abd48f3790a562) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.1.0](https://github.com/ahmadawais/ramadan-cli/compare/1.0.4...1.1.0)

![🐛 FIX:](https://img.shields.io/badge/-FIX-gray.svg?colorB=ff6347)

> 🐛 Extraneous pkgs [`b4e2db9`](https://github.com/ahmadawais/ramadan-cli/commit/b4e2db927e59d546671120c8a82d75dc55455502) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`dc3dc40`](https://github.com/ahmadawais/ramadan-cli/commit/dc3dc4037295d29c1a8f45b4274602d9bcf10459) <br>
> 📖 Gif or didnt happen [`26c51fb`](https://github.com/ahmadawais/ramadan-cli/commit/26c51fb9d9c1314e661fad35a4fadf8516d7076a) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.0.4](https://github.com/ahmadawais/ramadan-cli/compare/1.0.3...1.0.4)

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 Thumb [`f31175d`](https://github.com/ahmadawais/ramadan-cli/commit/f31175d203f88398e6c22d5dbdaef206b152a0c9) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`4bd2bca`](https://github.com/ahmadawais/ramadan-cli/commit/4bd2bca28e44c6f1051d81ff6bdd8d072adc3a1a) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.0.3](https://github.com/ahmadawais/ramadan-cli/compare/1.0.2...1.0.3)

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 Logo [`6bc3247`](https://github.com/ahmadawais/ramadan-cli/commit/6bc32471bd01fcde484ecc4fb3064e5f9cba1a5f) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`cf5bae1`](https://github.com/ahmadawais/ramadan-cli/commit/cf5bae1bd78d5d6d38fc8301a3b30857053bc1fc) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.0.2](https://github.com/ahmadawais/ramadan-cli/compare/1.0.1...1.0.2)

![👌 IMPROVE:](https://img.shields.io/badge/-IMPROVEMENT-gray.svg?colorB=39AA54)

> 👌 Lingo [`7fb353a`](https://github.com/ahmadawais/ramadan-cli/commit/7fb353acba288466f7d0c0ccd364c74da011e988) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`64e8707`](https://github.com/ahmadawais/ramadan-cli/commit/64e870719a3f4b8f951f6627afb3a23b9844c95d) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: [1.0.1](https://github.com/ahmadawais/ramadan-cli/compare/1.0.0...1.0.1)

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`68d8865`](https://github.com/ahmadawais/ramadan-cli/commit/68d88659bf07bfb221d20cc4675a0bea75f5bb34) <br>
> 📖 Usage [`3c4ce9a`](https://github.com/ahmadawais/ramadan-cli/commit/3c4ce9a9bc757cf4ccd25b49603d1591542ced3e) <br>

<br>

[![hr](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/hr.png)](/)

<br>

### RELEASE: 1.0.0

![📦 NEW:](https://img.shields.io/badge/-NEW-gray.svg?colorB=3778FF)

> 📦 First commit [`f8e79d8`](https://github.com/ahmadawais/ramadan-cli/commit/f8e79d8f5c4a50b4408d51df1b88de6799abe0bc) <br>
> 📦 First version [`5eaea8a`](https://github.com/ahmadawais/ramadan-cli/commit/5eaea8a43b0fdadcbebd7341bf4802850dfc4a74) <br>
> 📦 All option [`f4464f7`](https://github.com/ahmadawais/ramadan-cli/commit/f4464f7a0ddd58a6b91412cfce91c6e70a6c7cd9) <br>

![📖 DOC:](https://img.shields.io/badge/-DOCS-gray.svg?colorB=978CD4)

> 📖 Changelog [`3ceb848`](https://github.com/ahmadawais/ramadan-cli/commit/3ceb848b6dbe3147edb1e5693756b7eebc8e1818) <br>
