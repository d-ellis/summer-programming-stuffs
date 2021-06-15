const boidSize = 7.5;
const boidColour = '#06c9c9';
const maxForce = 1;
const maxVel = 8;

class Boid {
  constructor(x, y, space) {
    this.x = x;
    this.y = y;
    this.space = space;
    this.ctx = this.space.getContext('2d');
    this.vel = setMag({
      x: Math.random() * 4,
      y: Math.random() * 4,
    }, maxVel);


    this.acc = {
      x: 0,
      y: 0,
    };
    this.perception = 80;
  }

  update() {
    // Add velocity to displacement
    this.x += this.vel.x;
    this.y += this.vel.y;
    // Add acceleration to velocity
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.vel = limitMag(this.vel, maxVel);
    // Reset acceleration to 0
    this.acc = {
      x: 0,
      y: 0,
    };

    // If boid's x leaves the frame, switch sides
    if (this.x > width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = width;
    }

    // If boid's y leaves the frame, switch sides
    if (this.y > height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = height;
    }

    this.draw();
  }

  flock(boids) {

    // Set perception
    this.perception = Number(document.getElementById('perceptInput').value);

    const alignMult = Number(document.getElementById('alignInput').value);
    const cohereMult = Number(document.getElementById('cohereInput').value);
    const separateMult = Number(document.getElementById('separateInput').value);


    let alignment = this.align(boids);
    this.acc.x += (alignment.x * alignMult);
    this.acc.y += (alignment.y * alignMult);

    let cohesion = this.cohere(boids);
    this.acc.x += (cohesion.x * cohereMult);
    this.acc.y += (cohesion.y * cohereMult);

    let separation = this.separate(boids);
    this.acc.x += (separation.x * separateMult);
    this.acc.y += (separation.y * separateMult);
  }

  align(boids) {
    let count = 0;
    let steer = {
      x: 0,
      y: 0,
    };


    for (let i = 0; i < boids.length; i++) {
      // Don't align with self
      const boid = boids[i];
      if (boid === this) {
        continue;
      }


      // Get distance to boid
      const dist = getDist(this.x, this.y, boid.x, boid.y);
      // If within perception range, add steering force
      if (dist < this.perception) {
        count++;
        steer.x += boid.vel.x;
        steer.y += boid.vel.y;
      }
    }

    // If at least one other boid found, set desired force
    if (count > 0) {
      // Get average direction
      steer.x = steer.x / count;
      steer.y = steer.y / count;
      // Limit force
      steer = setMag(steer, maxVel);
      // Get direction relative to current direction
      steer.x -= this.vel.x;
      steer.y -= this.vel.y;
      // Limit force
      steer = limitMag(steer, maxForce);
    }

    return steer;
  }

  separate(boids) {
    let count = 0;
    let steer = {
      x: 0,
      y: 0,
    };

    for (let i = 0; i < boids.length; i++) {
      // Don't separate from self
      const boid = boids[i];
      if (boid === this) {
        continue;
      }


      // Get distance to boid
      let dist = getDist(this.x, this.y, boid.x, boid.y);
      // If within perception range, add steering force
      if (dist < this.perception) {
        count ++;
        // steer.x += boid.vel.x;
        // steer.y += boid.vel.y;

        let force = {
          x: (this.x - boid.x),
          y: (this.y - boid.y),
        };

        if (dist !== 0) {
          dist += boidSize;
          // Force magnitude should be inversely proportional to distance
          force.x = force.x / (dist * dist);
          force.y = force.y / (dist * dist);
        }

        steer.x += force.x;
        steer.y += force.y;
      }
    }

    // If at least one other boid found, set desired force
    if (count > 0) {
      // Get average direction
      steer.x = steer.x / count;
      steer.y = steer.y / count;
      // Limit force
      steer = setMag(steer, maxVel);
      // Get direction relative to current direction
      steer.x -= this.vel.x;
      steer.y -= this.vel.y;
      // Limit force
      steer = limitMag(steer, maxForce);
    }

    return steer;
  }

  cohere(boids) {
    let count = 0;
    let steer = {
      x: 0,
      y: 0,
    };

    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];
      // Don't cohere to self
      if (boid === this) {
        continue;
      }

      const dist = getDist(this.x, this.y, boid.x, boid.y);

      if (dist < this.perception) {
        count++;
        steer.x += boid.x;
        steer.y += boid.y;
      }

      if (count > 0) {
        steer.x = steer.x / count;
        steer.y = steer.y / count;

        steer.x -= this.x;
        steer.y -= this.y;

        steer = setMag(steer, maxVel);

        steer.x -= this.vel.x;
        steer.y -= this.vel.y;

        steer = limitMag(steer, maxForce);
      }

      return steer;
    }
  }

  draw() {
    // Calculate direction boid is facing
    // const angle = Math.atan(this.vel.y / this.vel.x);
    // Calculate the three corners
    // const front = ;
    // const rCorn =;
    // const lCorn = ;
    if (document.getElementById('showPercept').checked) {
      this.ctx.fillStyle = '#de0d34';
      this.ctx.globalAlpha = .25;
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.perception, 0, 2*Math.PI);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = boidColour;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, boidSize, 0, 2*Math.PI);
    this.ctx.fill();

    if (document.getElementById('showVelocity').checked) {
      const direction = setMag(this.vel, 30);
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(this.x, this.y);
      this.ctx.lineTo(this.x + direction.x, this.y + direction.y);
      this.ctx.stroke();
    }
  }
}

function getDist(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt((xDist * xDist) + (yDist * yDist));
}

function limitMag(v, max) {
  // Pythagoras, A^2 + B^2 = C^2
  const currentMag = Math.sqrt((v.x * v.x) + (v.y * v.y));

  // If C greater than max
  if (currentMag > max) {
    const newV = {};
    // Get ratio of desired magnitude to current magnitude
    const magRatio = max / currentMag;

    // Multiply by ratio to get desired magnitude
    newV.x = v.x * magRatio;
    newV.y = v.y * magRatio;

    return newV;
  }
  return v;
}

function setMag(v, mag) {
  // Pythagoras, A^2 + B^2 = C^2
  const currentMag = Math.sqrt((v.x * v.x) + (v.y * v.y));

  const newV = {};
  // Get ratio of desired magnitude to current magnitude
  const magRatio = mag / currentMag;

  // Multiply by ratio to get desired magnitude
  newV.x = v.x * magRatio;
  newV.y = v.y * magRatio;

  return newV;
}
