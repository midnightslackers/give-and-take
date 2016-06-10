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
        var topicObjList = data.result;
        var filter = $('#filter-topic');

        $.each(topicObjList, function() {
          filter.append($('<option>').val(this._id).text(this.name));
        });
      }
    });
  }

  function populateSubtopics() {
    var ajaxUrl;
    var selectedId = $('#filter-topic option:selected').val();
    if (selectedId == 'all') {
      ajaxUrl = '/api/subtopics';
    } else {
      ajaxUrl = '/api/topics/' + selectedId;
    }
    $.ajax({
      url: ajaxUrl,
      type: 'GET',
      contentType: 'application/json',
    }).done(function (data) {
      if (data.status === 'success') {
        var filter = $('#filter-subtopic');
        filter.html('<option value="all" selected="">All Topics</option>');
        if (selectedId == 'all') {
          $.each(data.result, function() {
            filter.append($('<option>').val(this._id).text(this.name + ' - ' + this.topic.name));
          });
        } else {
          $.each(data.result.subTopics, function() {
            filter.append($('<option>').val(this._id).text(this.name + ' - ' + this.topic.name));
          });
        }
      }
    });
  }

  function selectTopicListener() {
    $('#filter-topic').on('change', function () {
      var topicId = $(this).val();

      populateSubtopics();
      getPanels('/api/users/bytopic/' + topicId);
    });
  }

  function selectSubtopicListener() {
    $('#filter-subtopic').on('change', function () {
      var subtopicId = $(this).val();

      getPanels('/api/users/bysubtopic/' + subtopicId);
    });
  }

  function getPanels(ajaxUrl) {
    $.ajax({
      url: ajaxUrl,
      type: 'GET',
      contentType: 'application/json'
    }).done(function (data) {
      if (data.status === 'success' && data.result) {
        console.log('ajax done and success');
        console.log('data.result:', data.result);
        var $panels = $('.panels');

        $panels.html('');

        data.result.filter(function(currentPanel) {
          return currentPanel._id !== localStorage.userId;
        }).forEach(function(currentPanel, index) {
          if (index % 3 === 0) {
            $('<div>').addClass('row').appendTo($panels);
          }

          currentPanel.topic = '';
          currentPanel.subtopic = '';
          currentPanel.panelClass = 'panel panel-default js-modal-profile';

          if (currentPanel.profileImage) {
            currentPanel.panelClass += ' panel--left-image';
          }

          if (currentPanel.skills) {
            console.log('panel skills name:', currentPanel.skills[0].name);
            console.log('panel skills topic:', currentPanel.skills[0].topic.name);
            currentPanel.subtopic = currentPanel.skills[0].name;
            currentPanel.topic = currentPanel.skills[0].topic.name;
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
          data.result.topic = '';
          data.result.subtopic = '';
          data.result.notProfile = true;
          data.result.profileInfoClass = 'profile__info';

          if (data.result.profileImage) {
            data.result.profileInfoClass += ' profile__info--image';
          }

          if (data.result.skills) {
            data.result.subtopic = data.result.skills[0].name;
            data.result.topic = data.result.skills[0].topic.name;
          }

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

   // = = = = = = = =   F U N C T I O N   C A L L S   = = = = = = = = = = = = = =

          populateTopics();
          populateSubtopics();
          populateUser(localStorage.userId, localStorage.firstname);
          selectPanel();
          getPanels('/api/users');
          selectTopicListener();
          selectSubtopicListener();
          logout();

   // = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
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
