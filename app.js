var express = require('express');
var app = express();
const fs = require('fs');
const { setInterval } = require('timers/promises');
app.use(express.static('public'))
// app.use(express.json());       
app.use(express.urlencoded({extended: true})); ;
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

// setup my socket server
var io = require('socket.io')(http);
let count = 0;
let students = [];

function dvn(){
    console.log("students:");
}

function uniqu_students(obj) {
    // io.emit('mark_it_on_map', students); // to all, including the sender
    console.log("added:", students);
    var i = 0;
    for (i = 0; i < students.length; i++) {
        if (students[i].userid == obj.userid) {
            students[i].coord = obj.coord;

            // write it in a file 
            const d = new Date();
            fs.appendFile(`user_data\\${obj.user_name+"_"+obj.userid}.txt`,"coord ["+ obj.coord+"], userid: "+obj.userid+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"\n", (err) => {
                if (err) throw err;
            });
            // console.log("obj is alredy avilable in the array");
            return;
        }
    }
    students.push(obj);
    console.log("students length = ", students.length)
}
const delay = ms => new Promise(res => setTimeout(res, ms));

io.on('connection', function (socket) {
    console.log('New connection');
    count = io.engine.clientsCount;
    console.log("Connected clients: " + count);
    io.emit('participants', count);
    // to do: count clients in a room 
    // https://stackoverflow.com/questions/31468473/how-to-get-socket-io-number-of-clients-in-room

    // Called when the client calls socket.emit('message')
    socket.on('my_coords', function (obj) {
        // console.log("obj = ", obj);
        uniqu_students(obj);
        io.emit('mark_it_on_map', students); // to all, including the sender
    });
    
    // Called when a client disconnects
    socket.on('disconnect', function () {
        console.log('Disconnection ');
        count = io.engine.clientsCount;
        // console.log("count ==== ",count);
        console.log("Connected clients: " + count);

        io.emit('participants', count);
        students = [];
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.post("/", (req, res) => {
    const username = req.body.user;
    const student = req.body.join_as_;
    console.log("Username: " + username + " " + student);
    // res.sendFile(__dirname + '/public/default.html');
    res.sendFile(__dirname + '/public/default.html');
    
});

// app.listen(port);
http.listen(port, function () {
    console.log('listening on *: http://127.0.0.1:' + port);
});


// const fs = require('fs')
      
// // Data which will write in a file.
// let data = "Learning how to write in a file."
  
// // Write data in 'Output.txt' .
// fs.writeFile('Output.txt', data, (err) => {
      
//     // In case of a error throw err.
//     if (err) throw err;
// })

// ==============================================
// ================ GARBAGE CODE ================
// ==============================================
// socket.on("room",function(room) {
    //     console.log("Room: " + room);
//     socket.join(room);
// });
    // console.log('Chatlog - Room: ' + obj.room + ' | ' + obj.userid + ': ' + obj.msg);     
    // socket.broadcast.emit('message', msg); // to all, but not the sender
    // io.to(obj.room).emit('message',obj); // to all, including the sender