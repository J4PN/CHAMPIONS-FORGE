export type PokemonType =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"
  | "Fairy";

export interface PokemonStats {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface Ability {
  names: Partial<Record<
    "en" | "fr" | "es" | "de" | "it" | "ja" | "ko" | "zh-Hans" | "zh-Hant",
    string
  >>;
  hidden: boolean;
  // Can be a plain string (legacy) or a localized Record (new).
  description?: string | Partial<Record<
    "en" | "fr" | "es" | "de" | "it" | "ja" | "ko" | "zh-Hans" | "zh-Hant",
    string
  >>;
}

export interface Pokemon {
  id: number;
  types: PokemonType[];
  mega: boolean;
  base_id?: number;
  names: Partial<Record<
    "en" | "fr" | "es" | "de" | "it" | "ja" | "ko" | "zh-Hans" | "zh-Hant",
    string
  >>;
  stats?: PokemonStats;
  abilities?: Ability[];
  height?: number; // decimetres
  weight?: number; // hectograms
  tier?: "S" | "A" | "B" | "C" | "D";
  generation?: number;
  hasMega?: boolean;
}

export interface Move {
  name: string;
  type: PokemonType;
  category: "physical" | "special" | "status";
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  description: string;
}

/** A Pokémon configured for advanced team-building. */
export interface BuildSlot {
  pokemonId: number;
  ability?: string;          // ability name (en)
  moves?: string[];          // up to 4 move names
  item?: string;
  nature?: string;
  teraType?: PokemonType;
  // Stat Points (Champions: 66 points total, 32 max per stat)
  sp?: PokemonStats;
}

export const ALL_TYPES: PokemonType[] = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
];

