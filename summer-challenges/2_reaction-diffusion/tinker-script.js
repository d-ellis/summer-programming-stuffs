document.getElementById('redraw').addEventListener('click', () => {
  document.getElementById('subject').remove();

  const width = document.getElementById('widthInput').value;
  const height = document.getElementById('heightInput').value;

  const dA = document.getElementById('dAInput').value;
  const dB = document.getElementById('dBInput').value;

  const feed = document.getElementById('feedInput').value;
  const kill = document.getElementById('killInput').value;


  const newSim = document.createElement('react-diffuse');
  newSim.id = 'subject';

  newSim.setAttribute('width', width);
  newSim.setAttribute('height', height);

  newSim.setAttribute('dA', dA);
  newSim.setAttribute('dB', dB);

  newSim.setAttribute('feed', feed);
  newSim.setAttribute('kill', kill);

  document.getElementById('container').appendChild(newSim);
})
