const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// PNG file builder from raw RGBA buffer
function createPNG(width, height, getPixel) {
  // RGBA buffer with 1 filter byte per row
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type (RGBA)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([length, typeAndData, crc]);
}

// CRC32 implementation
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Color generation for Ebundi Gradient & Icon shape
function ebundiPixel(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;

  // Diagonal gradient: #E11D48 -> #E67E22
  const t = (nx + ny) / 2;
  let bgR = Math.round(225 + (230 - 225) * t);
  let bgG = Math.round(29 + (126 - 29) * t);
  let bgB = Math.round(72 + (34 - 72) * t);

  // For regular icons, add rounded corners (squircle). For maskable, fill full frame.
  if (!isMaskable) {
    const cornerRadius = 0.25;
    const cx = Math.max(cornerRadius, Math.min(1 - cornerRadius, nx));
    const cy = Math.max(cornerRadius, Math.min(1 - cornerRadius, ny));
    const dist = Math.hypot(nx - cx, ny - cy);
    if (dist > cornerRadius) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }
  }

  // Draw bag outline / 'e' shape in center
  const scale = isMaskable ? 0.7 : 0.85;
  const px = (nx - 0.5) / scale + 0.5;
  const py = (ny - 0.5) / scale + 0.5;

  // Bag handle
  const handleX = (px - 0.5) * 2;
  const handleY = py - 0.28;
  const handleDist = Math.hypot(handleX, handleY);
  if (py < 0.35 && handleDist > 0.16 && handleDist < 0.25) {
    return [255, 255, 255, 255];
  }

  // Bag body trapezoid
  if (py >= 0.33 && py <= 0.76) {
    const bagHalfWidth = 0.32 - (0.76 - py) * 0.05;
    if (Math.abs(px - 0.5) <= bagHalfWidth) {
      // Inside Bag - Draw Letter 'E' or brand accent in Rose
      const ex = px - 0.5;
      const ey = py - 0.55;
      const eDist = Math.hypot(ex, ey);

      // Letter 'e' arc & bar
      const inEArc = (eDist > 0.08 && eDist < 0.15 && (ex < 0 || ey < 0.08));
      const inEBar = (Math.abs(ey) < 0.03 && ex >= -0.12 && ex <= 0.14);

      if (inEArc || inEBar) {
        return [225, 29, 72, 255]; // Rose inside
      }
      return [255, 255, 255, 255]; // White bag
    }
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192, 512, maskable 192, maskable 512, and apple-touch-icon
const icons = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

icons.forEach(({ name, size, maskable }) => {
  const buf = createPNG(size, size, (x, y, w, h) => ebundiPixel(x, y, w, h, maskable));
  fs.writeFileSync(path.join(publicDir, name), buf);
  console.log(`Generated ${name} (${size}x${size}, ${buf.length} bytes)`);
});
