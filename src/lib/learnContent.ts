// AUTO-GENERATED from scripts/gen_learn.py — do not hand-edit.
// Multilingual data for the Learn page (VGC fundamentals).

import type { Lang } from "./i18n";

export type IconKey =
  | "BookOpen" | "Clock" | "Cloud" | "Layers" | "Sparkles" | "Zap"
  | "Shield" | "Swords" | "Sun" | "CloudRain" | "Wind" | "Snowflake"
  | "Leaf" | "CloudFog" | "Flame" | "Moon" | "Droplet" | "Skull"
  | "Target" | "FlaskConical" | "TrendingDown" | "Trophy" | "RefreshCw"
  | "Bomb" | "Star" | "CloudSun";

export interface MoveGroup {
  title: string;
  icon: IconKey;
  moves: { name: string; body: string }[];
}

// LangMap: EN is required; other langs optional (component falls back to EN).
type LangMap<T> = { en: T } & Partial<Record<Lang, T>>;

export type SectionContent =
  | { kind: "bullets"; items: LangMap<string[]> }
  | { kind: "paragraph"; text: LangMap<string> }
  | { kind: "moveGroups"; groups: LangMap<MoveGroup[]> };

export interface LearnSection {
  id: string;
  icon: IconKey;
  title: Record<Lang, string>;
  content: SectionContent;
}

