#!/usr/bin/env node
// Regenerate ability names+descriptions and the full movepool data from
// PokeAPI alone. Keeps the existing roster (already in pokemon.json) but
// drops every CL-derived field (tier, EN-only abilities, etc.) and rebuilds
// localized abilities + moves + movepool from scratch.
//
// Output:
//   - src/data/pokemon.json   (rewritten in place, no `tier`, abilities re-localized)
//   - src/data/moves.json     (rewritten, all moves with localized data)
//   - src/data/pokemon-moves.json (rewritten, id → string[])
//
// Usage: node scripts/regen-from-pokeapi.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POKEMON_PATH = path.resolve(__dirname, "../src/data/pokemon.json");
const MOVES_PATH = path.resolve(__dirname, "../src/data/moves.json");
const POKEMON_MOVES_PATH = path.resolve(
  __dirname,
  "../src/data/pokemon-moves.json",
);

const API_LANG_MAP = {
  en: "en",
  fr: "fr",
  es: "es",
  de: "de",
  it: "it",
  ja: "ja",
  ko: "ko",
  "zh-Hans": "zh-hans",
  "zh-Hant": "zh-hant",
};

const TYPE_CASE = {
  normal: "Normal", fire: "Fire", water: "Water", electric: "Electric",
  grass: "Grass", ice: "Ice", fighting: "Fighting", poison: "Poison",
  ground: "Ground", flying: "Flying", psychic: "Psychic", bug: "Bug",
  rock: "Rock", ghost: "Ghost", dragon: "Dragon", dark: "Dark",
  steel: "Steel", fairy: "Fairy",
};
const cap = (t) => TYPE_CASE[t] ?? (t[0].toUpperCase() + t.slice(1));

