document.getElementById('widthInput').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('width', e.target.value);
})

document.getElementById('heightInput').addEventListener('change', (e) => {
  document.getElementById('subject').setAttribute('height', e.target.value);
})

document.getElementById('scaleInput').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('scale', e.target.value);
})

document.getElementById('speedInput').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('speed', e.target.value);
})

document.getElementById('accInput').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('acceleration', e.target.value);
})

document.getElementById('maxSpeedInput').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('max-speed', e.target.value);
})

document.getElementById('spinInput').addEventListener('change', (e) => {
  if (e.target.checked) {
    document.getElementById('subject').setAttribute('inverse', true);
  } else {
    document.getElementById('subject').removeAttribute('inverse');
  }
})

document.getElementById('noHighlight').addEventListener('change', (e) => {
  // Remove all highlights
  document.getElementById('subject').removeAttribute('vertical');
  document.getElementById('subject').removeAttribute('horizontal');
})

document.getElementById('verticalHighlight').addEventListener('change', (e) => {
  // Remove horizontal highlight
  document.getElementById('subject').removeAttribute('horizontal');
  // Set vertical highlight colour
  const colour = document.getElementById('highlightColour').value;
  document.getElementById('subject').setAttribute('vertical', colour);
})

document.getElementById('horizontalHighlight').addEventListener('change', (e) => {
  // Remove vertical highlight
  document.getElementById('subject').removeAttribute('vertical');
  // Set horizontal highlight colour
  const colour = document.getElementById('highlightColour').value;
  document.getElementById('subject').setAttribute('horizontal', colour);
})

document.getElementById('highlightColour').addEventListener('input', (e) => {
  const colour = e.target.value;
  // Update colour if highlight is currently on
  if (document.getElementById('subject').hasAttribute('vertical')) {
    document.getElementById('subject').setAttribute('vertical', colour);
  } else if (document.getElementById('subject').hasAttribute('horizontal')) {
    document.getElementById('subject').setAttribute('horizontal', colour);
  }
})


document.getElementById('lineColour').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('colour', e.target.value);
})

document.getElementById('bgColour').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('background-colour', e.target.value);
})

document.getElementById('weightInput').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('weight', e.target.value);
})

document.getElementById('detailInput').addEventListener('input', (e) => {
  document.getElementById('subject').setAttribute('detail', e.target.value);
})
