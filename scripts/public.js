$(function () {
  $('form').on('submit', function(e){
    e.preventDefault();

    $.ajax({
      url: e.target.action,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        username: e.target.elements.username.value,
        password: e.target.elements.password.value
      }),
      type: 'POST'
    }).done(function(data) {

      if (data.status === 'success') {
        localStorage.token = data.result;
        window.location.assign('/dashboard?token=' + data.result);
      } else {
        $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+data.result+'</div>');
      }
      
      
    }).fail(function(data){
      var err = JSON.parse(data.responseText);
      $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+err.result+'</div>');
    });
  });
});
