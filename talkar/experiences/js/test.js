function load(url, element) {
  document.getElementById('talkar-experience').style.display = 'block';

  var XFoo = document.registerElement('x-aaaaa');
  var xfoo = document.createElement('x-aaaaa');

  const scene = document.createElement('a-scene');
  xfoo.appendChild(scene);

  const box = document.createElement('a-box');
  box.setAttribute('position', '-3 0 -3');
  box.setAttribute('material', 'color', 'red');
  box.setAttribute('id', 'hello');
  scene.appendChild(box);

  document.body.appendChild(xfoo);
}