export const LEARN_SECTIONS: LearnSection[] = [
  {
    id: "format",
    icon: "BookOpen",
    title: {
    en: "Format basics",
    fr: "Bases du format",
    es: "Fundamentos del formato",
    de: "Format-Grundlagen",
    it: "Basi del formato",
    ja: "フォーマットの基本",
    ko: "포맷 기본",
    "zh-Hans": "格式基础",
    "zh-Hant": "格式基礎"
  },
    content: { kind: "bullets", items: {
    en: ["**Doubles 2v2**: each player brings **6 Pokémon** and **picks 4** for the actual match. Both Pokémon battle simultaneously on each side.", "**Level 50 auto**: every Pokémon is level-set to 50 regardless of its actual level.", "**Stat Points (SP)**: instead of EVs/IVs, you have a budget of **66 SP** per Pokémon, capped at **32 per stat**. Easier tuning, less grind.", "**No duplicates**: no two Pokémon of the same species or two of the same held item on a team.", "**Mega Evolution** is allowed; one Mega per team and per battle.", "**20-minute game timer** with chess-clock-style turns."],
    fr: ["**Double 2v2** : chaque joueur amène **6 Pokémon** et en **choisit 4** pour le match. Les deux Pokémon de chaque côté combattent en même temps.", "**Niveau 50 auto** : tous les Pokémon sont automatiquement mis au niveau 50, peu importe leur niveau réel.", "**Stat Points (SP)** : à la place des EVs/IVs, tu as un budget de **66 SP** par Pokémon, plafonné à **32 par stat**. Réglage plus simple, moins de grind.", "**Pas de doublons** : pas deux Pokémon de la même espèce ni deux objets identiques dans une team.", "**Méga-Évolution** autorisée ; une seule Méga par team et par match.", "**Timer 20 minutes** par partie, façon échecs."],
    es: ["**Dobles 2v2**: cada jugador lleva **6 Pokémon** y **elige 4** para el combate real. Los dos Pokémon de cada lado combaten simultáneamente.", "**Nivel 50 automático**: todos los Pokémon se ajustan al nivel 50 sin importar su nivel real.", "**Puntos de estadística (SP)**: en lugar de EVs/IVs, tienes un presupuesto de **66 SP** por Pokémon, con un máximo de **32 por estadística**. Ajuste más fácil, menos grind.", "**Sin duplicados**: no puede haber dos Pokémon de la misma especie ni dos objetos equipados iguales en el equipo.", "**Megaevolución** permitida; una sola Mega por equipo y por combate.", "**Temporizador de 20 minutos** con turnos al estilo reloj de ajedrez."],
    de: ["**Doppel 2v2**: jeder Spieler bringt **6 Pokémon** mit und **wählt 4** für das eigentliche Match. Beide Pokémon kämpfen auf jeder Seite gleichzeitig.", "**Stufe 50 auto**: jedes Pokémon wird unabhängig von seiner tatsächlichen Stufe auf 50 gesetzt.", "**Statuspunkte (SP)**: statt EVs/IVs hast du ein Budget von **66 SP** pro Pokémon, pro Wert auf **32** begrenzt. Einfacheres Tuning, weniger Grind.", "**Keine Duplikate**: weder zwei Pokémon derselben Spezies noch zwei gleiche getragene Items in einem Team.", "**Mega-Entwicklung** erlaubt; eine Mega pro Team und pro Kampf.", "**20-Minuten-Spieltimer** mit Schachuhr-Zügen."],
    it: ["**Doppie 2v2**: ogni giocatore porta **6 Pokémon** e ne **sceglie 4** per il match. Entrambi i Pokémon di ciascun lato combattono contemporaneamente.", "**Livello 50 auto**: ogni Pokémon è impostato al livello 50 indipendentemente dal livello reale.", "**Punti Statistiche (SP)**: invece di EV/IV, hai un budget di **66 SP** per Pokémon, con un massimo di **32 per statistica**. Tuning più facile, meno grind.", "**Niente duplicati**: non si possono avere due Pokémon della stessa specie né due strumenti uguali in una squadra.", "**Megaevoluzione** permessa; una sola Mega per squadra e per lotta.", "**Timer di gioco 20 minuti** con turni in stile orologio degli scacchi."],
    ja: ["**ダブル 2v2**: 各プレイヤーは**6匹のポケモン**を持ち込み、実際の試合には**4匹を選出**します。各サイドの2匹のポケモンが同時に戦います。", "**レベル50自動**: すべてのポケモンは実際のレベルに関係なくレベル50に自動設定されます。", "**ステータスポイント (SP)**: 努力値/個体値の代わりに、ポケモンごとに**66 SP**の予算があり、**1つのステータスにつき32**が上限です。調整が簡単で、作業量が少ないです。", "**重複禁止**: チーム内に同じ種族のポケモンや同じ持ち物を2つ持つことはできません。", "**メガシンカ**が許可されています。チームごと、戦闘ごとに1体のメガのみ。", "**20分のゲームタイマー**、チェスクロック方式のターン。"],
    ko: ["**더블 2v2**: 각 플레이어는 **6마리의 포켓몬**을 가져오며 실제 경기에는 **4마리를 선택**합니다. 각 측의 두 마리 포켓몬이 동시에 전투합니다.", "**레벨 50 자동**: 모든 포켓몬은 실제 레벨과 관계없이 레벨 50으로 설정됩니다.", "**스탯 포인트 (SP)**: 노력치/개체값 대신 포켓몬당 **66 SP**의 예산이 있으며 **각 스탯당 32**로 제한됩니다. 튜닝이 더 쉽고 작업이 적습니다.", "**중복 금지**: 같은 종의 포켓몬 2마리 또는 같은 지닌 아이템 2개를 팀에 둘 수 없습니다.", "**메가진화**가 허용됩니다. 팀당, 전투당 하나의 메가만 가능합니다.", "**20분 게임 타이머**, 체스 클록 방식의 턴."],
    "zh-Hans": ["**双打 2v2**: 每位玩家带 **6 只宝可梦** 并 **选择 4 只** 参加实际比赛。每一方的两只宝可梦同时战斗。", "**自动 50 级**: 所有宝可梦自动设置为 50 级，无论实际等级如何。", "**属性点 (SP)**: 取代努力值/个体值，每只宝可梦有 **66 SP** 预算，**每项属性上限 32**。调整更简单，练度更低。", "**禁止重复**: 同一队伍不能有两只同种宝可梦或两个相同的携带道具。", "**超级进化** 允许；每队每场战斗仅限一只超级进化。", "**20 分钟游戏计时器**，采用棋钟式回合。"],
    "zh-Hant": ["**雙打 2v2**: 每位玩家帶 **6 隻寶可夢** 並 **選擇 4 隻** 參加實際比賽。每一方的兩隻寶可夢同時戰鬥。", "**自動 50 級**: 所有寶可夢自動設定為 50 級，無論實際等級如何。", "**屬性點 (SP)**: 取代努力值/個體值，每隻寶可夢有 **66 SP** 預算，**每項屬性上限 32**。調整更簡單，練度更低。", "**禁止重複**: 同一隊伍不能有兩隻同種寶可夢或兩個相同的攜帶道具。", "**超級進化** 允許；每隊每場戰鬥僅限一隻超級進化。", "**20 分鐘遊戲計時器**，採用棋鐘式回合。"]
  } },
  },
  {
    id: "speed",
    icon: "Clock",
    title: {
    en: "Speed control",
    fr: "Contrôle de vitesse",
    es: "Control de velocidad",
    de: "Tempo-Kontrolle",
    it: "Controllo della velocità",
    ja: "すばやさコントロール",
    ko: "스피드 컨트롤",
    "zh-Hans": "速度控制",
    "zh-Hant": "速度控制"
  },
    content: { kind: "bullets", items: {
    en: ["**Tailwind**: doubles your team's Speed for 4 turns. Cornerstone of offensive teams.", "**Trick Room**: reverses turn order for 5 turns — slowest moves first. Built around bulky slow attackers.", "**Priority moves**: Quick Attack, Bullet Punch, Sucker Punch, Aqua Jet, Extreme Speed, Fake Out — bypass speed entirely.", "**Choice Scarf**: 1.5× Speed but locks you into the first move you use.", "**Speed ties** are resolved by a coin flip — invest in 1 extra speed to break them."],
    fr: ["**Vent Arrière (Tailwind)** : double la vitesse de ta team pendant 4 tours. Pilier des équipes offensives.", "**Distorsion (Trick Room)** : inverse l'ordre des tours pendant 5 tours, les plus lents jouent en premier. Construit autour d'attaquants lents et massifs.", "**Attaques prioritaires** : Vive-Attaque, Pisto-Poing, Coup d'Boule, Aqua-Jet, Vitesse Extrême, Bluff — passent outre la vitesse.", "**Mouchoir Choix** : ×1.5 Vitesse mais te lock sur la première attaque utilisée.", "**Égalités de vitesse** : résolues à pile ou face — investis 1 de vitesse en plus pour les casser."],
    es: ["**Viento Afín (Tailwind)**: duplica la Velocidad de tu equipo durante 4 turnos. Pilar de los equipos ofensivos.", "**Espacio Raro (Trick Room)**: invierte el orden de los turnos durante 5 turnos — los más lentos primero. Se construye alrededor de atacantes lentos y resistentes.", "**Movimientos con prioridad**: Ataque Rápido, Puño Bala, Golpe Bajo, Acua Jet, Velocidad Extrema, Profesión — ignoran la velocidad.", "**Pañuelo Elegido**: ×1.5 Velocidad pero te obliga a usar el primer movimiento que elijas.", "**Empates de velocidad**: se resuelven al azar — invierte 1 punto más de velocidad para romperlos."],
    de: ["**Rückenwind (Tailwind)**: verdoppelt die Initiative deines Teams für 4 Runden. Eckpfeiler offensiver Teams.", "**Bizarroraum (Trick Room)**: kehrt die Zugreihenfolge für 5 Runden um — langsame Pokémon zuerst. Um klobige, langsame Angreifer herum aufgebaut.", "**Prioritätsattacken**: Ruckzuckhieb, Patronenhieb, Tiefschlag, Aquaknarre, Turbotempo, Mogelhieb — umgehen die Initiative komplett.", "**Wahlschal**: ×1,5 Initiative, aber du bleibst an die erste gewählte Attacke gebunden.", "**Initiative-Gleichstände** werden per Zufall entschieden — investiere 1 zusätzlichen Punkt, um sie zu brechen."],
    it: ["**Ventoincoda (Tailwind)**: raddoppia la Velocità della tua squadra per 4 turni. Pilastro delle squadre offensive.", "**Distortozona (Trick Room)**: inverte l'ordine dei turni per 5 turni — i più lenti agiscono per primi. Costruita attorno ad attaccanti lenti e resistenti.", "**Mosse di priorità**: Attaccorapido, Pugnoscarica, Attaccofurtivo, Acquagetto, Velocestrema, Bruciapelo — ignorano la velocità.", "**Wallo Scelta**: ×1.5 Velocità ma ti blocca sulla prima mossa usata.", "**Pareggi di velocità**: si risolvono a caso — investi 1 punto di velocità extra per romperli."],
    ja: ["**おいかぜ (Tailwind)**: チームのすばやさを4ターンの間2倍にします。攻撃チームの要です。", "**トリックルーム (Trick Room)**: 5ターンの間ターン順を逆転させます — 遅いポケモンが先に動きます。鈍足で耐久の高い攻撃役を中心に構築されます。", "**先制技**: でんこうせっか、マッハパンチ、ふいうち、アクアジェット、しんそく、ねこだまし — すばやさを完全に無視します。", "**こだわりスカーフ**: すばやさ1.5倍ですが、最初に使った技にロックされます。", "**すばやさの同速**: コインフリップで決まります — 1追加投資して同速を破りましょう。"],
    ko: ["**순풍 (Tailwind)**: 4턴 동안 팀의 스피드를 두 배로 만듭니다. 공격 팀의 핵심입니다.", "**트릭룸 (Trick Room)**: 5턴 동안 턴 순서를 역전시킵니다 — 느린 포켓몬이 먼저 행동합니다. 내구형 느린 공격수 중심으로 구축합니다.", "**선공 기술**: 전광석화, 마하펀치, 기습, 아쿠아제트, 신속, 속이다 — 스피드를 완전히 무시합니다.", "**구애스카프**: 스피드 1.5배이지만 처음 사용한 기술에 고정됩니다.", "**스피드 동률**: 동전 던지기로 결정 — 스피드 1을 더 투자해 깨세요."],
    "zh-Hans": ["**顺风 (Tailwind)**: 4 回合内使队伍速度翻倍。是进攻队伍的基石。", "**戏法空间 (Trick Room)**: 5 回合内反转回合顺序 — 速度最慢的先行动。围绕耐久型慢速攻击手构建。", "**先制技**: 电光一闪、子弹拳、突袭、水流喷射、神速、假动作 — 完全无视速度。", "**讲究围巾**: 速度 ×1.5 但锁定第一个使用的招式。", "**速度平局**: 通过抛硬币决定 — 多投资 1 点速度以打破平局。"],
    "zh-Hant": ["**順風 (Tailwind)**: 4 回合內使隊伍速度翻倍。是進攻隊伍的基石。", "**戲法空間 (Trick Room)**: 5 回合內反轉回合順序 — 速度最慢的先行動。圍繞耐久型慢速攻擊手建立。", "**先制技**: 電光一閃、子彈拳、突襲、水流噴射、神速、假動作 — 完全無視速度。", "**講究圍巾**: 速度 ×1.5 但鎖定第一個使用的招式。", "**速度平局**: 透過擲硬幣決定 — 多投資 1 點速度以打破平局。"]
  } },
  },
  {
    id: "weather",
    icon: "Cloud",
    title: {
    en: "Weather",
    fr: "Météo",
    es: "Clima",
    de: "Wetter",
    it: "Meteo",
    ja: "天候",
    ko: "날씨",
    "zh-Hans": "天气",
    "zh-Hant": "天氣"
  },
    content: { kind: "bullets", items: {
    en: ["**Sun** [icon:Sun] — Fire +50%, Water −50%, Solar Beam no charge, Chlorophyll doubles Speed, Solar Power +50% SpA but −1/8 HP/turn.", "**Rain** [icon:CloudRain] — Water +50%, Fire −50%, Thunder 100% accuracy, Swift Swim doubles Speed.", "**Sandstorm** [icon:Wind] — Rock +50% SpD, chip damage to non-Rock/Ground/Steel, Sand Rush doubles Speed.", "**Snow** [icon:Snowflake] — Ice types get +50% Defense, Slush Rush doubles Speed, Aurora Veil halves damage.", "Default duration is 5 turns, 8 turns with the corresponding weather rock (Heat Rock, Damp Rock, Smooth Rock, Icy Rock)."],
    fr: ["**Soleil** [icon:Sun] — Feu +50%, Eau −50%, Lance-Soleil sans charge, Chlorophylle double la Vitesse, Force Soleil +50% AtkS mais −1/8 PV/tour.", "**Pluie** [icon:CloudRain] — Eau +50%, Feu −50%, Fatal-Foudre 100% de précision, Glissade double la Vitesse.", "**Tempête de sable** [icon:Wind] — Roche +50% DéfS, dégâts résiduels sauf Roche/Sol/Acier, Hâte Sable double la Vitesse.", "**Neige** [icon:Snowflake] — Glace +50% Défense, Hâte Neige double la Vitesse, Voile Aurore divise les dégâts par 2.", "Durée par défaut 5 tours, 8 tours avec la pierre météo correspondante (Roche Chaude / Roche Humide / Roche Lisse / Roche Glace)."],
    es: ["**Sol** [icon:Sun] — Fuego +50%, Agua −50%, Rayo Solar sin carga, Clorofila duplica la Velocidad, Poder Solar +50% AtEsp pero −1/8 PV por turno.", "**Lluvia** [icon:CloudRain] — Agua +50%, Fuego −50%, Trueno 100% de precisión, Nado Rápido duplica la Velocidad.", "**Tormenta de arena** [icon:Wind] — Roca +50% DefEsp, daño residual excepto Roca/Tierra/Acero, Ímpetu Arena duplica la Velocidad.", "**Nieve** [icon:Snowflake] — Tipo Hielo +50% Defensa, Quitanieves duplica la Velocidad, Vel Aurora reduce el daño a la mitad.", "Duración por defecto 5 turnos, 8 turnos con la roca meteorológica correspondiente (Roca Calor, Roca Lluvia, Roca Suave, Roca Helada)."],
    de: ["**Sonnenschein** [icon:Sun] — Feuer +50%, Wasser −50%, Solarstrahl ohne Aufladung, Chlorophyll verdoppelt Initiative, Solarkraft +50% SpAng aber −1/8 KP/Runde.", "**Regen** [icon:CloudRain] — Wasser +50%, Feuer −50%, Donner 100% Genauigkeit, Wassertempo verdoppelt Initiative.", "**Sandsturm** [icon:Wind] — Gestein +50% SpVer, Splitterschaden außer Gestein/Boden/Stahl, Sandscharrer verdoppelt Initiative.", "**Schnee** [icon:Snowflake] — Eis +50% Verteidigung, Schneescharrer verdoppelt Initiative, Auroraschleier halbiert Schaden.", "Standarddauer 5 Runden, 8 Runden mit dem entsprechenden Wetterstein (Heißer Fels, Nasser Fels, Glatter Fels, Eis-Fels)."],
    it: ["**Sole** [icon:Sun] — Fuoco +50%, Acqua −50%, Solarraggio senza carica, Clorofilla raddoppia la Velocità, Solarpotere +50% AttSp ma −1/8 PS/turno.", "**Pioggia** [icon:CloudRain] — Acqua +50%, Fuoco −50%, Tuono 100% precisione, Nuotovelox raddoppia la Velocità.", "**Tempesta di sabbia** [icon:Wind] — Roccia +50% DifSp, danno residuo tranne Roccia/Terra/Acciaio, Sabbiafuria raddoppia la Velocità.", "**Neve** [icon:Snowflake] — Ghiaccio +50% Difesa, Slittavolt raddoppia la Velocità, Velaurora dimezza i danni.", "Durata predefinita 5 turni, 8 turni con la roccia meteo corrispondente (Roccia Calda, Roccia Umida, Roccia Liscia, Roccia Gelata)."],
    ja: ["**はれ** [icon:Sun] — ほのお +50%、みず −50%、ソーラービームがタメなし、ようりょくそでSが2倍、サンパワーで特攻+50%だが毎ターンHP−1/8。", "**あめ** [icon:CloudRain] — みず +50%、ほのお −50%、かみなりが必中、すいすいでSが2倍。", "**すなあらし** [icon:Wind] — いわのSDが+50%、いわ/じめん/はがね以外に継続ダメージ、すなかきでSが2倍。", "**ゆき** [icon:Snowflake] — こおりタイプの防御+50%、ゆきかきでSが2倍、オーロラベールでダメージ半減。", "デフォルトの持続時間は5ターン、対応する天候石(あついいわ、しめったいわ、さらさらいわ、つめたいいわ)で8ターン。"],
    ko: ["**쾌청** [icon:Sun] — 불꽃 +50%, 물 −50%, 솔라빔 차지 없음, 엽록소가 스피드 2배, 선파워로 특수공격 +50%지만 매턴 HP −1/8.", "**비** [icon:CloudRain] — 물 +50%, 불꽃 −50%, 번개 명중률 100%, 쓱쓱이 스피드 2배.", "**모래바람** [icon:Wind] — 바위 특수방어 +50%, 바위/땅/강철 외에 지속 데미지, 모래헤치기 스피드 2배.", "**눈** [icon:Snowflake] — 얼음 타입 방어 +50%, 눈치우기 스피드 2배, 오로라베일 데미지 절반.", "기본 지속 시간은 5턴, 해당 날씨 돌(열구슬, 축축한바위, 반들반들바위, 차가운바위)로 8턴."],
    "zh-Hans": ["**晴天** [icon:Sun] — 火 +50%，水 −50%，日光束无需蓄力，叶绿素速度翻倍，太阳力量特攻 +50% 但每回合 HP −1/8。", "**下雨** [icon:CloudRain] — 水 +50%，火 −50%，打雷 100% 命中，悠游自如速度翻倍。", "**沙暴** [icon:Wind] — 岩石特防 +50%，对非岩石/地面/钢属性持续伤害，拨沙速度翻倍。", "**冰雪** [icon:Snowflake] — 冰属性防御 +50%，雪隐速度翻倍，极光幕伤害减半。", "默认持续 5 回合，搭配对应的天气石（炽焰石、潮湿石、沙沙石、冰冷石）持续 8 回合。"],
    "zh-Hant": ["**晴天** [icon:Sun] — 火 +50%，水 −50%，日光束無需蓄力，葉綠素速度翻倍，太陽力量特攻 +50% 但每回合 HP −1/8。", "**下雨** [icon:CloudRain] — 水 +50%，火 −50%，打雷 100% 命中，悠遊自如速度翻倍。", "**沙暴** [icon:Wind] — 岩石特防 +50%，對非岩石/地面/鋼屬性持續傷害，撥沙速度翻倍。", "**冰雪** [icon:Snowflake] — 冰屬性防禦 +50%，雪隱速度翻倍，極光幕傷害減半。", "預設持續 5 回合，搭配對應的天氣石（熾焰石、潮濕石、沙沙石、冰冷石）持續 8 回合。"]
  } },
  },
  {
    id: "terrain",
    icon: "Layers",
    title: {
    en: "Terrain",
    fr: "Champ",
    es: "Campo",
    de: "Feld",
    it: "Campo",
    ja: "フィールド",
    ko: "필드",
    "zh-Hans": "场地",
    "zh-Hant": "場地"
  },
    content: { kind: "bullets", items: {
    en: ["**Electric Terrain** [icon:Zap] — Electric moves +30%, grounded Pokémon can't be put to sleep.", "**Grassy Terrain** [icon:Leaf] — Grass moves +30%, grounded Pokémon heal 1/16 HP per turn, Earthquake/Bulldoze halved.", "**Misty Terrain** [icon:CloudFog] — Dragon moves halved, grounded Pokémon immune to status.", "**Psychic Terrain** [icon:Sparkles] — Psychic moves +30%, grounded Pokémon immune to priority.", "Terrain effects only apply to **grounded** Pokémon (not Flying types or those with Levitate / Air Balloon)."],
    fr: ["**Champ Électrifié** [icon:Zap] — Attaques Élec +30%, les Pokémon au sol ne peuvent pas s'endormir.", "**Champ Herbu** [icon:Leaf] — Attaques Plante +30%, les Pokémon au sol récupèrent 1/16 PV par tour, Séisme/Bulldozer divisés par 2.", "**Champ Brumeux** [icon:CloudFog] — Attaques Dragon divisées par 2, les Pokémon au sol immunisés aux statuts.", "**Champ Psychique** [icon:Sparkles] — Attaques Psy +30%, les Pokémon au sol immunisés aux attaques prioritaires.", "Les effets de champ s'appliquent uniquement aux Pokémon **au sol** (pas les Vol, Lévitation, ou Ballon)."],
    es: ["**Campo Eléctrico** [icon:Zap] — Movimientos Eléctrico +30%, los Pokémon en tierra no pueden dormir.", "**Campo de Hierba** [icon:Leaf] — Movimientos Planta +30%, los Pokémon en tierra recuperan 1/16 PS por turno, Terremoto/Bulldozer reducidos a la mitad.", "**Campo de Niebla** [icon:CloudFog] — Movimientos Dragón reducidos a la mitad, los Pokémon en tierra inmunes a los estados.", "**Campo Psíquico** [icon:Sparkles] — Movimientos Psíquico +30%, los Pokémon en tierra inmunes a la prioridad.", "Los efectos de campo solo se aplican a los Pokémon **en tierra** (no a los tipo Volador, con Levitación o con Globo Helio)."],
    de: ["**Elektrofeld** [icon:Zap] — Elektro-Attacken +30%, geerdete Pokémon können nicht einschlafen.", "**Grasfeld** [icon:Leaf] — Pflanzen-Attacken +30%, geerdete Pokémon heilen 1/16 KP/Runde, Erdbeben/Bagger halbiert.", "**Nebelfeld** [icon:CloudFog] — Drache-Attacken halbiert, geerdete Pokémon gegen Statusveränderungen immun.", "**Psychofeld** [icon:Sparkles] — Psycho-Attacken +30%, geerdete Pokémon immun gegen Prio-Attacken.", "Feldeffekte wirken nur auf **geerdete** Pokémon (keine Flug-Typen, keine mit Schwebe / Luftballon)."],
    it: ["**Campo Elettrico** [icon:Zap] — Mosse Elettro +30%, i Pokémon a terra non possono addormentarsi.", "**Campo Erboso** [icon:Leaf] — Mosse Erba +30%, i Pokémon a terra recuperano 1/16 PS/turno, Terremoto/Sbigliozzo dimezzati.", "**Campo Nebbioso** [icon:CloudFog] — Mosse Drago dimezzate, i Pokémon a terra immuni agli stati.", "**Campo Psichico** [icon:Sparkles] — Mosse Psico +30%, i Pokémon a terra immuni alle mosse prioritarie.", "Gli effetti del campo si applicano solo ai Pokémon **a terra** (non ai tipi Volante, a chi ha Levitazione o Palloneliodio)."],
    ja: ["**エレキフィールド** [icon:Zap] — でんきわざ +30%、地面にいるポケモンは眠らない。", "**グラスフィールド** [icon:Leaf] — くさわざ +30%、地面にいるポケモンは毎ターンHPを1/16回復、じしん/じならしが半減。", "**ミストフィールド** [icon:CloudFog] — ドラゴンわざ半減、地面にいるポケモンは状態異常にならない。", "**サイコフィールド** [icon:Sparkles] — エスパーわざ +30%、地面にいるポケモンは先制技を受けない。", "フィールド効果は**地面にいる**ポケモンのみに適用されます(ひこうタイプ、ふゆう、ふうせんは対象外)。"],
    ko: ["**일렉트릭필드** [icon:Zap] — 전기 기술 +30%, 지면에 있는 포켓몬은 잠들지 않습니다.", "**그래스필드** [icon:Leaf] — 풀 기술 +30%, 지면에 있는 포켓몬은 매턴 HP 1/16 회복, 지진/땅고르기 절반.", "**미스트필드** [icon:CloudFog] — 드래곤 기술 절반, 지면에 있는 포켓몬은 상태이상 면역.", "**사이코필드** [icon:Sparkles] — 에스퍼 기술 +30%, 지면에 있는 포켓몬은 선공기 면역.", "필드 효과는 **지면에 있는** 포켓몬에게만 적용됩니다 (비행 타입, 부유, 풍선 제외)."],
    "zh-Hans": ["**电气场地** [icon:Zap] — 电属性招式 +30%，地面上的宝可梦无法入眠。", "**青草场地** [icon:Leaf] — 草属性招式 +30%，地面上的宝可梦每回合恢复 1/16 HP，地震/大地之力减半。", "**薄雾场地** [icon:CloudFog] — 龙属性招式减半，地面上的宝可梦免疫异常状态。", "**精神场地** [icon:Sparkles] — 超能力招式 +30%，地面上的宝可梦免疫先制技。", "场地效果仅对 **地面上的** 宝可梦生效（不包括飞行属性、飘浮、气球）。"],
    "zh-Hant": ["**電氣場地** [icon:Zap] — 電屬性招式 +30%，地面上的寶可夢無法入眠。", "**青草場地** [icon:Leaf] — 草屬性招式 +30%，地面上的寶可夢每回合恢復 1/16 HP，地震/大地之力減半。", "**薄霧場地** [icon:CloudFog] — 龍屬性招式減半，地面上的寶可夢免疫異常狀態。", "**精神場地** [icon:Sparkles] — 超能力招式 +30%，地面上的寶可夢免疫先制技。", "場地效果僅對 **地面上的** 寶可夢生效（不包括飛行屬性、飄浮、氣球）。"]
  } },
  },
  {
    id: "items",
    icon: "Sparkles",
    title: {
    en: "Common items",
    fr: "Objets courants",
    es: "Objetos comunes",
    de: "Gängige Items",
    it: "Strumenti comuni",
    ja: "よく使われる持ち物",
    ko: "자주 쓰이는 아이템",
    "zh-Hans": "常见道具",
    "zh-Hant": "常見道具"
  },
    content: { kind: "bullets", items: {
    en: ["**Choice Band/Specs/Scarf** — ×1.5 Atk/SpA/Spe but locks the move", "**Life Orb** — ×1.3 damage but −1/10 HP per attack", "**Focus Sash** — survive any 1 hit at full HP with 1 HP", "**Assault Vest** — ×1.5 SpD but no status moves", "**Leftovers** — heal 1/16 HP per turn", "**Sitrus Berry** — heal 1/4 max HP at 50% HP", "**Rocky Helmet** — contact attackers take 1/6 max HP", "**Booster Energy** — Paradox Pokémon boost their highest stat outside terrain/weather", "**Mental Herb** — cure Taunt/Encore/Torment/Disable on use", "**Safety Goggles** — immune to powder moves and weather damage"],
    fr: ["**Bandeau / Spécial / Mouchoir Choix** — ×1.5 Atk/AtkS/Vit mais lock l'attaque", "**Orbe Vie** — ×1.3 dégâts mais −1/10 PV par attaque", "**Ceinture Force** — survit à un coup à 1 PV depuis 100% PV", "**Veste de Combat** — ×1.5 DéfS mais pas d'attaques de statut", "**Restes** — récupère 1/16 PV par tour", "**Baie Sitrus** — récupère 1/4 PV max à 50% de PV", "**Casque Brut** — l'attaquant au contact perd 1/6 PV max", "**Énergie Booster** — les Paradoxe boostent leur meilleure stat hors météo/champ", "**Herbe Mental** — soigne Provoc / Encore / Tourmente / Entrave à l'usage", "**Lunettes Filtre** — immunité aux attaques poudre et aux dégâts météo"],
    es: ["**Cinta/Gafas/Pañuelo Elegido** — ×1.5 Ataque/AtEsp/Velocidad pero bloquea el movimiento", "**Vidasfera** — ×1.3 daño pero −1/10 PS por ataque", "**Banda Focus** — sobrevive a un golpe con 1 PS desde PS completos", "**Chaleco Asalto** — ×1.5 DefEsp pero sin movimientos de estado", "**Restos** — recupera 1/16 PS por turno", "**Baya Zidra** — recupera 1/4 de PS máx al 50% de PS", "**Casco Dentado** — el atacante por contacto pierde 1/6 de PS máx", "**Energía Prístina** — los Paradoja aumentan su mejor estadística sin clima/campo", "**Hierba Mental** — cura Mofa/Otra Vez/Tormento/Anulación al usarse", "**Gafas Protectoras** — inmune a movimientos polvo y al daño por clima"],
    de: ["**Wahlband/-glas/-schal** — ×1,5 Ang/SpAng/Init aber bindet an die Attacke", "**Leben-Orb** — ×1,3 Schaden, aber −1/10 KP pro Attacke", "**Fokusgurt** — überlebt bei voller KP einen K.O.-Treffer mit 1 KP", "**Offensivweste** — ×1,5 SpVer, aber keine Status-Attacken", "**Überreste** — heilt 1/16 KP pro Runde", "**Tsitrubeere** — heilt 1/4 max. KP bei 50% KP", "**Kletterdorn** — Kontakt-Angreifer verlieren 1/6 max. KP", "**Boost-Energie** — Paradox-Pokémon boosten ihren höchsten Wert ohne Feld/Wetter", "**Mentalkraut** — heilt Verhöhner/Zugabe/Folterknecht/Blockade bei Einsatz", "**Schutzbrille** — immun gegen Pulver-Attacken und Wetterschaden"],
    it: ["**Banda/Occhiali/Wallo Scelta** — ×1,5 Att/AttSp/Vel ma blocca la mossa", "**Vitasfera** — ×1,3 danno ma −1/10 PS per attacco", "**Focalnastro** — sopravvive a un colpo con 1 PS partendo da PS pieni", "**Giubbotto Assalto** — ×1,5 DifSp ma niente mosse di stato", "**Avanzi** — recupera 1/16 PS per turno", "**Baccacedra** — recupera 1/4 PS max al 50% di PS", "**Casco Roccia** — chi attacca per contatto perde 1/6 PS max", "**Energia Boost** — i Paradosso aumentano la statistica più alta fuori dal campo/meteo", "**Mentalerba** — cura Provocazione/Ripeti/Tormento/Inibitore all'uso", "**Occhialprotett** — immune a mosse polvere e danni da meteo"],
    ja: ["**こだわりハチマキ/メガネ/スカーフ** — こうげき/とくこう/すばやさ ×1.5 だが技がロックされる", "**いのちのたま** — ダメージ ×1.3 だが攻撃ごとにHP−1/10", "**きあいのタスキ** — 満HPからKOされそうな攻撃を1HPで耐える", "**とつげきチョッキ** — とくぼう ×1.5 だが変化技が使えない", "**たべのこし** — 毎ターンHPを1/16回復", "**オボンのみ** — HPが50%以下でHPを1/4回復", "**ゴツゴツメット** — 接触攻撃で相手のHPを1/6削る", "**ブーストエナジー** — パラドックスポケモンが天候/フィールド無しで最高ステータスを上昇", "**メンタルハーブ** — ちょうはつ/アンコール/いちゃもん/かなしばりを使用時に解除", "**ぼうじんゴーグル** — 粉技と天候ダメージに無効"],
    ko: ["**구애머리띠/안경/스카프** — 공격/특공/스피드 ×1.5이지만 기술 고정", "**생명의구슬** — 데미지 ×1.3이지만 공격마다 HP −1/10", "**기합의띠** — 풀 HP에서 KO 공격을 1 HP로 버팀", "**돌격조끼** — 특방 ×1.5이지만 변화기 사용 불가", "**먹다남은음식** — 매턴 HP 1/16 회복", "**오랭열매** — HP 50% 이하에서 최대 HP 1/4 회복", "**울퉁불퉁멧** — 접촉 공격 시 상대 최대 HP 1/6 감소", "**부스트에너지** — 패러독스 포켓몬이 날씨/필드 없이 최고 스탯을 상승", "**멘탈허브** — 도발/앵콜/트집/사슬묶기를 사용 시 해제", "**방진고글** — 가루 기술과 날씨 데미지 면역"],
    "zh-Hans": ["**讲究头巾/眼镜/围巾** — 攻击/特攻/速度 ×1.5 但锁定招式", "**生命宝珠** — 伤害 ×1.3 但每次攻击 HP −1/10", "**气势披带** — 满 HP 时承受一击至 1 HP", "**突击背心** — 特防 ×1.5 但无法使用变化招式", "**吃剩的东西** — 每回合恢复 1/16 HP", "**橙橙果** — HP 50% 以下时恢复最大 HP 1/4", "**凸凸头盔** — 接触攻击者损失最大 HP 1/6", "**增强能量** — 悖谬宝可梦在无天气/场地时提升最高属性", "**精神香草** — 使用时解除挑衅/应声虫/无理取闹/定身法", "**防尘护目镜** — 免疫粉招式和天气伤害"],
    "zh-Hant": ["**講究頭巾/眼鏡/圍巾** — 攻擊/特攻/速度 ×1.5 但鎖定招式", "**生命寶珠** — 傷害 ×1.3 但每次攻擊 HP −1/10", "**氣勢披帶** — 滿 HP 時承受一擊至 1 HP", "**突擊背心** — 特防 ×1.5 但無法使用變化招式", "**吃剩的東西** — 每回合恢復 1/16 HP", "**橙橙果** — HP 50% 以下時恢復最大 HP 1/4", "**凸凸頭盔** — 接觸攻擊者損失最大 HP 1/6", "**增強能量** — 悖謬寶可夢在無天氣/場地時提升最高屬性", "**精神香草** — 使用時解除挑釁/應聲蟲/無理取鬧/定身法", "**防塵護目鏡** — 免疫粉招式和天氣傷害"]
  } },
  },
  {
    id: "abilities",
    icon: "Zap",
    title: {
    en: "Game-changing abilities",
    fr: "Talents qui changent tout",
    es: "Habilidades que cambian el juego",
    de: "Spielverändernde Fähigkeiten",
    it: "Abilità che cambiano la partita",
    ja: "試合を決める特性",
    ko: "게임을 바꾸는 특성",
    "zh-Hans": "改变战局的特性",
    "zh-Hant": "改變戰局的特性"
  },
    content: { kind: "bullets", items: {
    en: ["**Intimidate** — lowers opposing Pokémon's Attack on switch in", "**Drought / Drizzle / Sand Stream / Snow Warning** — set weather on entry", "**Electric/Grassy/Misty/Psychic Surge** — set terrain on entry", "**Beast Boost / Moxie** — KO grants +1 to highest stat / Attack", "**Magic Bounce** — bounces back status moves", "**Levitate** — immune to Ground", "**Sturdy** — survive any 1HKO from full HP", "**Multiscale / Ice Scales** — halves damage at full HP / from special moves", "**Unaware** — ignores enemy stat boosts", "**Speed Boost** — +1 Speed every turn"],
    fr: ["**Intimidation** — baisse l'Attaque adverse à l'entrée", "**Sécheresse / Crachin / Sable Volant / Alerte Neige** — pose la météo à l'entrée", "**Surcharge / Herbe Folle / Brume Folle / Pouvoir Psychique** — pose le champ à l'entrée", "**Boost Chimère / Arrogance** — +1 meilleure stat / Attaque sur KO", "**Miroir Magik** — renvoie les attaques de statut", "**Lévitation** — immunité Sol", "**Fermeté** — survit aux OHKO depuis 100% PV", "**Multi-Écailles / Écailles Glacées** — divise les dégâts par 2 à 100% PV / depuis les attaques spéciales", "**Inconscient** — ignore les boosts de stats adverses", "**Turbo** — +1 Vitesse à chaque tour"],
    es: ["**Intimidación** — reduce el Ataque rival al entrar", "**Sequía / Llovizna / Chorro Arena / Nevada** — establece el clima al entrar", "**Electrogénesis / Flor Salvaje / Niebla Misteriosa / Campo Psíquico** — establece el campo al entrar", "**Subidón / Autoestima** — un KO otorga +1 a la estadística más alta / al Ataque", "**Espejo Mágico** — rebota los movimientos de estado", "**Levitación** — inmune a tipo Tierra", "**Robustez** — sobrevive a cualquier OHKO desde PS completos", "**Multiescamas / Gélida Escama** — reduce el daño a la mitad con PS completos / desde movimientos especiales", "**Ignorante** — ignora los aumentos de stats del rival", "**Impulso** — +1 Velocidad cada turno"],
    de: ["**Bedroher** — senkt den Angriff des Gegners beim Einwechseln", "**Dürre / Niesel / Sandsturm / Schneesturm** — setzt Wetter beim Einwechseln", "**Elektro-/Gras-/Nebel-/Psycho-Erzeuger** — setzt Feld beim Einwechseln", "**Bestien-Boost / Hochmut** — K.O. gewährt +1 auf höchsten Wert / Angriff", "**Magiespiegel** — reflektiert Status-Attacken", "**Schwebe** — immun gegen Boden", "**Robustheit** — überlebt jeden OHKO von voller KP", "**Multischuppe / Eisschuppen** — halbiert Schaden bei voller KP / von Spezial-Attacken", "**Unkenntnis** — ignoriert gegnerische Statusboosts", "**Tempomacher** — +1 Initiative pro Runde"],
    it: ["**Prepotenza** — abbassa l'Attacco avversario all'ingresso", "**Siccità / Piovischio / Sabbia Fluente / Scendineve** — imposta il meteo all'ingresso", "**Elettrogenesi / Muschio di Grano / Fiotto Fatato / Psicogenesi** — imposta il campo all'ingresso", "**Competitivo / Arroganza** — un KO concede +1 alla stat più alta / all'Attacco", "**Magispecchio** — rimbalza le mosse di stato", "**Levitazione** — immune a Terra", "**Vigore** — sopravvive a qualsiasi OHKO da PS pieni", "**Multisquame / Gelosquame** — dimezza i danni a PS pieni / dalle mosse speciali", "**Imperturbato** — ignora i potenziamenti avversari", "**Acceleratore** — +1 Velocità ogni turno"],
    ja: ["**いかく** — 交代出しで相手のこうげきを下げる", "**ひでり/あめふらし/すなおこし/ゆきふらし** — 場に出ると天候を発生させる", "**エレキメイカー/グラスメイカー/ミストメイカー/サイコメイカー** — 場に出るとフィールドを発生させる", "**ビーストブースト/じしんかじょう** — KOで最高ステータス/こうげきが+1", "**マジックミラー** — 変化技を反射する", "**ふゆう** — じめん無効", "**がんじょう** — 満HPから一撃必殺を耐える", "**マルチスケイル/こおりのりんぷん** — 満HP時にダメージ半減/特殊技のダメージを半減", "**てんねん** — 相手の能力変化を無視する", "**かそく** — 毎ターンすばやさ+1"],
    ko: ["**위협** — 교체로 등장 시 상대의 공격을 낮춤", "**가뭄 / 잔비 / 모래날림 / 눈퍼뜨리기** — 등장 시 날씨 발동", "**일렉트릭메이커/그래스메이커/미스트메이커/사이코메이커** — 등장 시 필드 발동", "**비스트부스트/자신과잉** — KO 시 최고 스탯/공격 +1", "**매직미러** — 변화기를 튕겨냄", "**부유** — 땅 면역", "**옹골참** — 풀 HP에서 원턴킬을 버팀", "**멀티스케일/얼음인분** — 풀 HP 시 데미지 절반/특수기 데미지 절반", "**천진** — 상대의 능력 변화를 무시", "**가속** — 매턴 스피드 +1"],
    "zh-Hans": ["**威吓** — 出场时降低对手的攻击", "**日照 / 降雨 / 沙流 / 降雪** — 出场时设置天气", "**电气制造者/青草制造者/薄雾制造者/精神制造者** — 出场时设置场地", "**异兽提升/自信过剩** — 击倒对手后最高属性/攻击 +1", "**魔法镜面** — 反弹变化招式", "**飘浮** — 免疫地面", "**结实** — 满 HP 时承受一击必杀", "**多重鳞片/冰鳞粉** — 满 HP 时伤害减半/特殊招式伤害减半", "**纯朴** — 忽视对手的能力变化", "**加速** — 每回合速度 +1"],
    "zh-Hant": ["**威嚇** — 出場時降低對手的攻擊", "**日照 / 降雨 / 沙流 / 降雪** — 出場時設定天氣", "**電氣製造者/青草製造者/薄霧製造者/精神製造者** — 出場時設定場地", "**異獸提升/自信過剩** — 擊倒對手後最高屬性/攻擊 +1", "**魔法鏡面** — 反彈變化招式", "**飄浮** — 免疫地面", "**結實** — 滿 HP 時承受一擊必殺", "**多重鱗片/冰鱗粉** — 滿 HP 時傷害減半/特殊招式傷害減半", "**純樸** — 忽視對手的能力變化", "**加速** — 每回合速度 +1"]
  } },
  },
  {
    id: "status",
    icon: "Shield",
    title: {
    en: "Status conditions",
    fr: "Statuts",
    es: "Estados alterados",
    de: "Statusveränderungen",
    it: "Condizioni di stato",
    ja: "状態異常",
    ko: "상태이상",
    "zh-Hans": "异常状态",
    "zh-Hant": "異常狀態"
  },
    content: { kind: "bullets", items: {
    en: ["**Burn** [icon:Flame] — halves physical attack, −1/16 HP per turn", "**Paralysis** [icon:Zap] — halves Speed, 25% chance to skip turn", "**Sleep** [icon:Moon] — can't act for 1-3 turns (1 with Sleep Talk)", "**Freeze** [icon:Snowflake] — can't act, 20% chance to thaw each turn", "**Poison** [icon:Droplet] — −1/8 HP per turn", "**Badly poisoned** [icon:Skull] — −1/16 HP first turn, then ramping up", "**Confusion** — 33% chance to hit yourself for ~50% of own Attack"],
    fr: ["**Brûlure** [icon:Flame] — divise l'attaque physique par 2, −1/16 PV/tour", "**Paralysie** [icon:Zap] — divise la Vitesse par 2, 25% de rater son tour", "**Sommeil** [icon:Moon] — ne peut pas agir pendant 1-3 tours (1 avec Blabla Dodo)", "**Gel** [icon:Snowflake] — ne peut pas agir, 20% de dégeler par tour", "**Poison** [icon:Droplet] — −1/8 PV par tour", "**Poison grave** [icon:Skull] — −1/16 PV au début, augmente chaque tour", "**Confusion** — 33% de se taper soi-même pour ~50% de sa propre Attaque"],
    es: ["**Quemadura** [icon:Flame] — reduce el ataque físico a la mitad, −1/16 PS por turno", "**Parálisis** [icon:Zap] — reduce la Velocidad a la mitad, 25% de perder el turno", "**Sueño** [icon:Moon] — no puede actuar durante 1-3 turnos (1 con Sonámbulo)", "**Congelación** [icon:Snowflake] — no puede actuar, 20% de descongelarse cada turno", "**Envenenamiento** [icon:Droplet] — −1/8 PS por turno", "**Envenenamiento grave** [icon:Skull] — −1/16 PS al inicio, luego va aumentando", "**Confusión** — 33% de herirse con ~50% del propio Ataque"],
    de: ["**Verbrennung** [icon:Flame] — halbiert den physischen Angriff, −1/16 KP/Runde", "**Paralyse** [icon:Zap] — halbiert die Initiative, 25% Chance die Runde zu verlieren", "**Schlaf** [icon:Moon] — kann 1-3 Runden nicht handeln (1 mit Schlafrede)", "**Gefroren** [icon:Snowflake] — kann nicht handeln, 20% Chance pro Runde aufzutauen", "**Vergiftung** [icon:Droplet] — −1/8 KP pro Runde", "**Schwere Vergiftung** [icon:Skull] — −1/16 KP in Runde 1, dann ansteigend", "**Verwirrung** — 33% Chance sich selbst mit ~50% des eigenen Angriffs zu treffen"],
    it: ["**Scottatura** [icon:Flame] — dimezza l'attacco fisico, −1/16 PS/turno", "**Paralisi** [icon:Zap] — dimezza la Velocità, 25% di perdere il turno", "**Sonno** [icon:Moon] — non può agire per 1-3 turni (1 con Sonnolalia)", "**Congelamento** [icon:Snowflake] — non può agire, 20% di scongelarsi per turno", "**Avvelenamento** [icon:Droplet] — −1/8 PS per turno", "**Iperavvelenamento** [icon:Skull] — −1/16 PS al primo turno, poi in crescita", "**Confusione** — 33% di colpirsi da solo con ~50% del proprio Attacco"],
    ja: ["**やけど** [icon:Flame] — 物理攻撃を半減、毎ターンHP−1/16", "**まひ** [icon:Zap] — すばやさ半減、25%の確率で行動不能", "**ねむり** [icon:Moon] — 1〜3ターン行動不能(ねごとだと1ターン)", "**こおり** [icon:Snowflake] — 行動不能、毎ターン20%で解ける", "**どく** [icon:Droplet] — 毎ターンHP−1/8", "**もうどく** [icon:Skull] — 初ターンHP−1/16、以降徐々に増加", "**こんらん** — 33%の確率で自分にダメージ(自攻撃の約50%)"],
    ko: ["**화상** [icon:Flame] — 물리 공격 절반, 매턴 HP −1/16", "**마비** [icon:Zap] — 스피드 절반, 25% 확률로 턴 스킵", "**잠듦** [icon:Moon] — 1-3턴 행동 불가 (잠꼬대 사용 시 1턴)", "**얼음** [icon:Snowflake] — 행동 불가, 매턴 20% 확률로 해동", "**독** [icon:Droplet] — 매턴 HP −1/8", "**맹독** [icon:Skull] — 첫 턴 HP −1/16, 이후 점점 증가", "**혼란** — 33% 확률로 자신의 공격 약 50%로 자해"],
    "zh-Hans": ["**灼伤** [icon:Flame] — 物攻减半，每回合 HP −1/16", "**麻痹** [icon:Zap] — 速度减半，25% 几率无法行动", "**睡眠** [icon:Moon] — 1-3 回合无法行动（梦话为 1 回合）", "**冰冻** [icon:Snowflake] — 无法行动，每回合 20% 几率解冻", "**中毒** [icon:Droplet] — 每回合 HP −1/8", "**剧毒** [icon:Skull] — 首回合 HP −1/16，之后递增", "**混乱** — 33% 几率攻击自己（约本体攻击的 50%）"],
    "zh-Hant": ["**灼傷** [icon:Flame] — 物攻減半，每回合 HP −1/16", "**麻痺** [icon:Zap] — 速度減半，25% 幾率無法行動", "**睡眠** [icon:Moon] — 1-3 回合無法行動（夢話為 1 回合）", "**冰凍** [icon:Snowflake] — 無法行動，每回合 20% 幾率解凍", "**中毒** [icon:Droplet] — 每回合 HP −1/8", "**劇毒** [icon:Skull] — 首回合 HP −1/16，之後遞增", "**混亂** — 33% 幾率攻擊自己（約本體攻擊的 50%）"]
  } },
  },
  {
    id: "tera",
    icon: "Swords",
    title: {
    en: "Tera Type",
    fr: "Type Téracristal",
    es: "Tipo Teracristal",
    de: "Tera-Typ",
    it: "Teratipo",
    ja: "テラスタイプ",
    ko: "테라스탈 타입",
    "zh-Hans": "太晶属性",
    "zh-Hant": "太晶屬性"
  },
    content: { kind: "paragraph", text: {
    en: "Each Pokémon has a hidden **Tera Type** that you can activate **once per battle**. Terastallizing changes the Pokémon's type to its Tera Type, granting STAB on moves of that type and changing its weaknesses / resistances. A Pokémon's original-type moves keep STAB even after Terastallizing (if matching). Use Tera defensively to flip a matchup, or offensively to add unexpected coverage.",
    fr: "Chaque Pokémon a un **Type Téracristal** caché qu'il peut activer **une fois par combat**. Le Téracristal change le type du Pokémon, octroie le STAB sur ce type, et modifie ses faiblesses/résistances. Les attaques du type original gardent le STAB même après Téracristal (si correspondance). Joue le Téra défensivement pour retourner un matchup, ou offensivement pour ajouter une couverture surprise.",
    es: "Cada Pokémon tiene un **Tipo Teracristal** oculto que puede activar **una vez por combate**. Teracristalizar cambia el tipo del Pokémon a su Tipo Teracristal, otorgando STAB a los movimientos de ese tipo y cambiando sus debilidades y resistencias. Los movimientos del tipo original mantienen el STAB incluso después de teracristalizar (si coinciden). Úsalo defensivamente para dar la vuelta a un enfrentamiento, u ofensivamente para añadir cobertura inesperada.",
    de: "Jedes Pokémon hat einen verdeckten **Tera-Typ**, den du **einmal pro Kampf** aktivieren kannst. Das Terakristallisieren ändert den Typ des Pokémon auf seinen Tera-Typ, gewährt STAB auf Attacken dieses Typs und ändert seine Schwächen und Resistenzen. Attacken des ursprünglichen Typs behalten auch nach dem Terakristallisieren STAB (wenn passend). Nutze Tera defensiv, um ein Matchup zu drehen, oder offensiv, um überraschende Abdeckung hinzuzufügen.",
    it: "Ogni Pokémon ha un **Teratipo** nascosto che può attivare **una sola volta per lotta**. Teracristallizzare cambia il tipo del Pokémon nel suo Teratipo, concedendo il STAB sulle mosse di quel tipo e cambiando le sue debolezze e resistenze. Le mosse del tipo originale mantengono il STAB anche dopo aver teracristallizzato (se corrispondono). Usa il Tera difensivamente per ribaltare un matchup, o offensivamente per aggiungere copertura inaspettata.",
    ja: "各ポケモンには隠された**テラスタイプ**があり、**1試合に1回**だけ発動できます。テラスタルするとポケモンのタイプがテラスタイプに変わり、そのタイプの技にタイプ一致ボーナス(STAB)が付き、弱点や耐性も変わります。元のタイプの技もテラスタル後にタイプ一致なら STAB を保持します。防御的に使って相性を逆転させたり、攻撃的に使って意外なカバレッジを追加しましょう。",
    ko: "각 포켓몬은 숨겨진 **테라스탈 타입**을 가지며 **배틀당 한 번만** 발동할 수 있습니다. 테라스탈하면 포켓몬의 타입이 테라스탈 타입으로 변하고, 해당 타입 기술에 자속 보너스(STAB)가 부여되며 약점과 저항이 바뀝니다. 원래 타입 기술도 테라스탈 후 일치하면 STAB를 유지합니다. 테라스탈을 방어적으로 써서 매치업을 뒤집거나, 공격적으로 써서 예상치 못한 커버리지를 추가하세요.",
    "zh-Hans": "每只宝可梦都有一个隐藏的 **太晶属性**，可以在 **每场战斗中激活一次**。太晶化会将宝可梦的属性变为太晶属性，为该属性的招式赋予本系加成（STAB），并改变其弱点和抵抗。宝可梦原始属性的招式在太晶化后（若匹配）仍保留 STAB。防御性地使用太晶化可以扭转对局，进攻性地使用则能增加出人意料的覆盖。",
    "zh-Hant": "每隻寶可夢都有一個隱藏的 **太晶屬性**，可以在 **每場戰鬥中啟動一次**。太晶化會將寶可夢的屬性變為太晶屬性，為該屬性的招式賦予本系加成（STAB），並改變其弱點和抵抗。寶可夢原始屬性的招式在太晶化後（若相符）仍保留 STAB。防禦性地使用太晶化可以扭轉對局，進攻性地使用則能增加出人意料的覆蓋。"
  } },
  },
  {
    id: "key-moves",
    icon: "Star",
    title: {
      en: "30 key moves explained",
      fr: "30 attaques clés expliquées",
      es: "30 movimientos clave explicados",
      de: "30 wichtige Attacken erklärt",
      it: "30 mosse chiave spiegate",
      ja: "30の重要な技の解説",
      ko: "30가지 주요 기술 설명",
      "zh-Hans": "30 个关键招式解析",
      "zh-Hant": "30 個關鍵招式解析",
    },
    content: {
      kind: "moveGroups",
      groups: {
        en: [
          {
            title: "Protection & anticipation",
            icon: "Shield",
            moves: [
              { name: "Protect", body: "Doubles staple. Shield one Pokémon while the partner kills a threat, or scout the opponent's set without taking damage." },
              { name: "Fake Out", body: "Priority flinch. Crucial to prevent an opponent from setting Trick Room or Tailwind on turn 1." },
              { name: "Wide Guard", body: "Unlike Protect, it can be used multiple times in a row. Vital against Rock Slide / Heat Wave spam." },
              { name: "Quick Guard", body: "Protects your side from all priority moves (Fake Out, ExtremeSpeed…). Less common but can save fragile setups." },
              { name: "Detect", body: "Same effect as Protect, but less common, which lets it bypass Cursed Body and similar gimmicks." },
            ],
          },
          {
            title: "Terrain control",
            icon: "CloudSun",
            moves: [
              { name: "Sunny Day", body: "Mandatory on sun teams. Enables Chlorophyll (2× Speed) and lets Solar Beam fire in one turn." },
              { name: "Rain Dance", body: "Boosts Water moves and makes Hurricane and Thunder 100% accurate." },
              { name: "Trick Room", body: "Inverts turn order for 5 turns — slow heavy hitters (Torkoal, Ursaring…) move first." },
              { name: "Aurora Veil", body: "Best protection in the game, combines Reflect + Light Screen, but requires active snow." },
            ],
          },
          {
            title: "Pivoting & momentum",
            icon: "RefreshCw",
            moves: [
              { name: "Parting Shot", body: "Weakens the opponent and safely pivots out — you see their move before choosing yours." },
              { name: "U-turn", body: "Keeps momentum. If opponent switches, you attack then pivot to keep the type advantage." },
              { name: "Volt Switch", body: "Like U-turn, but fails vs Ground types (no switch out, stuck on field)." },
            ],
          },
          {
            title: "High-risk offense",
            icon: "Bomb",
            moves: [
              { name: "Flare Blitz", body: "Devastating physical Fire move. Recoil hurts but often the only way to secure a clean KO." },
              { name: "Wave Crash", body: "Water equivalent of Flare Blitz. Under rain, KOs almost anything that doesn't resist." },
              { name: "Double-Edge", body: "Strong Normal physical. Often paired with boosting abilities on Mega Feraligatr-style sweepers." },
            ],
          },
          {
            title: "Targeting & item removal",
            icon: "Target",
            moves: [
              { name: "Rage Powder", body: "Forces opponents to attack the user (bulky redirector like Amoonguss), freeing the partner to set up." },
              { name: "Follow Me", body: "Same role as Rage Powder, but not blocked by Grass types or Safety Goggles." },
              { name: "Knock Off", body: "Big damage AND removes the item (Berry, Life Orb, Eviolite). Can wreck an entire set." },
              { name: "Taunt", body: "Ultimate anti-support tool. Forces attacks, blocks heals / walls / Trick Room." },
            ],
          },
          {
            title: "Niche specials",
            icon: "FlaskConical",
            moves: [
              { name: "Last Respects", body: "Scales with fainted teammates: from 50 BP at full team up to 200+ late-game. Terrifying." },
              { name: "Electro Shot", body: "Raikou / Raging Bolt signature. Boosts SpA and hits. One reason rain is so strong right now." },
              { name: "Sucker Punch", body: "Lets slow Pokémon strike first, but fails if the opponent uses a status move. Very tactical." },
              { name: "Helping Hand", body: "+5 priority, +50% to partner's next attack — great to guarantee a crucial KO." },
            ],
          },
          {
            title: "Stat control / debuffs",
            icon: "TrendingDown",
            moves: [
              { name: "Thunder Wave", body: "Paralysis cuts Speed by 50%. Alternative to Tailwind for controlling speed." },
              { name: "Will-O-Wisp", body: "Burn halves physical Attack — the worst nightmare for physical attackers." },
              { name: "Snarl", body: "Hits both opponents and drops their Special Attack. Great for mitigating special pressure." },
              { name: "Icy Wind", body: "Speed drop on both opponents. Unlike T-Wave, works on Electric and Ground types." },
              { name: "Electroweb", body: "Electric equivalent of Icy Wind. Decent damage on Flying / Water while dropping Speed." },
            ],
          },
          {
            title: "Setup & win conditions",
            icon: "Trophy",
            moves: [
              { name: "Dragon Dance / Quiver Dance", body: "Turn a decent Pokémon into a solo sweeper. Risky — they cost a turn of setup." },
              { name: "Perish Song", body: "Endgame tool. In the last 2v2, forces a win in 3 turns if you have the numerical advantage." },
            ],
          },
        ],
      },
    },
  },
];
