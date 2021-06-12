const rDTemplate = document.createElement('template');
rDTemplate.innerHTML = `
  <canvas></canvas>
`;

class ReactDiffuse extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {

    // Initialise Shadow DOM
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(rDTemplate.content.cloneNode(true));
    this.canv = this.shadowRoot.querySelector('canvas');
    this.ctx = this.canv.getContext('2d');

    // Set diffusion rates
    this.dA = this.getAttribute('dA') || 1.0;
    this.dB = this.getAttribute('dB') || .5;
    this.feed = this.getAttribute('feed') || .0545;
    this.kill = this.getAttribute('kill') || .062;



    this.t = 0;

    // Set dimensions
    this.width = this.getAttribute('width') || 200;
    this.canv.setAttribute('width', this.width);
    this.height = this.getAttribute('height') || 200;
    this.canv.setAttribute('height', this.height);

    // Initialise grids
    this.grid = [];
    this.next = [];
    for (let x = 0; x < this.width; x++) {
      this.grid.push([]);
      this.next.push([]);
      for (let y = 0; y < this.height; y++) {
        this.grid[x].push({ a: 1, b: 0 });
        this.next[x].push({ a: 1, b: 0 });
      }
    }

    for (let i = Math.floor(this.width*40/100); i < this.width*60/100; i++) {
      for (let j = Math.floor(this.height*40/100); j < this.height*60/100; j++) {
        this.grid[i][j].b = 1;
      }
    }


    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  update() {
    // Reset canvas
    this.canv.height += 0;

    this.diffuse();
    this.swap();

    // Draw next frame
    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  diffuse() {
    let iD = this.ctx.createImageData(this.width, this.height);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const current = this.grid[x][y];
        const reaction = current.a * current.b * current.b;
        const laplaced = this.laplace(x, y);

        // Update 'a' value
        const aTerm1 = this.dA * (laplaced.a);
        const aKill = this.feed * (1 - current.a);
        this.next[x][y].a = current.a + (aTerm1 - reaction + aKill) * 1; // Delta t is 1 because this function is being called every frame

        if (this.next[x][y].a < 0) {
          this.next[x][y].a = 0;
        } else if (this.next[x][y].a > 1) {
          this.next[x][y].a = 1;
        }

        // Update 'b' value
        const bTerm1 = this.dB * (laplaced.b);
        const bKill = (this.kill + this.feed) * current.b;
        this.next[x][y].b = current.b + (bTerm1  + reaction - bKill) * 1; // Delta t is 1 because this function is being called every frame

        if (this.next[x][y].b < 0) {
          this.next[x][y].b = 0;
        } else if (this.next[x][y].b > 1) {
          this.next[x][y].b = 1;
        }
        this.draw(x, y, iD);
      }
    }
    this.ctx.putImageData(iD, 0 , 0);
  }

  // Compact if statements here
  laplace(x, y) {
    const sum = { a: 0, b: 0 };
    const offLeft = (x > 0);
    const offRight = (x < this.width - 1);
    const offTop = (y > 0);
    const offBottom = (y < this.height - 1);

    sum.a += this.grid[x][y].a * -1;
    sum.b += this.grid[x][y].b * -1;

    // Only do left cell convolution if not at border
    if (offLeft) {
      sum.a += this.grid[x-1][y].a * .2;
      sum.b += this.grid[x-1][y].b * .2;
      // Top left corner
      if (offTop) {
        sum.a += this.grid[x-1][y-1].a * .05;
        sum.b += this.grid[x-1][y-1].b * .05;
      }
      // Bottom left corner
      if (offBottom) {
        sum.a += this.grid[x-1][y+1].a * .05;
        sum.b += this.grid[x-1][y+1].b * .05;
      }
    }

    // Only do right cell convolution if not at border
    if (offRight) {
      sum.a += this.grid[x+1][y].a * .2;
      sum.b += this.grid[x+1][y].b * .2;
      // Top left corner
      if (offTop) {
        sum.a += this.grid[x+1][y-1].a * .05;
        sum.b += this.grid[x+1][y-1].b * .05;
      }
      // Bottom left corner
      if (offBottom) {
        sum.a += this.grid[x+1][y+1].a * .05;
        sum.b += this.grid[x+1][y+1].b * .05;
      }
    }

    // Only do top cell convolution if not at border
    if (offTop) {
      sum.a += this.grid[x][y-1].a * .2;
      sum.b += this.grid[x][y-1].b * .2;
    }

    // Only do bottom cell convolution if not at border
    if (offBottom) {
      sum.a += this.grid[x][y+1].a * .2;
      sum.b += this.grid[x][y+1].b * .2;
    }

    return sum;
  }

  swap() {
    // Swap current grid for next grid
    const temp = this.grid;
    this.grid = this.next;
    this.next = temp;
  }

  draw(x, y, imageData) {
    const r = Math.floor(this.next[x][y].a * 255);
    const b = Math.floor(this.next[x][y].b * 255);
    /* fillRect is slow
    this.ctx.fillStyle = `rgb(${r}, 0, ${b})`;
    this.ctx.fillRect(x, y, 1, 1);
    */

    //let iD = this.ctx.createImageData(x, y, 1, 1);
    const pixelIndex = ((this.width * y) + x) * 4;
    imageData.data[pixelIndex + 0] = r;
    imageData.data[pixelIndex + 1] = 0;
    imageData.data[pixelIndex + 2] = b;
    imageData.data[pixelIndex + 3] = 255;
    // d[0] = r;
    // d[1] = 0;
    // d[2] = b;
    // d[3] = 1;
    //console.log(d);
    //this.ctx.putImageData(iD, x, y);
  }
}

customElements.define('react-diffuse', ReactDiffuse);
