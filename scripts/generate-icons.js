const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// Helper to write a uncompressed/deflated RGBA PNG
function createPng(width, height, drawFn) {
  const bytesPerPixel = 4;
  const rowSize = width * bytesPerPixel;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // filter type 0: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 72, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = createChunk("IHDR", ihdr);
  const idatChunk = createChunk("IDAT", deflated);
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(12 + length);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4);
  data.copy(buffer, 8);
  const crc = crc32(buffer.subarray(4, 8 + length));
  buffer.writeUInt32BE(crc >>> 0, 8 + length);
  return buffer;
}

// CRC32 implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

// Draw function: Luxury Gold badge on cream background with border
function drawBadge(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = w * 0.44;
  const dist = Math.hypot(x - cx, y - cy);

  // Background: #FAFAF8 -> (250, 250, 248)
  // Gold: #C5A467 -> (197, 164, 103)
  // Dark text: #181818 -> (24, 24, 24)

  // Outer border ring
  if (Math.abs(dist - r) < w * 0.02) {
    return [197, 164, 103, 255]; // Gold ring
  }

  // Inner fill
  if (dist < r) {
    // Inside badge: dark charcoal/black luxury background
    // with gold geometric diamond in center
    const innerDist = Math.abs(x - cx) + Math.abs(y - cy);
    if (innerDist < w * 0.22 && innerDist > w * 0.18) {
      return [216, 190, 131, 255]; // Light gold diamond accent
    }
    return [24, 24, 24, 255]; // Deep luxury charcoal
  }

  return [250, 250, 248, 255]; // Warm cream
}

const iconsDir = path.join(__dirname, "../public/icons");
fs.writeFileSync(path.join(iconsDir, "icon-192.png"), createPng(192, 192, drawBadge));
fs.writeFileSync(path.join(iconsDir, "icon-512.png"), createPng(512, 512, drawBadge));
console.log("Icons generated successfully!");
