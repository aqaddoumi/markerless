const xrScene = `
<div id="interface-container">
  <div id="interface-text-container">
    <h1 id="interface-text">Tap anywhere to see the experience</h1>
  </div>
</div>
<a-scene tap-business-card="videoAsset: #talk-video-asset" xrweb xrextras-almost-there xrextras-loading xrextras-runtime-error>
  <a-assets>
    <audio id="pop-01-sound-asset" src="assets/pop-01-sound.mp3" preload="auto"></audio>
    <audio id="pop-02-sound-asset" src="assets/pop-02-sound.mp3" preload="auto"></audio>
    <audio id="whoosh-01-sound-asset" src="assets/whoosh-01-sound.mp3" preload="auto"></audio>
    <img id="loading-texture-asset" src="assets/loading-texture.png">
    <img id="carpet-texture-asset" src="assets/carpet-texture.png">
    <video id="talk-video-asset" muted autoplay playsinline crossorigin="anonymous" src="assets/talk-video.mp4"></video>
  </a-assets>
  <a-camera id="camera-entity" position="0 0 0" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;"></a-camera>
  <a-box id="ground" class="cantap" scale="1000 2 1000" position="0 -1 0" material="shader: shadow; transparent: true; opacity: 0.4" shadow></a-box>
</a-scene>
`;

const chromakeyShader = {
  schema: {
    src: { type: 'map' },
    color: { default: { x: 0.1, y: 0.9, z: 0.2 }, type: 'vec3', is: 'uniform' },
    transparent: { default: true, is: 'uniform' },
  },

  init: function (data) {
    var videoTexture = new THREE.VideoTexture(data.src);
    videoTexture.minFilter = THREE.LinearFilter;
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: {
          type: 'c',
          value: data.color,
        },
        texture: {
          type: 't',
          value: videoTexture,
        },
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
    });
  },

  update: function (data) {
    this.material.color = data.color;
    this.material.src = data.src;
    this.material.transparent = data.transparent;
  },

  vertexShader: [
    'varying vec2 vUv;',
    'void main(void)',
    '{',
    'vUv = uv;',
    'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
    'gl_Position = projectionMatrix * mvPosition;',
    '}',
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D texture;',
    'uniform vec3 color;',
    'varying vec2 vUv;',
    'void main(void)',
    '{',
    'vec3 tColor = texture2D( texture, vUv ).rgb;',
    'float a = (length(tColor - color) - 0.5) * 7.0;',
    'gl_FragColor = vec4(tColor, a);',
    '}',
  ].join('\n'),
};

