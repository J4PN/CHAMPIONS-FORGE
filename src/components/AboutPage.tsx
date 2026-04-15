import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Github,
  Bug,
  Coffee,
  Code2,
} from "lucide-react";
import type { Lang } from "@/lib/i18n";

export const GITHUB_REPO = "https://github.com/EricTron-FR/PokeCounter.app";
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues/new`;

interface Props {
  onBack: () => void;
}

type Content = {
  title: string;
  intro: string; // HTML with <strong> and <p>
  otherTitle: string;
  otherBody: string; // HTML with <a>
  stackTitle: string;
  stackBody: string; // HTML with <a>
  sayHiTitle: string;
  sayHiLead: string;
  thanks: string;
};

const L: Record<Lang, Content> = {
  en: {
    title: "What is this?",
    intro:
      "<p>Hi, I'm <strong>Eric</strong>, indie dev. PokeCounter is a personal project, built in a single day as a small challenge.</p>" +
      "<p>The idea: paste the opposing team, the tool tells you which of your own Pokémon to bring. Simple and fast. Around it there's a full Pokédex, a battle simulator, a damage calculator, a comparator, a tier list cross-referenced with Smogon usage stats, and 9 languages. All of it in a fast SPA backed by a tiny Go + MongoDB service for the live meta rankings.</p>" +
      "<p>Free, no account, no ads, no paywall — and it'll stay that way. Bug, typo, idea? Open a GitHub issue (links below).</p>",
    otherTitle: "My other project",
    otherBody:
      "If you're a dev and you need to mock APIs quickly during development without spinning up a backend, check out <a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a>. It's my tool for spinning up fake REST endpoints in a few clicks, with delay and error scenarios. Free to use.",
    stackTitle: "How it's built",
    stackBody:
      "Vite + React + TypeScript + Tailwind for the frontend, plus a tiny Go service with MongoDB that powers the <strong>meta rankings</strong>. Pokémon data comes from <a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>, usage stats from Smogon. The 268 Pokémon and type landing pages are pre-rendered at build time and served by nginx. Teams you build on the site are submitted <strong>anonymously</strong> (species IDs only — no account, no IP stored long-term) so the rankings reflect real usage. Local team builds stay in your browser's localStorage. Analytics is self-hosted Umami (no cookies). The code is MIT licensed and <a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">on GitHub</a> if you want to fork it.",
    sayHiTitle: "Say hi",
    sayHiLead: "Bug, idea, typo, terrible translation — all welcome. The fastest way:",
    thanks:
      "Thanks to PokéAPI for the free data, to Smogon for the usage stats, to Nintendo / Game Freak / The Pokémon Company for the games we love, and to you for reading this far.",
  },
  fr: {
    title: "C'est quoi PokeCounter ?",
    intro:
      "<p>Salut. Moi c'est <strong>Eric</strong>, dev indé. PokeCounter est un projet perso, construit en une seule journée comme un petit défi.</p>" +
      "<p>L'idée : tu colles la team adverse, l'outil te dit quels Pokémon de ta propre team amener. Basique et rapide. Autour de ça il y a un Pokédex complet, un simulateur de combats, un calculateur de dégâts, un comparateur, un tier list croisé avec les stats Smogon, et 9 langues. Tout ça dans un SPA rapide adossé à un petit service Go + MongoDB pour le classement méta en direct.</p>" +
      "<p>Gratuit, sans compte, sans pub, sans paywall — et ça le restera. Bug, typo, idée ? Ouvre une issue GitHub (liens plus bas).</p>",
    otherTitle: "Mon autre projet",
    otherBody:
      "Si tu es dev et que tu as besoin de mock des API rapidement pendant le dev sans spin-up un backend, jette un œil à <a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a>. C'est mon outil pour créer des faux endpoints REST en quelques clics, avec du delay et des scénarios d'erreur. Gratuit à l'usage.",
    stackTitle: "Comment c'est fait",
    stackBody:
      "Vite + React + TypeScript + Tailwind pour le front, plus un petit service Go avec MongoDB qui alimente le <strong>classement méta</strong>. Les données Pokémon viennent de <a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>, les stats d'usage de Smogon. Les 268 pages landing Pokémon et type sont pré-rendues au build et servies par nginx. Les équipes que tu construis sur le site sont envoyées <strong>anonymement</strong> (uniquement les IDs des espèces — pas de compte, pas d'IP stockée durablement) pour que le classement reflète le vrai usage. Les builds locaux restent dans le localStorage de ton navigateur. L'analytics, c'est Umami self-hosted (pas de cookie). Le code est MIT et <a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">sur GitHub</a> si tu veux forker.",
    sayHiTitle: "Dis bonjour",
    sayHiLead: "Bug, idée, typo, traduction pourrie, tout est bienvenu. Le plus simple :",
    thanks:
      "Merci à PokéAPI pour les données gratuites, à Smogon pour les stats d'usage, à Nintendo / Game Freak / The Pokémon Company pour les jeux qu'on adore, et à toi de lire jusqu'ici.",
  },
  es: {
    title: "¿Qué es esto?",
    intro:
      "<p>Hola, soy <strong>Eric</strong>, desarrollador independiente. PokeCounter es un proyecto personal, construido en un solo día como un pequeño reto.</p>" +
      "<p>La idea: pegas el equipo rival y la herramienta te dice qué Pokémon de tu propio equipo llevar. Simple y rápido. Alrededor hay una Pokédex completa, un simulador de combates, una calculadora de daño, un comparador, una tier list cruzada con las estadísticas de Smogon, y 9 idiomas. Todo en una SPA rápida respaldada por un pequeño servicio Go + MongoDB para el ranking meta en vivo.</p>" +
      "<p>Gratis, sin cuenta, sin anuncios, sin paywall — y así seguirá. ¿Bug, errata, idea? Abre un issue en GitHub (enlaces más abajo).</p>",
    otherTitle: "Mi otro proyecto",
    otherBody:
      "Si eres dev y necesitas mockear APIs rápidamente durante el desarrollo sin levantar un backend, echa un vistazo a <a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a>. Es mi herramienta para crear endpoints REST falsos en unos clics, con delay y escenarios de error. Gratis de usar.",
    stackTitle: "Cómo está hecho",
    stackBody:
      "Vite + React + TypeScript + Tailwind para el frontend, más un pequeño servicio Go con MongoDB que alimenta el <strong>ranking meta</strong>. Los datos Pokémon vienen de <a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>, las estadísticas de uso de Smogon. Las 268 páginas de Pokémon y tipos están pre-renderizadas en el build y servidas por nginx. Los equipos que construyes en el sitio se envían <strong>anónimamente</strong> (solo los IDs de las especies — sin cuenta, sin IP almacenada a largo plazo) para que el ranking refleje el uso real. Las builds locales permanecen en el localStorage de tu navegador. Analytics con Umami self-hosted (sin cookies). El código es MIT y <a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">está en GitHub</a> si quieres forkearlo.",
    sayHiTitle: "Saluda",
    sayHiLead: "Bug, idea, errata, traducción horrible — todo bienvenido. Lo más rápido:",
    thanks:
      "Gracias a PokéAPI por los datos gratuitos, a Smogon por las estadísticas de uso, a Nintendo / Game Freak / The Pokémon Company por los juegos que amamos, y a ti por leer hasta aquí.",
  },
  de: {
    title: "Was ist das?",
    intro:
      "<p>Hi, ich bin <strong>Eric</strong>, Indie-Entwickler. PokeCounter ist ein Privatprojekt, an einem einzigen Tag als kleine Challenge gebaut.</p>" +
      "<p>Die Idee: Du fügst das gegnerische Team ein, und das Tool sagt dir, welche Pokémon aus deinem eigenen Team du mitnehmen solltest. Einfach und schnell. Drumherum gibt es einen vollständigen Pokédex, einen Kampfsimulator, einen Schadensrechner, einen Vergleich, eine Tier List mit Smogon-Nutzungsdaten und 9 Sprachen. Alles in einer schnellen SPA, gestützt auf einen winzigen Go-+-MongoDB-Service für die Live-Meta-Rangliste.</p>" +
      "<p>Kostenlos, kein Account, keine Werbung, keine Paywall — und das bleibt so. Bug, Tippfehler, Idee? Öffne ein GitHub-Issue (Links unten).</p>",
    otherTitle: "Mein anderes Projekt",
    otherBody:
      "Wenn du Entwickler bist und während der Entwicklung schnell APIs mocken willst, ohne ein Backend hochzuziehen, schau dir <a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a> an. Das ist mein Tool, um in wenigen Klicks Fake-REST-Endpoints mit Delays und Fehlerszenarien aufzusetzen. Kostenlos nutzbar.",
    stackTitle: "Wie es gebaut ist",
    stackBody:
      "Vite + React + TypeScript + Tailwind fürs Frontend, dazu ein winziger Go-Service mit MongoDB, der die <strong>Meta-Rangliste</strong> antreibt. Pokémon-Daten kommen von <a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>, Nutzungsstatistiken von Smogon. Die 268 Pokémon- und Typen-Landing-Pages werden zur Buildzeit vorgerendert und von nginx ausgeliefert. Teams, die du auf der Seite baust, werden <strong>anonym</strong> übermittelt (nur Spezies-IDs — kein Account, keine dauerhaft gespeicherten IPs), damit die Rangliste die echte Nutzung widerspiegelt. Lokale Builds bleiben im localStorage deines Browsers. Analytics ist selbstgehostetes Umami (keine Cookies). Der Code ist MIT-lizenziert und <a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">auf GitHub</a>, falls du forken willst.",
    sayHiTitle: "Sag Hallo",
    sayHiLead: "Bug, Idee, Tippfehler, schreckliche Übersetzung — alles willkommen. Am schnellsten:",
    thanks:
      "Danke an PokéAPI für die kostenlosen Daten, an Smogon für die Nutzungsstatistiken, an Nintendo / Game Freak / The Pokémon Company für die Spiele, die wir lieben, und an dich fürs Lesen bis hierher.",
  },
  it: {
    title: "Cos'è questa cosa?",
    intro:
      "<p>Ciao, sono <strong>Eric</strong>, sviluppatore indipendente. PokeCounter è un progetto personale, costruito in una sola giornata come piccola sfida.</p>" +
      "<p>L'idea: incolli il team avversario e lo strumento ti dice quali Pokémon del tuo team portare. Semplice e veloce. Intorno c'è un Pokédex completo, un simulatore di lotte, un calcolatore di danno, un comparatore, una tier list incrociata con le statistiche Smogon, e 9 lingue. Tutto in una SPA veloce supportata da un piccolo servizio Go + MongoDB per la classifica meta in tempo reale.</p>" +
      "<p>Gratuito, senza account, senza pubblicità, senza paywall — e continuerà così. Bug, typo, idea? Apri una issue su GitHub (link sotto).</p>",
    otherTitle: "Il mio altro progetto",
    otherBody:
      "Se sei sviluppatore e hai bisogno di mockare API velocemente durante lo sviluppo senza tirare su un backend, dai un'occhiata a <a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a>. È il mio strumento per creare finti endpoint REST in pochi clic, con delay e scenari di errore. Gratuito all'uso.",
    stackTitle: "Come è fatto",
    stackBody:
      "Vite + React + TypeScript + Tailwind per il frontend, più un piccolo servizio Go con MongoDB che alimenta la <strong>classifica meta</strong>. I dati Pokémon vengono da <a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>, le statistiche d'uso da Smogon. Le 268 pagine landing Pokémon e tipi sono pre-renderizzate al momento del build e servite da nginx. I team che crei sul sito vengono inviati in modo <strong>anonimo</strong> (solo gli ID delle specie — nessun account, nessun IP salvato a lungo termine) perché la classifica rifletta l'uso reale. I build locali restano nel localStorage del tuo browser. Analytics è Umami self-hosted (niente cookie). Il codice è MIT e <a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">su GitHub</a> se vuoi forkarlo.",
    sayHiTitle: "Saluta",
    sayHiLead: "Bug, idea, typo, traduzione orribile — tutto benvenuto. Il modo più veloce:",
    thanks:
      "Grazie a PokéAPI per i dati gratuiti, a Smogon per le statistiche d'uso, a Nintendo / Game Freak / The Pokémon Company per i giochi che amiamo, e a te per aver letto fin qui.",
  },
  ja: {
    title: "これは何?",
    intro:
      "<p>こんにちは、<strong>Eric</strong>です。インディーデベロッパーです。PokeCounterは個人プロジェクトで、ちょっとしたチャレンジとして1日で作りました。</p>" +
      "<p>アイデア: 相手のチームを貼り付けると、自分のチームからどのポケモンを連れて行くべきかを教えてくれるツールです。シンプルで高速。周辺には完全なポケモン図鑑、バトルシミュレーター、ダメージ計算機、比較ツール、Smogon使用統計と連動したティアリスト、9言語対応があります。すべて、ライブのメタランキングのための小さな Go + MongoDB サービスに支えられた高速 SPA です。</p>" +
      "<p>無料、アカウント不要、広告なし、ペイウォールなし — これからもそうです。バグ、タイポ、アイデア? GitHubでissueを開いてください(リンクは下に)。</p>",
    otherTitle: "別のプロジェクト",
    otherBody:
      "もしあなたがデベロッパーで、開発中にバックエンドを立ち上げずにすばやくAPIをモックしたいなら、<a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a>をチェックしてください。数クリックで偽のRESTエンドポイントを作成できるツールで、遅延やエラーシナリオもサポート。無料で使えます。",
    stackTitle: "どう作られているか",
    stackBody:
      "フロントエンドはVite + React + TypeScript + Tailwind、加えて<strong>メタランキング</strong>を支える小さなGoサービスとMongoDB。ポケモンデータは<a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>から、使用統計はSmogonから。268のポケモンとタイプのランディングページはビルド時に事前レンダリングされ、nginxが配信します。サイト上で作成したチームは、ランキングが実際の使用を反映するように<strong>匿名で</strong>送信されます(種族IDのみ — アカウントなし、IPは長期保存しません)。ローカルのビルドはブラウザのlocalStorageに残ります。アナリティクスはセルフホストのUmami(クッキーなし)。コードはMITライセンスで、<a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub上</a>にあります。フォークしたい場合はどうぞ。",
    sayHiTitle: "ひとこと",
    sayHiLead: "バグ、アイデア、タイポ、ひどい翻訳 — なんでも歓迎。最速の方法:",
    thanks:
      "無料データを提供してくれるPokéAPI、使用統計を提供してくれるSmogon、私たちが愛するゲームを作ってくれるNintendo / Game Freak / 株式会社ポケモン、そしてここまで読んでくれたあなたに感謝します。",
  },
  ko: {
    title: "이게 뭐죠?",
    intro:
      "<p>안녕하세요, 저는 <strong>Eric</strong>입니다. 인디 개발자입니다. PokeCounter는 작은 챌린지로 하루 만에 만든 개인 프로젝트입니다.</p>" +
      "<p>아이디어: 상대 팀을 붙여넣으면 당신의 팀에서 어떤 포켓몬을 데려가야 할지 알려주는 도구입니다. 간단하고 빠릅니다. 주변에는 완전한 포켓몬 도감, 배틀 시뮬레이터, 데미지 계산기, 비교 도구, Smogon 사용 통계와 연동된 티어 리스트, 9개 언어가 있습니다. 모두 실시간 메타 랭킹을 위한 작은 Go + MongoDB 서비스가 뒷받침하는 빠른 SPA입니다.</p>" +
      "<p>무료, 계정 불필요, 광고 없음, 페이월 없음 — 앞으로도 그렇게 유지될 것입니다. 버그, 오타, 아이디어? GitHub에서 issue를 열어주세요(링크는 아래에).</p>",
    otherTitle: "저의 다른 프로젝트",
    otherBody:
      "개발자이고 개발 중에 백엔드를 띄우지 않고 빠르게 API를 모킹하고 싶다면 <a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a>를 확인해 보세요. 몇 번의 클릭으로 가짜 REST 엔드포인트를 만들 수 있는 도구로, 지연과 오류 시나리오도 지원합니다. 무료로 사용 가능합니다.",
    stackTitle: "어떻게 만들어졌나",
    stackBody:
      "프론트엔드는 Vite + React + TypeScript + Tailwind, 그리고 <strong>메타 랭킹</strong>을 지원하는 작은 Go 서비스와 MongoDB. 포켓몬 데이터는 <a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>에서, 사용 통계는 Smogon에서 옵니다. 268개의 포켓몬 및 타입 랜딩 페이지는 빌드 타임에 사전 렌더링되고 nginx가 제공합니다. 사이트에서 구성한 팀은 랭킹이 실제 사용을 반영하도록 <strong>익명으로</strong> 전송됩니다 (종 ID만 — 계정 없음, IP는 장기 저장되지 않음). 로컬 빌드는 브라우저의 localStorage에 남습니다. 분석은 셀프 호스팅 Umami(쿠키 없음)입니다. 코드는 MIT 라이선스이며 포크하고 싶다면 <a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub에서</a> 확인하세요.",
    sayHiTitle: "인사하기",
    sayHiLead: "버그, 아이디어, 오타, 끔찍한 번역 — 모두 환영합니다. 가장 빠른 방법:",
    thanks:
      "무료 데이터를 제공하는 PokéAPI, 사용 통계를 제공하는 Smogon, 우리가 사랑하는 게임을 만드는 Nintendo / Game Freak / The Pokémon Company, 그리고 여기까지 읽어준 당신에게 감사합니다.",
  },
  "zh-Hans": {
    title: "这是什么?",
    intro:
      "<p>你好，我是<strong>Eric</strong>，独立开发者。PokeCounter是一个个人项目，作为一个小挑战在一天内构建完成。</p>" +
      "<p>想法：你粘贴对手的队伍，工具会告诉你从自己的队伍中带哪些宝可梦。简单快速。周围有完整的宝可梦图鉴、战斗模拟器、伤害计算器、比较工具、与Smogon使用统计交叉引用的Tier列表，以及9种语言。所有这些都在一个快速的 SPA 中，背后有一个支持实时环境排行榜的小型 Go + MongoDB 服务。</p>" +
      "<p>免费，无需账户，无广告，无付费墙 — 而且将永远如此。Bug、错字、想法？在GitHub上打开issue（链接在下面）。</p>",
    otherTitle: "我的另一个项目",
    otherBody:
      "如果你是开发者，在开发过程中需要快速模拟API而不想启动后端，可以看看<a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a>。这是我的工具，几次点击就能创建假的REST端点，支持延迟和错误场景。免费使用。",
    stackTitle: "如何构建",
    stackBody:
      "前端采用 Vite + React + TypeScript + Tailwind，再加上一个支持<strong>环境排行榜</strong>的小型 Go 服务和 MongoDB。宝可梦数据来自<a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>，使用统计来自 Smogon。268 个宝可梦和属性登陆页在构建时预渲染并由 nginx 提供。你在网站上构建的队伍会<strong>匿名</strong>提交（仅种族 ID — 无账号，IP 不长期存储），以便排行榜反映真实使用情况。本地构建仍保留在浏览器的 localStorage 中。分析使用自托管的 Umami（无 cookie）。代码采用 MIT 许可证，如果你想 fork 的话，<a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">在 GitHub 上</a>。",
    sayHiTitle: "打个招呼",
    sayHiLead: "Bug、想法、错字、糟糕的翻译 — 都欢迎。最快的方式:",
    thanks:
      "感谢PokéAPI提供免费数据，感谢Smogon提供使用统计，感谢Nintendo / Game Freak / The Pokémon Company制作我们喜爱的游戏，感谢你读到这里。",
  },
  "zh-Hant": {
    title: "這是什麼?",
    intro:
      "<p>你好，我是<strong>Eric</strong>，獨立開發者。PokeCounter是一個個人專案，作為一個小挑戰在一天內建置完成。</p>" +
      "<p>想法：你貼上對手的隊伍，工具會告訴你從自己的隊伍中帶哪些寶可夢。簡單快速。周圍有完整的寶可夢圖鑑、戰鬥模擬器、傷害計算器、比較工具、與Smogon使用統計交叉引用的Tier清單，以及9種語言。所有這些都在一個快速的 SPA 中，背後有一個支援即時環境排行榜的小型 Go + MongoDB 服務。</p>" +
      "<p>免費，無需帳號，無廣告，無付費牆 — 而且將永遠如此。Bug、錯字、想法？在GitHub上開issue（連結在下面）。</p>",
    otherTitle: "我的另一個專案",
    otherBody:
      "如果你是開發者，在開發過程中需要快速模擬API而不想啟動後端，可以看看<a href=\"https://mockfast.io\" target=\"_blank\" rel=\"noopener noreferrer\">mockfast.io</a>。這是我的工具，幾次點擊就能建立假的REST端點，支援延遲和錯誤情境。免費使用。",
    stackTitle: "如何建置",
    stackBody:
      "前端採用 Vite + React + TypeScript + Tailwind，再加上一個支援<strong>環境排行榜</strong>的小型 Go 服務和 MongoDB。寶可夢資料來自<a href=\"https://pokeapi.co\" target=\"_blank\" rel=\"noopener noreferrer\">PokéAPI</a>，使用統計來自 Smogon。268 個寶可夢和屬性登陸頁在建置時預渲染並由 nginx 提供。你在網站上建立的隊伍會<strong>匿名</strong>提交（僅種族 ID — 無帳號，IP 不長期儲存），以便排行榜反映真實使用情況。本地建置仍保留在瀏覽器的 localStorage 中。分析使用自架的 Umami（無 cookie）。程式碼採用 MIT 授權，如果你想 fork 的話，<a href=\"" + GITHUB_REPO + "\" target=\"_blank\" rel=\"noopener noreferrer\">在 GitHub 上</a>。",
    sayHiTitle: "打個招呼",
    sayHiLead: "Bug、想法、錯字、糟糕的翻譯 — 都歡迎。最快的方式:",
    thanks:
      "感謝PokéAPI提供免費資料，感謝Smogon提供使用統計，感謝Nintendo / Game Freak / The Pokémon Company製作我們喜愛的遊戲，感謝你讀到這裡。",
  },
};

function Html({ html }: { html: string }) {
  return (
    <div
      className="space-y-4 [&_p]:text-sm [&_p]:font-mono [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:no-underline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function AboutPage({ onBack }: Props) {
  const { t, lang } = useLang();
  const c = L[lang] ?? L.en;

  return (
    <main className="container py-6 sm:py-10 max-w-2xl">
      <Button variant="outline" size="sm" onClick={onBack} className="mb-8">
        <ArrowLeft className="h-3 w-3" />
        {t("backToApp")}
      </Button>

      <header className="mb-10">
        <div className="inline-flex items-center gap-3">
          <span className="inline-block h-3 w-3 bg-primary rotate-45" aria-hidden />
          <h1 className="font-pixel text-2xl sm:text-3xl text-foreground">
            {c.title}
          </h1>
        </div>
      </header>

      <section className="mb-10">
        <Html html={c.intro} />
      </section>

      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">01</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            {c.otherTitle}
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-4" />
        <Html html={`<p>${c.otherBody}</p>`} />
      </section>

      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">02</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            {c.stackTitle}
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-4" />
        <Html html={`<p>${c.stackBody}</p>`} />
      </section>

      <section className="mb-10">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-pixel text-xl text-primary tabular-nums">03</span>
          <h2 className="font-pixel text-sm uppercase tracking-wider text-foreground">
            {c.sayHiTitle}
          </h2>
        </div>
        <div className="h-[2px] bg-foreground mb-4" />
        <p className="text-sm font-mono text-muted-foreground leading-relaxed mb-4">
          {c.sayHiLead}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              <Github className="h-3 w-3" />
              {t("viewSource")}
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={GITHUB_ISSUES} target="_blank" rel="noopener noreferrer">
              <Bug className="h-3 w-3" />
              {t("reportBug")}
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="https://mockfast.io" target="_blank" rel="noopener noreferrer">
              <Code2 className="h-3 w-3" />
              mockfast.io
            </a>
          </Button>
        </div>
      </section>

      <section className="mb-6">
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-start gap-3">
          <Coffee className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            {c.thanks}
          </p>
        </div>
      </section>
    </main>
  );
}
