// @ts-check
/// <reference path="./node_modules/@types/p5/global.d.ts" />

let saveFramesBool = false;
// saveFramesBool = true;
let saveStep = 180;
let nSaved;

let grid;
let next;

let dT = 1;
let dA = 1;
let dB = 0.5;
let feed = 0.055;
let k = 0.062;

function setup() {
  createCanvas(200, 200)
  resetSketch()
  console.log('Press SPACE to stop looping or r to reset.')
  pixelDensity(1);
}

function draw() {
  background(255)

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = grid[x][y].a
      let b = grid[x][y].b
      next[x][y].a = a + dT * (
        dA * laplace('a', x, y)
        - a * b * b
        + feed * (1 - a)
      );
      next[x][y].b = b + dT * (
        dB * laplace('b', x, y)
        + a * b * b
        - (k + feed) * b
      );
    }
  }

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let pix = (x + y * width) * 4
      let a = grid[x][y].a
      let b = grid[x][y].b
      let c = floor((a-b)*255);
      c = constrain(c, 0, 255);
      pixels[pix + 0] = c;
      pixels[pix + 1] = c;
      pixels[pix + 2] = c;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();

  swap();

  if (saveFramesBool && frameCount % saveStep == 2) {
    nSaved = saveNumberedFrame(nSaved);
  }
}

function randomWalker(xStart, yStart, nPts) {
  let stepRange = 10;
  let x = xStart;
  let y = yStart;
  beginShape()
  for (let i = 0; i < nPts; i++) {
    vertex(
      x + random(-stepRange, stepRange),
      y + random(-stepRange, stepRange)
    )
  }
  endShape()
}

function wonkyCircle(centerX, centerY, radius, nPts, noiseRange=10) {
  beginShape()
  for (let i = 0; i < nPts; i++) {
    let angle = map(i, 0, nPts, 0, TWO_PI); // Map index to angle
    let noiseOffset = random(-noiseRange, noiseRange);
    let x = centerX + cos(angle) * (radius + noiseOffset);
    let y = centerY + sin(angle) * (radius + noiseOffset);
    vertex(x, y);
  }
  endShape(CLOSE)
}

function laplace(chem, x, y) {
  // chem is the chemical name, either a or b
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      // Weight the diagonal elements less than the vertical and horizontal
      let weight;
      if (i == 0 && j == 0) {
        weight = -1
      } else if (abs(i + j) == 1) {
        weight = 0.2
      } else {
        weight = 0.05
      }
      sum += grid[(x+i+width)%width][(y+j+height)%height][chem] * weight;
    }
  }
  return sum;
}

function swap() {
  let temp = grid;
  grid = next;
  next = temp;
}

function resetSketch() {
  nSaved = 0;
  grid = [];
  next = [];
  for (let x = 0; x < width; x++) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < height; y++) {
      // @ts-ignore
      grid[x][y] = { a: 1, b: 0};
      // @ts-ignore
      next[x][y] = { a: 1, b: 0};
    }
  }

  background(255)
  stroke(0);
  fill(255)
  strokeWeight(2);
  wonkyCircle(width/2, height/2, 50, 20);

  loadPixels();
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let pix = (i + j * width) * 4
      if (pixels[pix] == 0) {
        // @ts-ignore
        grid[i][j].b = 1;
      }
    }
  }

}
