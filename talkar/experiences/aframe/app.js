AFRAME.registerComponent('hello-world', {
  init: function () {
    console.log('Hello, World!');
  },
});

registerElements();

function registerElements() {
  registerTalkarAppElement();
  registerTalkarScreenElement();
  registerTalkarSceneElement();
  registerTalkarAssetsElement();
  registerTalkarExperienceElement();
  registerTalkarBoxElement();
}

function registerTalkarAppElement() {
  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function () {
    this.setAttribute('id', 't-app');
  };

  var tApp = document.registerElement('t-app', { prototype: proto });
}

function registerTalkarScreenElement() {
  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function () {
    this.setAttribute('id', 't-screen');
  };

  var tScreen = document.registerElement('t-screen', { prototype: proto });
}

function registerTalkarSceneElement() {
  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function () {
    this.setAttribute('id', 't-scene');

    const scene = document.createElement('a-scene');
    scene.setAttribute('id', 't-a-scene');
    this.appendChild(scene);

    const camera = document.createElement('a-camera');
    camera.setAttribute('id', 't-a-camera');
    camera.setAttribute('position', '0 0 0');
    scene.appendChild(camera);
  };

  var tScene = document.registerElement('t-scene', { prototype: proto });
}

function registerTalkarAssetsElement() {
  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function () {
    var scene = document.getElementById('t-a-scene');

    const assets = document.createElement('a-assets');
    assets.setAttribute('id', 't-a-assets');
    scene.appendChild(assets);
  };

  var tAssets = document.registerElement('t-assets', { prototype: proto });
}

function registerTalkarExperienceElement() {
  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function () {
    var scene = document.getElementById('t-a-scene');

    const experience = document.createElement('a-entity');
    experience.setAttribute('id', 't-a-experience');

    experience.setAttribute('hello-world', '');

    scene.appendChild(experience);
  };

  var tExperience = document.registerElement('t-experience', {
    prototype: proto,
  });
}

function registerTalkarBoxElement() {
  var proto = Object.create(HTMLElement.prototype);

  proto.createdCallback = function () {
    var experience = document.getElementById('t-a-experience');

    const box = document.createElement('a-box');
    box.setAttribute('position', '0 0 -5');
    box.setAttribute('color', 'red');
    box.setAttribute('scale', '0 0 0');

    experience.appendChild(box);

    box.setAttribute(
      'animation',
      'property: scale; to: 1 1 1; dur: 750; easing: easeOutElastic;'
    );
  };

  var tBox = document.registerElement('t-box', {
    prototype: proto,
  });
}

//function registerTalkar

//registerTalkar Circle
//registerTalkar Plane
//registerTalkar Video
//registerTalkar

/*
<a-app>
    <a-scene>
        <a-assets>
            <a-audio></a-audio>
            <a-img></a-img>
            <a-video></a-video>
            <a-model></a-model>
        </a-assets>

        <a-screen>
            <a-start>
                <a-top>
                <a-middle>
                <a-bottom>
            </a-start>

            <a-during>
                <a-button></a-button>
            </a-during>

            <a-end>
                <a-button></a-button>
            </a-end>
        </a-screen>

        <a-scene>
            <a-camera></a-camera>
            <a-box></a-box>

            <a-experience>
                <a-init>
                </a-init>

                <a-play>
                    <a-parent>
                        <a-video></a-video>
                        <a-entity>
                            <a-model>
                                <a-plane><a-plane>
                            <a-model>
                        <a-entity>
                        <a-circle><a-circle>
                    </a-parent>
                </a-play>

                <a-end>
                </a-end>

            </a-experience>
        <a-scene>
    </a-scene>  
<a-app>
*/
