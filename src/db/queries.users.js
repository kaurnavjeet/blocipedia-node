const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
      .then(user => {
        const msg = {
          to: user.email,
          from: "kaurnavjeet09@gmail.com",
          subject: "Welcome to Blocipedia",
          text: "Thank you for creating an account with Blocipedia",
          html: "<strong>Thank you</strong>"
        };
        sgMail.send(msg);
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  }
};
