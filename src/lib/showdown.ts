// Pokémon Showdown paste import / export.
// Format reference: https://pokepast.es / Showdown teambuilder.

import { POKEMON } from "./pokemon";
import { Pokemon, BuildSlot, PokemonStats, PokemonType } from "./types";
import { defaultSp, SP_MAX_PER_STAT } from "./buildStore";

const STAT_LABELS: Record<keyof PokemonStats, string> = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe",
};

const SHOWDOWN_KEYS: Record<string, keyof PokemonStats> = {
  hp: "hp",
  atk: "atk",
  def: "def",
  spa: "spa",
  spd: "spd",
  spe: "spe",
};

/** Convert Champions Stat Points (0–32) to Showdown EVs (0–252). */
export function spToEv(sp: number): number {
  return Math.min(252, Math.round((sp / SP_MAX_PER_STAT) * 252 / 4) * 4);
}

/** Convert Showdown EVs back to Champions SP, capped at SP_MAX_PER_STAT. */
export function evToSp(ev: number): number {
  return Math.min(SP_MAX_PER_STAT, Math.round((ev / 252) * SP_MAX_PER_STAT));
}

export function exportShowdown(
  slots: BuildSlot[],
  monById: Map<number, Pokemon>,
  teamName?: string,
): string {
  const blocks: string[] = [];
  if (teamName) blocks.push(`=== [gen9vgc2026regm] ${teamName} ===\n`);
  for (const slot of slots) {
    const mon = monById.get(slot.pokemonId);
    if (!mon) continue;
    const lines: string[] = [];
    const name = mon.names.en ?? `#${mon.id}`;
    const item = slot.item ? ` @ ${slot.item}` : "";
    lines.push(`${name}${item}`);
    if (slot.ability) lines.push(`Ability: ${slot.ability}`);
    lines.push("Level: 50");
    if (slot.teraType) lines.push(`Tera Type: ${slot.teraType}`);
    if (slot.sp) {
      const evs: string[] = [];
      (Object.keys(STAT_LABELS) as (keyof PokemonStats)[]).forEach((k) => {
        const ev = spToEv(slot.sp![k]);
        if (ev > 0) evs.push(`${ev} ${STAT_LABELS[k]}`);
      });
      if (evs.length > 0) lines.push(`EVs: ${evs.join(" / ")}`);
    }
    if (slot.nature) lines.push(`${slot.nature} Nature`);
    for (const m of slot.moves ?? []) {
      lines.push(`- ${m}`);
    }
    blocks.push(lines.join("\n"));
  }
  return blocks.join("\n\n") + "\n";
}

/** Try hard to find a Pokémon by any of its localized names. */
function findByName(name: string): Pokemon | undefined {
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  const target = norm(name);
  for (const p of POKEMON) {
    for (const n of Object.values(p.names)) {
      if (n && norm(n) === target) return p;
    }
  }
  return undefined;
}

export function importShowdown(text: string): BuildSlot[] {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b && !b.startsWith("==="));

  const slots: BuildSlot[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim());
    if (lines.length === 0) continue;

    const firstLine = lines[0];
    // "Charizard @ Choice Specs" or "Charizard (M) @ Item" or "Nickname (Charizard) @ Item"
    let name = firstLine;
    let item: string | undefined;
    const atIdx = firstLine.indexOf("@");
    if (atIdx >= 0) {
      name = firstLine.slice(0, atIdx).trim();
      item = firstLine.slice(atIdx + 1).trim();
    }
    // Nickname (Species) → Species
    const nick = name.match(/\(([^)]+)\)\s*$/);
    if (nick) name = nick[1].trim();
    // Strip gender marker ("(M)" / "(F)")
    name = name.replace(/\s*\([MF]\)\s*$/, "").trim();

    const mon = findByName(name);
    if (!mon) continue;

    const slot: BuildSlot = {
      pokemonId: mon.id,
      moves: [],
      sp: defaultSp(),
    };
    if (item) slot.item = item;

    for (const line of lines.slice(1)) {
      if (line.startsWith("Ability:")) {
        slot.ability = line.replace("Ability:", "").trim();
      } else if (line.startsWith("Tera Type:")) {
        const tt = line.replace("Tera Type:", "").trim();
        slot.teraType = (tt as PokemonType) || undefined;
      } else if (line.startsWith("EVs:")) {
        const evStr = line.replace("EVs:", "").trim();
        const parts = evStr.split("/").map((p) => p.trim());
        for (const p of parts) {
          const m = p.match(/^(\d+)\s+(\w+)$/);
          if (!m) continue;
          const ev = parseInt(m[1], 10);
          const labelLower = m[2].toLowerCase();
          const key = SHOWDOWN_KEYS[labelLower];
          if (key) slot.sp![key] = evToSp(ev);
        }
      } else if (line.endsWith("Nature")) {
        slot.nature = line.replace("Nature", "").trim();
      } else if (line.startsWith("- ")) {
        slot.moves!.push(line.slice(2).trim());
      }
    }
    slots.push(slot);
    if (slots.length >= 6) break;
  }
  return slots;
}
