import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { Buffer } from "node:buffer";

const root = path.resolve(import.meta.dirname, "..");
const iconsetDir = path.join(root, "build", "icon.iconset");

const pngTargets = [
  ["icon_16x16.png", 16],
  ["icon_16x16@2x.png", 32],
  ["icon_32x32.png", 32],
  ["icon_32x32@2x.png", 64],
  ["icon_128x128.png", 128],
  ["icon_128x128@2x.png", 256],
  ["icon_256x256.png", 256],
  ["icon_256x256@2x.png", 512],
  ["icon_512x512.png", 512],
  ["icon_512x512@2x.png", 1024]
];

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function insideRoundedRect(x, y, rectX, rectY, rectW, rectH, radius) {
  const right = rectX + rectW;
  const bottom = rectY + rectH;
  const cornerX = x < rectX + radius ? rectX + radius : x > right - radius ? right - radius : x;
  const cornerY = y < rectY + radius ? rectY + radius : y > bottom - radius ? bottom - radius : y;
  return (x - cornerX) ** 2 + (y - cornerY) ** 2 <= radius ** 2;
}

function paintRect(pixels, size, rect, color) {
  const [rectX, rectY, rectW, rectH, radius] = rect;
  for (let y = Math.floor(rectY); y < Math.ceil(rectY + rectH); y += 1) {
    for (let x = Math.floor(rectX); x < Math.ceil(rectX + rectW); x += 1) {
      if (x < 0 || y < 0 || x >= size || y >= size) {
        continue;
      }
      if (!insideRoundedRect(x + 0.5, y + 0.5, rectX, rectY, rectW, rectH, radius)) {
        continue;
      }

      const index = (y * size + x) * 4;
      pixels[index] = color[0];
      pixels[index + 1] = color[1];
      pixels[index + 2] = color[2];
      pixels[index + 3] = color[3];
    }
  }
}

function drawIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const bg = [15, 143, 125, 255];
  const keyboard = [28, 33, 39, 255];
  const key = [247, 248, 251, 255];

  paintRect(pixels, size, [size * 0.08, size * 0.08, size * 0.84, size * 0.84, size * 0.2], bg);
  paintRect(pixels, size, [size * 0.18, size * 0.27, size * 0.64, size * 0.46, size * 0.09], keyboard);

  const gap = size * 0.025;
  const keyW = size * 0.115;
  const keyH = size * 0.085;
  const row1Y = size * 0.36;
  const row2Y = size * 0.49;
  const startX = size * 0.25;

  for (let i = 0; i < 4; i += 1) {
    paintRect(pixels, size, [startX + i * (keyW + gap), row1Y, keyW, keyH, size * 0.018], key);
  }

  paintRect(pixels, size, [size * 0.27, row2Y, size * 0.18, keyH, size * 0.018], key);
  paintRect(pixels, size, [size * 0.48, row2Y, size * 0.25, keyH, size * 0.018], key);
  paintRect(pixels, size, [size * 0.33, size * 0.62, size * 0.34, keyH, size * 0.018], key);

  return pixels;
}

function pngBuffer(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const pixels = drawIcon(size);
  const scanlines = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (size * 4 + 1);
    scanlines[rowStart] = 0;
    pixels.copy(scanlines, rowStart + 1, y * size * 4, (y + 1) * size * 4);
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

fs.rmSync(iconsetDir, { recursive: true, force: true });
fs.mkdirSync(iconsetDir, { recursive: true });

for (const [fileName, size] of pngTargets) {
  fs.writeFileSync(path.join(iconsetDir, fileName), pngBuffer(size));
}
