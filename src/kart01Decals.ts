// Application layer (DES-0001): the decals of the Kart 01 — number plate and side sticker — painted on canvas and
// applied to the two decal materials. The only module of the model that touches the DOM; called by src/main.ts
// once after the model is built. The text is constant (the number 01 and the product name): nothing of the
// player or the environment enters, nothing is read back (no toDataURL, no pixel read).
import * as THREE from 'three';
import { KART01_NUMBER, type Kart01Model } from './kart01Model';

// Fallback font stack of the system; no @font-face, nothing downloaded.
const FONT = 'Archivo, "Arial Black", Impact, sans-serif';
const WHITE = '#FFFFFF';

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void): THREE.CanvasTexture | undefined {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return undefined;
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function chamferedPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: number): void {
  ctx.beginPath();
  ctx.moveTo(x + c, y);
  ctx.lineTo(x + w - c, y);
  ctx.lineTo(x + w, y + c);
  ctx.lineTo(x + w, y + h - c);
  ctx.lineTo(x + w - c, y + h);
  ctx.lineTo(x + c, y + h);
  ctx.lineTo(x, y + h - c);
  ctx.lineTo(x, y + c);
  ctx.closePath();
}

// Plate: the background is painted white and the material keeps the plate colour, so the displayed plate has
// exactly the colour of the kart sheet; the number takes the rubber colour (texturaPlaca of kart.js).
function plateTexture(palette: Kart01Model['palette']): THREE.CanvasTexture | undefined {
  return canvasTexture(512, 352, (ctx, w, h) => {
    ctx.fillStyle = WHITE;
    chamferedPath(ctx, 0, 0, w, h, 56);
    ctx.fill();
    ctx.fillStyle = palette.borracha;
    ctx.font = `italic 900 262px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(KART01_NUMBER, w / 2 + 6, h / 2 + 14);
  });
}

// Side sticker: dark slanted band with the product name and the number in a chamfered frame (texturaLateral).
function sidepodTexture(palette: Kart01Model['palette']): THREE.CanvasTexture | undefined {
  return canvasTexture(1024, 192, (ctx, w, h) => {
    ctx.fillStyle = palette.borracha;
    ctx.beginPath();
    ctx.moveTo(232, 0); ctx.lineTo(w, 0); ctx.lineTo(w - 44, h); ctx.lineTo(188, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = palette.placa;
    ctx.font = `italic 900 128px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('KARTLE', 262, h / 2 + 8);
    ctx.fillStyle = palette.placa;
    chamferedPath(ctx, 0, 0, 200, h, 34);
    ctx.fill();
    ctx.fillStyle = palette.borracha;
    ctx.font = `italic 900 136px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(KART01_NUMBER, 104, h / 2 + 8);
  });
}

// Paints both textures and assigns them; a repeated call replaces and disposes the previous ones. Without a 2D
// context the decals keep the material colour and no map; nothing throws, only the code is logged.
export function paintKart01Decals(model: Kart01Model): void {
  const plate = plateTexture(model.palette);
  const sidepod = sidepodTexture(model.palette);
  if (!plate || !sidepod) {
    plate?.dispose();
    sidepod?.dispose();
    console.warn('kart01-decals', 'NO_2D_CONTEXT');
    return;
  }
  for (const [material, texture] of [[model.materials.plate, plate], [model.materials.sidepod, sidepod]] as const) {
    material.map?.dispose();
    material.map = texture;
    material.needsUpdate = true;
  }
}
