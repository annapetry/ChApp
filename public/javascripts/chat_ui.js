(function () {
  if (typeof App === 'undefined') {
    window.App = {};
  }
  
  var ChatUi = window.App.ChatUi = function (options) {
    this.chat = options.chat;
    this.$rootEl = options.$rootEl;
  }

  ChatUi.prototype.getMessage = function () {
    var message = this.$rootEl.find('#msg').val();
    this.$rootEl.find('#msg').val('');
    return message;
  };

  ChatUi.prototype.sendMessage = function () {
    var msg = this.getMessage();
    this.chat.sendMessage(msg);
  };

  ChatUi.prototype.addMessage = function (message) {
    var $ul = this.$rootEl.find('#msgs');
    var $li = $('<li></li>');
    $li.text(message);
    $ul.prepend($li);
  };
})();

$(function () {
   var socket = io('http://localhost');
   var chat = new App.Chat(socket);
   var ui = new App.ChatUi({
     chat: chat,
     $rootEl: $('body')
   })
  socket.on('message', function (data) {
    ui.addMessage(data.text);
  });
  
  $('form').on('submit', function (event) {
    event.preventDefault();
    ui.sendMessage();
  })
});