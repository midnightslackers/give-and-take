(function(module, $) {

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
          location.assign('/dashboard');
        } else {
          // invalid token
          $('body')
            .removeClass('hide')
            .show();
        }
      });
    } else {
      $('body')
        .removeClass('hide')
        .show();
    }
    */

  //  populate select options for topics
    var options = $('#register-topic');
    $.ajax({
      url: '/api/topics',
      type: 'GET',
      contentType: 'application/json',
    })
    .done(function(data) {
      var result;
      if (data.status === 'success') {
        result = data.result;
        $.each(result, function() {
          options.append($('<option />').val(this._id).text(this.name));
        });
      }
      else {
        console.log('status is error');
      }
    })
    .fail(function(data) {
      console.dir('fail', data);
    });

  // Event Listener for Register AND Login Forms
    $('.login-form').on('submit', function(e){
      e.preventDefault();
      var dataObj = {};

      if ($(this).attr('action') === '/api/auth/register') {
        dataObj = {
          username: e.target.elements.username.value,
          password: e.target.elements.password.value,
          firstname: e.target.elements.first_name.value,
          lastname: e.target.elements.last_name.value,
          gender: e.target.elements.gender.value,
          zip: e.target.elements.zip.value,
          topic : e.target.elements.topic.value,
          skills: e.target.elements.subtopics.value
        };
      }
      else if ($(this).attr('action') === '/api/auth/login') {
        dataObj = {
          username: e.target.elements.username.value,
          password: e.target.elements.password.value
        };
      }

      $.ajax({
        url: e.target.action,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(dataObj),
        type: 'POST'
      }).done(function(data) {

        if (data.status === 'success') {
          console.log('front end: success');
          localStorage.token = data.result.token;
          localStorage.firstname = data.result.firstname;
          localStorage.userId = data.result.userId;
          window.location.assign('/dashboard');
        } else {
          $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+data.result+'</div>');
          console.log(data.result);
        }

      }).fail(function(data){
        var err = JSON.parse(data.responseText);
        $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+err.result+'</div>');
        console.error(err);
      });
    });
  });

}(window, $));
