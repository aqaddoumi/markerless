/*const xrScreen = `

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

/*<!DOCTYPE html>
<html>
  <head>
    <title>TalkAR</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta name="apple-mobile-web-app-capable" content="yes">

  </head>
  <body>
    <div class="container-fluid" id="interface-container">
        <div class="row justify-content-center align-items-center" style="height: 20%;">
          <div class="col-10">
            <h3 class="text-center gotham-font">AIM CAMERA TOWARD ANY FLAT SURFACE</h1>
          </div>
        </div>
        <div class="row justify-content-center" style="height: 15%;"></div>
        <div class="row justify-content-center" style="height: 30%;">
          <div class="col-10 justify-content-center" style="position: relative;">
            <img id="tap-circle" src="assets/tap-circle.png"/>
            <img id="tap-hand" src="assets/tap-hand.png"/>
          </div>
        </div>
        <div class="row justify-content-center" style="height: 15%;"></div>
        <div class="row justify-content-center align-items-center" style="height: 20%;">
          <div class="col-10">
            <h3 class="text-center gotham-font">TAP TO VIEW AR HOLOGRAM</h1>
          </div>
        </div>
      </div>

  </body>
</html>

*/
