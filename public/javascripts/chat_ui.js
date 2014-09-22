(function () {
  if (typeof App === 'undefined') {
    window.App = {};
  }
  
  var ChatUi = window.App.ChatUi = function (options) {
    this.chat = options.chat;
    this.$rootEl = options.$rootEl;
  };
  
  ChatUi.prototype.displayUsers = function (usersHash) {
    this.$rootEl.find('#users').empty();
    var that = this;
    Object.keys(usersHash).forEach(function (key) {
      var $li = $('<li></li>');
      $li.text(usersHash[key]);
      that.$rootEl.find('#users').prepend($li);
    });
  };

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
   });
   
  socket.on('updateUsers', function (data) {
    ui.displayUsers(data.users);
  });
   
  socket.on('message', function (data) {
    var message = '< ' + data.nick + ' > ' + data.text;
    ui.addMessage(message);
  });
  
  $('form').on('submit', function (event) {
    event.preventDefault();
    ui.sendMessage();
  })
});