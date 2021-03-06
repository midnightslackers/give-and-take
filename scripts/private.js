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
      if (topicId == 'all') {
        populateSubtopics();
        getPanels('/api/users');
      } 
      else {
        populateSubtopics();
        getPanels('/api/users/bytopic/' + topicId);
      }
    });
  }
  
  function selectGenderListener() {
    $('input[type=radio][name=gender]').on('change', function() {
      var selectedGender = $(this).val();
      if (selectedGender == 'all') {
        getPanels('/api/users');
      }
      else {
        getPanels('/api/users/bygender/' + selectedGender);
      }    
    });
  }

  function selectSubtopicListener() {
    $('#filter-subtopic').on('change', function () {
      var subtopicId = $(this).val();
      if (subtopicId == 'all') {
        getPanels('/api/users');
      }
      else {
        getPanels('/api/users/bysubtopic/' + subtopicId);
      }
    });
  }

  function getPanels(ajaxUrl) {
    var token = localStorage.token;
    $.ajax({
      beforeSend: function (request) {
        request.setRequestHeader('token', token);
      },
      url: ajaxUrl,
      type: 'GET',
      contentType: 'application/json'
    }).done(function (data) {
      if (data.status === 'success' && data.result) {
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
    var token = localStorage.token;
    $('.navbar-nav, .js-panels').on('click', '.js-modal-profile', function (e) {
      e.preventDefault();

      var _self = this;
      var userId = $(this).attr('data-user-id');

      $.ajax({
        beforeSend: function (request) {
          request.setRequestHeader('token', token);
        },
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
          $modal.modal('show', _self);
        }
      });
    });
  }

  function sendMessage(userId) {
    var token = localStorage.token;
    $('.js-send-message').on('submit', function (e) {
      e.preventDefault();

      var dataObj = {
        recipientId: userId,
        senderName: e.target.elements.name.value,
        senderEmail: e.target.elements.email.value,
        message: e.target.elements.message.value
      };

      $.ajax({
        beforeSend: function (request) {
          request.setRequestHeader('token', token);
        },
        url: e.target.action,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dataObj)
      }).done(function (data) {
        if (data.result.message === 'success') {
          e.target.reset();

          $('.profile__send-message').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Your message has been sent.</div>');
        }
      });
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
          }).on('shown.bs.modal', function (e) {
            sendMessage(e.relatedTarget.dataset.userId);
          });

   // = = = = = = = =   F U N C T I O N   C A L L S   = = = = = = = = = = = = = =

          populateTopics();
          populateSubtopics();
          populateUser(localStorage.userId, localStorage.firstname);
          selectPanel();
          getPanels('/api/users');
          selectTopicListener();
          selectSubtopicListener();
          selectGenderListener();
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
