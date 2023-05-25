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
            count = io.engine.clientsCount;
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






// write this project dicription in a professional way in very detail



// mpu's collage bus tracking web app. use this app to track your collage bus location in real time, 
// as well as you can track students location too

// how to use it-
// 1. open the website
// 2. enter your name
// 3. if you are a student the click "i am an student" button.
// 4. if you are a driver then click "i am a driver" button, after that enter your password in new popup.
// 5. after doing this, can see a map, where you can track the bus, and watch where is the students are waiting for bus.

// note -
// 1. it will not work if you leave the tab of lock your mobile phone.
// 2. you have to allow permitions of the location.

// used tecnology-
// in frontend: html, css, js
// in backend: nodejs, socket.io
// apis - mapbox

// [explain here what is web socket in brief]
// [explain here what is mapbox in brief]

// created by devendra dhare

// github link - https://github.com/devendradhare/collage_bus_project.git
// instagram - https://www.instagram.com/devendra_dhare22?utm_source=qr











// according to you just explain
// this is some brief details of my project can you pleace expend it in detail like you just explained

// Cover Page:
// Project Title - mpu bus live
// Our teem - devendra dhare, abhay kodale
// Course Name and Code - BCA / BCA605
// College/University Name - madhyanchal profissional university bhopal MP
// Date - 26/05/2023

// MPU's College Bus Tracking Web App is a sophisticated application designed to provide real-time tracking of college buses and students' locations. By utilizing this app, users can easily monitor the current location of their college bus, as well as track the whereabouts of individual students.

// To use the app, follow these steps:

// 1.	Access the website.
// 2.	Enter your name.
// 3.	If you are a student, click the "I am a student" button.
// 4.	If you are a driver, click the "I am a driver" button and enter your password in the subsequent popup.
// 5.	Once authenticated, a map will be displayed, allowing you to track the bus's location and observe where students are waiting.

// Please take note of the following:

// 1.	The app requires an active tab or an unlocked mobile phone to function properly.
// 2.	Location permissions must be granted for the app to operate correctly.

// Technologies employed in the development of this application include:

// - Frontend:   HTML, CSS, JavaScript
// - Backend:    Node.js, Socket.IO
// - API:             Mapbox

// What is web socket:

// Web Socket is a communication protocol that enables real-time, bidirectional data exchange between clients and servers over a single, long-lived connection. It facilitates instant data transmission, making it ideal for applications requiring real-time updates.

// What is MapBox:

// Mapbox is an API that offers mapping and location-based services. It provides developers with powerful tools and functionalities to incorporate maps and geospatial data into their applications.

// The project was created by Devendra Dhare.

// GitHub Link:  https://github.com/devendradhare/collage_bus_project.git
// Instagram:     https://www.instagram.com/devendra_dhare22?utm_source=qr





// Table of Contents:
// List all the sections or components of your project file with their corresponding page numbers.

// Introduction:
// Provide an overview of your project and its objectives.

// Explain the relevance and significance of your project.
// Literature Review (if applicable):
// Summarize existing research, theories, or scholarly articles related to your project.
// Discuss their relevance and influence on your work.

// Methodology:
// Describe the research methodology or approach you followed.
// Explain the data collection methods, experimental procedures, or research techniques used.
// Implementation:
// Describe how you implemented your project.
// Provide details about the tools, technologies, programming languages, or frameworks used.
// Include code snippets, algorithms, or flowcharts if applicable.
// Results and Analysis:
// Present the findings or results of your project.
// Use tables, graphs, charts, or visualizations to represent data.
// Analyze and interpret the results, discussing their implications.
// Discussion:
// Reflect on the findings of your project.
// Discuss any limitations, challenges, or unexpected outcomes encountered.
// Provide a critical analysis of your project's strengths and weaknesses.
// Suggest improvements or areas for future research.
// Conclusion:
// Summarize the main points and achievements of your project.
// Restate the objectives and significance of your work.
// Discuss the broader impact or potential applications.
// References:
// Include a list of all the sources you cited in your project.
// Follow a consistent citation style (e.g., APA, MLA) as specified by your institution.
// Appendices (if applicable):
// Include any additional supporting materials such as raw data, questionnaires, or supplementary charts and diagrams.