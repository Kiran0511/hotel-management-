const LocalStrategy = require('passport-local').Strategy; //local passport strategy which we installed
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const connection = require('../db-config')
function init(passport) { //object
  //call a method use and pass the localstrategy object 1st para username 2nd para is arrow function
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    //login
    //Check email

    connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
        return done(error);
      }

      if (!results || results.length == 0) {
        return done(null, false, { message: 'Email Doesnt exist/ Invalid Email' });
      }

      const user = results[0];

      bcrypt.compare(password, user.password, (error, match) => {
        if (error) {
          return done(error);
        }

        if (match) {
          return done(null, user, { message: 'Logged in succesfully' });
        } else {
          return done(null, false, { message: 'Incorrect Email and password' });
        }
      });
    });
  }));
  //It helps us to store data in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  })
  //To get the data that is stored in session
  passport.deserializeUser((id, done) => {
    connection.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
      if (error) {
        return done(error);
      }

      return done(null, results[0]);
    });
  });
}

module.exports = init
