$(function () {
  var request = superagent;

  $('form').on('submit', function(e){
    e.preventDefault();
    request
      .post(e.target.action)
      .set('Content-Type', 'application/json')
      .send( {
        username: e.target.elements.username.value,
        password: e.target.elements.password.value
      })
      .end(function(err, res) {
        if (!err && res.body && res.body.status == 'success' && res.body.result) {
          localStorage.token = res.body.result;
          $('.nav-tabs').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><div class="form-group"><label>Your Token</label><input class="form-control" type="text" value="'+res.body.result+'"></div></div>');
        } else {
          var error = err;

          console.log('username: ' + e.target.elements.username.value);
          if (res.body.result.message !== undefined) {
            error = res.body.result.message;
          }else if(res.body.result){
            error = res.body.result;
          }

          $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+error+'</div>');
        }
      });
  });
});
