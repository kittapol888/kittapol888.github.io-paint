import { state, hexToRgb } from './state.js';
import { drawLine, drawRect, drawEllipse, putThickPixel } from './primitives.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let imageData = ctx.createImageData(canvas.width, canvas.height);

// รายการสีสำหรับ Palette คลาสสิก
const defaultColors = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#808040', '#004040', '#0080FF', '#004080', '#4000FF', '#804000',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'
];

function initCanvas() {
const container = document.querySelector('.canvas-area');
  
  // ปรับ Resolution ของ Canvas ให้เท่ากับขนาดหน้าจอจริงขณะนั้น
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  // สร้าง imageData ใหม่ตามขนาด Canvas
  imageData = ctx.createImageData(canvas.width, canvas.height);

    
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 255;
    imageData.data[i + 1] = 255;
    imageData.data[i + 2] = 255;
    imageData.data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

function getScaledMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: Math.floor((event.clientX - rect.left) * scaleX),
    y: Math.floor((event.clientY - rect.top) * scaleY)
  };
}

function setupUI() {
  // สลับเครื่องมือ
  const toolButtons = document.querySelectorAll('.toolbox button');
  toolButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      toolButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.currentTool = e.target.dataset.tool;
    });
  });

  // สร้าง Palette สี
  const paletteContainer = document.getElementById('palette');
  const currentColorDisplay = document.getElementById('currentColor');
  
  defaultColors.forEach(hex => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = hex;
    swatch.addEventListener('click', () => {
      state.color = hexToRgb(hex);
      currentColorDisplay.style.backgroundColor = hex;
    });
    paletteContainer.appendChild(swatch);
  });

  // ปรับความหนาเส้น
  const lineWidth = document.getElementById('lineWidth');
  const widthDisplay = document.getElementById('widthDisplay');
  lineWidth.addEventListener('input', (e) => {
    state.lineWidth = parseInt(e.target.value, 10);
    widthDisplay.textContent = `${state.lineWidth}px`;
  });
}

// ----------------------------------------------------
// ระบบ Events การวาด (ใช้โค้ดเดิมทั้งหมด)
// ----------------------------------------------------

canvas.addEventListener('mousedown', (e) => {
  state.isDrawing = true;
  const pos = getScaledMousePos(e);
  state.startX = pos.x;
  state.startY = pos.y;
  state.lastX = pos.x;
  state.lastY = pos.y;

  state.snapshot = new Uint8ClampedArray(imageData.data);

  if (state.currentTool === 'pencil' || state.currentTool === 'eraser') {
    const activeColor = state.currentTool === 'eraser' ? { r: 255, g: 255, b: 255, a: 255 } : state.color;
    putThickPixel(imageData, pos.x, pos.y, state.lineWidth, activeColor.r, activeColor.g, activeColor.b, activeColor.a);
    ctx.putImageData(imageData, 0, 0);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!state.isDrawing) return;
  const pos = getScaledMousePos(e);

  if (state.currentTool === 'pencil' || state.currentTool === 'eraser') {
    const activeColor = state.currentTool === 'eraser' ? { r: 255, g: 255, b: 255, a: 255 } : state.color;
    drawLine(imageData, state.lastX, state.lastY, pos.x, pos.y, state.lineWidth, activeColor.r, activeColor.g, activeColor.b, activeColor.a);
    state.lastX = pos.x;
    state.lastY = pos.y;
    ctx.putImageData(imageData, 0, 0);
  } else {
    imageData.data.set(state.snapshot);
    const c = state.color;
    if (state.currentTool === 'line') {
      drawLine(imageData, state.startX, state.startY, pos.x, pos.y, state.lineWidth, c.r, c.g, c.b, c.a);
    } else if (state.currentTool === 'rect') {
      drawRect(imageData, state.startX, state.startY, pos.x, pos.y, state.lineWidth, c.r, c.g, c.b, c.a);
    } else if (state.currentTool === 'ellipse') {
      drawEllipse(imageData, state.startX, state.startY, pos.x, pos.y, state.lineWidth, c.r, c.g, c.b, c.a);
    }
    ctx.putImageData(imageData, 0, 0);
  }
});

window.addEventListener('mouseup', () => {
  state.isDrawing = false;
});

initCanvas();
setupUI();