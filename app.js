
'use strict'

var zmq = require('zmq')
  , sock = zmq.socket('sub')
  , express = require('express')
  , http = require('http')
  , app = express()  
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  ;

app.set('views', __dirname + '/views')
app.set('view engine', 'pug')
app.use(express.static(__dirname + '/public'))

sock.connect('tcp://192.168.1.104:3000');
sock.subscribe('0');
sock.subscribe('1');

sock.on('message', function(topic, msg) {
    var status = msg[0],
        adc = msg.readUInt16BE(1) >>> 1,
        temp = adc * 0.031249727 + (-255.9977596);
    console.log('received a message related to:', topic[0], 'containing message:', status, msg, adc, temp);
    io.emit('temp', { for: 'everyone', id: topic.toString(), temp: temp, adc: adc, status: status }); 
});

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})

server.listen(80)

io.on('connection', function(socket){
  // console.log('a user connected');
});
