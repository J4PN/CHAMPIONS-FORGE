// Standard Pokémon natures with their stat modifiers (+10% / -10%).
// Neutral natures (Hardy/Docile/Bashful/Quirky/Serious) have no modifiers.

export type StatKey = "atk" | "def" | "spa" | "spd" | "spe";

export interface Nature {
  name: string;
  plus?: StatKey;
  minus?: StatKey;
}

export const NATURES: Nature[] = [
  { name: "Hardy" },
  { name: "Lonely", plus: "atk", minus: "def" },
  { name: "Brave", plus: "atk", minus: "spe" },
  { name: "Adamant", plus: "atk", minus: "spa" },
  { name: "Naughty", plus: "atk", minus: "spd" },
  { name: "Bold", plus: "def", minus: "atk" },
  { name: "Docile" },
  { name: "Relaxed", plus: "def", minus: "spe" },
  { name: "Impish", plus: "def", minus: "spa" },
  { name: "Lax", plus: "def", minus: "spd" },
  { name: "Timid", plus: "spe", minus: "atk" },
  { name: "Hasty", plus: "spe", minus: "def" },
  { name: "Serious" },
  { name: "Jolly", plus: "spe", minus: "spa" },
  { name: "Naive", plus: "spe", minus: "spd" },
  { name: "Modest", plus: "spa", minus: "atk" },
  { name: "Mild", plus: "spa", minus: "def" },
  { name: "Quiet", plus: "spa", minus: "spe" },
  { name: "Bashful" },
  { name: "Rash", plus: "spa", minus: "spd" },
  { name: "Calm", plus: "spd", minus: "atk" },
  { name: "Gentle", plus: "spd", minus: "def" },
  { name: "Sassy", plus: "spd", minus: "spe" },
  { name: "Careful", plus: "spd", minus: "spa" },
  { name: "Quirky" },
];

// Common competitive items in Pokémon Champions / VGC.
export const COMMON_ITEMS = [
  "Choice Band",
  "Choice Specs",
  "Choice Scarf",
  "Life Orb",
  "Focus Sash",
  "Leftovers",
  "Sitrus Berry",
  "Assault Vest",
  "Rocky Helmet",
  "Eviolite",
  "Light Clay",
  "Mental Herb",
  "Safety Goggles",
  "Weakness Policy",
  "Throat Spray",
  "Booster Energy",
  "Covert Cloak",
  "Loaded Dice",
  "Wide Lens",
  "Scope Lens",
  "Expert Belt",
  "Mystic Water",
  "Charcoal",
  "Black Belt",
  "Spell Tag",
  "Twisted Spoon",
  "Hard Stone",
  "Magnet",
  "Miracle Seed",
  "Sharp Beak",
  "Soft Sand",
  "Metal Coat",
  "Dragon Fang",
  "BlackGlasses",
  "Silk Scarf",
  "Silver Powder",
  "Never-Melt Ice",
  "Poison Barb",
];
