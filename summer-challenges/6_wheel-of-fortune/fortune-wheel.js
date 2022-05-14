let options = [
  {name: 'Test A', colour: '#ff0000'},
  {name: 'Test B', colour: '#0ff000'},
  {name: 'Test C', colour: '#00ff00'},
  {name: 'Test D', colour: '#000ff0'},
  {name: 'Test E', colour: '#0000ff'},
  {name: 'Test F', colour: '#f0000f'},
]
let currentRotation = 0;

function loadColours() {
  const saved = localStorage.getItem('options');
  if (saved) {
    options = JSON.parse(saved);
  } else {
    localStorage.setItem('options', JSON.stringify(options));
    loadColours();
    return;
  }
}

function loadPicker() {
  loadColours();
  const container = document.getElementById('optionChoices');
  container.innerHTML = '';
  for (let i = 0; i < options.length; i++) {
    const thisOption = document.createElement('div');
    thisOption.classList.add('colour-option');

    const optionName = document.createElement('input');
    optionName.classList.add('option-name');
    optionName.type = 'text';
    optionName.value = options[i].name;
    optionName.addEventListener('change', () => {
      options[i].name = optionName.value;
      localStorage.setItem('options', JSON.stringify(options));
      loadWheel();
    })

    const optionColour = document.createElement('input');
    optionColour.classList.add('option-colour');
    optionColour.type = 'color';
    optionColour.value = options[i].colour;
    optionColour.addEventListener('change', () => {
      options[i].colour = optionColour.value;
      localStorage.setItem('options', JSON.stringify(options));
      loadWheel();
    })

    const del = document.createElement('input');
    del.type = 'button';
    del.value = 'X';
    del.addEventListener('click', () => {
      options.splice(i, 1);
      localStorage.setItem('options', JSON.stringify(options));
      loadPicker();
      loadWheel();
    })
    thisOption.appendChild(optionName);
    thisOption.appendChild(optionColour);
    thisOption.appendChild(del);
    container.appendChild(thisOption);
  }
}

function loadWheel() {
  const canvContainer = document.getElementById('wheelContainer');
  // Create pointer
  const pointer = document.getElementById('pointer');
  const pointerCtx = pointer.getContext('2d');
  pointerCtx.rect(pointer.width/2 - 2, 0, 4, 50);
  pointerCtx.strokeStyle = 'white';
  pointerCtx.fillStyle = 'black';
  pointerCtx.fill();
  pointerCtx.stroke();

  // Create wheel stuff
  const wheel = document.getElementById('wheelCanv');
  const ctx = wheel.getContext('2d');
  const segments = options.length;
  const arc = 2 * Math.PI / segments;
  for (let i = 0; i < segments; i++) {
    // Create segment
    ctx.beginPath();
    ctx.fillStyle = options[i].colour;
    ctx.arc(wheel.width / 2, wheel.height / 2, wheel.width * 0.49, arc * i, arc * (i+1));
    ctx.lineTo(wheel.width / 2, wheel.height / 2);
    ctx.fill();
  }
  ctx.textAlign = 'right';
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#ffffff';
  ctx.font = 'bold 48px calibri';
  for (let i = 0; i < segments; i++) {
    const angle = arc * (i + 0.5);
    ctx.save();
    ctx.beginPath();
    ctx.translate(wheel.width/2, wheel.width/2);
    ctx.rotate(angle);
    ctx.fillText(options[i].name, 4*wheel.width/9, 16);
    ctx.strokeText(options[i].name, 4*wheel.width/9, 16);
    ctx.restore();
  }
}

document.getElementById('spinWheel').addEventListener('click', () => {
  currentRotation += Math.random() * 360 + 1440;
  document.getElementById('wheelCanv').style.transform = `rotate(${currentRotation}deg)`;
})

document.getElementById('addOption').addEventListener('click', () => {
  let newColour = Math.floor(Math.random()*16777215).toString(16);
  if (newColour.length === 5) {
    newColour = `0${newColour}`;
  }
  options.push({name: 'New option', colour: `#${newColour}`});
  localStorage.setItem('options', JSON.stringify(options));
  loadPicker();
  loadWheel();
})

loadPicker();
loadWheel();
