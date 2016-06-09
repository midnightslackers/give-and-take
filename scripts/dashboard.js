(function(module, $) {

  function populateUser(userId, firstName) {
    $('.js-modal-profile-self')
      .attr('data-user-id', userId)
      .text(firstName);
  }

  function populateTopics() {
    $.ajax({
      url: '/api/topics',
      type: 'GET',
      contentType: 'application/json',
    }).done(function (data) {
      if (data.status === 'success') {
        var template = $('#select-option-template').html();

        // TODO: handlebars
      }
    });
  }

  function populateSubtopics(topicId) {
    var ajaxUrl = '/api/topics/' + topicId + '/subtopics';

    $.ajax({
      url: ajaxUrl,
      type: 'GET',
      contentType: 'application/json',
    }).done(function (data) {
      if (data.status === 'success') {
        var template = $('#select-option-template').html();

        // TODO: handlebars
      }
    });
  }

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
      contentType: 'application/json'
    }).done(function (data) {
      if (data.status === 'success' && data.result) {
        var $panels = $('.panels');

        $panels.html('');

        data.result.filter(function (currentPanel) {
          return currentPanel._id !== localStorage.userId;
        }).forEach(function (currentPanel, index) {
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

  function selectPanel() {
    $('.navbar-nav, .js-panels').on('click', '.js-modal-profile', function (e) {
      e.preventDefault();

      var userId = $(this).attr('data-user-id');

      $.ajax({
        url: '/api/users/' + userId,
        type: 'GET',
        contentType: 'application/json'
      }).done(function (data) {
        if (data.status === 'success' && data.result) {
          data.result.notProfile = true;
          if (userId === localStorage.userId) {
            data.result.notProfile = false;
          }

          var source = $('#profile-template').html();
          var template = Handlebars.compile(source);
          var html = template(data.result);
          var $modal = $('#modal-profile');

          $modal.find('.modal-content').html(html);
          $modal.modal('show');
        }
      });
    });
  }

  function getProfile() {
    $('#profile-modal').on('shown.bs.modal', function () {
      $('#myInput').focus()
    })

    $.ajax({
      url: '/api/users/' + selectedUserId,
      type: 'GET',
      contentType: 'application/json'
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

          $('#modal-profile').on('hidden.bs.modal', function () {
            $(this).find('.modal-content').html('');
          });

          populateUser(localStorage.userId, localStorage.firstname);
          selectPanel();
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
