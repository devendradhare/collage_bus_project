"use strict";

// MapBox api key
mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZW5kcmFtIiwiYSI6ImNsZzRneHZpMDBwNjUzZXN0MzNjdzc1cTcifQ.bv5VgjZ12reLoeK9w-teYg'; // setup my socket client

var socket = io();
var user_count = 0; // difault position
// let position = [77.39889912939028, 23.25604944351329];
// chhindwara 78.8700483, 21.9521117

var position = [78.8700483, 21.9521117]; // setting up MapBoxe

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [77.39889912939028, 23.25604944351329],
  // starting position
  zoom: 4
}); // getting currunt coordinates of the user

var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  // When active the map will receive updates to the device's location as it changes.
  trackUserLocation: false,
  // Draw an arrow next to the location dot to indicate which direction the device is heading.
  showUserHeading: true
}); // the button on the map to showing our current position

map.addControl(geolocate);
map.on('load', function (e) {
  setInterval(function () {
    geolocate.trigger();
  }, 3000);
});
geolocate.on('geolocate', function (e) {
  map.flyTo({
    zoom: map.getZoom()
  });
  var lon = e.coords.longitude;
  var lat = e.coords.latitude;
  position = [lon, lat]; // console.log(position);
}); // program to generate random strings

var userid = Math.random().toString(36).substring(2, 7);
console.log("this is randome string", userid); // let userid = "0";

window.onload = function () {
  // userid
  // do {
  //   userid = prompt("enter your name: ");
  // } while (userid == undefined);
  // sending users location cordinates to the server in evry 5 sec.
  setInterval(function () {
    console.log("sending msg: " + position + " from " + userid);
    socket.emit('message', {
      "msg": position,
      "userid": userid
    });
  }, 3000); // adding marker of the users location

  var markers = []; // receiving marker data form the server

  socket.on('message', function (obj) {
    console.log("obj = ", obj); // removeing old and offline users marker

    markers.forEach(function (element) {
      console.log("element removed", element);
      element.remove();
    }); // telling to the map, where to add markers

    var geojson = {
      'type': 'FeatureCollection',
      'features': []
    }; // process of adding marker

    obj.forEach(function (el) {
      geojson.features.push({
        'userid': el.userid,
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': el.msg
        }
      });
    }); // add markers to map

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = geojson.features[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var feature = _step.value;
        var el = document.createElement('div');
        el.className = 'marker'; // make a marker for each feature and add it to the map

        var temp = new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map); // temp.remove();
        // console.log("=======temp=======", temp);

        markers.push(temp);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
  socket.on('participants', function (count) {
    var p = document.getElementById("participants");
    p.innerHTML = " " + count;
  });
}; // ==============================================
// ================ GARBAGE CODE ================
// ==============================================
// read room in querystring
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const room = urlParams.get('room');
//
//
// const generateRandomString = (length = 6) => Math.random().toString(20).substr(2, length);
// const generateRandomDarkColor = () => {
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//       color += Math.floor(Math.random() * 10);
//   }
//   return color;
// }
// socket.emit('room', room);
//
//   // let userid = "";
// localStorage.setItem("userid", userid);
// if (localStorage.getItem("userid")) {
//   userid = localStorage.getItem("userid");
// } else {
//   userid = generateRandomString(8);
//   localStorage.setItem("userid", userid);
//   // localStorage.setItem("userColor",generateRandomDarkColor());
// }
//
//
// $("form").on('submit', function (event) {
//   event.preventDefault();
//   // let msg = $("#msg").val();
//   let msg = position[0] + " " + position[1];
//   msg = msg.replace(/(<([^>]+)>)/gi, "");
//   const userid = localStorage.getItem("userid");
//   console.log("sending msg: " + msg + " from " + userid);
//   socket.emit('message', { "msg": msg, "userid": userid, "room": room });
//   $("#msg").val("hi");
// });
// $("form").on('submit', function (event) {
//   event.preventDefault();
// let msg = $("#msg").val();
// let msg = position;
// msg = msg.replace(/(<([^>]+)>)/gi, "");
// const userid = localStorage.getItem("userid");
// console.log("adding marker", i++);
// console.log("feature.userid = ");
// console.log(feature);
// create a HTML element for each feature
//
//
// let geojson = {
//   'type': 'FeatureCollection',
//   'features': [],
//   // 'features': [
//   //   {
//   //     'userid': userid,
//   //     'type': 'Feature',
//   //     'geometry': {
//   //       'type': 'Point',
//   //       'coordinates': position
//   //     },
//   //   }
//   // ]
// };
//
//
//
// geojson.features = [];
// let prevChat = $("#chatBoard").html();
// const ts = new Date().toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
// $("#chatBoard").html(prevChat + 'userid = ' + obj.userid + " message = " + obj.msg + ' time = ' + ts + '</br>');
// var chatboard = document.getElementById("chatBoard");
// chatboard.scrollTop = chatboard.scrollHeight;
// console.log(prevChat + obj.userid + ": " + obj.msg);
//
//
//
// window.addEventListener('beforeunload', function (e) {
//   socket.emit('disconnect', '=======');
// });