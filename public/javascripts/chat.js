(function () {
  if (typeof App === 'undefined') {
    window.App = {};
  }
  
  var Chat = App.Chat = function (socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function (message) {
    this.socket.emit('message', { text: message });
  };
  
  Chat.prototype.processCommand = function (input) {
    if (input[0] === '/') {
      var words = input.split(" ");
      var command = words[0];
      
      if (command === '/nick') {
        this.socket.emit('nicknameChangeRequest', { nick: words[1] });
      } else {
        this.socket.emit('message', {
          text: 'ERROR: Unrecognized command.'
        })
      }
      
    } else {
      this.sendMessage(input);
    }
  }
})();