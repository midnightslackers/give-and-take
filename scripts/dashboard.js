(function (module) {

  $('a[href="#logout"]').on('click', function (e) {
    e.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('firstname');
    localStorage.removeItem('userId');

    location.assign('/');
  });

  /*
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
      if (data.status === 'success') {
        console.log('valid token');

        $('.container-fluid')
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

})(window);
