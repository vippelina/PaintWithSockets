/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module("ChatApp", []);

//get a socket connection to server
app.factory("socket", function(){
    console.log("socket function");
    var socket = io.connect("http://localhost:8763");
    return socket; 
});

app.controller("ChatCtrl", function($scope, socket){ 
    //create an array to save all messages
    $scope.msgs = [];
    $scope.sendMsg = function(){  
        //the emit function sends to server
        //first argument is the action
        socket.emit("send msg", $scope.msg.text);
        //clear input field
        $scope.msg.text = "";
    };//send Msg function
    //this is where we catch the get msg from server
    socket.on("get msg", function(data){
        console.log("get message callback");
       //angular vet inte att man måste uppdatera the messages model på frontend
       //därför måste man använda sig av digest
       $scope.msgs.push(data);
       $scope.$digest();
    });//socket on
});

$("#msgInput").submit(function(e){
    $(this).find($("input")).text("");
    e.preventDefault();
  });