(function(module, $) {

  function populateUser(userId, firstName) {
    $('.js-user-profile-link')
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
      contentType: 'application/json',
    }).done(function (data) {
      if (data.status === 'success') {
        var template = $('#panel-template').html();

        // TODO: handlebars
      }
    });
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

    /*
    // Checks if there's a token and is valid
    var currentToken = localStorage.token;

    if (currentToken) {
      var dataObj = {
        token: currentToken
      };

      $.ajax({
        url: '/api/auth/validate',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(dataObj)
      }).done(function (data) {
        if (data.status === 'success' && result === true) {
          // valid token
          $('body')
            .removeClass('hide')
            .show();
        } else {
          // invalid token
          module.location.assign('/');
        }
      });
    } else {
      // no token found
      module.location.assign('/');
    }
    */

  });

}(window, jQuery));
