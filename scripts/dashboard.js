$(function () {

  function populateTopics() {
  }

  function populateSubtopics() {
  }

  function selectTopic() {
  }

  function selectSubtopic() {
  }

  function getPanels() {
  }

  function getProfile() {
  }

  function sendMessage() {
  }

  function logout() {
    $('a[href="#logout"]').on('click', function (e) {
      e.preventDefault();

      localStorage.removeItem('token');
      localStorage.removeItem('firstname');
      localStorage.removeItem('userId');

      location.assign('/');
    });
  }

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
