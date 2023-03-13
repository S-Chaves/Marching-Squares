const canvas = document.querySelector('#canvas');

const WIDTH = 400;
const HEIGHT = 400;
const RES = 10;
const COLS = 1 + WIDTH / RES;
const ROWS = 1 + HEIGHT / RES;

const points = new Array(COLS);
for (let i = 0; i < COLS; i++) {
  points[i] = new Array(ROWS);
  for (let j = 0; j < ROWS; j++) {
    points[i][j] = Math.random() < 0.5 ? 1 : 0; // Random value
  }
}

function draw() {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "orange";
    for (let i = 0; i < COLS - 1; i++) {
      for (let j = 0; j < ROWS - 1; j++) {
        const value = points[i][j];
        const x = i * RES;
        const y = j * RES;
        const half = RES / 2;

        const linePoints = {
          top: { x: x + half, y },
          right: { x: x + RES, y: y + half },
          bot: { x: x + half, y: y + RES },
          left: { x, y: y + half }
        };

        const type = getType(
          points[i][j], points[i + 1][j], points[i + 1][j + 1], points[i][j + 1]
        );

        chooseLine(ctx, type, linePoints);
      }
    }

    // window.requestAnimationFrame(draw);
  }
}

draw();

// Utils functions
function line(ctx, point1, point2) {
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
}

function getType(p1, p2, p3, p4) {
  return (p1 * 8) + (p2 * 4) + (p3 * 2) + p4;
}

function chooseLine(ctx, type, linePoints) {
  const types = {
    1: () => line(ctx, linePoints.left, linePoints.bot),
    2: () => line(ctx, linePoints.right, linePoints.bot),
    3: () => line(ctx, linePoints.left, linePoints.right),
    4: () => line(ctx, linePoints.top, linePoints.right),
    6: () => line(ctx, linePoints.top, linePoints.bot),
    7: () => line(ctx, linePoints.left, linePoints.top),
    8: () => line(ctx, linePoints.left, linePoints.top), // types[7]()
    9: () => line(ctx, linePoints.left, linePoints.top), // types[6]()
    11: () => line(ctx, linePoints.top, linePoints.right), // types[4]()
    12: () => line(ctx, linePoints.left, linePoints.right), // types[3]()
    13: () => line(ctx, linePoints.right, linePoints.bot), // types[2]()
    14: () => line(ctx, linePoints.left, linePoints.bot), // types[1]()
    5: () => {
      line(ctx, linePoints.left, linePoints.top);
      line(ctx, linePoints.bot, linePoints.right);
    },
    10: () => {
      line(ctx, linePoints.left, linePoints.bot);
      line(ctx, linePoints.top, linePoints.right);
    },
  };

  if (type in types) {
    types[type]();
  }
}