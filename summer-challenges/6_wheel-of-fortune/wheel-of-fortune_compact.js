const template = document.createElement('template');
template.innerHTML = `
<div class='container'>
<canvas class='wheel-canv'></canvas>
<canvas class='pointer-canv'></canvas>
</div>
<style>
.container {
  position: relative;
  margin: 0;
}
.container canvas {
  position: absolute;
  left: 0;
  top: 0;
}
.wheel-canv {
  transition: all 2s ease-out;
}
.wheel-canv:hover, .pointer-canv:hover {
  cursor: pointer;
}
</style>
`;

class WoF extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    const sR = this.shadowRoot;
    sR.appendChild(template.content.cloneNode(true));
    const wheel = sR.querySelector('.wheel-canv');
    const ctx = wheel.getContext('2d');
    const ptr = sR.querySelector('.pointer-canv');
    const pCtx = ptr.getContext('2d');
    let r = 0;

    const size = this.getAttribute('size') || 500;
    wheel.setAttribute('width', size);
    wheel.setAttribute('height', size);
    ptr.setAttribute('width', size);
    ptr.setAttribute('height', size);
    sR.querySelector('.container').style.width = sR.querySelector('.container').style.height = `${size}px`;

    const names = this.getAttribute('names') ? this.getAttribute('names').split(';') : [];
    const colours = this.getAttribute('colours') ? this.getAttribute('colours').split(';') : [];

    const longest = [...names].sort((a,b) => {
      return b.length - a.length;
    })[0].length;

    //this.createWheel();
    pCtx.rect(size/2 - 2, 0, 4, size/8);
    pCtx.strokeStyle = 'white';
    pCtx.fillStyle = 'black';
    pCtx.fill();
    pCtx.stroke();

    let segments = names.length;
    const arc = 2 * Math.PI / segments;
    for (let i = 0; i < segments; i++) {
      const cI = i % colours.length;
      ctx.beginPath();
      ctx.fillStyle = colours[cI];
      ctx.arc(size/2, size/2, size*0.49, arc*i, arc*(i+1));
      ctx.lineTo(size/2, size/2);
      ctx.fill();
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.getAttribute('textColour') || '#000000';
    ctx.font = `${(size/2.1)/longest}px lucida console`;
    for (let i = 0; i < segments; i++) {
      const angle = arc * (i + 0.5);
      ctx.save();
      ctx.beginPath();
      ctx.translate(size/2, size/2);
      ctx.rotate(angle);
      ctx.fillText(names[i], 4*size/9, 0);
      ctx.restore();
    }

    this.addEventListener('click', () => {
      r += Math.random() * 360 + 1440;
      wheel.style.transform = `rotate(${r}deg)`;
    });
  }
}

customElements.define('wheel-of-fortune', WoF);
