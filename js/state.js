export const state = {
  currentTool: 'pencil',
  color: { r: 0, g: 0, b: 0, a: 255 },
  lineWidth: 1,
  isDrawing: false,
  startX: 0,
  startY: 0,
  lastX: 0,
  lastY: 0,
  snapshot: null
};

// แปลง Hex Color (#RRGGBB) เป็น RGB Object
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 255
  } : { r: 0, g: 0, b: 0, a: 255 };
}