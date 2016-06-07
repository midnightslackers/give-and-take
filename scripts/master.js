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
    }
    ).done(function(data) {
      console.log(e.target.action);
      console.log(data);
      if (data.status === 'success' && data.result) {
        localStorage.token = data.result;
        window.location.assign('/dashboard');
      } else {
        var error = err;

        if (data.result.message !== undefined) {
          error = data.result.message;
        }else if(data.result){
          error = data.result;
        }

        $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+error+'</div>');
      }
    });
  });
});
