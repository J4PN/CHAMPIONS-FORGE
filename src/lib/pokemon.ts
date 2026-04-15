import raw from "@/data/pokemon.json";
import { Pokemon } from "./types";

export const POKEMON: Pokemon[] = raw as unknown as Pokemon[];

/** URL-friendly identifier for a Pokémon — uses the English name. */
export function monSlug(p: Pokemon): string {
  const name = p.names.en ?? `pokemon-${p.id}`;
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Build a canonical URL for a Pokémon detail page. */
export function monUrl(p: Pokemon): string {
  return `/pokemon/${monSlug(p)}`;
}

const POKEMON_BY_SLUG = new Map<string, Pokemon>();

export function findBySlug(slug: string): Pokemon | undefined {
  if (POKEMON_BY_SLUG.size === 0) {
    for (const p of POKEMON) POKEMON_BY_SLUG.set(monSlug(p), p);
  }
  return POKEMON_BY_SLUG.get(slug);
}

// Our pokemon.json IDs for 5 Hisuian forms don't match the real PokeAPI IDs
// so their sprite URLs 404 (Samurott/Zoroark/Decidueye) or worse serve the
// WRONG mon's sprite (Arcanine/Goodra). The data itself (types, stats) is
// correct — only the sprite lookup needs remapping.
const SPRITE_ID_OVERRIDE: Record<number, number> = {
  // Hisuian forms
  10229: 10230, // Hisuian Arcanine
  10336: 10236, // Hisuian Samurott
  10340: 10239, // Hisuian Zoroark
  10341: 10244, // Hisuian Decidueye
  10239: 10242, // Hisuian Goodra
  // Mega evolutions (data IDs != PokeAPI IDs for Champions-original megas)
  10006: 10073,  // Mega Pidgeot
  10007: 10054,  // Mega Medicham
  10008: 10055,  // Mega Manectric
  10009: 10070,  // Mega Sharpedo
  10010: 10087,  // Mega Camerupt
  10011: 10056,  // Mega Banette
  10012: 10306,  // Mega Chimecho
  10013: 10074,  // Mega Glalie
  10014: 10278,  // Mega Clefable
  10016: 10279,  // Mega Victreebel
  10020: 10280,  // Mega Starmie
  10024: 10281,  // Mega Dragonite
  10025: 10282,  // Mega Meganium
  10026: 10283,  // Mega Feraligatr
  10031: 10284,  // Mega Skarmory
  10052: 10292,  // Mega Chesnaught
  10054: 10294,  // Mega Greninja
  10055: 10314,  // Mega Meowstic
  10056: 10300,  // Mega Hawlucha
  10061: 10291,  // Mega Chandelure
  10062: 10296,  // Mega Floette
};

// These mega IDs have no pixel sprite on PokeAPI — fall back to artwork.
const NO_PIXEL_SPRITE = new Set([10306,10278,10280,10282,10283,10284,10292,10294,10314,10300,10291,10296]);

/** Small pixel sprite (96x96) — crisp at small sizes (chips, badges, lists).
 *  Falls back to artwork for the 12 Champions-original megas that lack pixel sprites. */
export function spriteUrl(p: Pokemon): string {
  const id = SPRITE_ID_OVERRIDE[p.id] ?? p.id;
  if (NO_PIXEL_SPRITE.has(id)) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

/** HD official artwork (~475x475) — use for large displays (team slots, Pokédex, share cards). */
export function artworkUrl(p: Pokemon, shiny = false): string {
  const id = SPRITE_ID_OVERRIDE[p.id] ?? p.id;
  const path = shiny ? "official-artwork/shiny" : "official-artwork";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/${path}/${id}.png`;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af]/g, "");
}

/**
 * Search across all localized names so users can type in any supported
 * language (Romaji / kana / hanzi / hangul / Latin).
 */
export function searchPokemon(query: string, limit = 10): Pokemon[] {
  const q = normalize(query);
  if (!q) return [];
  const starts: Pokemon[] = [];
  const includes: Pokemon[] = [];
  for (const p of POKEMON) {
    const candidates = Object.values(p.names).map((n) => normalize(n ?? ""));
    let matched: "start" | "inc" | null = null;
    for (const c of candidates) {
      if (!c) continue;
      if (c.startsWith(q)) {
        matched = "start";
        break;
      }
      if (c.includes(q)) matched = "inc";
    }
    if (matched === "start") starts.push(p);
    else if (matched === "inc") includes.push(p);
    if (starts.length >= limit) break;
  }
  return [...starts, ...includes].slice(0, limit);
}