// Full Gen 6+ type effectiveness chart.
// TYPE_CHART[attacker][defender] => multiplier
export const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  Normal: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1,
    Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 1,
    Rock: 0.5, Ghost: 0, Dragon: 1, Dark: 1, Steel: 0.5, Fairy: 1,
  },
  Fire: {
    Normal: 1, Fire: 0.5, Water: 0.5, Electric: 1, Grass: 2, Ice: 2,
    Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 2,
    Rock: 0.5, Ghost: 1, Dragon: 0.5, Dark: 1, Steel: 2, Fairy: 1,
  },
  Water: {
    Normal: 1, Fire: 2, Water: 0.5, Electric: 1, Grass: 0.5, Ice: 1,
    Fighting: 1, Poison: 1, Ground: 2, Flying: 1, Psychic: 1, Bug: 1,
    Rock: 2, Ghost: 1, Dragon: 0.5, Dark: 1, Steel: 1, Fairy: 1,
  },
  Electric: {
    Normal: 1, Fire: 1, Water: 2, Electric: 0.5, Grass: 0.5, Ice: 1,
    Fighting: 1, Poison: 1, Ground: 0, Flying: 2, Psychic: 1, Bug: 1,
    Rock: 1, Ghost: 1, Dragon: 0.5, Dark: 1, Steel: 1, Fairy: 1,
  },
  Grass: {
    Normal: 1, Fire: 0.5, Water: 2, Electric: 1, Grass: 0.5, Ice: 1,
    Fighting: 1, Poison: 0.5, Ground: 2, Flying: 0.5, Psychic: 1, Bug: 0.5,
    Rock: 2, Ghost: 1, Dragon: 0.5, Dark: 1, Steel: 0.5, Fairy: 1,
  },
  Ice: {
    Normal: 1, Fire: 0.5, Water: 0.5, Electric: 1, Grass: 2, Ice: 0.5,
    Fighting: 1, Poison: 1, Ground: 2, Flying: 2, Psychic: 1, Bug: 1,
    Rock: 1, Ghost: 1, Dragon: 2, Dark: 1, Steel: 0.5, Fairy: 1,
  },
  Fighting: {
    Normal: 2, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 2,
    Fighting: 1, Poison: 0.5, Ground: 1, Flying: 0.5, Psychic: 0.5, Bug: 0.5,
    Rock: 2, Ghost: 0, Dragon: 1, Dark: 2, Steel: 2, Fairy: 0.5,
  },
  Poison: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 2, Ice: 1,
    Fighting: 1, Poison: 0.5, Ground: 0.5, Flying: 1, Psychic: 1, Bug: 1,
    Rock: 0.5, Ghost: 0.5, Dragon: 1, Dark: 1, Steel: 0, Fairy: 2,
  },
  Ground: {
    Normal: 1, Fire: 2, Water: 1, Electric: 2, Grass: 0.5, Ice: 1,
    Fighting: 1, Poison: 2, Ground: 1, Flying: 0, Psychic: 1, Bug: 0.5,
    Rock: 2, Ghost: 1, Dragon: 1, Dark: 1, Steel: 2, Fairy: 1,
  },
  Flying: {
    Normal: 1, Fire: 1, Water: 1, Electric: 0.5, Grass: 2, Ice: 1,
    Fighting: 2, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 2,
    Rock: 0.5, Ghost: 1, Dragon: 1, Dark: 1, Steel: 0.5, Fairy: 1,
  },
  Psychic: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1,
    Fighting: 2, Poison: 2, Ground: 1, Flying: 1, Psychic: 0.5, Bug: 1,
    Rock: 1, Ghost: 1, Dragon: 1, Dark: 0, Steel: 0.5, Fairy: 1,
  },
  Bug: {
    Normal: 1, Fire: 0.5, Water: 1, Electric: 1, Grass: 2, Ice: 1,
    Fighting: 0.5, Poison: 0.5, Ground: 1, Flying: 0.5, Psychic: 2, Bug: 1,
    Rock: 1, Ghost: 0.5, Dragon: 1, Dark: 2, Steel: 0.5, Fairy: 0.5,
  },
  Rock: {
    Normal: 1, Fire: 2, Water: 1, Electric: 1, Grass: 1, Ice: 2,
    Fighting: 0.5, Poison: 1, Ground: 0.5, Flying: 2, Psychic: 1, Bug: 2,
    Rock: 1, Ghost: 1, Dragon: 1, Dark: 1, Steel: 0.5, Fairy: 1,
  },
  Ghost: {
    Normal: 0, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1,
    Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 2, Bug: 1,
    Rock: 1, Ghost: 2, Dragon: 1, Dark: 0.5, Steel: 1, Fairy: 1,
  },
  Dragon: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1,
    Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 1,
    Rock: 1, Ghost: 1, Dragon: 2, Dark: 1, Steel: 0.5, Fairy: 0,
  },
  Dark: {
    Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1,
    Fighting: 0.5, Poison: 1, Ground: 1, Flying: 1, Psychic: 2, Bug: 1,
    Rock: 1, Ghost: 2, Dragon: 1, Dark: 0.5, Steel: 1, Fairy: 0.5,
  },
  Steel: {
    Normal: 1, Fire: 0.5, Water: 0.5, Electric: 0.5, Grass: 1, Ice: 2,
    Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 1,
    Rock: 2, Ghost: 1, Dragon: 1, Dark: 1, Steel: 0.5, Fairy: 2,
  },
  Fairy: {
    Normal: 1, Fire: 0.5, Water: 1, Electric: 1, Grass: 1, Ice: 1,
    Fighting: 2, Poison: 0.5, Ground: 1, Flying: 1, Psychic: 1, Bug: 1,
    Rock: 1, Ghost: 1, Dragon: 2, Dark: 2, Steel: 0.5, Fairy: 1,
  },
};

export const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: "bg-type-normal text-black",
  Fire: "bg-type-fire text-white",
  Water: "bg-type-water text-white",
  Electric: "bg-type-electric text-black",
  Grass: "bg-type-grass text-black",
  Ice: "bg-type-ice text-black",
  Fighting: "bg-type-fighting text-white",
  Poison: "bg-type-poison text-white",
  Ground: "bg-type-ground text-black",
  Flying: "bg-type-flying text-black",
  Psychic: "bg-type-psychic text-white",
  Bug: "bg-type-bug text-black",
  Rock: "bg-type-rock text-white",
  Ghost: "bg-type-ghost text-white",
  Dragon: "bg-type-dragon text-white",
  Dark: "bg-type-dark text-white",
  Steel: "bg-type-steel text-black",
  Fairy: "bg-type-fairy text-black",
};

export const TYPE_FR: Record<PokemonType, string> = {
  Normal: "Normal",
  Fire: "Feu",
  Water: "Eau",
  Electric: "Élec",
  Grass: "Plante",
  Ice: "Glace",
  Fighting: "Combat",
  Poison: "Poison",
  Ground: "Sol",
  Flying: "Vol",
  Psychic: "Psy",
  Bug: "Insecte",
  Rock: "Roche",
  Ghost: "Spectre",
  Dragon: "Dragon",
  Dark: "Ténèbres",
  Steel: "Acier",
  Fairy: "Fée",
};
