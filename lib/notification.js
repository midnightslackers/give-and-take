const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

const notification = module.exports;

notification.send = (recipient, senderEmail, senderName , message, callback) => {
  let subject = 'Message from ' + senderName;

  let text = message + '\n\n' + '---' + '\n\n' + 'Contact ' + senderName + ' at ' + senderEmail + '\n\n' + 'You received this message as a user of the Give&Take Community at give-and-take.herokuapp.com';

  let email = new sendgrid.Email({
    to: recipient,
    from: senderEmail,
    subject,
    text
  });

  sendgrid.send(email, (err, json) => {
    if (err) return callback(err);
    callback(null, json);
  });
};
