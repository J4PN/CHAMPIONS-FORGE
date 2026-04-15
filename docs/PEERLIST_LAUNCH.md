# Peerlist Launch — PokeCounter

Launch date: **Monday**
Recommended launch time: **9-10am IST** (5:30-6:30am CET)

---

## Pitch (launch post body)

**PokeCounter — counter-picker for Pokémon Champions, in 9 languages**

Hi, I'm Eric. I got tired of second-guessing my picks every time I faced a new team in Pokémon Champions, so I built a tool that does it for me — paste the opposing team, get the best picks from your roster in under a second.

Most competitive Pokémon tools are English-only, which leaves out the massive Japanese, Korean, Chinese, Spanish, German and Italian player bases. PokeCounter ships in 9 languages from day one, fully translated — not just UI strings but the 250-Pokémon Pokédex, the Learn page, the tier list, everything.

**What's inside**

**Counter picker** — paste the opposing team and get ranked picks for 1v1 (bring 3) or 2v2 (bring 4), based on the full 18-type effectiveness chart and your own roster.

**Live meta** — tier list (curated and live from real user data), weekly top teams, trending Pokémon with week-over-week deltas from actual user submissions.

**Build tools** — full Pokédex with 250 Pokémon including 50 Mega Evolutions, Gen 9 damage calculator with the new Stat Point system, team analyzer, battle simulator against 10 archetypes (sun, rain, trick room, tailwind, hyper offense, mono-type, meta templates), Showdown paste import and export.

**9 languages from launch** — English, Français, Español, Deutsch, Italiano, 日本語, 한국어, 简体中文, 繁體中文.

**Privacy-first, free forever** — no sign-up, no ads, no paywall. Self-hosted Umami analytics, no cookies. Team submissions are anonymous (species IDs only, no IP stored long-term). Source on GitHub, MIT licensed.

Built solo in a week. Feedback and bug reports very welcome — especially if you're a native speaker in one of the non-English languages and something sounds off.

pokecounter.app

---

## Tagline options (short field)

In order of preference:

1. **Paste the opposing team. Get the best picks. In your language.**
2. **The counter picker for Pokémon Champions — 9 languages, open source.**
3. **Free counter picker for Pokémon Champions in 9 languages.**

Recommendation: option 1. It's concrete, user-focused, and the three-sentence rhythm is memorable.

---

## Prepared replies for common comments

Paste these as starting points — adapt the tone to each commenter.

### "How did you build this so fast?"

Solo, nights and weekends over about a week. Vite + React + TypeScript on the front, a small Go service with MongoDB on the back for the live rankings. A lot of it reuses open data — PokéAPI for sprites and base stats, Smogon for usage stats, a hand-curated tier list as a fallback. The 9 translations were the longest part, about 200 strings each language. Happy to share more on specific parts if you're curious.

### "Why not just use Pikalytics / Champions Lab?"

Pikalytics is great for tournament-level usage stats, but they're not yet live for Champions — they're waiting for official data. Champions Lab has a solid team builder, but it's English-only and not focused on counter-picking as the primary workflow. I wanted something that (1) works in the user's native language, (2) is focused on the "paste opponent, get picks" flow first, (3) uses real submitted user data rather than just curated tiers. That's the niche PokeCounter lives in.

### "What's the tech stack?"

- Frontend: Vite + React + TypeScript + Tailwind, fully static SPA
- Backend: Go with MongoDB for the live rankings and trending endpoints (about 200 lines of Go)
- Hosted on a single Kimsufi box with nginx + Let's Encrypt
- Analytics: self-hosted Umami (no cookies)
- Source: github.com/EricTron-FR/PokeCounter.app (MIT)

Intentionally boring and lightweight. The whole backend binary is under 10 MB and handles everything with rate limiting at the edge.

### "Any plans for a mobile app?"

The SPA is already responsive and works well as a PWA — you can install it from your phone's browser and it'll feel native, offline sprites included. A standalone native app is possible down the line (React Native probably) but right now the web experience covers 95% of use cases. What do you want on mobile that the PWA doesn't give you?

### "How can I contribute?"

Code contributions are very welcome — the repo is MIT on GitHub. The easiest entry points are:
1. Spot a mistranslation in your native language and open a PR on `src/lib/i18n.ts`
2. Flag a bug or suggest a feature via GitHub issues
3. If you're a Pokémon Champions player, just build teams on the site — the rankings and tier list get better with every submission
4. If you're a content creator, feel free to use it for your breakdowns (no credit required, but a shoutout is appreciated)

---

## Cover image

Use a screenshot of the actual interface, not a logo or stock image. Peerlist favors covers that show the product in action.

Best options:
- Home screen with all three columns visible (Opponent Team / My Team / Best Picks)
- Rankings page showing live data
- Tier list page (the S/A/B/C/D layout is instantly recognizable)

Format: 1200x630 PNG, under 1 MB.

---

## Launch checklist

- [ ] Cover image ready (1200x630, shows the interface)
- [ ] Pitch copied into Peerlist launch form
- [ ] Tagline set
- [ ] Tags selected (developer tools, gaming, open source, indie)
- [ ] GitHub repo star count refreshed (star your own repo if it has 0)
- [ ] Umami analytics open in a browser tab to watch live traffic
- [ ] Phone ready with prepared replies saved as drafts
- [ ] Alarm set for launch time (9am IST = 5:30am CET)
- [ ] Coffee

---

## Post-launch timing

| Window | What to do |
|---|---|
| 0-30 min | Reply to every comment within 5 minutes. This is when upvotes accelerate or die. |
| 30 min - 2h | Stay active. Upvote supportive comments. Ask follow-up questions. |
| 2h - 8h | Check every 30 min. Reply to new comments. |
| 8h - 24h | Check every 2-3 hours. Reply to anything substantive. |
| Day 2 | Post a short "launch recap" update thread on your personal Twitter with numbers. If traction is good, consider the Hindi localization follow-up post (see MARKETING_PLAN.md section 3). |

---

## Metrics to track

- Upvotes on the Peerlist post (aim for top 5 of the day)
- Unique visitors to pokecounter.app during launch day (Umami)
- Language breakdown of visitors (see if the 9-language angle actually draws non-English users)
- GitHub stars (Peerlist users who check the repo)
- New team submissions in `/api/stats/pokemon` during launch window

---

## After the launch

If it performs well:
1. Follow-up thread on r/stunfisk or r/VGC with a "built this, Peerlist launch went well, sharing here too" angle
2. Hindi localization as a Day 2 product update ("added हिन्दी based on feedback")
3. Consider a Show HN post later in the week targeting the tech angle

If it underperforms (<20 upvotes, <100 visitors):
1. Don't panic. Peerlist is one signal, not the whole story.
2. Review the cover image and tagline. Was the first-glance impression clear?
3. Try another launch surface within a week: Reddit, HackerNews, or Product Hunt.
