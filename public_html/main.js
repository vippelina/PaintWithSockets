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
            //create object of position
            var position = {};
            position.x = event.offsetX;
            position.y = event.offsetY;
            socket.emit("send points", position);
       //send points to server
       }
    };
    
    $scope.ablePaint = function(){
        isPressed = true;
    };
    
    $scope.disablePaint = function(){
        isPressed = false;
    };
    
    //get the points from server
    socket.on("get points", function(data){
       //draw line between the points
       //context.lineWidth = radius*2;
       context.lineTo(data.x, data.y);
       context.stroke;
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