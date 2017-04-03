var app = {
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
  init: function () {},
  
  send: function (message) {
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function () {
    $.ajax({
      url: this.server,
      type: 'GET',
      dataType: 'json',
      dataFilter: function(data) {
        var data = JSON.parse(data);
        // var results = data.results;
        // loop through each result and look at the text
          // strip out the left bracket things
        for (var i = 0; i < data.results.length; i++) {
          // var re1 = /</;
          // var re2 = />/;
          var textToChange = data.results[i].text;
          var newText = textToChange.replace(/</g, 'java');
          var newText = newText.replace(/>/g, ' is fun! ');
          data.results[i].text = newText;
          var nameToChange = data.results[i].username;
          var newName = nameToChange.replace(/</g, 'java');
          var newName = newName.replace(/>/g, ' is fun! ');
          data.results[i].username = newName;
          // use a regex to find the left brackets
        }
        return JSON.stringify(data);
      },
      success: function (data) {
        console.log('fetch successful');
        // prepend the data to the page
        for (var i = 0; i < data.results.length; i++) {
          var chat = `<div class='chat'><p class='username'>${data.results[i].username}</p><p class='text'>${data.results[i].text}</p></div>`;
          $('#chats').prepend(chat);
          console.log(i);
        }

        window.test = data.results;
        return true;
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get messages', data);
      }
    });
  }
};


















