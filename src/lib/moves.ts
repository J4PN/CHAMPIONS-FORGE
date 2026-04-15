import movesRaw from "@/data/moves.json";
import { Move } from "./types";

export const MOVES: Record<string, Move> = movesRaw as unknown as Record<
  string,
  Move
>;

export function getMove(name: string): Move | undefined {
  return MOVES[name];
}
