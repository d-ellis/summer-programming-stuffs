let subject;
const circles = [];
const width = 1280;
const height = 720;
const startingRadius = 1;

class Circle {
  constructor(x, y, r = startingRadius) {
    this.xPos = x;
    this.yPos = y;
    this.r = r;
    this.colour = getColour(x, y);
    this.maxSize = false;
    this.growRate = Math.random() * 2;
  }

  draw() {
    const ctx = subject.getContext('2d');
    ctx.strokeStyle = this.colour;
    ctx.fillStyle = this.colour;
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.r, 0, 2*Math.PI);
    //ctx.globalAlpha = .8;
    //ctx.stroke();
    ctx.globalAlpha = .75;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  grow() {
    if (this.maxSize) return;

    // Check if at border
    const hitTop = this.yPos - (this.r + this.growRate) <= 0;
    const hitBottom = this.yPos + (this.r + this.growRate) >= height;
    const hitLeft = this.xPos - (this.r + this.growRate) <= 0;
    const hitRight = this.xPos + (this.r + this.growRate) >= width;
    if (hitTop || hitBottom || hitLeft || hitRight) {
      this.maxSize = true;
      return;
    }

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      if (this.xPos === circle.xPos && this.yPos === circle.yPos) continue;
      const dist = getDist(circle.xPos, circle.yPos, this.xPos, this.yPos);
      // If new circle wall falls within other circle, then not valid
      if (dist <= circle.r + this.r + this.growRate - 1) {
        this.maxSize = true;
        return;
      }
    }
    this.r += this.growRate;
  }
}

function start() {
  subject = document.createElement('canvas');
  subject.setAttribute('width', width);
  subject.setAttribute('height', height);
  document.getElementById('container').appendChild(subject);

  window.requestAnimationFrame(() => {
    this.update();
  });
}

function update() {
  let valid = false;
  let tries = 0;
  let newX, newY;
  // Loop until valid position is found, or limit reached
  while (!valid && tries < 1000) {
    tries++;
    valid = true;
    newX = Math.random() * width;
    newY = Math.random() * height;

    for (let i = 0; i < circles.length; i++) {
      // Calculate distance between point and other circle
      const circle = circles[i];
      const d = getDist(circle.xPos, circle.yPos, newX, newY);
      // If point lies within circle, new point must be chosen
      if (d <= circle.r + startingRadius) {
        valid = false;
        break;
      }
    }
  }

  // If limit was reached, end
  if (!valid) {
    console.log('Packed');
    return;
  }

  circles.push(new Circle(newX, newY));
  subject.height += 0;
  // Loop through circles and draw them
  for (let i = 0; i <  circles.length; i++) {
    circles[i].draw();
    circles[i].grow();
  }

  window.requestAnimationFrame(() => {
    this.update();
  });
}

function getColour(x, y) {
  const hue = (x / width) * 360;
  const saturation = 100;
  const lightness = (1 - (y / height)) * 30 + 20;

  const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  return hsl;
}

function getDist(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt((xDist * xDist) + (yDist * yDist));
}

start();
