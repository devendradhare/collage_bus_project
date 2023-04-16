// MapBox api key
mapboxgl.accessToken =
  'pk.eyJ1IjoiY29kZW5kcmFtIiwiYSI6ImNsZzRneHZpMDBwNjUzZXN0MzNjdzc1cTcifQ.bv5VgjZ12reLoeK9w-teYg';

var socket = io();                                        // setup my socket client
let user_count = 0;                                       // connected users
let position = [78.8700483, 21.9521117];                  // default coordinates (chhindwara)

let userid = Math.random().toString(36).substring(2, 7);  // program to generate random strings
let cookie_data = document.cookie.split("dvn")[1].split("split");

var map = new mapboxgl.Map({                              // setting up MapBoxe
  container: 'map', style: 'mapbox://styles/mapbox/streets-v11',
  center: [77.39889912939028, 23.25604944351329],         // it will sets the camera of the map above bhopal
  zoom: 11, // minZoom: 10
}); 00

var geolocate = new mapboxgl.GeolocateControl({           // getting currunt coordinates of the user
  positionOptions: { enableHighAccuracy: true },
  trackUserLocation: false,
  showUserHeading: true
});

map.addControl(geolocate);              // the button on the map to showing our current position
map.on('load', function (e) {
  setInterval(() => { geolocate.trigger(); }, 3000);
});

geolocate.on('geolocate', (e) => {
  map.flyTo({ zoom: map.getZoom() });
  position = [e.coords.longitude, e.coords.latitude];
});


window.onload = function () {
  setInterval(() => {                                 // sending users location coordinates 
    socket.emit('my_coords', {                        // to the server in evry 3 sec.
      "coord": position, "userid": userid,
      "user_name": cookie_data.at(0),
      "i_am_a": cookie_data.at(1)
    });
  }, 3000);

  var markers = [];                                   // adding marker of the users location
  socket.on('mark_it_on_map', function (obj) {        // receiving marker data form the server
    markers.forEach(element => { element.remove(); });// removeing old and offline users marker
    let geojson = {                                   // telling to the map, where to add markers
      'type': 'FeatureCollection',
      'features': [],
    };
    obj.forEach(el => {                               // process of adding marker
      geojson.features.push({
        'userid': el.userid, 'i_am_a': el.i_am_a,
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': el.coord
        },
      });
    });

    for (const feature of geojson.features) {         // adding each users markers on the map
      const el = document.createElement('div');
      el.className = feature.i_am_a;                  // make a marker for each feature and 
      var temp = new mapboxgl.Marker(el)              // add it to the map
        .setLngLat(feature.geometry.coordinates).addTo(map);
      markers.push(temp);
    }
  });

  socket.on('participants', function (count) {        // updating conncted users count
    user_count = count;
    document.getElementById("participants").innerHTML = " " + count;
  });
}