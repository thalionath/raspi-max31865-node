
var socket = io();

socket.on('temp', function(msg){
    $('#temp' + msg.id).text(msg.temp.toFixed(2));
});


