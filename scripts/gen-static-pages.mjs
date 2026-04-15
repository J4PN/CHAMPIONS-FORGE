#!/usr/bin/env node
// Generate pre-rendered HTML for every /pokemon/<slug> and /type/<type> URL.
//
// For each URL we take the built dist/index.html as a template and:
//   - rewrite <title>, <meta description>, canonical, og:title, og:url, og:image
//   - inject rich HTML inside <div id="root">...</div> (H1, sprite, stats, FAQ)
//
// On JS load React replaces the content, so users see the SPA and crawlers
// see the pre-rendered content.
//
// Usage: node scripts/gen-static-pages.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const INDEX_HTML = path.join(DIST, "index.html");
const POKEMON_PATH = path.resolve(__dirname, "../src/data/pokemon.json");

const BASE = "https://pokecounter.app";

const SPRITE_BASE = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
const SPRITE_MEGA = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const ALL_TYPES = [
  "Normal", "Fire", "Water", "Electric", "Grass", "Ice",
  "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug",
  "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy",
];

// Gen 6+ type chart — identical to src/lib/types.ts
const TYPE_CHART = {
  Normal:   { Normal:1,Fire:1,Water:1,Electric:1,Grass:1,Ice:1,Fighting:1,Poison:1,Ground:1,Flying:1,Psychic:1,Bug:1,Rock:0.5,Ghost:0,Dragon:1,Dark:1,Steel:0.5,Fairy:1 },
  Fire:     { Normal:1,Fire:0.5,Water:0.5,Electric:1,Grass:2,Ice:2,Fighting:1,Poison:1,Ground:1,Flying:1,Psychic:1,Bug:2,Rock:0.5,Ghost:1,Dragon:0.5,Dark:1,Steel:2,Fairy:1 },
  Water:    { Normal:1,Fire:2,Water:0.5,Electric:1,Grass:0.5,Ice:1,Fighting:1,Poison:1,Ground:2,Flying:1,Psychic:1,Bug:1,Rock:2,Ghost:1,Dragon:0.5,Dark:1,Steel:1,Fairy:1 },
  Electric: { Normal:1,Fire:1,Water:2,Electric:0.5,Grass:0.5,Ice:1,Fighting:1,Poison:1,Ground:0,Flying:2,Psychic:1,Bug:1,Rock:1,Ghost:1,Dragon:0.5,Dark:1,Steel:1,Fairy:1 },
  Grass:    { Normal:1,Fire:0.5,Water:2,Electric:1,Grass:0.5,Ice:1,Fighting:1,Poison:0.5,Ground:2,Flying:0.5,Psychic:1,Bug:0.5,Rock:2,Ghost:1,Dragon:0.5,Dark:1,Steel:0.5,Fairy:1 },
  Ice:      { Normal:1,Fire:0.5,Water:0.5,Electric:1,Grass:2,Ice:0.5,Fighting:1,Poison:1,Ground:2,Flying:2,Psychic:1,Bug:1,Rock:1,Ghost:1,Dragon:2,Dark:1,Steel:0.5,Fairy:1 },
  Fighting: { Normal:2,Fire:1,Water:1,Electric:1,Grass:1,Ice:2,Fighting:1,Poison:0.5,Ground:1,Flying:0.5,Psychic:0.5,Bug:0.5,Rock:2,Ghost:0,Dragon:1,Dark:2,Steel:2,Fairy:0.5 },
  Poison:   { Normal:1,Fire:1,Water:1,Electric:1,Grass:2,Ice:1,Fighting:1,Poison:0.5,Ground:0.5,Flying:1,Psychic:1,Bug:1,Rock:0.5,Ghost:0.5,Dragon:1,Dark:1,Steel:0,Fairy:2 },
  Ground:   { Normal:1,Fire:2,Water:1,Electric:2,Grass:0.5,Ice:1,Fighting:1,Poison:2,Ground:1,Flying:0,Psychic:1,Bug:0.5,Rock:2,Ghost:1,Dragon:1,Dark:1,Steel:2,Fairy:1 },
  Flying:   { Normal:1,Fire:1,Water:1,Electric:0.5,Grass:2,Ice:1,Fighting:2,Poison:1,Ground:1,Flying:1,Psychic:1,Bug:2,Rock:0.5,Ghost:1,Dragon:1,Dark:1,Steel:0.5,Fairy:1 },
  Psychic:  { Normal:1,Fire:1,Water:1,Electric:1,Grass:1,Ice:1,Fighting:2,Poison:2,Ground:1,Flying:1,Psychic:0.5,Bug:1,Rock:1,Ghost:1,Dragon:1,Dark:0,Steel:0.5,Fairy:1 },
  Bug:      { Normal:1,Fire:0.5,Water:1,Electric:1,Grass:2,Ice:1,Fighting:0.5,Poison:0.5,Ground:1,Flying:0.5,Psychic:2,Bug:1,Rock:1,Ghost:0.5,Dragon:1,Dark:2,Steel:0.5,Fairy:0.5 },
  Rock:     { Normal:1,Fire:2,Water:1,Electric:1,Grass:1,Ice:2,Fighting:0.5,Poison:1,Ground:0.5,Flying:2,Psychic:1,Bug:2,Rock:1,Ghost:1,Dragon:1,Dark:1,Steel:0.5,Fairy:1 },
  Ghost:    { Normal:0,Fire:1,Water:1,Electric:1,Grass:1,Ice:1,Fighting:1,Poison:1,Ground:1,Flying:1,Psychic:2,Bug:1,Rock:1,Ghost:2,Dragon:1,Dark:0.5,Steel:1,Fairy:1 },
  Dragon:   { Normal:1,Fire:1,Water:1,Electric:1,Grass:1,Ice:1,Fighting:1,Poison:1,Ground:1,Flying:1,Psychic:1,Bug:1,Rock:1,Ghost:1,Dragon:2,Dark:1,Steel:0.5,Fairy:0 },
  Dark:     { Normal:1,Fire:1,Water:1,Electric:1,Grass:1,Ice:1,Fighting:0.5,Poison:1,Ground:1,Flying:1,Psychic:2,Bug:1,Rock:1,Ghost:2,Dragon:1,Dark:0.5,Steel:1,Fairy:0.5 },
  Steel:    { Normal:1,Fire:0.5,Water:0.5,Electric:0.5,Grass:1,Ice:2,Fighting:1,Poison:1,Ground:1,Flying:1,Psychic:1,Bug:1,Rock:2,Ghost:1,Dragon:1,Dark:1,Steel:0.5,Fairy:2 },
  Fairy:    { Normal:1,Fire:0.5,Water:1,Electric:1,Grass:1,Ice:1,Fighting:2,Poison:0.5,Ground:1,Flying:1,Psychic:1,Bug:1,Rock:1,Ghost:1,Dragon:2,Dark:2,Steel:0.5,Fairy:1 },
};

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function effectiveness(atk, defTypes) {
  return defTypes.reduce((m, t) => m * (TYPE_CHART[atk]?.[t] ?? 1), 1);
}

