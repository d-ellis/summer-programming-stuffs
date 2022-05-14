const wheelOfFortuneTemplate = document.createElement('template');
wheelOfFortuneTemplate.innerHTML = `
<canvas class='wheel-canv'></canvas>
<canvas class='pointer-canv'></canvas>
<style>
.wheel-canv, .pointer-canv {
  position: absolute;

}
.wheel-canv {
  transition: all 2s ease-out;
}
.wheel-canv:hover, .pointer-canv:hover {
  cursor: pointer;
}
</style>
`;

class WheelOfFortune extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(wheelOfFortuneTemplate.content.cloneNode(true));
    this.wheel = this.shadowRoot.querySelector('.wheel-canv');
    this.ctx = this.wheel.getContext('2d');
    this.pointer = this.shadowRoot.querySelector('.pointer-canv');
    this.pointerCtx = this.pointer.getContext('2d');
    this.rotation = 0;

    this.update();

    this.addEventListener('click', this.spinWheel);

  }

  update() {
    this.initialise();
    this.createWheel();
  }

  initialise() {
    this.size = this.getAttribute('size') || 500;
    this.wheel.setAttribute('width', this.size);
    this.wheel.setAttribute('height', this.size);
    this.pointer.setAttribute('width', this.size);
    this.pointer.setAttribute('height', this.size);

    this.names = this.getAttribute('names');
    this.names = this.names ? this.names.split(';') : [];
    this.colours = this.getAttribute('colours');
    this.colours = this.colours ? this.colours.split(';') : [];
  }

  createWheel() {
    // Draw pointer
    this.pointerCtx.rect(this.pointer.width/2 - 2, 0, 4, this.pointer.height/8);
    this.pointerCtx.strokeStyle = 'white';
    this.pointerCtx.fillStyle = 'black';
    this.pointerCtx.fill();
    this.pointerCtx.stroke();

    // Draw wheel
    let segments = this.names.length;
    const arc = 2 * Math.PI / segments;
    for (let i = 0; i < segments; i++) {
      const colourIndex = i >= this.colours.length ? i - this.colours.length : i;
      // Create segment
      this.ctx.beginPath();
      this.ctx.fillStyle = this.colours[colourIndex];
      this.ctx.arc(this.wheel.width / 2, this.wheel.height / 2, this.wheel.width * 0.49, arc * i, arc * (i+1));
      this.ctx.lineTo(this.wheel.width / 2, this.wheel.height / 2);
      this.ctx.fill();
    }
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = this.getAttribute('textColour') || '#000000';
    this.ctx.font = `${this.size/15}px calibri`;
    for (let i = 0; i < segments; i++) {
      const angle = arc * (i + 0.5);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.translate(this.wheel.width/2, this.wheel.width/2);
      this.ctx.rotate(angle);
      this.ctx.fillText(this.names[i], 4*this.wheel.width/9, this.size/50);
      this.ctx.restore();
    }
  }

  spinWheel() {
    this.rotation += Math.random() * 360 + 1440;
    this.wheel.style.transform = `rotate(${this.rotation}deg)`;
  }
}

customElements.define('wheel-of-fortune', WheelOfFortune);
