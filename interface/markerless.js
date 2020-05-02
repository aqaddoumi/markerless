const xrScene = `
<a-scene xrweb xrextras-almost-there xrextras-loading xrextras-runtime-error xrextras-log-to-screen>
  <a-camera position="0 0 0"></a-camera>
  <a-box position="0 0 -5"></a-box>
</a-scene>
`;

window.XRExtras.AFrame.loadAFrameForXr({
  version: 'latest',
}).then(() => {
  document.body.insertAdjacentHTML('beforeend', xrScene);
});
