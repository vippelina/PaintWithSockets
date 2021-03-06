/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//Här är en kommentar
var express = require("express");

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var map = {};
server.listen(process.env.PORT || 5000);

app.use(express.static(__dirname + "/public_html"));
app.use(express.static(__dirname + "/js/libs"));
//kim har bidragit!! OCH VIPPS!!! kimkimkim
io.sockets.on("connection", function(socket){
    //console.log("in i sockets on connection, app.js");
    //here we catch the event thrown from client, with callback as second argument
    //the data object is the received message
    socket.on("send msg", function(data){
       io.sockets.emit("get msg", data); 
       //$scope.msg.text = "";
       //this will be catched bli client on its socket.on get msg
    });
    
    //receives points and sends them out to all connected sockets
    socket.on("send points", function(data){
       io.sockets.emit("get points", data); 
    });

    socket.on("join", function(name){
        people[socket.id] = name;

        socket.emit("update", "You have connected to the server.");
        socket.sockets.emit("update", name + " has joined the server.")
        socket.sockets.emit("update-people", people);
    });

    socket.id = Math.floor(Math.random() * 1000);

    socket.on('data', function(data) {
        socket.write('ID: '+socket.id);
     
    });

    socket.on('chat message', function(msg){
        io.sockets.emit('chat message', socket.id, msg);
    });
});

