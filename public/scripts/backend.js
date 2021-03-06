
/**
* Moves the map to display over Berlin
*
* @param  {H.Map} map      A HERE Map instance within the application
*/
function moveMapToBerlin(map){

    map.setCenter({lat:32.8801, lng:-117.2340});
    map.setZoom(14);
    refreshBeacons(map);
}

function refreshBeacons(map) {
  console.log("running");
  var values;
  var old_beacons;
  var oldies = function(old_beacons) {
    values = old_beacons;
    refresh(values);
  }


  getOldJSON(oldies);


  function getOldJSON(callback2) {
    let req3 = new XMLHttpRequest();
    req3['responseType'] = "text";
    req3.open("GET", "https://api.jsonbin.io/b/5bc2f24b716f9364f8c37e6c/latest", true);
    req3.setRequestHeader("secret-key", "$2a$10$aXtCIwATAuWL.aDyqGE7T.H1wbu7giYVFtaPvtT6B/srWOafZgX1W");
    req3.send();

    req3.onreadystatechange = () => {
      if (req3.readyState == XMLHttpRequest.DONE) {
        console.log(req3.responseText);
        old_beacons = req3.responseText;
        callback2(old_beacons);
      }
    };
  }

  var refresh = function(data) {
    data = JSON.parse(data);
    count = data['beacons'].length;
    console.log(count);
    console.log("entering loop");
    for (var i = 0; i < count; i++) {
      console.log("looping");
      addDomMarker(map, data['beacons'][i].lat, data['beacons'][i].lon, data['beacons'][i].name, data['beacons'][i].email, data['beacons'][i].occ, data['beacons'][i].time, true);
    }
  }
}

function setUpClickListener(map) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.
  map.addEventListener('tap', function (evt) {
  var coord = map.screenToGeo(evt.currentPointer.viewportX,
    evt.currentPointer.viewportY);
  addDomMarker(map, coord.lat.toFixed(4), coord.lng.toFixed(4));
  });
}


function addDomMarker(map, lati, lon, name, email, occ, time, inJSON) {
  var outerElement = document.createElement('div'),
  innerElement = document.createElement('div');

  outerElement.style.userSelect = 'none';
  outerElement.style.webkitUserSelect = 'none';
  outerElement.style.msUserSelect = 'none';
  outerElement.style.mozUserSelect = 'none';
  outerElement.style.cursor = 'default';

  innerElement.style.color = 'red';
  innerElement.style.backgroundColor = 'blue';
  innerElement.style.border = '2px solid black';
  innerElement.style.font = 'normal 12px arial';
  innerElement.style.lineHeight = '12px'

  innerElement.style.paddingTop = '2px';
  innerElement.style.paddingLeft = '4px';
  innerElement.style.width = '20px';
  innerElement.style.height = '20px';

  // add negative margin to inner element
  // to move the anchor to center of the div
  innerElement.style.marginTop = '-10px';
  innerElement.style.marginLeft = '-10px';

  outerElement.appendChild(innerElement);

  // Add text to the DOM element
  innerElement.innerHTML = 'C';

  function alertme() {
    alert("AHH");
  }

  function changeOpacity(evt) {
      evt.target.style.opacity = 0.6;
      alert(name + " is having an event at " + time + ".\n" + "Head over and check out the " + occ + ". Their email is " + email + ".");
  };


  function changeOpacityToOne(evt) {
      evt.target.style.opacity = 1;
  };

  //create dom icon and add/remove opacity listeners
  var domIcon = new H.map.DomIcon(outerElement, {
  // the function is called every time marker enters the viewport
    onAttach: function(clonedElement, domIcon, domMarker) {
        clonedElement.addEventListener('mouseover', changeOpacity, alertme);
        clonedElement.addEventListener('mouseout', changeOpacityToOne);
    },

  // the function is called every time marker leaves the viewport
    onDetach: function(clonedElement, domIcon, domMarker) {
    clonedElement.removeEventListener('mouseover', changeOpacity);
    clonedElement.removeEventListener('mouseout', changeOpacityToOne);
    }
  });



  if (inJSON) {
    var newMarker = new H.map.DomMarker({lat:lati, lng:lon}, {
      icon: domIcon
    });
    map.addObject(newMarker);
  } else {


    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var occ = document.getElementById("occasion").value;
    var time = document.getElementById("time").value;

    if (name !== "" && email !== "" && occ !== "" && time !== "") {

      var newMarker = new H.map.DomMarker({lat:lati, lng:lon},{
          icon: domIcon
      });


      // //api.jsonbin.io/b/5bc2f24b716f9364f8c37e6c
      // $2a$10$aXtCIwATAuWL.aDyqGE7T.H1wbu7giYVFtaPvtT6B/srWOafZgX1W

      map.addObject(newMarker);

      unfill();

      var val;
      var returned_json;
      var jsonval = function(returned_json) {
        val = returned_json;
        update(val);
      }

      getJSON(jsonval);

      function getJSON(callback) {
        let req1 = new XMLHttpRequest();
        req1['responseType'] = "text";
        req1.open("GET", "https://api.jsonbin.io/b/5bc2f24b716f9364f8c37e6c/latest", true);
        req1.setRequestHeader("secret-key", "$2a$10$aXtCIwATAuWL.aDyqGE7T.H1wbu7giYVFtaPvtT6B/srWOafZgX1W");
        req1.send();
        req1.onreadystatechange = () => {
          if (req1.readyState == XMLHttpRequest.DONE) {
            returned_json = req1.responseText;
            callback(returned_json);
          }
        };
      }

      var update = function(data) {
        let req2 = new XMLHttpRequest();
          req2.onreadystatechange = () => {
            if (req2.readyState == XMLHttpRequest.DONE) {
              console.log(req2.responseText);
            }
          };

        data = JSON.parse(data);
        data['beacons'].push({"name": name, "email": email, "occ": occ, "time": time, "lat": lati, "lon": lon});
        data = JSON.stringify(data);

        req2.open("PUT", "https://api.jsonbin.io/b/5bc2f24b716f9364f8c37e6c", true);
        req2.setRequestHeader("Content-type", "application/json");
        req2.send(data);
      }
    }
  }
}

/**
* Boilerplate map initialization code starts below:
*/

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
    app_id: 'hM6QGhSurmnxc8i69ynP',
    app_code: 'GoO9Ti5ehS-nrEQQcm-KGQ',
    useHTTPS: true
});

var pixelRatio = window.devicePixelRatio || 1;
var defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
});

//Step 2: initialize a map  - not specificing a location will give a whole world view.
var map = new H.Map(document.getElementById('map'),
defaultLayers.normal.map, {pixelRatio: pixelRatio});

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
moveMapToBerlin(map);
setUpClickListener(map);
addDomMarker(map);