function defensiveMatchups(mon) {
  const weak = [], resist = [], immune = [];
  for (const t of ALL_TYPES) {
    const m = effectiveness(t, mon.types);
    if (m === 0) immune.push(t);
    else if (m >= 2) weak.push({ type: t, mult: m });
    else if (m < 1) resist.push({ type: t, mult: m });
  }
  return { weak, resist, immune };
}

function pickScore(attacker, defender) {
  const off = Math.max(
    ...attacker.types.map((t) => effectiveness(t, defender.types)),
  );
  const inc = Math.max(
    ...defender.types.map((t) => effectiveness(t, attacker.types)),
  );
  let s = 0;
  if (off >= 2) s += 1;
  if (off >= 4) s += 1;
  if (inc === 0) s += 1;
  else if (inc >= 4) s -= 1;
  else if (inc >= 2) s -= 0.5;
  if (off >= 2 && inc < 2) s += 0.5;
  return s;
}

function topCounters(mon, pokemon, n = 8) {
  return pokemon
    .filter((p) => p.id !== mon.id)
    .map((p) => ({ p, s: pickScore(p, mon) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((r) => r.p);
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============ Pokémon page renderer ============

function renderPokemonBody(mon, allPokemon) {
  const name = mon.names?.en ?? `Pokemon #${mon.id}`;
  const types = mon.types.join(" / ");
  const { weak, resist, immune } = defensiveMatchups(mon);
  const stats = mon.stats ?? null;
  const counters = topCounters(mon, allPokemon, 8);
  const spriteUrl = mon.mega && mon.base_id ? SPRITE_MEGA(mon.id) : SPRITE_BASE(mon.id);

  const statsHtml = stats
    ? `<section><h2>Base stats</h2><dl>
      <dt>HP</dt><dd>${stats.hp}</dd>
      <dt>Attack</dt><dd>${stats.atk}</dd>
      <dt>Defense</dt><dd>${stats.def}</dd>
      <dt>Sp. Attack</dt><dd>${stats.spa}</dd>
      <dt>Sp. Defense</dt><dd>${stats.spd}</dd>
      <dt>Speed</dt><dd>${stats.spe}</dd>
      <dt>Total</dt><dd><strong>${stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe}</strong></dd>
    </dl></section>`
    : "";

  const weakText =
    weak.length > 0
      ? `takes super-effective damage from ${weak.map((w) => w.type).join(", ")}`
      : "has no type weaknesses";

  const weakHtml =
    weak.length > 0
      ? `<section><h2>Weaknesses</h2><ul>${weak.map((w) => `<li>${w.type} (&times;${w.mult})</li>`).join("")}</ul></section>`
      : "";
  const resistHtml =
    resist.length > 0
      ? `<section><h2>Resistances</h2><ul>${resist.map((r) => `<li>${r.type} (&times;${r.mult})</li>`).join("")}</ul></section>`
      : "";
  const immuneHtml =
    immune.length > 0
      ? `<section><h2>Immunities</h2><ul>${immune.map((t) => `<li>${t}</li>`).join("")}</ul></section>`
      : "";

  const abilities = mon.abilities ?? [];
  const abilitiesHtml =
    abilities.length > 0
      ? `<section><h2>Abilities</h2><ul>${abilities
          .map((a) => {
            const abName = a.names?.en ?? "?";
            const hidden = a.hidden ? " <em>(hidden)</em>" : "";
            const desc = a.description ? ` &mdash; ${esc(a.description)}` : "";
            return `<li><strong>${esc(abName)}</strong>${hidden}${desc}</li>`;
          })
          .join("")}</ul></section>`
      : "";

  const countersHtml =
    counters.length > 0
      ? `<section><h2>Top counters vs ${esc(name)}</h2><ol>${counters
          .map(
            (c) =>
              `<li><a href="/pokemon/${slugify(c.names?.en ?? `pokemon-${c.id}`)}">${esc(c.names?.en ?? "?")}</a> (${c.types.join(" / ")})</li>`,
          )
          .join("")}</ol></section>`
      : "";

  const topCounterName = counters[0]?.names?.en ?? "—";

  return `
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/pokedex">Pokédex</a> / ${esc(name)}</nav>
  <article>
    <header>
      <img src="${spriteUrl}" alt="${esc(name)} sprite" width="96" height="96" loading="lazy">
      <h1>${esc(name)} counters, weaknesses &amp; stats</h1>
      <p><strong>Type:</strong> ${esc(types)}</p>
    </header>
    <p>Looking for the best counters for <strong>${esc(name)}</strong>? This page
    lists the top Pokémon from the Pokémon Champions roster that hit ${esc(name)}
    super-effectively, along with its full base stats, defensive matchups,
    abilities and weaknesses. ${esc(name)} is a ${esc(types)}-type Pokémon that ${weakText}.</p>
    ${statsHtml}
    ${weakHtml}
    ${resistHtml}
    ${immuneHtml}
    ${abilitiesHtml}
    ${countersHtml}
    <section>
      <h2>Frequently asked questions</h2>
      <details open>
        <summary>What is the best counter for ${esc(name)}?</summary>
        <p>Based on STAB type coverage and defensive safety, the top counter
        in the Pokémon Champions roster is <strong>${esc(topCounterName)}</strong>.
        See the full ranked list above for more options.</p>
      </details>
      <details>
        <summary>What are ${esc(name)}'s weaknesses?</summary>
        <p>${weak.length > 0 ? `${esc(name)} is weak to ${weak.map((w) => w.type).join(", ")}.` : `${esc(name)} has no type weaknesses.`}</p>
      </details>
      <details>
        <summary>What type is ${esc(name)}?</summary>
        <p>${esc(name)} is a ${esc(types)}-type Pokémon.</p>
      </details>
    </section>
  </article>
</main>`;
}

function renderTypeBody(type, pokemon) {
  const typeLower = type.toLowerCase();
  const hitsThisType = ALL_TYPES.filter((t) => TYPE_CHART[t][type] >= 2);
  const thisResists = ALL_TYPES.filter(
    (t) => TYPE_CHART[t][type] !== undefined && TYPE_CHART[t][type] < 1 && TYPE_CHART[t][type] > 0,
  );
  const thisImmune = ALL_TYPES.filter((t) => TYPE_CHART[t][type] === 0);

  const ofType = pokemon.filter((p) => p.types.includes(type)).slice(0, 12);
  const counters = pokemon
    .filter((p) => p.types.some((pt) => hitsThisType.includes(pt)))
    .slice(0, 12);

  const weakText =
    hitsThisType.length > 0
      ? `weak to ${hitsThisType.join(", ")}`
      : "not weak to any type";

  return `
<main>
  <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/types-chart">Types</a> / ${type}</nav>
  <article>
    <header>
      <h1>Best ${type} counters &amp; weaknesses</h1>
      <p>${type}-type Pokémon are ${weakText}. They resist ${thisResists.length > 0 ? thisResists.join(", ") : "nothing"}${thisImmune.length > 0 ? ` and are immune to ${thisImmune.join(", ")}` : ""}.</p>
    </header>
    <p>This page lists the best counters for ${type}-type Pokémon in the
    Pokémon Champions roster, the strongest ${type}-type mons themselves,
    and the type's full offensive and defensive matchups.</p>
    <section>
      <h2>Matchups</h2>
      <ul>
        <li><strong>Weak to:</strong> ${hitsThisType.join(", ") || "nothing"}</li>
        <li><strong>Resists:</strong> ${thisResists.join(", ") || "nothing"}</li>
        ${thisImmune.length > 0 ? `<li><strong>Immune to:</strong> ${thisImmune.join(", ")}</li>` : ""}
      </ul>
    </section>
    ${
      ofType.length > 0
        ? `<section><h2>Best ${type}-type Pokémon</h2><ul>${ofType.map((p) => `<li><a href="/pokemon/${slugify(p.names?.en ?? `pokemon-${p.id}`)}">${esc(p.names?.en ?? "?")}</a></li>`).join("")}</ul></section>`
        : ""
    }
    <section>
      <h2>Top counters to ${type}</h2>
      <ol>${counters.map((p) => `<li><a href="/pokemon/${slugify(p.names?.en ?? `pokemon-${p.id}`)}">${esc(p.names?.en ?? "?")}</a> (${p.types.join(" / ")})</li>`).join("")}</ol>
    </section>
    <p>Want to find the best pick for your own team against a ${type}-type
    opponent? <a href="/">Open the PokeCounter app</a>.</p>
  </article>
</main>`;
  void typeLower;
}

// ============ Template mutation ============

function applyMeta(template, { title, description, canonical, image }) {
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${esc(description)}" />`,
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = html.replace(
    /property="og:title"\s+content="[^"]*"/,
    `property="og:title" content="${esc(title)}"`,
  );
  html = html.replace(
    /property="og:description"\s+content="[^"]*"/,
    `property="og:description" content="${esc(description)}"`,
  );
  html = html.replace(
    /property="og:url"\s+content="[^"]*"/,
    `property="og:url" content="${canonical}"`,
  );
  if (image) {
    html = html.replace(
      /property="og:image"\s+content="[^"]*"/,
      `property="og:image" content="${image}"`,
    );
  }
  html = html.replace(
    /name="twitter:title"\s+content="[^"]*"/,
    `name="twitter:title" content="${esc(title)}"`,
  );
  html = html.replace(
    /name="twitter:description"\s+content="[^"]*"/,
    `name="twitter:description" content="${esc(description)}"`,
  );
  if (image) {
    html = html.replace(
      /name="twitter:image"\s+content="[^"]*"/,
      `name="twitter:image" content="${image}"`,
    );
  }
  return html;
}

