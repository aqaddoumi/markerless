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
  //AFRAME.registerComponent('tap-business-card', tapBusinessCardComponent);
  document.body.insertAdjacentHTML('beforeend', talkarScene);
};

//<talkar-experience>
//  <talkar-assets>

//  </talkar-assets>
//  <talkar-elements>
//    <talkar-main>
//      <talkar-video src="" width="" height="" size=""><talkar-video>
//      <talkar-model src="" cube-map="" position="" scale="" rotation=""
//        show="scale: delay: duration: ease: from: "
//        rotation="delay: duration: ease: from: "
//        sound: "src: "
//        hide="atEnd: true" rotation delay: ease: to:>
//      <talkar-model>
//
//
//    </talkar-main>
//  </talkar-elements>
//</talkar-experience>

//TalkAR Experience
//TalkAR Loading

//TalkAR Assets
//TalkAR Image Asset
//TalkAR Sound Asset
//TalkAR Model Asset
//TalkAR Video Asset

//TalkAR Elements
//TalkAR Element
//TalkAR Box
//TalkAR Plane
//TalkAR Circle
//TalkAR Model
//TalkAR Video

//Attributes
//Position
//Scale
//Size
//Src
//Show Animation
//Constant Animation
//Hide Animation
