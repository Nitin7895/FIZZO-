// 📖 Docs: obsidian/frontend/webgl-scenes.md

/**
 * Canvas-drawn textures for the can: the printed label (with fruit art), the
 * condensation maps, and the fruit skins. Everything is drawn at runtime, so
 * there are no image files to download.
 */

import * as THREE from "three";

import { flavorById, type FlavorId } from "@/data/flavors";

const LABEL_W = 2048;
const LABEL_H = 1024;
const SANS = "'Arial Black', 'Helvetica Neue', Impact, sans-serif";

const canvasOf = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  return { canvas, ctx };
};

const ball = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  light: string,
  dark: string,
) => {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, light);
  g.addColorStop(1, dark);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.2, r * 0.12, -0.6, 0, Math.PI * 2);
  ctx.fill();
};

const leaf = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "#2f9a3f";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(size * 0.5, -size * 0.55, size, 0);
  ctx.quadraticCurveTo(size * 0.5, size * 0.55, 0, 0);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size * 0.9, 0);
  ctx.stroke();
  ctx.restore();
};

const drawFruitArt = (ctx: CanvasRenderingContext2D, id: FlavorId, cx: number, cy: number) => {
  switch (id) {
    case "blueberry":
      leaf(ctx, cx + 40, cy - 130, 150, -0.9);
      ball(ctx, cx - 120, cy + 20, 112, "#7d8dff", "#1d2a8c");
      ball(ctx, cx + 85, cy + 55, 126, "#8a99ff", "#1a2580");
      ball(ctx, cx - 5, cy - 55, 96, "#6f7fff", "#222f96");
      break;
    case "lime": {
      ball(ctx, cx + 120, cy + 70, 120, "#d6ff7a", "#3f9a1c");
      ctx.save();
      ctx.translate(cx - 70, cy);
      ctx.fillStyle = "#2f8f2a";
      ctx.beginPath();
      ctx.arc(0, 0, 170, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#eaf7c4";
      ctx.beginPath();
      ctx.arc(0, 0, 152, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 9; i += 1) {
        ctx.fillStyle = i % 2 ? "#b9e04a" : "#a6d63a";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 138, (i / 9) * Math.PI * 2 + 0.06, ((i + 1) / 9) * Math.PI * 2 - 0.06);
        ctx.fill();
      }
      ctx.restore();
      break;
    }
    case "cherry":
      ctx.strokeStyle = "#3f7a28";
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(cx - 90, cy + 30);
      ctx.quadraticCurveTo(cx - 40, cy - 190, cx + 20, cy - 215);
      ctx.moveTo(cx + 100, cy + 50);
      ctx.quadraticCurveTo(cx + 70, cy - 170, cx + 20, cy - 215);
      ctx.stroke();
      leaf(ctx, cx + 20, cy - 215, 130, -0.2);
      ball(ctx, cx - 90, cy + 70, 118, "#ff6479", "#a30f2b");
      ball(ctx, cx + 100, cy + 95, 126, "#ff6f82", "#9b0b27");
      break;
    case "mango": {
      const g = ctx.createLinearGradient(cx - 130, cy - 120, cx + 150, cy + 150);
      g.addColorStop(0, "#ffd34a");
      g.addColorStop(0.55, "#ff9a1f");
      g.addColorStop(1, "#e2441a");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, 150, 190, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.ellipse(cx - 55, cy - 45, 30, 70, -0.5, 0, Math.PI * 2);
      ctx.fill();
      leaf(ctx, cx + 20, cy - 160, 170, -0.7);
      break;
    }
    case "grape": {
      leaf(ctx, cx + 10, cy - 190, 160, -0.55);
      const spots: [number, number][] = [
        [-90, -60], [0, -75], [90, -60], [-45, 20], [45, 20], [0, 100], [-130, 15], [130, 15],
      ];
      for (const [dx, dy] of spots) ball(ctx, cx + dx, cy + dy, 74, "#b886ff", "#4a1796");
      break;
    }
    default:
      break;
  }
};

