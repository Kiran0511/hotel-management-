var mysql = require('mysql')
const bcrypt = require ('bcrypt')

// exports.getLogin = (req, res, next) => {

//        return res.render('admin/login', { user: "" });

//  }
//  exports.postLogin = (req, res, next) => {
//     const connection = require('../db-config');
//     const passport = require('passport');
//     const bcrypt = require('bcrypt');
//     const email = req.body.email;
//     const password = req.body.password;

//     connection.query('SELECT * FROM admin WHERE email = ? and password = ?', [email, password], (error, results) => {
//         if (error) {
//             throw error;
//         } else {
//             if (results.length > 0) {
//                 req.session.email = email;
//                 return res.redirect('admin/adbooking')
//             } else {
//                 console.log('error')
//             }
//         }
//     });
//   };

  exports.adbooking = (req, res, next) => {

    return res.render('admin/adbooking');
  }