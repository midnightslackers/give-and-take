$(function () {
  // var request = superagent;

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
      if (data.status == 'success' && data.result) {
        localStorage.token = data.result;
        $('.nav-tabs').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><div class="form-group"><label>Your Token</label><input class="form-control" type="text" value="'+data.result+'"></div></div>');
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

//     request
//       .post(e.target.action)
//       .set('Content-Type', 'application/json')
//       .send( {
//         username: e.target.elements.username.value,
//         password: e.target.elements.password.value
//       })
//       .end(function(err, res) {
//         if (!err && res.body && res.body.status == 'success' && res.body.result) {
//           localStorage.token = res.body.result;
//           $('.nav-tabs').before('<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><div class="form-group"><label>Your Token</label><input class="form-control" type="text" value="'+res.body.result+'"></div></div>');
//         } else {
//           var error = err;
//
//           console.log('username: ' + e.target.elements.username.value);
//           if (res.body.result.message !== undefined) {
//             error = res.body.result.message;
//           }else if(res.body.result){
//             error = res.body.result;
//           }
//
//           $('.nav-tabs').before('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+error+'</div>');
//         }
      // });
  });
});
