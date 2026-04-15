import raw from "@/data/meta-teams.json";

export interface MetaTeam {
  id: string;
  name: string;
  description: string;
  pokemonIds: number[];
}

export const META_TEAMS: MetaTeam[] = raw as MetaTeam[];
