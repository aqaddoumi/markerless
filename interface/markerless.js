/*const xrScreen = `
<div id="interface-container" style="background-color: red; height: 100%; width: 100%;"></div>
`;*/

const xrScene = `
<a-scene xrweb xrextras-almost-there xrextras-loading xrextras-runtime-error>
  <a-camera position="0 0 0"></a-camera>
  <a-box position="0 0 -5"></a-box>
</a-scene>
`;

window.XRExtras.AFrame.loadAFrameForXr({
  version: 'latest',
}).then(() => {
  document.body.insertAdjacentHTML('beforeend', xrScene);
  //document.body.insertAdjacentHTML('afterbegin', xrScreen);
});

// xrextras-log-to-screen
