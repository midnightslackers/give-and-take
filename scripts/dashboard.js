(function(module, $) {

  function populateUser(userId, firstName) {
    $('.js-user-profile-link')
      .attr('data-user-id', userId)
      .text(firstName);
  }

  (function populateTopics() {
    $.ajax({
      url: '/api/topics',
      type: 'GET',
      contentType: 'application/json',
    }).done(function (data) {
      if (data.status === 'success') {
        var topicObjList = data.result;
        var filter = $('#filter-topic');
        
        $.each(topicObjList, function() {
          filter.append($('<option />').val(this._id).text(this.name));
        });
      }
    });
  })();

  (function populateSubtopics(topicId) {
    console.log('starting populate TOPics()');
    $.ajax({
      url: '/api/subtopics',
      type: 'GET',
      contentType: 'application/json',
    }).done(function (data) {
      console.log('ajax done');
      if (data.status === 'success') {
        console.log('response success');
        var topicObjList = data.result;
        console.log(data.result);
        var filter = $('#filter-subtopic');
        
        $.each(topicObjList, function() {
          filter.append($('<option />').val(this._id).text(this.name + ' - ' + this.topic.name));
        });
      }
    });
  })();

  function selectTopic() {
    $('.js-filter-topics').on('change', function () {
    });
  }

  function selectSubtopic() {
    $('.js-filter-subtopics').on('change', function () {
    });
  }

  function getPanels() {
    $.ajax({
      url: '/api/users',
      type: 'GET',
      contentType: 'application/json',
    }).done(function (data) {
      if (data.status === 'success' && data.result) {
        var $panels = $('.panels');

        $panels.html('');

        data.result.forEach(function (currentPanel, index) {
          if (index % 3 === 0) {
            $('<div>').addClass('row').appendTo($panels);
          }

          currentPanel.panelClass = 'panel panel-default js-modal-profile';

          if (currentPanel.profileImage) {
            currentPanel.panelClass += ' panel--left-image';
          }

          currentPanel.topic = '';
          currentPanel.subtopic = '';

          if (currentPanel.skills) {
            currentPanel.subtopic = currentPanel.skills[0].name;

            // var subtopics = currentPanel.subtopic = currentPanel.skills[0].subtopics;
            //
            // if (subtopics) {
            //   currentPanel.subtopic = subtopics.subtopic;
            // }
          }

          var source = $('#panel-template').html();
          var template = Handlebars.compile(source);
          var html = template(currentPanel);

          $panels.find('.row:last-child').append(html);
        });
      }
    });
  }

  function createProfile() {
  }

  function getProfile() {
    $('#profile-modal').on('shown.bs.modal', function () {
      $('#myInput').focus()
    })

    $.ajax({
      url: '/api/users/' + selectedUserId,
      type: 'GET',
      contentType: 'application/json',
    }).done(function(data) {
      if (data.status === 'success') {
        var template = $('#profile-template').html();

        // TODO: handlebars
      }
    });
  }

  function sendMessage() {
    var userId = localStorage.getItem('userId');
    var senderFirstname;
    var senderEmail;
    $.ajax({
      url: '/api/users/' + userId,
      type: 'GET',
      contentType: 'application/json',
    }).done(function(data) {
      if (data.status === 'success') {
        senderFirstname = data.result.firstname;
        senderEmail = data.result.username;
        // TO DO : autofill form with name and email
        // var source = $('#profile-template').html();
        // var template = Handlebars.compile(source);
        // var context = {};
        // var html = template(context);
      }
    });

    $('.js-send-message').on('submit', function (e) {
      e.preventDefault();
      // grabbing field info
      // ajax POST to api/users/sender/message

    });
  }

  function logout() {
    $('.js-logout').on('click', function (e) {
      e.preventDefault();

      localStorage.removeItem('token');
      localStorage.removeItem('firstname');
      localStorage.removeItem('userId');

      location.assign('/');
    });
  }

  $(function () {

    // Checks if there's a token and is valid
    var currentToken = localStorage.token;

    if (currentToken) {
      var dataObj = {
        token: currentToken
      };

      $.ajax({
        url: '/api/auth/validate',
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
        data: dataObj
      }).done(function (data) {
        if (data.status === 'success' && data.result === true) {
          // valid token
          $('body')
            .removeClass('hide')
            .show();

          populateUser(localStorage.userId, localStorage.firstname);
          getPanels();
          logout();
        } else {
          // invalid token
          location.assign('/');
        }
      });
    } else {
      // no token found
      location.assign('/');
    }

  });

}(window, jQuery));
