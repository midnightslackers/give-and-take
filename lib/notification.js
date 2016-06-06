const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

const notification = module.exports;

notification.send = (payload, callback) => {
  let email = new sendgrid.Email(payload);

  sendgrid.send(email, (err, json) => {
    if (err) return callback(err);

    callback(null, json);
  });
};
