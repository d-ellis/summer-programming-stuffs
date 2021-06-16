const container = document.getElementById('container');
const size = 50;
let field;
const cells = [];

function setup() {
  // Create playing field
  field = document.createElement('div');
  field.id = 'field';
  field.style.gridTemplateColumns = `repeat(${size}, auto)`;
  container.appendChild(field);

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      // Create dead cell
      const cell = document.createElement('div');
      cell.classList.add('cell', 'dead');
      cell.style.width = `${100/cells}%`;
      cell.style.height = `${100/cells}%`;
      cells.push(cell);
      field.appendChild(cell);
    }
  }
}

setup();
