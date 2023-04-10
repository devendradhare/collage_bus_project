"use strict";

var express = require('express');

var app = express();
app.use(express["static"]('public'));

var http = require('http').Server(app);

var port = process.env.PORT || 80; // setup my socket server

var io = require('socket.io')(http);

var count = 0;
var students = [];

function uniqu_students(obj) {
  var i;

  for (i = 0; i < students.length; i++) {
    if (students[i].userid == obj.userid) {
      students[i].msg = obj.msg; // console.log("obj is alredy avilable in the array");

      return;
    }
  }

  students.push(obj);
  console.log("students length = ", students.length);
  console.log("added:", students);
}

io.on('connection', function (socket) {
  console.log('New connection');
  count = io.engine.clientsCount;
  console.log("Connected clients: " + count);
  io.emit('participants', count); // to do: count clients in a room 
  // https://stackoverflow.com/questions/31468473/how-to-get-socket-io-number-of-clients-in-room
  // Called when the client calls socket.emit('message')

  socket.on('message', function (obj) {
    console.log("obj = ", obj);
    uniqu_students(obj);
    io.emit('message', students); // to all, including the sender
  }); // Called when a client disconnects

  socket.on('disconnect', function () {
    console.log('Disconnection ');
    count = io.engine.clientsCount; // console.log("count ==== ",count);

    console.log("Connected clients: " + count);
    io.emit('participants', count);
    students = [];
  });
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/default.html');
});
http.listen(port, function () {
  console.log('listening on *: ' + port);
}); // ==============================================
// ================ GARBAGE CODE ================
// ==============================================
// socket.on("room",function(room) {
//     console.log("Room: " + room);
//     socket.join(room);
// });
// console.log('Chatlog - Room: ' + obj.room + ' | ' + obj.userid + ': ' + obj.msg);     
// socket.broadcast.emit('message', msg); // to all, but not the sender
// io.to(obj.room).emit('message',obj); // to all, including the sender