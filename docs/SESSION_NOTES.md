# Session notes — 2026-04-10

Summary of everything worked on in this long session. Organized by theme
so it's easy to skim, not chronological.

## Shipped & live on pokecounter.app

### 1. Reliable scroll-to-top on route change
- `src/components/ScrollToTop.tsx`
- Switched from `useEffect` + smooth scroll to `useLayoutEffect` + instant.
  Smooth was getting interrupted by Suspense remounts on lazy pages, leaving
  new pages mid-scroll. `useLayoutEffect` runs synchronously before paint so
  the user never sees the old scroll position flash.
- Resets all three candidates: `window.scrollTo(0,0)` +
  `document.documentElement.scrollTop` + `document.body.scrollTop`.

### 2. Learn page emojis → Lucide icons
- `src/components/LearnPage.tsx`
- Replaced every emoji (weather markers ×4, terrain markers ×4, status
  markers ×6, MoveGroup headers ×8 per locale) with Lucide icons for
  consistency with the rest of the UI.
- Icons used: Sun, CloudRain, Wind, Snowflake, Zap, Leaf, CloudFog,
  Sparkles, Flame, Moon, Droplet, Skull, Shield, CloudSun, RefreshCw,
  Bomb, Target, FlaskConical, TrendingDown, Trophy.
- `MoveGroup` component now takes a required `icon` prop rendered next
  to the title.
- Added an `Inline` helper for inline icons inside `<strong>` labels:
  `<strong>Sun <Inline Icon={Sun} /></strong>`.

### 3. Hisuian sprite fix (5 mons)
- `src/lib/pokemon.ts` — `spriteUrl()`
- Our `pokemon.json` stored wrong IDs for 5 Hisuian forms, so sprite
  URLs either 404'd (Samurott, Zoroark, Decidueye) or served the wrong
  mon's sprite (Arcanine showed Voltorb, Goodra showed Zoroark).
- Data (types, stats, moves) was already correct — only the sprite
  fetch was broken. Added a `SPRITE_ID_OVERRIDE` map that remaps the
  broken IDs to real PokeAPI IDs at sprite-fetch time:
  ```
  10229 → 10230  (Hisuian Arcanine)
  10336 → 10236  (Hisuian Samurott)
  10340 → 10239  (Hisuian Zoroark)
  10341 → 10244  (Hisuian Decidueye)
  10239 → 10242  (Hisuian Goodra)
  ```

### 4. Deploy path
- Kimsufi server, rsync over SSH port 60910.
- **Key: `~/.ssh/kimsufi`** (not the default `id_ed25519` — that fails).
- Command saved to memory under `deploy_kimsufi.md`.

## On disk but NOT shipped

### Engine v2 — massive combat simulator (`scripts/gen-massive-sim.mjs`)
The big one. A full rewrite of the script that generates
`src/data/matchup-matrix.json`. **Untracked, not in the app, sim data was
deleted before deploy.**

#### What it does
Simulates **10 billion team-vs-team matchups** (100 000 candidate teams
round-robining) in **~78 seconds** on one CPU thread.

#### Pipeline
1. Load `pokemon.json` + `moves.json` + `pokemon-moves.json` + `tiers.json`
   + `meta-teams.json`.
2. Build a `battler` profile for each of the 250 Pokémon: L50 stats
   (31 IV / 0 EV neutral nature), a 4-move set (best STAB per owned type
   + best coverage moves), an ability (priority-picked from their ability
   list), and an item (role-assigned — see Items section below).
3. **Precompute two 250×250 1v1 battle matrices** (normal speed order +
   Trick-Room inverted speed order). Each cell is a `sim1v1` result in
   [−1, +1]: positive if row Pokémon wins, negative if column wins, with
   magnitude = winner HP % remaining.
4. Generate 100 000 legal candidate teams (10 000 per archetype × 10
   archetypes) with max 1 mega per team.
5. For each team, compute a **per-attacker attack vector**
   `av[d] = sum over A's 6 mons of matrix[ai · n + d]`, then every
   team-vs-team matchup reduces to **6 array reads** instead of 36
   (the attack-vector optimization is what makes the 10B scale tractable).
6. Inner loop picks the normal or TR matrix based on whether either
   team is trick-room archetype.
7. Aggregate per-team win rate + avg score, archetype averages,
   archetype-vs-archetype heatmap, per-mon versatility, hardest-to-counter
   (lowest avg counter score), easiest-to-counter (count of mons scoring
   ≥ 0.5 — not avg, because avg saturates at 1.0 for frail mons).
8. Write `src/data/matchup-matrix.json` (~220 KB) + human-readable
   `scripts/report-massive.txt`.

#### Combat engine covered
- **Damage formula**: standard Pokémon L50 calc
  `((22 · power · A/D) / 50 + 2) · STAB · type_eff · modifiers`.
  Physical uses Atk/Def, special uses SpA/SpD.
