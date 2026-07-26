// วาด Pixel เดี่ยว
export function putPixel(imageData, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= imageData.width || y < 0 || y >= imageData.height) return;
  const idx = (y * imageData.width + x) * 4;
  imageData.data[idx] = r;
  imageData.data[idx + 1] = g;
  imageData.data[idx + 2] = b;
  imageData.data[idx + 3] = a;
}

// วาด Pixel แบบมีความหนา (หัวแปรงทรงกลม)
export function putThickPixel(imageData, cx, cy, thickness, r, g, b, a = 255) {
  const radius = Math.floor(thickness / 2);
  if (radius <= 0) {
    putPixel(imageData, cx, cy, r, g, b, a);
    return;
  }
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy <= radius * radius) {
        putPixel(imageData, cx + dx, cy + dy, r, g, b, a);
      }
    }
  }
}

// วาดเส้นตรง (Bresenham's Line Algorithm)
export function drawLine(imageData, x1, y1, x2, y2, thickness, r, g, b, a = 255) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  let x = x1;
  let y = y1;

  while (true) {
    putThickPixel(imageData, x, y, thickness, r, g, b, a);
    if (x === x2 && y === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
}

// วาดสี่เหลี่ยม
export function drawRect(imageData, x1, y1, x2, y2, thickness, r, g, b, a = 255) {
  drawLine(imageData, x1, y1, x2, y1, thickness, r, g, b, a); // บน
  drawLine(imageData, x2, y1, x2, y2, thickness, r, g, b, a); // ขวา
  drawLine(imageData, x2, y2, x1, y2, thickness, r, g, b, a); // ล่าง
  drawLine(imageData, x1, y2, x1, y1, thickness, r, g, b, a); // ซ้าย
}

// วาดวงรี / วงกลม (Parametric Ellipse)
export function drawEllipse(imageData, x1, y1, x2, y2, thickness, r, g, b, a = 255) {
  const cx = Math.floor((x1 + x2) / 2);
  const cy = Math.floor((y1 + y2) / 2);
  const rx = Math.abs(Math.floor((x2 - x1) / 2));
  const ry = Math.abs(Math.floor((y2 - y1) / 2));

  if (rx === 0 && ry === 0) {
    putThickPixel(imageData, cx, cy, thickness, r, g, b, a);
    return;
  }

  const step = 1 / Math.max(rx, ry, 1);
  for (let angle = 0; angle < Math.PI * 2; angle += step) {
    const x = Math.round(cx + rx * Math.cos(angle));
    const y = Math.round(cy + ry * Math.sin(angle));
    putThickPixel(imageData, x, y, thickness, r, g, b, a);
  }
}