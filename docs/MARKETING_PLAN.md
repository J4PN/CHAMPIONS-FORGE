# Marketing Plan — pokecounter.app

> Growth strategy for a Pokémon Champions counter-picker tool
> Last updated: 2026-04-11

---

## 1. Current state (diagnostic)

**Product**: pokecounter.app — paste the opposing team, get the best counter picks from your roster. Built on a Vite SPA + Go/MongoDB backend. Already ships:
- Counter picker (1v1 / 2v2)
- Full Pokédex, battle sim, damage calculator, tier list (curated + live usage)
- Meta rankings (top teams, top Pokémon, top types, trending)
- Saved teams, share cards (OG + square)
- Advanced team builder with full Champions configuration
- **9 languages**: EN, FR, ES, DE, IT, JA, KO, zh-Hans, zh-Hant

**Stage**: Post-launch week 1. One Reddit post on r/pokemon with modest traction. Backend is live and starting to collect real usage data (~33 species tracked, ~10 submitted teams). No community channel, no Twitter, no creator partnerships.

**The problem is not the product. It's distribution.**
Every cold-start feature (rankings, trending, tier list live mode, any future Win/Loss tracking) needs **users submitting data** to become valuable. Shipping more features right now is diminishing returns. The leverage is in getting the product in front of Pokémon Champions players — especially in the **7 markets where no competitor has a native-language alternative.**

---

## 2. Positioning & Identity

### Positioning statement
> PokeCounter is the **fastest, free, multilingual counter picker** for Pokémon Champions. Built for everyday ladder players, not just tournament pros. Paste the opposing team, get the best picks instantly, in your own language.

### Competitor positioning map

| Tool | Stance | Language | Our angle vs them |
|---|---|---|---|
| Champions Lab | Team builder + battle AI, competitive-flavored | EN only | Simpler workflow, 9 languages, counter-picker first |
| Pikalytics | Data/stats authority (when live) | EN only | Live data *now*, multilingual, no signup |
| Game8 | Mass-audience walkthroughs | EN/JP (limited) | Competitive focus, counter-picker, open source |
| PokéBase | Team builder with deep config | EN only | Counter picker, meta rankings |

**The hole we own**: *"Ladder player, non-English native, wants a fast counter-pick without learning VGC jargon or creating an account."*

### Community identity
Every community needs an identity for members to hook onto. For pokecounter, it's:

> **"Everyday ladder players who want to play smarter in their own language."**

Not "competitive Pokémon pros". Not "VGC tournament grinders". **Casual-to-intermediate ladder players** who speak a language other than English and currently get nothing from Champions Lab or Pikalytics. This is a massive, underserved niche.

### Taglines (by audience)
- **Neutral / Reddit**: "Counter-pick any Champions team in seconds."
- **Non-English markets**: "Finally, a Champions tool in [language]."
- **Tech/HN**: "Open-source Go + React counter picker for Pokémon Champions. 9 languages, no signup."
- **Creators**: "A free tool for your Champions breakdowns. Works in your viewers' language."

---

## 3. The 7-language moat — core strategy

**This is the most important insight of the entire plan.**

- Champions Lab: English only
- Pikalytics: English only (and not even live for Champions yet)
- Game8: English / limited Japanese walkthroughs
- PokéBase: English only

PokeCounter is **the only competitive tool for Pokémon Champions available natively in Japanese, Korean, Simplified Chinese, Traditional Chinese, Spanish, German, and Italian.**

Those 7 markets contain, conservatively, **more Pokémon fans than the English-speaking world combined**. Japan alone is the #1 Pokémon market on Earth. China has the largest Pokémon fan base by absolute numbers.

**Nobody is talking to them. Nobody is building for them. Nobody even knows they exist as a segment.**

If we execute on multilingual distribution, we can realistically own 50-80% of the international Champions player market for the next 6-12 months — before any competitor notices and catches up.

**Everything downstream in this plan is designed around that moat.**

---

## 4. 90-day launch plan

### Week 1 — Localized launch (the most important week)

**Goal**: post a natural, friendly introduction of the tool in each of the 7 underserved languages, in the most active community for that language.

