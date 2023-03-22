const canvas = document.querySelector('#canvas');

const WIDTH = 400; // Canvas width
const HEIGHT = 400; // Canvas height
let points;
let CENTER_DIST = 180; // Distance to the center
let CENTER_AMOUNT = 100; // Amount of center points
let RES = 10; // Space between points
let COLS = Math.round(1 + WIDTH / RES); // Amount of colums
let ROWS = Math.round(1 + HEIGHT / RES); // Amount of rows
let COLOR = false; // If true there's color
let PERSPECTIVE_3D = false; // If true show perspective in 3D
let z = null;

// Create centers for worley noise
const centers = [];
for (let i = 0; i < CENTER_AMOUNT; i++) {
  centers.push({ x: random(0, WIDTH), y: random(0, HEIGHT), z: random(0, WIDTH) });
}

createPoints();

function draw() {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    if (z !== null) {
      if (z == WIDTH) z = 0;
      else z++;
    }

    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        let distance = WIDTH + 1;

        for (let k = 0; k < CENTER_AMOUNT; k++) {
          const aux = dist({ x: i * RES, y: j * RES, z }, centers[k]);
          if (aux < distance) {
            distance = aux;
          }
        }

        points[i][j] = map(distance + CENTER_DIST, 0, WIDTH, 0, 1);
      }
    }

    ctx.strokeStyle = "black";
    for (let i = 0; i < COLS - 1; i++) {
      for (let j = 0; j < ROWS - 1; j++) {
        const x = i * RES;
        const y = j * RES;
        const half = RES / 2;
        // Points of the square
        const a = points[i][j];
        const b = points[i + 1][j];
        const c = points[i + 1][j + 1];
        const d = points[i][j + 1];

        const type = getType(
          Math.round(a), Math.round(b), Math.round(c), Math.round(d)
        );
        // Points in between vertices
        const linePoints = {
          top: { x: x + half, y },
          right: { x: x + RES, y: y + half },
          bot: { x: x + half, y: y + RES },
          left: { x, y: y + half }
        };

        chooseLine(ctx, type, linePoints);
      }
    }

    window.requestAnimationFrame(draw);
  }
}

draw();

// Utils functions
function createPoints() {
  // Create points for the lines
  points = new Array(COLS);
  for (let i = 0; i < COLS; i++) {
    points[i] = new Array(ROWS);
  }
}

function dist(point1, point2) {
  if (point1.z == null) {
    return Math.sqrt(
      (point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
  }
  return Math.sqrt(
    (point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2 + (point2.z - point1.z) ** 2);
}

function map(number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function line(ctx, point1, point2) {
  if (COLOR) {
    const clr = map(point1.y, 0, HEIGHT, 0, 255);
    ctx.strokeStyle = `rgba(${clr},${0},${0})`;
  }

  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
}

function getType(p1, p2, p3, p4) {
  return (p1 * 8) + (p2 * 4) + (p3 * 2) + p4;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
    9: () => line(ctx, linePoints.top, linePoints.bot), // types[6]()
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

// Config listeners
document.querySelector('.resolution').addEventListener('change', (e) => {
  RES = parseInt(e.target.value);
  COLS = Math.round(1 + WIDTH / RES);
  ROWS = Math.round(1 + HEIGHT / RES);
  createPoints();
});

document.querySelector('.generate').addEventListener('click', () => {
  for (let i = 0; i < CENTER_AMOUNT; i++) {
    centers[i] = ({ x: random(0, WIDTH), y: random(0, HEIGHT), z: random(0, WIDTH) });
  }
});

document.querySelector('.center-amount').addEventListener('change', (e) => {
  CENTER_AMOUNT = parseInt(e.target.value);
});

document.querySelector('.center-distance').addEventListener('change', (e) => {
  CENTER_DIST = parseInt(e.target.value);
});

document.querySelector('.color').addEventListener('click', () => COLOR = !COLOR);

document.querySelector('.perspective').addEventListener('click', () => {
  if (PERSPECTIVE_3D) z = null;
  else z = 0;
  PERSPECTIVE_3D = !PERSPECTIVE_3D;
});