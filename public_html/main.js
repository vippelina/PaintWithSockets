/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module("ChatApp", []);

//get a socket connection to server
app.factory("socket", function(){
    console.log("socket function");
    var socket = io.connect(window.location.hostname);
    return socket; 
});


var obj = {
    user : 'user',
    message : ''
  };

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

    //form
    $('form').submit(function(){
        $scope.submitForm();
    });

     $scope.submitForm = function(event){
        obj.message = $('#m').val();
        socket.emit('chat message', obj);
        $('#m').val('');
        return false;
     }
     //chat
    $scope.onChatUpdate = function (from, msg){
      $('#chat').append($('<li>').text(from+" says: "+msg.message));
      $('#chat').css('color', col); 
    }

    $scope.ablePaint = function(event){
        isPressed = true;
       // context.moveTo(event.offsetX, event.offsetY);
        $scope.putPoint(event);
    };
    
    $scope.disablePaint = function(event){
        isPressed = false;
     //   context.moveTo(event.offsetX, event.offsetY);
    };

    $scope.getRandomColor = function() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }
      

    //$scope.kimsVar = "HEJ JAG HETER KIM";
    //$scope.objArr = [{namn: "Vippe", age: "21"}, {namn: "kim", age: "78"}, {namn: "Sara", age: "13"}];

    
    //get the points from server
    socket.on("get points", function(data){
        //do not draw to if there was a click
        console.log('client on get points '+data);
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


    // get chat updates
    socket.on("chat message", function(from, msg){
        $scope.onChatUpdate(from, msg);      
    });

    socket.on('update', function(msg){
      //$('#messages').append($('<li>').text(msg));
    });
});