- **~50 combat-relevant abilities** implemented with priority-based
  picking (if a Pokémon has several, the most impactful is chosen):
  - **Weather setters**: Drought, Drizzle, Sand Stream, Snow Warning
  - **Weather abusers**: Chlorophyll, Swift Swim, Sand Rush, Slush Rush,
    Solar Power, Sand Force
  - **Stat multipliers**: Huge Power, Pure Power, Water Bubble, Hustle,
    Fur Coat
  - **Damage boosts** (offensive): Tough Claws, Iron Fist, Strong Jaw,
    Mega Launcher, Sharpness, Technician, Sheer Force, Reckless,
    Adaptability, Tinted Lens, Analytic, Parental Bond, Fairy/Dark Aura,
    Punk Rock
  - **Type conversion / -ate**: Pixilate, Refrigerate, Aerilate,
    Galvanize, Normalize, Liquid Voice, Protean, Libero
  - **Ignore defender ability**: Mold Breaker, Turboblaze, Teravolt
  - **Defensive reductions**: Thick Fat, Heatproof, Fluffy, Filter,
    Solid Rock, Prism Armor, Multiscale, Shadow Shield, Ice Scales,
    Purifying Salt, Dry Skin
  - **Type immunities**: Levitate, Flash Fire, Water Absorb, Volt
    Absorb, Lightning Rod, Motor Drive, Sap Sipper, Storm Drain,
    Earth Eater
  - **Switch-in**: Intimidate, Download, Dauntless Shield, Intrepid Sword
  - **Misc**: Sturdy, Gale Wings (priority on Flying), Scrappy
- **Move tagging** (needed for ability interactions): contact, punch,
  bite, pulse, slicing, sound, recoil, has-secondary-effect. Built with
  hardcoded move-name sets.
- **Items** (assigned by `pickItem()` heuristic based on stats):
  - **Life Orb** — ×1.3 damage (recoil ignored for simplicity)
  - **Choice Band** — physical Atk ×1.5 (slow physical hitters)
  - **Choice Specs** — special SpA ×1.5 (slow special hitters)
  - **Choice Scarf** — Spe ×1.5 (mid-speed offensive)
  - **Leftovers** — +1/16 max HP end-of-turn (bulky walls)
  - **Focus Sash** — survive OHKO from full HP with 1 HP (frail offensive)
  - **Assault Vest** — defender SpD ×1.5 (bulky special walls)
  - **Megas**: no item (they hold the Mega Stone)
- **Stat stages**: Intimidate drops Atk by 1 stage, Download +1 Atk or
  SpA depending on foe's weaker defense, Intrepid Sword +1 Atk,
  Dauntless Shield +1 Def.
- **Weather damage boosts**: Sun → Fire ×1.5 / Water ×0.5 — Rain →
  Water ×1.5 / Fire ×0.5 — Sand + Sand Force → Rock/Ground/Steel ×1.3.
- **Trick Room**: a second pair matrix built with reversed speed order;
  used by the hot loop whenever either team's archetype is trick-room.

#### Performance optimizations
- `Float32Array` / `Float64Array` / `Int32Array` / `Int8Array` everywhere
  in the hot path
- Flat storage: `teamIdxFlat` is one `Int32Array(T * 6)` — no nested
  property lookups
- **Attack-vector trick**: 6 reads per team matchup instead of 36
  (the single biggest perf win, ~6× speedup)
- Archetype heatmap accumulators are flat `Float64Array[100]` (10×10)
  to avoid object property writes in the inner loop
- End result: **128 million matchups / second** single-threaded

#### What the sim doesn't model
- No crit rolls, no damage spread randomness (deterministic mid-roll)
- No status moves (no burn / paralysis / sleep / freeze)
- No stat setup moves (no Swords Dance, Calm Mind, Dragon Dance)
- No multi-turn mechanics (no recoil tracking, no Leftovers on attacker
  with Life Orb recoil)
- No terrain (Electric / Grassy / Misty / Psychic terrains)
- No tera types
- Trick Room is modeled as **always-on** for TR archetype teams, which
  gives them a ~86% win rate in the sim versus ~50–55% in real
  tournaments. The sim is "technically optimal TR play" without the
  setup cost / 5-turn limit / Taunt vulnerability.

### Rankings page (built, then removed before deploy)
- `src/components/RankingsPage.tsx` (deleted)
- Was wired at `/rankings` with a Trophy nav icon and footer link.
  Displayed: top 20 teams with sprites, archetype win-rate bar chart,
  archetype-vs-archetype heatmap (color-coded), most versatile Pokémon,
  hardest-to-counter, easiest-to-counter.
- Localized via existing `simPool*` i18n keys so Trick Room → Distorsion
  in French etc.
- **Removed** because the Trick Room dominance artifact (100% win rate
  on top 20 teams, 86% archetype avg) made the rankings misleading. A
  real page would need the engine to model TR setup cost first.
- Files to restore it later:
  - Component: rewrite `src/components/RankingsPage.tsx` against the
    new data shape (archetypeAverage, archetypeHeatmap, topTeams,
    versatility, counterability, easiestToCounter with threatCount).
  - Route: lazy import + View type + pathname check + nav button +
    render block in `App.tsx`.
  - `src/lib/i18n.ts` already has `navRankings` key (EN+FR).
  - Sitemap entry in `scripts/gen-sitemap.mjs`.
  - Document title in `src/lib/useDocumentTitle.ts`.

## Things noted for next time

### Engine v2 tuning ideas
- **Trick Room tax**: blend normal + TR matrices for TR teams (e.g.
  40% TR + 60% normal) to reflect the setup turn cost. Should push TR
  win rate from 86% down to ~55% which matches real tournaments.
- **Life Orb recoil**: track it properly — 1/10 max HP per attack.
  Would lower Life Orb users' effective win rate slightly.
- **Setup moves**: model +2 Atk / +2 SpA / +1 Spe boosts over 1-2 turns
  for a handful of sweepers (Dragon Dance, Quiver Dance, Nasty Plot).
- **Status moves**: burn halves physical Atk, paralysis halves Spe.
  These would massively shift certain matchups.

### Rankings UI revival
If/when the engine is retuned, the rankings page is mostly ready —
just rewrite the component to match the current data shape and
re-wire the 5 touchpoints (App, footer, sitemap, title, i18n).

## i18n keys added (kept, unused until rankings comes back)
- `navRankings`: "Rankings" (EN), "Classements" (FR)
