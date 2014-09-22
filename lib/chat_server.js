var chatServer = function (server) {
  var io = require('socket.io')(server);
  var guestnumber = 1;
  var nicknames = {}; // keys are sockets, values are usernames
  
  var validNick = function (nick) {
    var isValid = true;
    
    if (!!nick.match(/^guest\d*$/i)) { // Working! yayayyyyyy!
      isValid = false;
    }
  
    Object.keys(nicknames).forEach(function (key) {
      if (nicknames[key] === nick) {
        isValid = false;
      }
    })
    
    return isValid;
  };

  io.on('connection', function (socket) {
    nicknames[socket.id] = 'guest' + guestnumber;
    guestnumber += 1;
    
    io.emit('message', {
      nick: 'Server',
      text: nicknames[socket.id] + ' has joined the channel.'
    })
    
    io.emit('updateUsers', {
      users: nicknames
    });
    
    socket.on('disconnect', function () {
      io.emit('message', {
        text: nicknames[socket.id] + ' has left the channel.'
      });
      delete nicknames[socket.id];
      io.emit('updateUsers', {
        users: nicknames
      });
    });
    
    socket.on('message', function (data) {
      data.nick = nicknames[socket.id];
      io.emit('message', data);
    });
    
    socket.on('nicknameChangeRequest', function (data) {
      changeNick(data.nick);
    });
    
    function changeNick (newNick) {

      if (validNick(newNick)) {
        var oldNick = nicknames[socket.id];
        nicknames[socket.id] = newNick;
        
        io.emit("message", {
          nick: 'Server',
          text: oldNick + ' has changed their name to ' + newNick
        });
        io.emit('updateUsers', {
          users: nicknames
        });
      } else {
        socket.emit('message', {
          nick: "Server",
          text: "Nickname is invalid or already taken."
        });
      }
    };
    
    function parseMessage (data) {
      return data.text.split(" ")[0];
    }
  });  
};

module.exports = chatServer;