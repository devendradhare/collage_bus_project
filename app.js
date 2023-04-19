var express = require('express');
var app = express();
const fs = require('fs');
app.use(express.static('public'))
// app.use(express.json());       
app.use(express.urlencoded({ extended: true }));;
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

// setup my socket server
var io = require('socket.io')(http);
let count = 0;
let students = [];
let set_intr = true;

function uniqu_students(obj) {
    console.log(obj);
    for (var i = 0; i < students.length; i++) {
        if (students[i].userid == obj.userid) {
            students[i].coord = obj.coord;

            // write it in a file 
            // const d = new Date();
            // fs.appendFile(`user_data\\${obj.user_name + "_" + obj.userid}.txt`,
            //     "coord [" + obj.coord + "], userid: " + obj.userid + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "\n",
            //     (err) => { if (err) throw err; });
            return;
        }
    }
    students.push(obj);
    console.log("students length = ", students.length)
    console.log("added:", students);
}

io.on('connection', function (socket) {
    console.log('New connection');
    count = io.engine.clientsCount;
    console.log("Connected clients: " + count);
    io.emit('participants', count);
    if (set_intr) {
        set_intr = false;
        let si = setInterval(() => {
            if (!count) {
                clearInterval(si);
                set_intr = true;
                console.log(" stoped : " + si);
            }
            console.log("message sended " + count + " started : " + si);
            io.emit('mark_it_on_map', students); // to all, including the sender
        }, 2000);
    }

    socket.on('my_coords', function (obj) { uniqu_students(obj); });// Called when the client calls socket.emit('my_coords')

    socket.on('disconnect', function () {       // Called when a client disconnects
        count = io.engine.clientsCount;
        console.log('Disconnection \nConnected clients: ' + count);
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
    console.log("Username: " + username + "\ni am a:   " + student);
    res.sendFile(__dirname + '/public/default.html');
});

// app.listen(port);
http.listen(port, function () {
    console.log('listening on *: http://127.0.0.1:' + port);
});