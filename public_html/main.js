/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module("ChatApp", []);

//get a socket connection to server
app.factory("socket", function(){
    console.log("socket function");
    var socket = io.connect("http://localhost:3000");
    return socket; 
});

app.controller("ChatCtrl", function($scope, socket){ 
    //get the canvas, set it's width and get its context
    var canvas = $("#canvas")[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    context = canvas.getContext('2d');

    //set the thicknes of the pencil
    var radius = 10;
    //set the linewidht twice the radius
    var linewidth = radius*2;
    //variables to detect mouse behaviour
    var isPressed = false;
    
    //function draw points
    $scope.putPoint = function(event){
       if(isPressed){
            //create object with position info
            var eventInfo = {};
            eventInfo.x = event.offsetX;
            eventInfo.y = event.offsetY;
            eventInfo.type = event.type;
            socket.emit("send points", eventInfo);
       //send points to server
       }
       
       
    };
    
    $scope.ablePaint = function(event){
        isPressed = true;
       // context.moveTo(event.offsetX, event.offsetY);
        $scope.putPoint(event);
    };
    
    $scope.disablePaint = function(event){
        isPressed = false;
     //   context.moveTo(event.offsetX, event.offsetY);
    };
    
    //get the points from server
    socket.on("get points", function(data){
        //do not draw to if there was a click
        if(data.type === "mousedown"){
            context.beginPath();
            context.moveTo(data.x, data.y);
        }
       //draw line between the points
       context.lineWidth = linewidth;
       context.lineTo(data.x, data.y);
       context.stroke();
       //this is where we put the point
       context.beginPath();
       context.arc(data.x, data.y, radius, 0, Math.PI*2);
       context.fill();
       //prepare painter for next action
       context.beginPath();
       context.moveTo(data.x, data.y);
    });
});

$("#msgInput").submit(function(e){
    $(this).find($("input")).text("");
    e.preventDefault();
  });