**Day 1 (Mon)** — Japanese launch
- Post on **5ch /vp/ (ポケモン)** board with a post drafted natively (see section 7)
- Post on **Twitter/X** with `#ポケモンChampions #ポケモン対戦` hashtags + the share card image
- Reply to every comment for 3-4 hours post-submission

**Day 2 (Tue)** — Korean + Simplified Chinese
- Morning: **DCInside 포켓몬스터 갤러리** post (Korea's main Pokémon board)
- Afternoon: **Baidu Tieba 宝可梦吧** post (China's largest Pokémon forum)
- Evening: moderate replies, thank early users

**Day 3 (Wed)** — Traditional Chinese + Spanish
- **巴哈姆特 (Bahamut) 寶可夢哈拉板** for zh-Hant (Taiwan's largest gaming forum)
- **r/PokemonEspanol** + Spanish VGC Discords
- **Show HN** post in parallel (target 9am PT, see section 6) — English-speaking tech crowd

**Day 4 (Thu)** — German + Italian
- **r/Pokemon_de** (German Reddit) + Filb.de (historic German Pokémon forum)
- **Pokémon Millennium forum** (Italy's reference Pokémon forum)

**Day 5 (Fri)** — Consolidation
- Reply to all remaining comments from the week
- Post a "Week 1 recap" thread on the main home (Twitter) with numbers
- Identify the top 3 markets by engagement → those get the follow-up content

### Week 2 — Creator outreach

**Goal**: 15 personalized DMs to Pokémon VGC creators who cover Champions.

Send a short, honest message (template in section 9). The goal is not "sponsor me" — it's "I built this, please use it if it helps your content". **2-3 who respond = thousands of views, inbound traffic, and genuine endorsements.**

### Week 3 — Content rituals start

**Weekly cadence**:
- **Monday**: "Top teams of the week" tweet thread with share cards (auto-generated from `/api/rankings/weekly`)
- **Wednesday**: "Rising stars" short post — which Pokémon gained the most places vs last week (from `/api/stats/trending`)
- **Friday**: A highlighted matchup breakdown (one opposing team + best counters) — easily becomes a 20-second video for creators

### Week 4-8 — Flywheel nurture

- Engage daily with anyone mentioning the tool in any language
- Share user wins publicly ("@username built this team, it's now #3 in the weekly rankings")
- Ship one small visible improvement per week based on community feedback — creates the feedback loop

### Week 9-12 — Community consolidation

If traction is working, launch a **dedicated Discord server** (see section 5). Before week 9 it's too early — you need at least 50-100 active users to seed it.

---

## 5. Community flywheel design

```
Player arrives (via Reddit / Twitter / search)
      ↓
Builds a team → sees instant counter picks
      ↓
Gets value → comes back next day for rankings / trending
      ↓
Shares card / logs a match / tells a friend
      ↓
New player arrives
      ↑
      └← the loop compounds
```

### Core loop (what to optimize for)
**Weekly return visit** — the metric that matters is "did the user come back within 7 days". Everything in the product (rankings, trending, tier list live mode, Won/Lost when shipped) exists to reinforce this.

### Cold-start problem
The rankings + trending pages need data to be valuable. Until week 2-3, expect them to look sparse. **Don't panic.** The 7-language launch in week 1 is what starts feeding them.

### Community platform decision
- **Not yet**: Discord. Too early. A dead Discord is worse than no Discord.
- **Now**: Twitter/X as the public megaphone, local language forums as the community roots
- **Week 9+**: Discord if there's momentum

---

## 6. Channel playbook

### 6.1 — Local language forums (the main play)

**Rules of engagement**:
- Post **natively**, not translated. Use idioms, local memes, reference the game the way locals do.
- Don't lead with the link — lead with the story ("I was getting frustrated with counter-picks in Champions, so I built…").
- Respond to every comment for the first 3 hours. Be humble, open to criticism.
- If a moderator asks you to remove a link, comply immediately and ask where you *can* post.

### 6.2 — Reddit (English, already tried)

Previous post had modest traction. Next attempt should:
- Be posted on **r/stunfisk** or **r/VGC** (competitive niches, not r/pokemon which is too generic)
- Use a **personal story** title, not a product pitch
- **Wednesday 10am EST** is the historical sweet spot for gaming-adjacent posts
- Include a visual (share card or live screenshot)

Suggested title: *"I got tired of guessing counter picks in Champions, so I built a free tool that does it for me (9 languages, open source)"*

### 6.3 — Show HN (Hacker News)

Target **Wednesday 8-9am PT**. Title format:
> Show HN: PokeCounter – 9-language counter picker for Pokémon Champions (Vite + Go + Mongo, MIT)

Body focuses on the *tech* angle:
- Why 9 languages (design decision, localization approach)
- Why Go + MongoDB instead of a no-backend SPA
- Open source link
- Honest about the scale (side project, small data set)

HN loves honesty + technical depth + side projects. **Don't oversell**. Let the tech speak.

### 6.4 — Twitter/X

Start the account. Post 3-4x per week:
1. Weekly top teams visual (Monday)
2. Trending Pokémon (Wednesday)
3. Feature highlights with GIFs (Friday)
4. Engagement: reply to anyone mentioning Pokémon Champions counters

Use hashtags per language:
- `#PokemonChampions #VGC2026` (EN)
- `#ポケモンChampions #ポケモン対戦` (JA)
- `#포켓몬Champions` (KO)
- `#宝可梦Champions` (ZH)

### 6.5 — Product Hunt

Launch **week 3 or later**. Needs 5-10 screenshots + a short video demo. Less urgent than HN, but valuable for SEO backlinks. Tuesday launches outperform other days.

### 6.6 — VGC tournament communities

- **Nugget Bridge** (Discord + forum) — the historical VGC community
- **Victory Road** (VGC organization + Discord)
- **Smogon sub-forum: Other Games**

These are English but **hyper-engaged**. Post as a community member contributing a tool, not as a marketer.

---

## 7. Localized outreach templates

**These are ready to copy-paste** into the respective community. Each is written to sound natural to a native speaker, not translated from English.

### 7.1 — 🇯🇵 Japanese (5ch /vp/, Twitter)

**Title**: `【自作ツール】ポケモンChampionsのカウンター選出補助サイト作りました`

**Body**:
```
こんにちは。
Championsで相手の選出を見てから自分の選出を決めるのが毎回面倒だったので、
パパッとカウンター候補を出してくれるサイトを個人で作りました。

pokecounter.app

特徴:
・日本語対応 (9言語)
・相手パーティを貼り付けるだけで最適な選出を自動計算
・無料、アカウント登録なし、広告なし
・ダメージ計算、タイプ相性表、シミュレーター付き
・オープンソース (MIT)

まだα版なのでバグや翻訳ミスがあるかもしれません。
フィードバックいただけたら嬉しいです。
```

### 7.2 — 🇰🇷 Korean (DCInside, Naver Café)

**Title**: `포켓몬 Champions 카운터 픽 도구 만들었습니다 (9개 언어 지원)`

**Body**:
```
안녕하세요.

Champions에서 상대 팀 보고 뭘 내보낼지 매번 고민하는 게 귀찮아서,
자동으로 카운터 픽을 계산해주는 웹사이트를 만들었습니다.

pokecounter.app

주요 기능:
- 한국어 지원 (9개 언어)
- 상대 팀 입력 → 최적의 픽 즉시 표시
- 무료, 계정 없음, 광고 없음
- 데미지 계산기, 타입 상성표, 배틀 시뮬레이터 포함
- 오픈소스 (MIT 라이선스)

알파 버전이라 버그나 오역이 있을 수 있어요.
피드백 주시면 감사하겠습니다.
```

### 7.3 — 🇨🇳 Simplified Chinese (Baidu Tieba, NGA)

**Title**: `【自制工具】宝可梦 Champions 克制选择辅助工具 (9种语言)`

**Body**:
```
大家好。

在 Champions 里经常看对面队伍后纠结选谁出战，于是做了一个
自动计算最佳克制选择的网站。

pokecounter.app

主要功能：
- 中文支持 (共9种语言)
- 粘贴对手队伍即可得到最佳克制建议
- 免费、无需账号、无广告
- 伤害计算器、属性相克表、战斗模拟器
- 开源 (MIT 许可)

还是 alpha 版本，可能有 bug 或翻译错误。
欢迎反馈。
```

### 7.4 — 🇹🇼 Traditional Chinese (Bahamut, PTT)

**Title**: `[工具] 寶可夢 Champions 剋制選擇輔助網站 (9種語言)`

**Body**:
```
大家好。

在 Champions 裡每次看完對手隊伍都要想半天該派誰出場，
所以做了一個自動計算最佳剋制選擇的網站。

pokecounter.app

功能：
- 繁體中文支援 (共9種語言)
- 貼上對手隊伍 → 立刻顯示最佳選擇
- 免費、無需帳號、無廣告
- 傷害計算器、屬性相剋表、戰鬥模擬器
- 開源 (MIT 授權)

目前還是 alpha 版，可能有 bug 或翻譯錯誤。
歡迎提供回饋。
```

### 7.5 — 🇪🇸 Spanish (r/PokemonEspanol, Discord Latam)

**Title**: `Hice una web que calcula counters para Pokémon Champions (gratis, 9 idiomas)`

**Body**:
```
¡Hola!

Me cansé de dudar a la hora de elegir mi equipo contra un rival en Champions,
así que armé una web que calcula los mejores counters automáticamente.

pokecounter.app

Características:
- En español (y otros 8 idiomas)
- Pegas el equipo rival y ves al instante tus mejores picks
- Gratis, sin cuenta, sin anuncios, sin paywall
- Incluye calculadora de daño, tabla de tipos, simulador de combates
- Código abierto (MIT)

Todavía es alpha, puede tener bugs o errores de traducción.
Cualquier feedback es bienvenido.
```

### 7.6 — 🇩🇪 German (r/Pokemon_de, Filb.de)

**Title**: `Eigenes Tool: Counter-Picker für Pokémon Champions (9 Sprachen, kostenlos)`

**Body**:
```
Moin zusammen,

ich hatte irgendwann keinen Bock mehr, in Champions jedes Mal beim Gegnerteam
zu raten, wen ich am besten mitnehme. Also habe ich eine Seite gebaut, die
das automatisch ausrechnet.

pokecounter.app

Features:
- Auf Deutsch (plus 8 weitere Sprachen)
- Gegnerteam eingeben → beste Picks sofort sichtbar
- Kostenlos, kein Account, keine Werbung, keine Paywall
- Schadensrechner, Typen-Tabelle, Kampfsimulator inklusive
- Open Source (MIT)

Noch in der Alpha, kann also Bugs oder Übersetzungsfehler haben.
Feedback gerne.
```

### 7.7 — 🇮🇹 Italian (Pokémon Millennium)

**Title**: `[Tool] Counter-picker per Pokémon Champions (9 lingue, gratis)`

**Body**:
```
Ciao a tutti,

Mi sono stufato di dover ogni volta indovinare quali Pokémon portare contro
il team avversario in Champions, quindi ho creato un sito che calcola
automaticamente i migliori counter.

pokecounter.app

Caratteristiche:
- In italiano (e altre 8 lingue)
- Incolli il team avversario → vedi subito i migliori counter
- Gratuito, senza account, senza pubblicità, senza paywall
- Calcolatore di danno, tabella dei tipi, simulatore di lotte
- Open source (MIT)

È ancora in alpha, potrebbe avere bug o errori di traduzione.
Feedback benvenuti.
```

**IMPORTANT: Posting rules for all 7 templates**
1. **Read the sub's rules first.** Some forums ban self-promotion entirely. If so, post in a "community projects" or "tools" thread.
2. **Reply to every comment within 30 minutes** for the first 3 hours. Reddit/5ch/NGA mods kill threads where the OP disappears.
3. **Don't edit the post for 1 hour.** Editing too soon triggers anti-spam filters on some platforms.
4. **Upvotes arrive in the first 30 minutes or never.** Don't panic if numbers are low in the first 15 minutes.

---

## 8. Content rituals (weekly cadence)

| Day | Channel | Content |
|---|---|---|
| Mon | Twitter/X + Reddit weekly | "Top teams of the week" — share card auto-generated from `/api/rankings/weekly`. |
| Wed | Twitter/X | "Rising stars" — 3 Pokémon with biggest positive delta from `/api/stats/trending`. |
| Fri | Twitter/X | A highlighted matchup: "This week's nastiest opponent team, and the 6 Pokémon that counter it." Optional: short video (Loom or OBS). |
| Sat-Sun | — | Reserve for community replies. Do not post new content. |

**Each post must have a visual.** Use the existing share card generator or `/rankings` screenshots.

---

## 9. Creator / ambassador program

### 9.1 — Creator outreach (week 2)

**Target list**: find 15-20 Pokémon content creators who cover Champions. Priority:
- YouTube channels with 10k-500k subs that post Champions content (large enough to matter, small enough to respond)
- Twitch streamers running Champions ladder grinds
- Twitter accounts posting team breakdowns

**DM template** (English, adapt for other languages):
```
Hey [name],

I've been enjoying your Champions content — especially the [specific video/tweet].

I built a free tool called pokecounter.app that does instant counter picks for
Champions. It's open source, works in 9 languages, and I thought it might
save you time when you're prepping matchup breakdowns for your content.

No ask attached — just sharing in case it's useful. If you end up using it in
a video, I'd love to see it, but zero pressure either way.

Cheers,
[your name]
```

**Do NOT**:
- Ask them to promote the tool
- Offer them "sponsorship" at this stage (you have no budget, they'll sniff it out)
- Send the same generic DM to all 20 (personalize the specific content reference)

**Follow-up** (2 weeks later, ONE time only):
```
Hey [name], just wanted to check in — any feedback on pokecounter.app?
Anything missing that would make it more useful for your content?
```

### 9.2 — Ambassador program (week 6-8, if traction justifies)

Criteria for identifying ambassadors:
- Users who have submitted 10+ teams via the tool
- People who reply in your language community threads helping other users
- Creators who organically mentioned the tool without being asked

Benefits to offer:
- "Early access" badge on their submitted teams in `/rankings`
- Direct Discord/Twitter line to you for feature requests
- Public credit in the tool (About page)
- Custom share card template with their name

**Don't build a formal program until you have 20+ candidates.** Before then, it's just you building relationships manually.

---

## 10. Metrics & decision gates

### What to track weekly

| Metric | Where | Good sign |
|---|---|---|
| Unique daily visitors | Umami | >100 by week 2, >500 by week 4 |
| Teams submitted per day | `/api/stats/pokemon` total | Compounding week-over-week |
| Language distribution | Umami lang breakdown | Non-EN should be >30% by week 2 |
| Return visits (7-day) | Umami retention | >20% by week 4 |
| Rankings page views | Umami | Growing = the data loop is working |
| GitHub stars | github.com/EricTron-FR/PokeCounter.app | Proxy for dev/tech credibility |

### Decision gates

- **End of week 1**: If no language has generated >50 unique visits, pivot. The 7-language launch didn't land. Analyze why: wrong sub? bad translation? timing?
- **End of week 4**: If teams submitted per day is still <20, the cold start hasn't broken. Ship the Win/Loss feature next — it creates a reason to return daily.
- **End of week 8**: If DAU is <300, the niche may be too small for a dedicated tool. Pivot to either (a) broader Pokémon scope beyond Champions, or (b) pause and wait for Champions player base to grow.
- **End of week 12**: If DAU is >1000 and return rate >20%, launch the Discord community, start the ambassador program, and consider a paid tier (rankings history, team analytics exports) for power users.

### What NOT to optimize for

- **Total pageviews** (vanity metric, doesn't matter without retention)
- **Twitter follower count** (vanity; Discord DM engagement is a better signal)
- **Feature count** (we already have enough features for 10× the current user base)

---

## Summary — what to do this week

1. **Don't ship any new features.** The product is ready for 10× its current traffic.
2. **Post all 7 localized launch threads** (section 7) following the day-by-day schedule in section 4.
3. **Launch Show HN on Wednesday 9am PT** with the tech angle.
4. **Reply to every comment** in every thread for the first 3 hours post-submission.
5. **Track daily visitor count per language** via Umami. Flag which markets respond.
6. **Draft the creator outreach list** (15-20 names) ready for week 2.

If this week delivers >500 unique visitors (vs baseline ~[current]), the 7-language moat strategy is validated and we can double down. If not, we debug and adjust.

---

*This plan is a living document. Update the "Last updated" date and re-evaluate weekly. The goal is compound growth via the 7-language moat — not a viral hit from any single post.*
