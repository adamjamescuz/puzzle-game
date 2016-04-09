
$(document).ready(function () {

  // defines the site views
  var siteModel = {
    pages:[
        {
            id:0,
            name:"home",
            elem:"#home-view",
            manifest:[]
        },
        {
            id:1,
            name:"puzzle",
            elem:"#puzzle-view",
            manifest:[
              {src: "assets/img/firework.jpg", "id": "PuzzleImage"}
            ]
        }
    ],
    pagesRequiredToRun:[
        'home'
    ],
    startPage: 'home'
  };

  // site model is passed into lightweight single page app controller
  var app = new ApplicationController(siteModel);
  app.init();
});


// - Polyfills

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
}

// - IE 11 polyfill for custom event
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

// - helper method for prototype inheritence
var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};
