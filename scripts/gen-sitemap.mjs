#!/usr/bin/env node
// Generate sitemap.xml with all crawlable URLs for PokeCounter.
//   /                          (home)
//   /pokedex, /compare, /types-chart, /battle, /learn, /about, /legal
//   /pokemon/<slug>             — one per Pokémon (250 entries)
//   /type/<type>                — one per type (18 entries)
// Each entry gets hreflang alternates for the 9 supported languages.
//
// Usage: node scripts/gen-sitemap.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POKEMON_PATH = path.resolve(__dirname, "../src/data/pokemon.json");
const OUT_PATH = path.resolve(__dirname, "../public/sitemap.xml");

const BASE = "https://pokecounter.app";
const LANGS = ["en", "fr", "es", "de", "it", "ja", "ko", "zh-Hans", "zh-Hant"];
const ALL_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];
const TODAY = new Date().toISOString().slice(0, 10);

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function urlEntry(loc, priority = 0.7, changefreq = "weekly") {
  const alternates = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${loc}"/>`,
  ).join("\n");
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>
  </url>`;
}

function main() {
  const pokemon = JSON.parse(fs.readFileSync(POKEMON_PATH, "utf8"));

  const urls = [];
  // Home + main sections
  urls.push(urlEntry(`${BASE}/`, 1.0, "daily"));
  urls.push(urlEntry(`${BASE}/pokedex`, 0.9));
  urls.push(urlEntry(`${BASE}/compare`, 0.8));
  urls.push(urlEntry(`${BASE}/types-chart`, 0.8));
  urls.push(urlEntry(`${BASE}/battle`, 0.8));
  urls.push(urlEntry(`${BASE}/rankings`, 0.9, "daily"));
  urls.push(urlEntry(`${BASE}/tiers`, 0.9, "daily"));
  urls.push(urlEntry(`${BASE}/learn`, 0.7));
  urls.push(urlEntry(`${BASE}/about`, 0.4, "monthly"));
  urls.push(urlEntry(`${BASE}/legal`, 0.3, "monthly"));

  // Per-Pokémon landing pages
  for (const mon of pokemon) {
    const slug = slugify(mon.names?.en ?? `pokemon-${mon.id}`);
    urls.push(urlEntry(`${BASE}/pokemon/${slug}`, 0.7));
  }

  // Per-type landing pages
  for (const t of ALL_TYPES) {
    urls.push(urlEntry(`${BASE}/type/${t}`, 0.7));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

  fs.writeFileSync(OUT_PATH, xml);
  console.log(
    `Wrote ${urls.length} URLs to ${OUT_PATH} (${pokemon.length} Pokémon + ${ALL_TYPES.length} types + 8 pages)`,
  );
}

main();
