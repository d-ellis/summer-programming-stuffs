const countdownTemplate = document.createElement('template');
countdownTemplate.innerHTML = `
<div id='container'>
<audio id='track' src='./chateux.mp3'></audio>
<canvas id='countdown'></canvas>
<canvas id='countdownCover'></canvas>
<canvas id='text'></canvas>
</div>
<style>
#container {
  position: relative;
  margin: 0;
  cursor: pointer;
}
#container canvas {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
`

class RetroCountdown extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(countdownTemplate.content.cloneNode(true));
    this.text = this.shadowRoot.querySelector('#text');
    this.textCtx = this.text.getContext('2d');
    this.countdown = this.shadowRoot.querySelector('#countdown');
    this.countdownCtx = this.countdown.getContext('2d');
    this.cover = this.shadowRoot.querySelector('#countdownCover');
    this.coverCtx = this.cover.getContext('2d');
    this.track = this.shadowRoot.querySelector('#track');

    this.initialise();
    this.covered = 0;

    this.addEventListener('click', () => {
      if (this.running) return;
      this.track.play();
      this.update();
      this.running = true;
    });
  }

  initialise() {
    this.size = this.getAttribute('size') || 500;
    this.textContent = this.getAttribute('text') || 'HELLO\\nWORLD!';
    const content = this.textContent.split('\\n');
    this.text.setAttribute('width', this.size);
    this.text.setAttribute('height', this.size);
    this.countdown.setAttribute('width', this.size);
    this.countdown.setAttribute('height', this.size);
    this.cover.setAttribute('width', this.size);
    this.cover.setAttribute('height', this.size);
    this.shadowRoot.querySelector('#container').style.width = `${this.size}px`;
    this.shadowRoot.querySelector('#container').style.height = `${this.size}px`;

    // Fill background colour
    this.countdownCtx.fillStyle = '#090f73';
    this.countdownCtx.fillRect(0, 0, this.size, this.size);
    this.countdownCtx.fillStyle = '#a4acde';
    // Draw ring
    const arc = 2 * Math.PI / 60;
    for (let i = 0; i < 60; i++) {
      this.countdownCtx.save();
      this.countdownCtx.translate(this.size/2, this.size/2);
      this.countdownCtx.rotate(i * arc);
      if (i % 5 === 0) {
        this.countdownCtx.fillRect(-8,-300, 16, 40)
      } else {
        this.countdownCtx.fillRect(-5, -300, 10, 25)
      }
      this.countdownCtx.restore();
    }

    // Position text
    this.textCtx.textAlign = 'center';
    this.textCtx.textBaseline = 'middle';
    this.textCtx.fillStyle = '#a4acde';
    const fontSize = Number(this.getAttribute('fontsize')) || 48;
    this.textCtx.font = `bold ${fontSize}px monospace`;
    const lineHeight = fontSize + 4;
    let textLine = (this.size / 2) - ((content.length - 1) * 0.5 * lineHeight);
    for (const text of content) {
      this.textCtx.fillText(text, this.size/2, textLine);
      textLine += lineHeight;
    }
    this.text.style.filter = `blur(${this.getAttribute('blur') || 1.25}px)`;
    this.countdown.style.filter = `blur(${this.getAttribute('blur') || 1.25}px)`;
  }

  update(timestamp) {
    const time = Number(this.getAttribute('seconds')) || 60;
    const fps = Number(this.getAttribute('fps')) || 20;
    const fade = Number(this.getAttribute('fade-from')) || 0.9;
    this.countdownCtx.fillStyle = '#090f73';
    const fadeMult = 1/(1 - fade);
    if (!this.startTime) {
      this.startTime = timestamp;
      this.prev = 0;
    }
    const elapsed = timestamp - this.startTime;
    // 20fps
    const maxTime = time*1000;
    const arc = elapsed/maxTime;
    if (elapsed - this.prev >= 1000/fps) {
      this.prev = elapsed;
      const start = -Math.PI/2;
      this.covered = (Math.PI*2)*arc;
      const end = start + (this.covered);
      this.countdownCtx.beginPath();
      this.countdownCtx.moveTo(this.size/2, this.size/2);
      this.countdownCtx.arc(this.size/2, this.size/2, this.size/2, start, end);
      this.countdownCtx.fill();
    }
    if (arc > fade) {
      if (!this.volume) {
        this.track.volume;
      }
      this.track.volume = this.volume * (1-arc) * fadeMult;
    }
    if (this.covered < Math.PI * 2) {
      requestAnimationFrame(t => {
        this.update(t);
      });
    } else {
      this.countdownCtx.arc(this.size/2, this.size/2, this.size/2, 0, 2*Math.PI);
      this.track.pause();
      this.track.currentTime = 0;
    }
  }
}

customElements.define('retro-countdown', RetroCountdown);
