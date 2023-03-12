const canvas = document.querySelector('#canvas');

const WIDTH = 400;
const HEIGHT = 400;
const RES = 10;
const COLS = WIDTH / RES;
const ROWS = HEIGHT / RES;

const points = [];
for (let i = 0; i < COLS; i++) {
  const row = [];
  for (let j = 0; j < ROWS; j++) {
    const x = Math.random < 0.5 ? 1 : 0;
    const y = Math.random < 0.5 ? 1 : 0;
    row.push({ x, y });
  }
  points.push(row);
}

function draw() {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "orange";
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        ctx.fillRect(i * RES, j * RES, 2, 2);
      }
    }

    // window.requestAnimationFrame(draw);
  }
}

draw();