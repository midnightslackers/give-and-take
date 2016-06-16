const sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);

const notification = module.exports = {
  send(recipient, senderEmail, senderName , message) {
    const subject = 'Message from ' + senderName;

    const text = message + '\n\n' + '---' + '\n\n' + 'Contact ' + senderName + ' at ' + senderEmail + '\n\n' + 'You received this message as a user of the Give&Take Community at give-and-take.herokuapp.com';

    const email = new sendgrid.Email({
      to: recipient,
      from: senderEmail,
      subject,
      text
    });

    return new Promise( (resolve, reject) => {
      sendgrid.send(email, (err, json) => {
        if (err) return reject('There was a problem sending the message');
        resolve(json);
      });
    });
  }
};
