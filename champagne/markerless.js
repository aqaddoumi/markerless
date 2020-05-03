const xrScene = `
<a-scene tap-business-card="videoAsset: #talk-video-asset" xrweb xrextras-almost-there xrextras-loading xrextras-runtime-error>
  <a-assets>
    <img id="posx" src="assets/cubemap/posx.jpg">
    <img id="posy" src="assets/cubemap/posy.jpg">
    <img id="posz" src="assets/cubemap/posz.jpg">
    <img id="negx" src="assets/cubemap/negx.jpg">
    <img id="negy" src="assets/cubemap/negy.jpg">
    <img id="negz" src="assets/cubemap/negz.jpg">
    <audio id="pop-01-sound-asset" src="assets/pop-01-sound.mp3" preload="auto"></audio>
    <audio id="pop-02-sound-asset" src="assets/pop-02-sound.mp3" preload="auto"></audio>
    <audio id="pop-03-sound-asset" src="assets/pop-03-sound.mp3" preload="auto"></audio>
    <audio id="whoosh-01-sound-asset" src="assets/whoosh-01-sound.mp3" preload="auto"></audio>
    <img id="loading-texture-asset" src="assets/loading-texture.png">
   
    <a-asset-item id="tray-model-asset" src="assets/tray.glb"></a-asset-item>
    <a-asset-item id="bucket-model-asset" src="assets/bucket.glb"></a-asset-item>
    <a-asset-item id="glasses-model-asset" src="assets/glasses.glb"></a-asset-item>
    
    <video id="talk-video-asset" muted autoplay playsinline crossorigin="anonymous" src="assets/talk-video.mp4"></video>
  </a-assets>
  <a-camera id="camera-entity" position="0 0 0" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;"></a-camera>
  <a-box id="ground" class="cantap" scale="1000 2 1000" position="0 -1 0" material="shader: shadow; transparent: true; opacity: 0.4" shadow></a-box>
</a-scene>
`;

/**
 * @param  {Array<THREE.Material>|THREE.Material} material
 * @return {Array<THREE.Material>}
 */
const ensureMaterialArray = (material) => {
  if (!material) {
    return [];
  }

  if (Array.isArray(material)) {
    return material;
  }

  if (material.materials) {
    return material.materials;
  }

  return [material];
};

/**
 * @param  {THREE.Object3D} mesh
 * @param  {Array<string>} materialNames
 * @param  {THREE.Texture} envMap
 * @param  {number} reflectivity  [description]
 */
const applyEnvMap = (mesh, materialNames, envMap, reflectivity) => {
  if (!mesh) return;

  materialNames = materialNames || [];

  mesh.traverse((node) => {
    if (!node.isMesh) {
      return;
    }
    const meshMaterials = ensureMaterialArray(node.material);

    meshMaterials.forEach((material) => {
      if (material && !('envMap' in material)) return;
      if (materialNames.length && materialNames.indexOf(material.name) === -1)
        return;

      material.envMap = envMap;
      material.reflectivity = reflectivity;
      material.needsUpdate = true;
    });
  });
};

const toUrl = (urlOrId) => {
  const img = document.querySelector(urlOrId);
  return img ? img.src : urlOrId;
};

