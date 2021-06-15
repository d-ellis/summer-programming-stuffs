const container = document.getElementById('container');
let plane;
const boids = [];
const boidCount = 50;
const width = 1280;
const height = 720;


function setup() {
  plane = document.createElement('canvas');
  plane.id = 'subject';
  plane.setAttribute('width', width);
  plane.setAttribute('height', height);
  container.appendChild(plane);

  // Create new boids
  for (let i = 0; i < boidCount; i++) {
    const xPos = Math.random() * width;
    const yPos = Math.random() * height;
    const boid = new Boid(xPos, yPos, plane);
    boids.push(boid);
  }

  update();
}

function update() {

  plane.height += 0;
  boids.forEach(boid => {
    boid.flock(boids);
    boid.update();
  });

  window.requestAnimationFrame(() => {
    update();
  })
}

setup();

document.getElementById('alignInput').addEventListener('input', () => {
  document.getElementById('alignVal').textContent = document.getElementById('alignInput').value;
})
document.getElementById('cohereInput').addEventListener('input', () => {
  document.getElementById('cohereVal').textContent = document.getElementById('cohereInput').value;
})
document.getElementById('separateInput').addEventListener('input', () => {
  document.getElementById('separateVal').textContent = document.getElementById('separateInput').value;
})
document.getElementById('perceptInput').addEventListener('input', () => {
  document.getElementById('perceptVal').textContent = document.getElementById('perceptInput').value;
})
