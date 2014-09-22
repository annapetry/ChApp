var chatServer = function (server) {
  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    socket.emit('from_server', { msg: 'Server Connection Established' });
    socket.on('message', function (data) {
      io.emit('message', data);
    });
  });  
}

module.exports = chatServer;