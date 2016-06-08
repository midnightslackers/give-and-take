$(function () {
  $('.login-form').on('submit', function(e){
    e.preventDefault();
    var dataObj = {};

    if ($(this).attr('action') === '/api/auth/register') {
      console.log('register!');
      dataObj = {
        username: e.target.elements.username.value,
        password: e.target.elements.password.value,
        firstname: e.target.elements.first_name.value,
        lastname: e.target.elements.last_name.value,
        gender: e.target.elements.gender.value,
        zip: e.target.elements.zip.value
        // skills: e.target.elements.subtopics.value
      };
    } 
    else if ($(this).attr('action') === '/api/auth/login') {
      console.log('login!');
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
        localStorage.token = data.result;
        window.location.assign('/dashboard?token=' + data.result);
      } else {
        $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+data.result+'</div>');
        console.log(data.result); 
      }
      
      
    }).fail(function(data){
      var err = JSON.parse(data.responseText);
      $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+err.result+'</div>');
      console.dir(data);
    });
  });
});
