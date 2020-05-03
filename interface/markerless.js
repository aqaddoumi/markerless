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
});

/*   <script
async
src="https://apps.8thwall.com/xrweb?appKey=6GSBAjDK5sqxliljtu4BiY8P6OMN1rH5t9ZjxeOjJt0JlQeO8aIyK4ccQMER1cGbH5cmSE"
></script>
<script src="./../xrextras/dist/xrextras.js"></script>
<script src="./markerless.js"></script>*/