// Latest mainline version-groups (ordered preference) used to scope movepools.
const VERSION_GROUPS = [
  "scarlet-violet",
  "sword-shield",
  "ultra-sun-ultra-moon",
];
const ALLOWED_LEARN_METHODS = new Set([
  "level-up",
  "machine",
  "tutor",
  "egg",
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempt = 0) {
  const r = await fetch(url);
  if (r.ok) return r.json();
  if (r.status === 404) return null;
  if (attempt < 2) {
    await sleep(500);
    return fetchJson(url, attempt + 1);
  }
  throw new Error(`${url}: ${r.status}`);
}

function extractLocalized(nameList) {
  const out = {};
  for (const n of nameList || []) {
    for (const [ours, their] of Object.entries(API_LANG_MAP)) {
      if (n.language?.name === their) out[ours] = n.name;
    }
  }
  return out;
}

function pickEffectEntry(entries) {
  // Prefer English short_effect, fallback to first.
  const en = entries?.find((e) => e.language?.name === "en");
  return en?.short_effect || en?.effect || entries?.[0]?.short_effect || "";
}

function pickFlavor(entries) {
  // Prefer EN flavor text from latest game.
  if (!entries) return "";
  const en = entries.filter((e) => e.language?.name === "en");
  if (en.length === 0) return "";
  // Try sword-shield first, otherwise the last EN entry.
  const sw = en.find((e) => e.version_group?.name === "sword-shield");
  return (sw?.flavor_text || en[en.length - 1].flavor_text || "")
    .replace(/[\f\n\r]/g, " ")
    .trim();
}

async function fetchAbility(abilityRef, cache) {
  const key = abilityRef.url;
  if (cache.has(key)) return cache.get(key);
  const data = await fetchJson(abilityRef.url);
  const result = data
    ? {
        names: extractLocalized(data.names),
        description: pickEffectEntry(data.effect_entries),
      }
    : { names: { en: abilityRef.name }, description: "" };
  cache.set(key, result);
  return result;
}

async function fetchMoveDetails(moveName, cache) {
  if (cache.has(moveName)) return cache.get(moveName);
  const data = await fetchJson(`https://pokeapi.co/api/v2/move/${moveName}`);
  if (!data) {
    const fallback = { name: moveName, type: "Normal", category: "status", power: null, accuracy: null, pp: null, description: "" };
    cache.set(moveName, fallback);
    return fallback;
  }
  const out = {
    name: data.names?.find((n) => n.language?.name === "en")?.name ?? data.name,
    type: cap(data.type?.name ?? "normal"),
    category: data.damage_class?.name ?? "status",
    power: data.power ?? null,
    accuracy: data.accuracy ?? null,
    pp: data.pp ?? null,
    description: pickFlavor(data.flavor_text_entries),
  };
  cache.set(moveName, out);
  return out;
}

function pokemonApiId(mon) {
  // For megas use the base id; PokeAPI's /pokemon/{id} for the mega form id
  // also works (10033 etc) but movesets are nearly identical to base.
  return mon.mega && mon.base_id ? mon.base_id : mon.id;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(POKEMON_PATH, "utf8"));
  console.log(`Regenerating data for ${data.length} entries`);

  const abilityCache = new Map();
  const moveCache = new Map();
  const movepools = {};
  const baseFetched = new Map(); // base id → moveset (dedupe megas)

  for (let i = 0; i < data.length; i++) {
    const mon = data[i];
    const apiId = pokemonApiId(mon);
    process.stdout.write(`[${i + 1}/${data.length}] mon ${apiId} `);
    try {
      let pokeData;
      if (baseFetched.has(apiId)) {
        pokeData = baseFetched.get(apiId);
      } else {
        pokeData = await fetchJson(`https://pokeapi.co/api/v2/pokemon/${apiId}`);
        baseFetched.set(apiId, pokeData);
        await sleep(20);
      }
      if (!pokeData) {
        console.log("(no pokemon data, skipping)");
        continue;
      }

      // For mega forms, prefer the mega-specific abilities already in the
      // entry (we keep them as-is). For base forms, refetch ability names+desc.
      if (!mon.mega) {
        const newAbilities = [];
        for (const ab of pokeData.abilities || []) {
          const fetched = await fetchAbility(ab.ability, abilityCache);
          newAbilities.push({
            names: fetched.names,
            hidden: !!ab.is_hidden,
            description: fetched.description,
          });
        }
        if (newAbilities.length > 0) mon.abilities = newAbilities;
      } else if (mon.abilities) {
        // Re-fetch description+localized names for mega abilities by name
        const newAbilities = [];
        for (const ab of mon.abilities) {
          const enName = ab.names?.en;
          if (!enName) {
            newAbilities.push(ab);
            continue;
          }
          const slug = enName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
          const fetched = await fetchAbility(
            { name: slug, url: `https://pokeapi.co/api/v2/ability/${slug}` },
            abilityCache,
          );
          newAbilities.push({
            names: fetched.names.en ? fetched.names : { en: enName },
            hidden: !!ab.hidden,
            description: fetched.description,
          });
        }
        mon.abilities = newAbilities;
      }

      // Drop CL-derived field
      delete mon.tier;

      // Movepool: filter by latest version-group + allowed learn methods
      const moveNames = new Set();
      for (const m of pokeData.moves || []) {
        const usable = (m.version_group_details || []).find(
          (d) =>
            VERSION_GROUPS.includes(d.version_group?.name) &&
            ALLOWED_LEARN_METHODS.has(d.move_learn_method?.name),
        );
        if (usable) moveNames.add(m.move.name);
      }
      movepools[mon.id] = [...moveNames].sort();

      // Fetch full move details for any not yet seen
      for (const mname of moveNames) {
        if (!moveCache.has(mname)) {
          await fetchMoveDetails(mname, moveCache);
          await sleep(15);
        }
      }
      console.log(`(${moveNames.size} moves)`);
    } catch (e) {
      console.log(`fail: ${e.message}`);
    }
  }

  fs.writeFileSync(POKEMON_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`Rewrote ${data.length} entries to pokemon.json`);

  // Build deduped moves db, keyed by display name
  const movesDb = {};
  for (const m of moveCache.values()) {
    movesDb[m.name] = m;
  }
  fs.writeFileSync(MOVES_PATH, JSON.stringify(movesDb, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(movesDb).length} unique moves to moves.json`);

  // Movepools were keyed by the API slug name; remap to display names so the
  // builder can resolve them through the moves DB.
  const slugToDisplay = {};
  for (const [slug, mv] of moveCache.entries()) {
    slugToDisplay[slug] = mv.name;
  }
  const remapped = {};
  for (const [pid, slugs] of Object.entries(movepools)) {
    remapped[pid] = slugs.map((s) => slugToDisplay[s] ?? s).filter(Boolean);
  }
  fs.writeFileSync(POKEMON_MOVES_PATH, JSON.stringify(remapped, null, 2) + "\n");
  console.log(
    `Wrote ${Object.keys(remapped).length} movepools to pokemon-moves.json`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