/** The printed wrap: wordmark, fruit art, zero-sugar badge, back-of-can panel. */
export const drawLabel = (id: FlavorId): THREE.CanvasTexture => {
  const { colors, name } = (() => {
    const flavor = flavorById(id);
    return { colors: flavor.scene, name: flavor.name };
  })();
  const { canvas, ctx } = canvasOf(LABEL_W, LABEL_H);

  const base = ctx.createLinearGradient(0, 0, 0, LABEL_H);
  base.addColorStop(0, colors.can);
  base.addColorStop(1, colors.canDeep);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, LABEL_W, LABEL_H);

  // Bold diagonal colour block
  ctx.fillStyle = colors.stripe;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(0, LABEL_H * 0.78);
  ctx.lineTo(LABEL_W, LABEL_H * 0.5);
  ctx.lineTo(LABEL_W, LABEL_H);
  ctx.lineTo(0, LABEL_H);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Top and bottom ticker bands
  ctx.fillStyle = colors.canDeep;
  ctx.fillRect(0, 0, LABEL_W, 96);
  ctx.fillRect(0, LABEL_H - 70, LABEL_W, 70);
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 46px ${SANS}`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const ticker = "ZERO SUGAR  ●  REAL FRUIT  ●  SPARKLING  ●  ";
  for (let x = -20; x < LABEL_W; x += ctx.measureText(ticker).width) ctx.fillText(ticker, x, 50);
  ctx.fillStyle = colors.canDeep;
  ctx.font = `900 40px ${SANS}`;
  ctx.fillText("350 ML  ●  FIZZO BEVERAGE CO.  ●  FIZZO BEVERAGE CO.  ●  350 ML", 40, LABEL_H - 34);

  // Wordmark with a hard drop shadow, slightly skewed — printed, not glowing
  const cx = LABEL_W / 2;
  ctx.save();
  ctx.translate(cx, 330);
  ctx.transform(1, 0, -0.14, 1, 0, 0);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = `900 330px ${SANS}`;
  ctx.fillStyle = colors.canDeep;
  ctx.fillText("FIZZO", 14, 14);
  ctx.lineWidth = 16;
  ctx.strokeStyle = colors.canDeep;
  ctx.strokeText("FIZZO", 0, 0);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("FIZZO", 0, 0);
  ctx.restore();

  // Flavor name
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = `900 96px ${SANS}`;
  ctx.fillText(name.toUpperCase(), cx - 270, 460);

  drawFruitArt(ctx, id, cx + 330, 690);

  // "0 sugar" seal
  ctx.save();
  ctx.translate(cx - 400, 700);
  ctx.rotate(-0.2);
  ctx.fillStyle = colors.canDeep;
  ctx.beginPath();
  ctx.arc(0, 0, 118, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 140px ${SANS}`;
  ctx.fillText("0", 0, 36);
  ctx.font = `900 34px ${SANS}`;
  ctx.fillText("SUGAR", 0, 84);
  ctx.restore();

  // Back-of-can panel straddles the seam (x = 0 / LABEL_W)
  const panel = (x: number) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, 150, 300, 640);
    ctx.fillStyle = "#101010";
    ctx.font = `900 36px ${SANS}`;
    ctx.textAlign = "left";
    ctx.fillText("Nutrition", x + 20, 200);
    ctx.fillRect(x + 20, 214, 260, 6);
    ctx.font = `700 28px ${SANS}`;
    ["Calories 0", "Sugar 0 g", "Fat 0 g", "Sodium 10 mg"].forEach((line, i) =>
      ctx.fillText(line, x + 20, 262 + i * 44),
    );
    for (let i = 0; i < 38; i += 1) {
      ctx.fillRect(x + 24 + i * 6.7, 520, i % 3 === 0 ? 5 : 2.6, 220);
    }
  };
  panel(LABEL_W - 150);
  panel(-150);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

/** Droplets + streaks: used as bump (relief) and, inverted, as roughness (shine). */
export const drawCondensation = (): { bump: THREE.CanvasTexture; rough: THREE.CanvasTexture } => {
  const w = 1024;
  const h = 512;
  const bump = canvasOf(w, h);
  const rough = canvasOf(w, h);
  bump.ctx.fillStyle = "#000";
  bump.ctx.fillRect(0, 0, w, h);
  rough.ctx.fillStyle = "rgb(105,105,105)";
  rough.ctx.fillRect(0, 0, w, h);

  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 520; i += 1) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = 1.6 + Math.pow(rnd(), 2.8) * 8;
    const streak = rnd() < 0.18 ? r * (3 + rnd() * 7) : 0;
    for (const target of [bump.ctx, rough.ctx]) {
      const isBump = target === bump.ctx;
      const g = target.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, isBump ? "rgba(255,255,255,1)" : "rgba(8,8,8,1)");
      g.addColorStop(0.7, isBump ? "rgba(170,170,170,0.9)" : "rgba(20,20,20,0.9)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      target.fillStyle = g;
      target.beginPath();
      target.ellipse(x, y + streak * 0.5, r, r + streak, 0, 0, Math.PI * 2);
      target.fill();
    }
  }
  const make = (canvas: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 1);
    return t;
  };
  return { bump: make(bump.canvas), rough: make(rough.canvas) };
};

/** A fruit skin: gradient with fine speckle ("bloom"). */
export const drawSkin = (light: string, dark: string, speckle: string): THREE.CanvasTexture => {
  const { canvas, ctx } = canvasOf(256, 256);
  const g = ctx.createLinearGradient(0, 0, 256, 256);
  g.addColorStop(0, light);
  g.addColorStop(1, dark);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = speckle;
  for (let i = 0; i < 700; i += 1) {
    ctx.globalAlpha = 0.05 + ((i * 7) % 10) / 70;
    ctx.beginPath();
    ctx.arc((i * 97) % 256, (i * 53 + ((i * i) % 29)) % 256, 0.6 + ((i * 3) % 3), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/** A lime wheel's cut face. */
export const drawLimeFace = (): THREE.CanvasTexture => {
  const { canvas, ctx } = canvasOf(512, 512);
  ctx.fillStyle = "#2f8f2a";
  ctx.beginPath();
  ctx.arc(256, 256, 256, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f3f9d8";
  ctx.beginPath();
  ctx.arc(256, 256, 236, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 10; i += 1) {
    const a0 = (i / 10) * Math.PI * 2 + 0.05;
    const a1 = ((i + 1) / 10) * Math.PI * 2 - 0.05;
    const g = ctx.createRadialGradient(256, 256, 20, 256, 256, 215);
    g.addColorStop(0, "#d9ec7a");
    g.addColorStop(1, "#9fd23a");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(256, 256);
    ctx.arc(256, 256, 215, a0, a1);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  for (let i = 0; i < 60; i += 1) {
    ctx.beginPath();
    ctx.arc(256 + Math.cos(i * 2.4) * (30 + (i % 7) * 26), 256 + Math.sin(i * 2.4) * (30 + (i % 7) * 26), 4, 0, Math.PI * 2);
    ctx.fill();
  }
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
