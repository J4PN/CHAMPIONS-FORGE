<div align="center">

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png" width="48" alt="Charizard" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/445.png" width="48" alt="Garchomp" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png" width="48" alt="Dragonite" />

# PokeCounter

### *Free counter-picker for **Pokemon Champions** (2026)*

**Paste the opposing team. Get the best picks. Win the match.**

[![Live](https://img.shields.io/badge/live-pokecounter.app-ff3d8b?style=for-the-badge)](https://pokecounter.app)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Go](https://img.shields.io/badge/Go-1.25-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png" width="48" alt="Lucario" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/887.png" width="48" alt="Dragapult" />
<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" width="48" alt="Pikachu" />

[**pokecounter.app**](https://pokecounter.app) ·
[**Pokedex**](https://pokecounter.app/pokedex) ·
[**Rankings**](https://pokecounter.app/rankings) ·
[**Tier List**](https://pokecounter.app/tiers) ·
[**Speed Tiers**](https://pokecounter.app/speed) ·
[**Battle Sim**](https://pokecounter.app/battle)

</div>

---

## What is it?

**PokeCounter** is a web app that takes the friction out of counter-picking in **Pokemon Champions**. Drop the opposing team, drop your team, and instantly see the optimal subset to bring for the matchup.

Type a name in **any of 9 languages**, get the pick in one click, share via URL. No sign-up, no ads, no paywalls.

```
Opponent Team          My Team               Best Picks
+-----------------+    +-----------------+    +-------------------+
| 6 slots         |    | 6 slots         |    | Bring 3 (1v1)     |
|                 |    |                 |    | or 4 (2v2)        |
|                 | -> |                 | -> |                   |
|                 |    |                 |    | Pick 1 -- 8 pts   |
|                 |    |                 |    | Pick 2 -- 6 pts   |
+-----------------+    +-----------------+    +-------------------+
```

---

## Features

### <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" width="24" /> Counter Picker

- **Optimal subset finder** -- brute-force `C(6, N)` subsets, scoring both offensive coverage AND defensive safety (a pick that covers 1 extra opponent but gets threatened by 3 won't be chosen over a safer alternative).
- **Per-pick matchup chips** -- green for opponents hit 2x+, red for opponents that threaten you.
- **18-type coverage grid** -- see gaps at a glance.
- **URL sharing** -- opponent team encoded in `?opp=...`, one link to share a matchup.

### <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png" width="24" /> Live Meta Rankings

Real usage data from every team built on the site, powered by a Go + MongoDB backend:

- **Top 20 teams of the week** -- with play count, sorted by popularity.
- **Top 10 Pokemon** -- most picked across all submitted teams.
- **Top 10 types** -- type distribution in the real meta.
- **Trending / Rising Stars** -- week-over-week deltas showing which Pokemon are gaining or losing popularity.
- **"Use this team" button** -- load any ranked team directly into the counter picker.

### <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png" width="24" /> Tier List

- **Curated mode** -- S/A/B/C/D tiers from the initial roster analysis.
- **Live mode** -- tiers computed in real-time from user submission data, updated continuously.
- Toggleable with one click. Champions Lab doesn't have live tiers.

### <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png" width="24" /> Speed Tiers

Interactive speed tier chart for all 250 Pokemon:

- **SP slider** (0-32) -- see final Speed stat at Level 50 recalculated live for every Pokemon.
- **Nature toggle** (+Spe / neutral / -Spe) -- instantly see the effect.
- **Benchmark lines** -- Base 100, Base 80, Tailwind x2, Choice Scarf x1.5 reference values.
- **Speed tier labels** -- Blazing / Very Fast / Fast / Average / Below Avg / Slow / TR Tier.
- Searchable and filterable.

### <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png" width="24" /> Battle Simulator

Test your team against 500 to 10,000 generated opponents across 10 archetypes:

- **Win rate by archetype** -- colored bars for Sun, Rain, Trick Room, Tailwind, Hyper Offense, Bulky, Mono-type, Meta, Balance, Random.
- **Per-Pokemon performance** -- pick rate, win rate when picked vs benched, impact score, MVP / Liability badges.
- **Strategy tips** -- auto-generated advice: shared weaknesses, hard counter archetypes, best lead pair, severe threat Pokemon, speed control recommendations.
- **Biggest threats** -- the opponent Pokemon that correlate most with your losses, with sprites and win rates.
- **Best / worst 3 matchups** + collapsible full list.

### <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/282.png" width="24" /> Full Pokedex

- **250 entries** covering 200 base + 50 Mega Pokemon (Season 1 roster).
- Per-Pokemon detail: stats with bars, abilities (hidden flag), height/weight, full defensive matchup table, complete movepool (lazy-loaded).
- **Multi-language search** -- type `Glurak`, `리자몽`, `リザードン`, `喷火龙` or `Charizard`.
- Filter by type, base/Mega, tier (S/A/B/C/D).

### <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png" width="24" /> Advanced Team Builder

Full per-Pokemon configuration:

| Field | Description |
| --- | --- |
| **Ability** | Dropdown filtered to the Pokemon's legal abilities |
| **4 Moves** | Searchable selectors from actual movepool, with type and BP |
| **Nature** | All 25 natures with +/- stat indicators |
| **Tera Type** | All 18 types |
| **Item** | Free-text input |
| **Stat Points** | Champions SP: 66 total, 32 max per stat, with bars and +/- buttons |

Supports Showdown paste import/export.

### <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/658.png" width="24" /> More Tools

- **Type Chart** -- interactive 18x18 effectiveness grid.
- **Damage Calculator** -- Gen 9 formula with Champions SP system.
- **Team Analyzer** -- overall score, shared weaknesses, coverage holes, actionable suggestions (translated in 9 languages).
- **Compare** -- two Pokemon builds side by side.
- **Share Card** -- generate a 1200x630 (OG) or 1080x1080 (Instagram) PNG of your team, downloadable or shareable via Web Share API.
- **Learn VGC** -- 9 interactive accordion sections covering format basics, speed control, weather, terrain, items, abilities, status, 30 key moves, and Tera Type. All in 9 languages.
- **Saved Teams** -- unlimited named slots in localStorage.

### 9 Languages

Every UI string, Pokemon name, type label, team suggestion, and Learn page content is translated:

| | | |
| --- | --- | --- |
| English | Francais | Espanol |
| Deutsch | Italiano | 日本語 |
| 한국어 | 简体中文 | 繁體中文 |

Auto-detected from browser language on first visit.

---

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | Vite 5 + React 18 + TypeScript 5 + Tailwind CSS 3 |
| Components | shadcn/ui primitives + lucide-react icons |
| Backend | Go (chi router) + MongoDB |
| Analytics | Umami (self-hosted, no cookies) |
| Hosting | Nginx + Let's Encrypt (static SPA + reverse proxy to Go API) |

The Go service handles anonymous team submissions, rankings aggregation, trending computation, and species stats. It binds to `127.0.0.1:8080` (localhost only), with nginx proxying `/api/*` requests.

Frontend is a static SPA. Backend is optional -- the counter picker, Pokedex, damage calc, and battle sim all work offline.

---

## Quick start

```bash
git clone https://github.com/EricTron-FR/PokeCounter.app.git
cd PokeCounter.app
npm install
npm run dev          # localhost:5173
```

No env vars, no API keys, no database needed for development. The backend is only required for the live rankings features.

### Production build

```bash
npm run build        # dist/
```

Drop `dist/` on any static host (Vercel, Netlify, Cloudflare Pages, nginx).

---

## The scoring formula

For every Pokemon in your team vs every opponent:

```
offense:
  SE hit (x2)         +1
  Double SE hit (x4)  +1 extra
  Clean hit (SE and not threatened)  +0.5

defense:
  Immune to opponent   +1
  Threatened (x2)      -1
  Quad threatened (x4) -2
```

The optimal subset is the combination of N Pokemon (3 for 1v1, 4 for 2v2) that maximizes `totalScore` -- a blend of offensive coverage and defensive safety. With `C(6, 4) = 15` subsets max, it's instant.

---

## Contributing

PRs welcome. Guidelines:

- **Keep the bundle slim.** Lazy-load anything not needed on first paint. Target < 150 KB gzipped for the main chunk.
- **Privacy first.** No third-party tracking beyond self-hosted Umami.
- **All UI strings in all 9 languages.** Machine-translate and mark with `// FIXME translation` if unsure.
- **Stay pixel-art.** Press Start 2P for headings, dark cards with borders, subtle shadows.

---

## Credits

| Source | Provides | License |
| --- | --- | --- |
| [PokéAPI](https://pokeapi.co/) | Sprites, names, stats, abilities, movepools | MIT |
| [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) | Pixel font | OFL |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Monospace font | OFL |
| [Tailwind CSS](https://tailwindcss.com) | Styling | MIT |
| [shadcn/ui](https://ui.shadcn.com) | Component primitives | MIT |
| [lucide-react](https://lucide.dev) | Icons | ISC |

Thanks to the competitive Pokemon community and to Nintendo / Game Freak / The Pokemon Company for the games.

---

## License

[**MIT**](./LICENSE) -- fork it, improve it, learn from it.

Pokemon and related properties are trademarks of Nintendo / Game Freak / The Pokemon Company. PokeCounter is a fan-made tool, not affiliated with or endorsed by any of those entities.

---

<div align="center">

<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png" width="40" />

Made with pixels

<sub>If PokeCounter helps you win a match, star the repo</sub>

</div>
