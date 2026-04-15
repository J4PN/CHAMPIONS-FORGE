// Generate a share card PNG for a Pokémon Champions team.
// Supports two formats:
//   - "og":     1200×630 (Twitter / Discord / Facebook OG)
//   - "square": 1080×1080 (Instagram feed)
//
// Layout: title + subtitle at top, sprites (with Pokémon names underneath)
// centered both axes, single URL footer at bottom.

import type { Pokemon, PokemonType } from "./types";
import { spriteUrl } from "./pokemon";
import { pokemonName, type Lang } from "./i18n";

export type CardFormat = "og" | "square";

interface Dimensions {
  w: number;
  h: number;
  cols: number;
  rows: number;
  spriteSize: number;
  gap: number;
  nameSize: number;
  titleSize: number;
  subtitleSize: number;
  footerSize: number;
}

function dimensions(format: CardFormat): Dimensions {
  if (format === "square") {
    return {
      w: 1080,
      h: 1080,
      cols: 3,
      rows: 2,
      spriteSize: 220,
      gap: 32,
      nameSize: 20,
      titleSize: 52,
      subtitleSize: 22,
      footerSize: 30,
    };
  }
  // og 1200×630: 6 sprites in one row
  return {
    w: 1200,
    h: 630,
    cols: 6,
    rows: 1,
    spriteSize: 150,
    gap: 20,
    nameSize: 16,
    titleSize: 44,
    subtitleSize: 20,
    footerSize: 26,
  };
}

const TYPE_COLORS: Record<PokemonType, string> = {
  Normal: "#9FA19F",
  Fire: "#E62829",
  Water: "#2980EF",
  Electric: "#FAC000",
  Grass: "#3FA129",
  Ice: "#3DCEF3",
  Fighting: "#FF8000",
  Poison: "#9141CB",
  Ground: "#915121",
  Flying: "#81B9EF",
  Psychic: "#EF4179",
  Bug: "#91A119",
  Rock: "#AFA981",
  Ghost: "#704170",
  Dragon: "#5060E1",
  Dark: "#624D4E",
  Steel: "#60A1B8",
  Fairy: "#EF70EF",
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
}

interface Options {
  team: Pokemon[];
  title: string;
  subtitle: string;
  lang: Lang;
  format: CardFormat;
}

export async function generateShareCard(
  opts: Options,
): Promise<Blob | null> {
  const dim = dimensions(opts.format);
  const canvas = document.createElement("canvas");
  canvas.width = dim.w;
  canvas.height = dim.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // --- background ---
  const bg = ctx.createLinearGradient(0, 0, 0, dim.h);
  bg.addColorStop(0, "#fef6e4");
  bg.addColorStop(1, "#f7e7c2");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, dim.w, dim.h);

  // Subtle grid
  ctx.strokeStyle = "rgba(120, 80, 40, 0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < dim.w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, dim.h);
    ctx.stroke();
  }
  for (let y = 0; y < dim.h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(dim.w, y);
    ctx.stroke();
  }

  // Top/bottom border bars
  ctx.fillStyle = "#2b1810";
  ctx.fillRect(0, 0, dim.w, 6);
  ctx.fillRect(0, dim.h - 6, dim.w, 6);

  // --- title + subtitle (top, centered) ---
  const titleY = dim.h * 0.08;
  ctx.fillStyle = "#2b1810";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = `bold ${dim.titleSize}px 'Press Start 2P', monospace, system-ui`;
  ctx.fillText(opts.title, dim.w / 2, titleY);

  ctx.fillStyle = "#6b4e2e";
  ctx.font = `${dim.subtitleSize}px monospace`;
  ctx.fillText(opts.subtitle, dim.w / 2, titleY + dim.titleSize + 14);

  // --- team grid (centered both axes in remaining space) ---
  const topUsed = titleY + dim.titleSize + 14 + dim.subtitleSize + 20;
  const footerUsed = dim.footerSize + 40;
  const availableH = dim.h - topUsed - footerUsed;

  const teamCount = Math.min(6, opts.team.length);
  const rows = Math.ceil(teamCount / dim.cols);
  const cellH = dim.spriteSize + dim.nameSize + 18;
  const gridH = rows * cellH + (rows - 1) * dim.gap;
  const gridY = topUsed + (availableH - gridH) / 2;

  const images = await Promise.all(
    opts.team
      .slice(0, 6)
      .map((p) => loadImage(spriteUrl(p)).catch(() => null)),
  );

  for (let i = 0; i < teamCount; i++) {
    const pokemon = opts.team[i];
    const col = i % dim.cols;
    const row = Math.floor(i / dim.cols);

    // Count Pokémon in this row to center it horizontally
    const rowStart = row * dim.cols;
    const rowCount = Math.min(dim.cols, teamCount - rowStart);
    const rowWidth =
      rowCount * dim.spriteSize + (rowCount - 1) * dim.gap;
    const rowX = (dim.w - rowWidth) / 2;

    const x = rowX + col * (dim.spriteSize + dim.gap);
    const y = gridY + row * (cellH + dim.gap);

    // Sprite card
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, dim.spriteSize, dim.spriteSize);
    ctx.strokeStyle = "#2b1810";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, dim.spriteSize, dim.spriteSize);

    const img = images[i];
    if (img) {
      ctx.imageSmoothingEnabled = false;
      const pad = 10;
      ctx.drawImage(
        img,
        x + pad,
        y + pad,
        dim.spriteSize - pad * 2,
        dim.spriteSize - pad * 2,
      );
    }

    // Type bars at bottom of sprite card
    const types = pokemon.types;
    const barH = 10;
    for (let j = 0; j < types.length; j++) {
      ctx.fillStyle = TYPE_COLORS[types[j]] ?? "#999";
      const barW = dim.spriteSize / types.length;
      ctx.fillRect(x + j * barW, y + dim.spriteSize - barH, barW, barH);
    }

    // Pokémon name under the sprite (localized)
    ctx.fillStyle = "#2b1810";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.font = `bold ${dim.nameSize}px monospace`;
    const name = pokemonName(pokemon, opts.lang);
    // Truncate if it would overflow the cell
    const maxW = dim.spriteSize + dim.gap * 0.6;
    let displayName = name;
    if (ctx.measureText(displayName).width > maxW) {
      while (
        displayName.length > 3 &&
        ctx.measureText(displayName + "…").width > maxW
      ) {
        displayName = displayName.slice(0, -1);
      }
      displayName += "…";
    }
    ctx.fillText(
      displayName,
      x + dim.spriteSize / 2,
      y + dim.spriteSize + 10,
    );
  }

  // --- footer: single URL, centered ---
  ctx.fillStyle = "#2b1810";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.font = `bold ${dim.footerSize}px 'Press Start 2P', monospace`;
  ctx.fillText("POKECOUNTER.APP", dim.w / 2, dim.h - 22);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
  });
}
