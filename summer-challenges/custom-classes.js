const dualAxisTemplate = document.createElement('template');
dualAxisTemplate.innerHTML = `
  <canvas></canvas>
  <style>
  canvas{
    float: left;
  }
  </style>
`;

class DualAxis extends HTMLElement{

  constructor() {
    super();
  }

  attributeChangedCallback() {

  }

  connectedCallback() {

    // Initialise
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(dualAxisTemplate.content.cloneNode(true));
    this.canv = this.shadowRoot.querySelector('canvas')
    this.ctx = this.canv.getContext('2d');
    this.t = 0;


    window.requestAnimationFrame(() => {
      this.update();
    });

  }

  update() {
    // Set dimensions
    const width = this.getAttribute('width') || 500;
    this.canv.setAttribute('width', width);
    const height = this.getAttribute('height') || 300;
    this.canv.setAttribute('height', height);
    this.scale = this.getAttribute('scale') || 1;


    // Set colours
    this.backgroundColour = this.getAttribute('background-colour') || '#ffffff';
    this.colour = this.getAttribute('colour') || '#000000';
    this.vertical = this.getAttribute('vertical');
    this.horizontal = this.getAttribute('horizontal');
    this.inverse = this.getAttribute('inverse');


    // Set speed
    this.speed = this.getAttribute('speed') || 1;
    this.maxSpeed = this.getAttribute('max-speed');
    this.acc = 1 + (this.getAttribute('acceleration') || 0);



    // Misc details
    this.highlight = this.getAttribute('highlight');
    this.weight = this.getAttribute('weight') || 20;
    this.detail = this.getAttribute('detail') || 200;

    // Illusion breaks if lower than 20
    if (this.detail < 20) {
      this.detail = 20;
    }


    // Reset canvas
    this.canv.height += 0;

    // Increment time
    this.t += this.speed/60;

    // Adjust speed depending on acceleration
    this.speed = this.speed * this.acc;

    // Cap speed
    if (this.maxSpeed) {
      if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed;
      }
    }

    this.ctx.fillStyle = this.backgroundColour;
    this.ctx.fillRect(0, 0, this.canv.width, this.canv.height);

    // Draw initial shape
    this.ctx.beginPath();
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.colour;
    this.ctx.lineWidth = this.weight;

    const scaledWidth = this.canv.width * this.scale;
    const scaledHeight = this.canv.height * this.scale;

    const resolution = this.detail;

    for (let i = -1; i < resolution; i++) {
      this.drawPoint(12*Math.PI*i/resolution);
    }
    this.ctx.closePath();
    this.ctx.stroke();


    // Check if highlights are needed
    // Vertical highlight bar
    if (this.vertical) {

      const rectWidth = scaledWidth * 0.4;
      const startX = (this.canv.width - rectWidth) / 2


      this.ctx.fillStyle = this.vertical;

      // Loop through to give rectangle faded look
      for (let i = 0; i < rectWidth/2; i++) {
        const alpha = 5*i/rectWidth;
        this.ctx.globalAlpha = alpha;
        this.ctx.fillRect(startX + i, 0, 2, this.canv.height);
        this.ctx.fillRect(startX + rectWidth - i, 0, 2, this.canv.height);
      }
      //this.ctx.fillRect(startX, 0, rectWidth, this.canv.height);
      this.ctx.globalAlpha = 1;



      this.ctx.beginPath();
      // Begin at -2 to ensure seamless line connection
      for (let i = -2; i < resolution; i++) {
        // If inverse, then go right to left
        if (this.inverse) {
          if (Math.sin(4*i*Math.PI / resolution + 2 * Math.PI / 4) > 0) {
            this.drawPoint(12*Math.PI*i/resolution);
          }
        } else {
          // Else go left to right
          if (Math.sin(4*i*Math.PI / resolution + 2 * Math.PI / 4) < 0) {
            this.drawPoint(12*Math.PI*i/resolution);
          }
        }
      }
      this.ctx.stroke();
    } else if (this.horizontal) {


      const rectHeight = scaledHeight * 0.4;
      const startY = (this.canv.height - rectHeight) / 2;

      this.ctx.fillStyle = this.horizontal;

      // Loop through to give rectangle faded look
      for (let i = 0; i < rectHeight/2; i++) {
        const alpha = 5*i/rectHeight;
        this.ctx.globalAlpha = alpha;
        this.ctx.fillRect(0, startY + i, this.canv.width, 2);
        this.ctx.fillRect(0, startY + rectHeight - i, this.canv.width, 2);
      }


      //this.ctx.fillRect(0, startY, this.canv.width, rectHeight);

      this.ctx.beginPath();
      // Begin at -2 to ensure seamless line connection
      for (let i = -2; i < resolution; i++) {
        // If inverse then go bottom to top
        if (this.inverse) {
          if (Math.sin(6*i*Math.PI / resolution + 2 * Math.PI + 1.4 + this.t) < 0) {
            this.drawPoint(12*Math.PI*i/resolution);
          }
        } else {
          if (Math.sin(6*i*Math.PI / resolution + 2 * Math.PI + 1.4 + this.t) > 0) {
            this.drawPoint(12*Math.PI*i/resolution);
          }
        }
      }
      this.ctx.stroke();
    }

    // Draw next position
    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  drawPoint(position) {
    const height = this.canv.height/2 - 25;
    const width = this.canv.width/2 - 25;
    const halfHeight = this.canv.height / 2;
    const halfWidth = this.canv.width / 2;

    const x = width * this.scale * Math.sin(position / 3);
    const y = height * this.scale * Math.sin(this.t + position/2);

    // If point is first in current line, move to before drawing line
    if (Math.abs(x - this.lastX) > halfWidth * this.scale || Math.abs(y - this.lastY) > halfHeight * this.scale) {
      this.ctx.moveTo(halfWidth + x, halfHeight + y);
    }

    this.lastX = x;
    this.lastY = y;

    this.ctx.lineTo(halfWidth + x, halfHeight + y);
  }


}

customElements.define('dual-axis', DualAxis);
