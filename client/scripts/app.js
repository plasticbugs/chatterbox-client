var app = {
  server: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
  allRooms: {},
  friends: {},
  currentRoom: '',
  init: function () {
    app.fetch();
    $(document).ready(function() {
      if (!app.ranTheThing) {
        $('#send .submit').on('submit', function (event) {
          event.preventDefault(); 
          app.handleSubmit();
        });
        app.ranTheThing = 1;
      }
      $('.new-room').on('click', function () {
        var roomToCreate = prompt('What room name?') || 'lobby';
        if (app.allRooms[roomToCreate] === undefined) {
          app.allRooms[roomToCreate] = [];
          var dropdown = $('#roomSelect');
          var element = `<option value='${roomToCreate}'>${roomToCreate}</option>`;
          dropdown.append(element);
          $("select option[value='" + roomToCreate +"']").attr('selected','selected');
        }
        app.renderRoom(roomToCreate);
      });
    });
    
    setInterval(function () {
      app.renderRoom(app.currentRoom);
    }, 2500);

  },
  
  send: function (message) {
    $.ajax({
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages',
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
      // dataFilter: function (data) { return app.scrubData(data); },
      success: function (data) {
        console.log('fetch successful');
        // prepend the data to the page

        for (var i = 0; i < data.results.length; i++) {
          var chat = data.results[i];
          // render the chat element to the screen
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
        $( 'select' ).change(function() {
          $( 'select option:selected' ).each(function() {
            app.renderRoom($(this).text());
          });
        }).trigger( "change" );
        return true;
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get messages', data);
      }
    });
  },
  
  clearMessages: function () {
    $('#chats').children().remove();
  },

  renderMessage: function (message) {
    var classes;
    if (app.friends.hasOwnProperty(message.username)) {
      // parse the chat string into a jquery obj
      classes = 'username friend';
    } else {
      classes = 'username';
    }
    var chat = `<div class='chat'><a class='${classes}' href='#'>${message.username}</a><p class='text'>${message.text}</p></div>`;
    $('#chats').append(chat);

    $('.username').on('click', function(event) {
      event.preventDefault();
      app.handleUsernameClick.call(this);
    });
  },

  renderRoom: function (roomName) {
    app.currentRoom = roomName;
    if (!app.allRooms[roomName]) {
      var dropdown = $('#roomSelect');
      var element = `<option value='${roomName}'>${roomName}</option>`;
      dropdown.append(element);
    }

    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfs.hackreactor.com/chatterbox/classes/messages?order=-createdAt&where={"roomname":"' + roomName + '"}',
      type: 'GET',
      contentType: 'application/json',
      // dataFilter: function (data) { return app.scrubData(data); },
      success: function (data) {
        app.clearMessages();
        // loop through the data
        _.each(data.results, function(message) {
        // render each message
          app.renderMessage(message);
        });


        console.log('chatterbox: Room Rendered');
      },
      error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  handleUsernameClick: function () {
    app.friends[$(this).text()] = $(this).text();
  },
  handleSubmit: function () {
    var message = {
      username: window.location.search.slice(10),
      text: $('#message').val(),
      roomname: app.currentRoom
    };
    app.send(message);
    $('#message').val('');
  },
  // scrubData: function (data) {

  //   var data = JSON.parse(data);
  //     // var.responseText = data.responseText;
  //     // loop through each result and look at the text
  //       // strip out the left bracket things
  //   for (var i = 0; i < data.results.length; i++) {
  //     // if there is no text in the message
  //     if (!data.results[i].text) {
  //       // splice out the empty message
  //       data.results.splice(i, 1);
  //     } else {
  //       var textToChange = data.results[i].text;
  //       var newText = textToChange.replace(/</g, 'java');
  //       var newText = newText.replace(/>/g, ' is fun! ');
  //       data.results[i].text = newText;

  //       if (!data.results[i].username) {
  //         data.results[i].username = ' ';
  //       }
  //       var nameToChange = data.results[i].username;
  //       var newName = nameToChange.replace(/</g, 'java');
  //       var newName = newName.replace(/>/g, ' is fun! ');
  //       data.results[i].username = newName;
  //     }
  //   }
  //   return JSON.stringify(data);
  // }
};


app.init();




// on click of username
// add user to app.friends






