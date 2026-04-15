#!/usr/bin/env node
// Enriches src/data/pokemon.json with stats + abilities (localized).
// Usage: node scripts/fetch-details.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../src/data/pokemon.json");

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

async function fetchPokemon(id) {
  const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!r.ok) throw new Error(`pokemon ${id}: ${r.status}`);
  return r.json();
}

async function fetchAbility(id) {
  const r = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);
  if (!r.ok) throw new Error(`ability ${id}: ${r.status}`);
  return r.json();
}

function extractNames(nameList) {
  const out = {};
  for (const n of nameList) {
    for (const [ours, their] of Object.entries(API_LANG_MAP)) {
      if (n.language.name === their) out[ours] = n.name;
    }
  }
  return out;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

  const abilityCache = new Map();
  let done = 0;

  for (const mon of data) {
    done++;
    const apiId = mon.mega && mon.base_id ? mon.id : mon.id;
    try {
      process.stdout.write(`[${done}/${data.length}] mon ${apiId}... `);
      const poke = await fetchPokemon(apiId);
      // Stats
      const stats = {};
      for (const s of poke.stats) {
        const key = s.stat.name.replace("special-attack", "spa").replace("special-defense", "spd").replace("attack", "atk").replace("defense", "def").replace("speed", "spe");
        stats[key] = s.base_stat;
      }
      mon.stats = stats;
      mon.height = poke.height; // decimetres
      mon.weight = poke.weight; // hectograms

      // Abilities (localized)
      const abilities = [];
      for (const a of poke.abilities) {
        const abName = a.ability.name;
        const abUrl = a.ability.url;
        const abIdMatch = abUrl.match(/\/ability\/(\d+)\//);
        const abId = abIdMatch ? abIdMatch[1] : abName;
        if (!abilityCache.has(abId)) {
          try {
            const abData = await fetchAbility(abId);
            const names = extractNames(abData.names || []);
            abilityCache.set(abId, names);
            await new Promise((r) => setTimeout(r, 20));
          } catch {
            abilityCache.set(abId, { en: abName });
          }
        }
        abilities.push({
          names: abilityCache.get(abId),
          hidden: a.is_hidden,
        });
      }
      mon.abilities = abilities;
      console.log("ok");
    } catch (e) {
      console.warn(`fail: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 20));
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`\nDone. Enriched ${data.length} entries.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