function injectBody(html, body) {
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

// ============ Main ============

function main() {
  if (!fs.existsSync(INDEX_HTML)) {
    console.error(`dist/index.html not found. Run \`npm run build\` first.`);
    process.exit(1);
  }
  const template = fs.readFileSync(INDEX_HTML, "utf8");
  const pokemon = JSON.parse(fs.readFileSync(POKEMON_PATH, "utf8"));

  let pokemonCount = 0;
  const pokemonDir = path.join(DIST, "pokemon");
  fs.mkdirSync(pokemonDir, { recursive: true });
  for (const mon of pokemon) {
    const name = mon.names?.en;
    if (!name) continue;
    const slug = slugify(name);
    const title = `${name} counters, weaknesses & stats · PokeCounter`;
    const description = `Best counters for ${name}. Full base stats, type matchups, weaknesses, abilities, top picks from the Pokémon Champions roster.`;
    const canonical = `${BASE}/pokemon/${slug}`;
    const image = mon.mega && mon.base_id ? SPRITE_MEGA(mon.id) : SPRITE_BASE(mon.id);

    let html = applyMeta(template, { title, description, canonical, image });
    html = injectBody(html, renderPokemonBody(mon, pokemon));
    fs.writeFileSync(path.join(pokemonDir, `${slug}.html`), html);
    pokemonCount++;
  }

  let typeCount = 0;
  const typeDir = path.join(DIST, "type");
  fs.mkdirSync(typeDir, { recursive: true });
  for (const type of ALL_TYPES) {
    const slug = type.toLowerCase();
    const title = `Best ${type} counters & weaknesses · PokeCounter`;
    const description = `Best counters to ${type}-type Pokémon, ${type} weaknesses, resistances and the strongest ${type}-type mons in the Pokémon Champions roster.`;
    const canonical = `${BASE}/type/${slug}`;

    let html = applyMeta(template, { title, description, canonical });
    html = injectBody(html, renderTypeBody(type, pokemon));
    fs.writeFileSync(path.join(typeDir, `${slug}.html`), html);
    typeCount++;
  }

  console.log(`Wrote ${pokemonCount} Pokémon pages + ${typeCount} type pages to dist/`);
}

main();