const tapBusinessCardComponent = {
  schema: {
    videoAsset: { type: 'string' },
  },
  init: function () {
    //Assign Element & Data
    const element = this.el;
    const data = this.data;

    //Variables
    var hasUserTapped = false;
    var hasVideoLoaded = false;
    var isExperiencePlaying = false;

    //Video Asset
    const videoAsset = document.querySelector(data.videoAsset);

    if (videoAsset.readyState > 3) {
      startExperience();
    }

    videoAsset.oncanplaythrough = function () {
      startExperience();
    };

    videoAsset.onended = function () {
      finishExperience();
    };

    //Assets
    const loadingTexAsset = document.getElementById('loading-texture-asset');
    const carpetTexAsset = document.getElementById('carpet-texture-asset');

    const pop01SoundAsset = document.getElementById('pop-01-sound-asset');
    const pop02SoundAsset = document.getElementById('pop-02-sound-asset');
    const whoosh01SoundAsset = document.getElementById('whoosh-01-sound-asset');

    //Elements
    const parentEl = document.createElement('a-entity');
    const loadingEl = document.createElement('a-plane');
    const carpetEl = document.createElement('a-plane');
    const videoEl = document.createElement('a-plane');

    //Initialize Elements
    createParentElement();
    createLoadingElement();
    createCarpetElement();
    createVideoElement();

    function createParentElement() {
      parentEl.setAttribute('id', 'parent-entity');
      element.appendChild(parentEl);
    }

    function createVideoElement() {
      videoEl.object3D.visible = false;
      videoEl.object3D.translateZ(0.5);
      videoEl.setAttribute('material', 'src', videoAsset);
      videoEl.setAttribute('material', {
        shader: 'chromakey',
        src: '#talk-video-asset',
        color: '0.1 0.9 0.2',
      });

      const width = 1.5;
      const height = (960 / 540) * width;
      videoEl.setAttribute('width', width);
      videoEl.setAttribute('height', height);
      videoEl.object3D.translateY(height / 2);

      parentEl.appendChild(videoEl);
    }

    function createLoadingElement() {
      loadingEl.object3D.visible = false;
      loadingEl.setAttribute('material', 'src', loadingTexAsset);
      loadingEl.setAttribute('material', 'transparent', true);
      loadingEl.object3D.translateY(0.5);
      loadingEl.object3D.translateX(-0.3);
      loadingEl.setAttribute(
        'animation',
        'property: rotation; to: 0 0 -360; dur: 1000; loop: true; easing: linear'
      );
      parentEl.appendChild(loadingEl);
    }

    function createCarpetElement() {
      carpetEl.object3D.visible = false;
      carpetEl.setAttribute('rotation', '-90 90 0');
      carpetEl.setAttribute('material', 'src', carpetTexAsset);
      carpetEl.setAttribute('position', '0 0.1 0');
      carpetEl.setAttribute('material', 'transparent', true);
      parentEl.appendChild(carpetEl);
    }

    const ground = document.getElementById('ground');
    ground.addEventListener('click', (event) => {
      if (!hasUserTapped) {
        const touchPoint = event.detail.intersection.point;
        parentEl.setAttribute('position', touchPoint);

        hasUserTapped = true;
        hideInterface();

        videoAsset.play();
        videoAsset.pause();

        pop01SoundAsset.play();
        pop01SoundAsset.pause();

        pop02SoundAsset.play();
        pop02SoundAsset.pause();

        whoosh01SoundAsset.play();
        whoosh01SoundAsset.pause();

        if (!hasVideoLoaded) {
          showLoadingElement();
        } else {
          if (!isExperiencePlaying) {
            isExperiencePlaying = true;
            showCarpetElement();
            showVideoElement();
            setTimeout(function () {
              playVideo();
            }, 650);
          }
        }
      }
    });

    function hideInterface() {
      const userInterface = document.getElementById('interface-container');
      userInterface.style.display = 'none';
    }

    function showLoadingElement() {
      loadingEl.object3D.visible = true;
    }

    function hideLoadingElement() {
      loadingEl.object3D.visible = false;
    }

    function showCarpetElement() {
      carpetEl.object3D.visible = true;
      carpetEl.setAttribute('scale', '0 0 0');
      carpetEl.setAttribute(
        'animation',
        'property: scale; to: 3 4 1; dur: 750; easing: easeOutElastic;'
      );
      pop01SoundAsset.currentTime = 0;
      pop01SoundAsset.play();
    }

    function showVideoElement() {
      setTimeout(function () {
        videoEl.object3D.visible = true;
        videoAsset.muted = false;
        videoEl.setAttribute('scale', '0 0 0');
        videoEl.setAttribute(
          'animation',
          'property: scale; to: 1 1 1; dur: 750; easing: easeOutElastic;'
        );
      }, 750);
    }

    function playVideo() {
      videoAsset.currentTime = 0;
      videoAsset.loop = false;
      videoAsset.play();
    }

    function startExperience() {
      hasVideoLoaded = true;

      if (hasUserTapped) {
        if (!isExperiencePlaying) {
          isExperiencePlaying = true;
          hideLoadingElement();
          showCarpetElement();
          showVideoElement();
          setTimeout(function () {
            playVideo();
          }, 650);
        }
      }
    }

    function finishExperience() {
      carpetEl.setAttribute(
        'animation',
        'property: scale; to: 0 0 0; dur: 500; easing: easeInQuint; delay: 0'
      );
      videoEl.setAttribute(
        'animation',
        'property: scale; to: 0 0 0; dur: 500; easing: easeInQuint; delay: 0'
      );

      whoosh01SoundAsset.currentTime = 0;
      whoosh01SoundAsset.play();

      setTimeout(function () {
        hasUserTapped = false;
        isExperiencePlaying = false;
        videoEl.object3D.visible = false;
        carpetEl.object3D.visible = false;
      }, 500);
    }
  },
  tick: function () {
    const parentObj = document.getElementById('parent-entity').object3D;
    const camera = document.getElementById('camera-entity').object3D;
    parentObj.rotation.y = Math.atan2(
      camera.position.x - parentObj.position.x,
      camera.position.z - parentObj.position.z
    );
  },
};

window.XRExtras.AFrame.loadAFrameForXr({
  version: 'latest',
}).then(() => {
  AFRAME.registerShader('chromakey', chromakeyShader);
  AFRAME.registerComponent('tap-business-card', tapBusinessCardComponent);
  document.body.insertAdjacentHTML('beforeend', xrScene);
});
