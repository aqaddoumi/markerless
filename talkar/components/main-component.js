const talkarScene = `
<a-scene id="talkar-scene" xrweb xrextras-almost-there xrextras-loading xrextras-runtime-error>
  <a-camera position="0 0 0"></a-camera>
  <a-box position="0 0 -5"></a-box>
</a-scene>
`;

window.XRExtras.AFrame.loadAFrameForXr({
  version: 'latest',
}).then(() => {
  initializeTalkarExperience();
});

const initializeTalkarExperience = () => {
  document.body.insertAdjacentHTML('beforeend', talkarScene);
};
