const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

const notification = module.exports;

notification.send = (recipient, senderEmail, senderName , message, callback) => {
  let email = new sendgrid.Email({
    to: recipient,
    from: 'notification@give-and-take.herokuapp.com',
    subject: `Message from ${senderName}`,
    text: `${message} \n\n Contact me at ${senderEmail} \n\n\n You received this message as a user of the Give & Take Community at give-and-take.herokuapp.com`
  }); 

  sendgrid.send(email, (err, json) => {
    if (err) return callback(err);
    callback(null, json);
  });
};