const cubeEnvMapComponent = {
  multiple: true,
  schema: {
    posx: { default: '#posx' },
    posy: { default: '#posy' },
    posz: { default: '#posz' },
    negx: { default: '#negx' },
    negy: { default: '#negy' },
    negz: { default: '#negz' },
    extension: { default: 'jpg', oneOf: ['jpg', 'png'] },
    format: { default: 'RGBFormat', oneOf: ['RGBFormat', 'RGBAFormat'] },
    enableBackground: { default: false },
    reflectivity: { default: 10, min: 0, max: 10 },
    materials: { default: [] },
  },
  init: function () {
    const data = this.data;

    this.texture = new THREE.CubeTextureLoader().load([
      toUrl(data.posx),
      toUrl(data.negx),
      toUrl(data.posy),
      toUrl(data.negy),
      toUrl(data.posz),
      toUrl(data.negz),
    ]);
    this.texture.format = THREE[data.format];

    this.object3dsetHandler = () => {
      const mesh = this.el.getObject3D('mesh');
      const data = this.data;
      applyEnvMap(mesh, data.materials, this.texture, data.reflectivity);
    };
    this.el.addEventListener('object3dset', this.object3dsetHandler);
  },
  update: function (oldData) {
    const data = this.data;
    const mesh = this.el.getObject3D('mesh');

    let addedMaterialNames = [];
    let removedMaterialNames = [];

    if (data.materials.length) {
      if (oldData.materials) {
        addedMaterialNames = data.materials.filter(
          (name) => !oldData.materials.includes(name)
        );
        removedMaterialNames = oldData.materials.filter(
          (name) => !data.materials.includes(name)
        );
      } else {
        addedMaterialNames = data.materials;
      }
    }
    if (addedMaterialNames.length) {
      applyEnvMap(mesh, addedMaterialNames, this.texture, data.reflectivity);
    }
    if (removedMaterialNames.length) {
      applyEnvMap(mesh, removedMaterialNames, null, 1);
    }

    if (oldData.materials && data.reflectivity !== oldData.reflectivity) {
      const maintainedMaterialNames = data.materials.filter((name) =>
        oldData.materials.includes(name)
      );
      if (maintainedMaterialNames.length) {
        applyEnvMap(
          mesh,
          maintainedMaterialNames,
          this.texture,
          data.reflectivity
        );
      }
    }

    if (this.data.enableBackground && !oldData.enableBackground) {
      this.setBackground(this.texture);
    } else if (!this.data.enableBackground && oldData.enableBackground) {
      this.setBackground(null);
    }
  },

  remove: function () {
    this.el.removeEventListener('object3dset', this.object3dsetHandler);
    const mesh = this.el.getObject3D('mesh');
    const data = this.data;
    applyEnvMap(mesh, data.materials, null, 1);
    if (data.enableBackground) {
      this.setBackground(null);
    }
  },

  setBackground: function (texture) {
    this.el.sceneEl.object3D.background = texture;
  },
};

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
    let scene = this.el.sceneEl;
    scene.addEventListener('realityready', () => {
      showInterface();
    });

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

    const pop01SoundAsset = document.getElementById('pop-01-sound-asset');
    const pop02SoundAsset = document.getElementById('pop-02-sound-asset');
    const pop03SoundAsset = document.getElementById('pop-03-sound-asset');
    const whoosh01SoundAsset = document.getElementById('whoosh-01-sound-asset');

    const trayEl = document.createElement('a-entity');
    const buckerEl = document.createElement('a-entity');
    const glassesEl = document.createElement('a-entity');

    //Elements
    const parentEl = document.createElement('a-entity');
    const videoEl = document.createElement('a-plane');
    const loadingEl = document.createElement('a-plane');

    //<a-asset-item id="tray-model-asset" src="assets/tray.glb"></a-asset-item>
    //<a-asset-item id="bucket-model-asset" src="assets/bucket.glb"></a-asset-item>
    //<a-asset-item id="glasses-model-asset" src="assets/glasses.glb"></a-asset-item>

    //Initialize Elements
    createParentElement();
    createVideoElement();
    createLoadingElement();

    createTrayElement();

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
      const height = (960 / 960) * width;
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
      loadingEl.setAttribute(
        'animation',
        'property: rotation; to: 0 0 -360; dur: 1000; loop: true; easing: linear'
      );
      parentEl.appendChild(loadingEl);
    }

    function createTrayElement() {
      trayEl.object3D.visible = true;
      trayEl.setAttribute('gltf-model', '#tray-model-asset');
      trayEl.setAttribute('cube-env-map');
      parentEl.appendChild(trayEl);
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

        pop03SoundAsset.play();
        pop03SoundAsset.pause();

        whoosh01SoundAsset.play();
        whoosh01SoundAsset.pause();

        if (!hasVideoLoaded) {
          showLoadingElement();
        } else {
          if (!isExperiencePlaying) {
            isExperiencePlaying = true;
            showVideoElement();
            showLearnMore();
            setTimeout(function () {
              playVideo();
            }, 650);
          }
        }
      }
    });

    function showInterface() {
      const userInterface = document.getElementById('interface-container');
      userInterface.style.visibility = 'visible';
    }

    function hideInterface() {
      const userInterface = document.getElementById('interface-container');
      userInterface.style.display = 'none';
    }

    function showLearnMore() {
      setTimeout(function () {
        const userInterface = document.getElementById(
          'interface-container-two'
        );
        userInterface.style.visibility = 'visible';
      }, 7000);
    }

    function showLoadingElement() {
      loadingEl.object3D.visible = true;
    }

    function hideLoadingElement() {
      loadingEl.object3D.visible = false;
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
        pop03SoundAsset.currentTime = 0;
        pop03SoundAsset.play();
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
          showVideoElement();
          setTimeout(function () {
            playVideo();
          }, 650);
        }
      }
    }

    function finishExperience() {
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
  AFRAME.registerComponent('cube-env-map', cubeEnvMapComponent);
  AFRAME.registerComponent('tap-business-card', tapBusinessCardComponent);
  document.body.insertAdjacentHTML('beforeend', xrScene);
});
