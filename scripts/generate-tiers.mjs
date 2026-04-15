#!/usr/bin/env node
// Generate a comprehensive tier list for the Pokémon Champions roster by
// cross-referencing:
//   1. Smogon VGC Reg I / Reg F usage stats (high ELO 1760+, March 2026)
//   2. Base stat totals as fallback for mons not in Smogon stats (Megas,
//      regional forms, mons unique to Champions)
//   3. Mega bonus: +1 tier over the base form
//
// Output: src/data/tiers.json
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POKEMON_PATH = path.resolve(__dirname, "../src/data/pokemon.json");
const TIERS_PATH = path.resolve(__dirname, "../src/data/tiers.json");

const STATS_URLS = [
  "https://www.smogon.com/stats/2026-03/gen9vgc2026regi-1760.txt",
  "https://www.smogon.com/stats/2026-03/gen9vgc2026regf-1760.txt",
];

// ----------------- Name normalization -----------------

// Strip Smogon form suffixes and punctuation so we can match with our names.
function normalizeName(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\s'.:]/g, "")
    .replace(/\(.+\)/, "");
}

// Some Smogon names need remapping to our canonical EN names.
const SMOGON_RENAMES = {
  "urshifurapidstrike": "urshifu", // we may or may not have Urshifu
  "urshifusinglestrike": "urshifu",
  "mrmime": "mrmime",
  "mrrime": "mrrime",
  "nidoranf": "nidoranf",
  "nidoranm": "nidoranm",
  "typenull": "typenull",
  "taurospaldeacombat": "taurospaldea",
  "taurospaldeaaqua": "taurospaldea",
  "taurospaldeablaze": "taurospaldea",
  "oricoriopompom": "oricorio",
  "oricoriopau": "oricorio",
  "oricoriosensu": "oricorio",
  "basculegionm": "basculegion",
  "basculegionf": "basculegion",
  "indeedeef": "indeedee",
  "indeedee": "indeedee",
  "meowsticm": "meowstic",
  "meowsticf": "meowstic",
  "zamazentacrowned": "zamazenta",
  "zaciancrowned": "zacian",
};

// ----------------- Fetch & parse Smogon -----------------

async function fetchStats(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url}: ${r.status}`);
  return r.text();
}

function parseSmogon(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^\|\s*\d+\s*\|\s*([^|]+?)\s*\|\s*([\d.]+)%/);
    if (!m) continue;
    let name = m[1].trim();
    const usage = parseFloat(m[2]);
    const key = SMOGON_RENAMES[normalizeName(name)] ?? normalizeName(name);
    if (!(key in out) || out[key] < usage) {
      out[key] = usage;
    }
  }
  return out;
}

// ----------------- Tier thresholds -----------------

// Usage % → tier
function usageToTier(usage) {
  if (usage >= 15) return "S";
  if (usage >= 5) return "A";
  if (usage >= 1.5) return "B";
  if (usage >= 0.3) return "C";
  return "D";
}

// Base stat total → tier (fallback when not in Smogon usage data)
function bstToTier(bst) {
  if (bst >= 700) return "S"; // Mega Mewtwo/Rayquaza, Arceus etc.
  if (bst >= 600) return "A"; // pseudo-legends, strong megas
  if (bst >= 520) return "B";
  if (bst >= 450) return "C";
  return "D";
}

// Specialized Mega tier by BST (tighter thresholds — every Mega is at least
// competitive because they consume the limited "one Mega per team" slot)
function megaBstToTier(bst) {
  if (bst >= 700) return "S";
  if (bst >= 600) return "A"; // strong megas like Mega Charizard X/Y, Mega Metagross
  if (bst >= 500) return "B";
  return "C";
}

// No ban list — our pokemon.json IS the Champions legal roster. Anything in
// there is fair game; if Smogon has usage data for it, great; if not, BST
// fallback. We trust the roster as ground truth.

// ----------------- Main -----------------

async function main() {
  console.log("Fetching Smogon stats...");
  const texts = await Promise.all(STATS_URLS.map(fetchStats));
  const usage = {};
  for (const t of texts) {
    const parsed = parseSmogon(t);
    for (const [k, v] of Object.entries(parsed)) {
      usage[k] = Math.max(usage[k] ?? 0, v);
    }
  }
  console.log(`Parsed ${Object.keys(usage).length} mons from Smogon stats`);

  const pokemon = JSON.parse(fs.readFileSync(POKEMON_PATH, "utf8"));

  // Build a set of base_ids that have a Mega form in the roster — their base
  // forms get promoted since Champions re-enables Mega Evolution.
  const hasMega = new Set();
  for (const mon of pokemon) {
    if (mon.mega && mon.base_id) hasMega.add(mon.base_id);
  }

  const TIER_ORDER = ["D", "C", "B", "A", "S"];
  const bump = (t, n = 1) =>
    TIER_ORDER[Math.min(TIER_ORDER.length - 1, TIER_ORDER.indexOf(t) + n)];

  const tiers = { S: [], A: [], B: [], C: [], D: [] };
  const details = [];

  for (const mon of pokemon) {
    const name = mon.names?.en ?? "";
    const nn = normalizeName(name);
    const bst = mon.stats
      ? mon.stats.hp + mon.stats.atk + mon.stats.def + mon.stats.spa + mon.stats.spd + mon.stats.spe
      : 0;

    let tier;
    let source;

    if (mon.mega) {
      tier = megaBstToTier(bst);
      source = `mega bst ${bst}`;
    } else if (usage[nn] != null) {
      tier = usageToTier(usage[nn]);
      source = `smogon ${usage[nn].toFixed(2)}%`;
    } else {
      tier = bstToTier(bst);
      source = `bst ${bst}`;
    }

    // Base form with a Mega available: at least B tier (you're bringing it
    // for the Mega, which implies competitive viability)
    if (!mon.mega && hasMega.has(mon.id)) {
      if (["C", "D"].includes(tier)) tier = "B";
    }

    tiers[tier].push(mon.id);
    details.push({ id: mon.id, name, tier, source });
  }

  // Dedupe + sort each bucket
  for (const k of Object.keys(tiers)) {
    tiers[k] = [...new Set(tiers[k])].sort((a, b) => a - b);
  }

  fs.writeFileSync(TIERS_PATH, JSON.stringify(tiers, null, 2) + "\n");

  console.log(`\nTier breakdown:`);
  for (const k of ["S", "A", "B", "C", "D"]) {
    console.log(`  ${k}: ${tiers[k].length}`);
  }
  console.log(`  (total: ${Object.values(tiers).reduce((a, b) => a + b.length, 0)})`);
  console.log(`\nSample details:`);
  for (const d of details.slice(0, 20)) {
    console.log(`  ${d.tier}  ${d.name.padEnd(25)}  ${d.source}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
