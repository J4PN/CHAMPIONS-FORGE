#!/usr/bin/env node
// Fetches localized Pokémon names from PokeAPI and rewrites src/data/pokemon.json
// Usage: node scripts/fetch-names.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, "../src/data/pokemon.json");

// Our lang keys → PokeAPI's (lowercase) language names
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

const MEGA_PREFIX = {
  en: "Mega ",
  fr: "Méga-",
  es: "Mega-",
  de: "Mega-",
  it: "Mega ",
  ja: "メガ",
  ko: "메가",
  "zh-Hans": "超级",
  "zh-Hant": "超級",
};

function megaSuffix(nameEn) {
  if (/\sX$/.test(nameEn)) return " X";
  if (/\sY$/.test(nameEn)) return " Y";
  return "";
}

async function fetchSpecies(id) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`species ${id}: ${r.status}`);
  const j = await r.json();
  const names = {};
  for (const n of j.names) {
    const code = n.language.name;
    for (const [ourKey, apiKey] of Object.entries(API_LANG_MAP)) {
      if (code === apiKey) names[ourKey] = n.name;
    }
  }
  return names;
}

async function main() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const data = JSON.parse(raw);

  const cache = new Map();
  let done = 0;
  for (const mon of data) {
    const baseId = mon.base_id ?? mon.id;
    if (!cache.has(baseId)) {
      try {
        process.stdout.write(`[${++done}/${data.length}] species ${baseId}... `);
        const names = await fetchSpecies(baseId);
        cache.set(baseId, names);
        console.log("ok");
      } catch (e) {
        console.warn(`fail: ${e.message}`);
        cache.set(baseId, {});
      }
      await new Promise((r) => setTimeout(r, 30));
    } else {
      done++;
    }

    const base = cache.get(baseId);
    const names = { ...base };
    const prevEn = mon.name_en ?? mon.names?.en;
    const prevFr = mon.name_fr ?? mon.names?.fr;
    if (!names.en && prevEn) names.en = prevEn;
    if (!names.fr && prevFr) names.fr = prevFr;

    if (mon.mega) {
      const suffix = megaSuffix(prevEn ?? names.en ?? "");
      // Strip any existing mega prefix/suffix from base species names first
      const baseSpeciesNames = {};
      for (const lang of Object.keys(MEGA_PREFIX)) {
        baseSpeciesNames[lang] = names[lang] || names.en || prevEn;
      }
      const out = {};
      for (const [lang, prefix] of Object.entries(MEGA_PREFIX)) {
        const baseName = baseSpeciesNames[lang];
        out[lang] = `${prefix}${baseName}${suffix}`;
      }
      mon.names = out;
    } else {
      mon.names = names;
    }
    delete mon.name_en;
    delete mon.name_fr;
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`\nDone. Rewrote ${data.length} entries with localized names.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
