var app = {
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
  allRooms: {},
  init: function () {
    app.fetch();
    // console.log(app.allRooms) // undefined;
  },
  
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
    // var dataObject = {
    //   "roomname": roomName
    // }
    $.ajax({
      url: this.server,
      type: 'GET',
      dataType: 'json',
      dataFilter: function(data) {
        var data = JSON.parse(data);
        // var.responseText = data.responseText;
        // loop through each result and look at the text
          // strip out the left bracket things
        window.trash = data.results;
        for (var i = 0; i < data.results.length; i++) {
          // var re1 = /</;
          // var re2 = />/;
          if (!data.results[i].text) {
            data.results[i].text = ' ';
          }
          var textToChange = data.results[i].text;
          var newText = textToChange.replace(/</g, 'java');
          var newText = newText.replace(/>/g, ' is fun! ');
          data.results[i].text = newText;

          if (!data.results[i].username) {
            data.results[i].username = ' ';
          }
          var nameToChange = data.results[i].username;
          var newName = nameToChange.replace(/</g, 'java');
          var newName = newName.replace(/>/g, ' is fun! ');
          data.results[i].username = newName;


        }
        return JSON.stringify(data);
      },
      success: function (data) {
        console.log('fetch successful');
        // prepend the data to the page

        for (var i = 0; i < data.results.length; i++) {
          var chat = data.results[i];

          // take the message's room name and add it to a property so we can
          if (data.results[i].roomname && app.allRooms[data.results[i].roomname] === undefined) {
            app.allRooms[data.results[i].roomname] = [data.results[i]];
          } else if (data.results[i].roomname) {
            app.allRooms[data.results[i].roomname].push(data.results[i]);
          }
          // iterate over the property's keys to get all the possible room names
        }

        // set up our dropdown here;
        var dropdown = $('#roomSelect');
        for (var key in app.allRooms) {
          var element = `<option value='${key}'>${key}</option>`;
          dropdown.append(element);
        // set up the input on the page
        }

        window.test = data.results;
        return true;
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get messages', data);
      },
      complete: function () {
        // var dropdown = $('#roomSelect');
        // for (var key in app.allRooms) {
        //   // set up the input on the page

        // }

      }
    });
  },
  
  clearMessages: function () {
    $('#chats').children().remove();
  },

  renderMessage: function (message) {
    var chat = `<div class='chat'><p class='username'>${message.username}</p><p class='text'>${message.text}</p></div>`;
    $('#chats').prepend(chat);
  },

  renderRoom: function (roomName) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages?order=-createdAt&where={"roomname":"' + roomName + '"}',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        window.trash = data;
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });


  }
};


app.init();












