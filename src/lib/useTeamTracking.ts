import { useEffect, useRef } from "react";

// Anonymous usage telemetry. Two signals:
//  1. Initial submission — after DEBOUNCE_MS of stable 6-Pokémon team, POST
//     once. Per-day localStorage dedup prevents spam from the same browser.
//  2. Engagement re-submission — if the user stays on the page with the
//     same stable team for ENGAGEMENT_MS, POST a second time to weight
//     teams that real users actually looked at. Bypasses dedup since it's
//     a separate signal, and only fires once per stable team per page load.
//
// The server (see api/cmd/api/teams.go) rate-limits per IP to 20/day so the
// engagement re-submission can't inflate counts disproportionately.

const TEAM_SIZE = 6;
const DEBOUNCE_MS = 10_000;      // 10 seconds
const ENGAGEMENT_MS = 10 * 60_000; // 10 minutes
const STORAGE_PREFIX = "pokecounter.sentTeams.";

function apiBase(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  return envBase ?? "";
}

function todayKey(): string {
  const d = new Date();
  return `${STORAGE_PREFIX}${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function canonicalHash(ids: number[]): string {
  return [...ids].sort((a, b) => a - b).join(",");
}

function loadSent(): Set<string> {
  try {
    const raw = localStorage.getItem(todayKey());
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function persistSent(set: Set<string>) {
  try {
    localStorage.setItem(todayKey(), JSON.stringify([...set]));
  } catch {
    /* noop */
  }
}

async function rawPostTeam(ids: number[]): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase()}/api/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ species: ids }),
      keepalive: true,
    });
    return res.ok || res.status === 429;
  } catch {
    return false;
  }
}

/**
 * Submit the team once per UTC day per browser. Uses localStorage dedup.
 */
async function submitInitial(ids: number[], hash: string): Promise<void> {
  const sent = loadSent();
  if (sent.has(hash)) return;
  const ok = await rawPostTeam(ids);
  if (ok) {
    sent.add(hash);
    persistSent(sent);
  }
}

interface Options {
  /** When true, re-submit the same team after ENGAGEMENT_MS as an
   *  "actually played" signal. Only enable for the user's own team — never
   *  for the opponent picker, since seeing an opponent team doesn't mean
   *  the user is playing it. */
  withEngagement?: boolean;
}

/**
 * Watch a team of Pokémon IDs and submit it to the telemetry endpoint:
 *   - once, after DEBOUNCE_MS of stable 6-Pokémon team (initial)
 *   - (my team only) again, after ENGAGEMENT_MS if still loaded (engagement)
 *
 * Safe to use multiple times on the same page. Dedup of the initial
 * submission is global per day via localStorage.
 */
export function useTeamTracking(
  ids: number[],
  { withEngagement = false }: Options = {},
): void {
  const debounceRef = useRef<number | null>(null);
  const engagementRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current !== null) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (engagementRef.current !== null) {
      window.clearTimeout(engagementRef.current);
      engagementRef.current = null;
    }

    if (ids.length !== TEAM_SIZE) return;
    const distinct = new Set(ids);
    if (distinct.size !== TEAM_SIZE) return;

    const hash = canonicalHash(ids);
    const alreadySent = loadSent().has(hash);

    if (!alreadySent) {
      debounceRef.current = window.setTimeout(() => {
        void submitInitial(ids, hash);
        debounceRef.current = null;
      }, DEBOUNCE_MS);
    }

    if (withEngagement) {
      engagementRef.current = window.setTimeout(() => {
        void rawPostTeam(ids);
        engagementRef.current = null;
      }, ENGAGEMENT_MS);
    }

    return () => {
      if (debounceRef.current !== null) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (engagementRef.current !== null) {
        window.clearTimeout(engagementRef.current);
        engagementRef.current = null;
      }
    };
  }, [ids, withEngagement]);
}
