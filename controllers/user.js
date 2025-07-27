var mysql = require('mysql')
const bcrypt = require ('bcrypt')

exports.getHome = (req, res, next) => {
  // Retrieve review data from the database
  const connection = require('../db-config');
  const action = 'enable';
  connection.query('SELECT * FROM review WHERE action = ?', [action], (err, reviewResults) => {
    if (err) {
      req.flash('error', 'Error retrieving review data');
      return next(err);
    }
    const reviews = reviewResults;
    if (req.session.user != undefined) {
      // Retrieve user data from the database
      connection.query('SELECT * FROM users WHERE id = ?', [req.session.user.id], (err, userResults) => {
        if (err) {
          req.flash('error', 'Error retrieving user data');
          return next(err);
        }
        const user = userResults[0];
        return res.render('user/home', { user: user, reviews: reviews });
      });
    } else {
      return res.render('user/home', { user: null, reviews: reviews });
  }
  });
};
exports.getRegister = (req, res, next) => {

    if (req.session.email != undefined) {
       return res.render('user/register', { user: req.session.email });
    }
    else {
       return res.render('user/register', { user: "" });
    }
 }
 exports.postRegister = async (req,res,next) =>{
        const connection = require('../db-config')
        const validator = require('validator');
        const { username, email, mobile, aadhar,password } = req.body;
        if (!username || !aadhar|| !email || !password || !mobile) {
            req.flash('error', 'All fields are required*');
            req.flash('username', username);
            req.flash('email', email);
            req.flash('mobile', mobile);
            req.flash('aadhar', aadhar);
            return res.redirect('/register');
        }
        if (!validator.isAlpha(username, 'en-US', { ignore: ' ' })) {
          req.flash('error', 'Invalid UserName');
          req.flash('email', email);
          req.flash('mobile', mobile);
          req.flash('aadhar', aadhar);
          return res.redirect('/register');
        }
        
        if (!validator.isEmail(email)) {
          req.flash('error', 'Invalid Email');
          req.flash('username', username);
          req.flash('mobile', mobile);
          req.flash('aadhar', aadhar);
          return res.redirect('/register');
        }
        
        
          if (!validator.isMobilePhone(mobile) || !validator.isLength(mobile, {min: 10, max: 10})){
          req.flash('error', 'Mobile Number is incorrect (must be a 10-digit number)');
          req.flash('username', username);
          req.flash('aadhar', aadhar);
          req.flash('email', email);
  
          return res.redirect('/register');
        }
        if (!validator.isNumeric(aadhar) || !validator.isLength(aadhar, {min: 12, max: 12})){
            req.flash('error', 'Invalid Aadhar Number (must be a 12-digit number)');
            req.flash('username', username);
            req.flash('email', email);
            req.flash('mobile', mobile);
            return res.redirect('/register');
          }
        if (!validator.isStrongPassword(password)) {
          req.flash('error', 'Password is weak Try a strong password { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}');
          req.flash('username', username);
          req.flash('aadhar', aadhar);
          req.flash('email', email);
          req.flash('mobile', mobile);
          return res.redirect('/register');
        }
  
        // Check if email already exists in the database
        connection.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email], (err, results) => {
            if (err) throw err;
            if (results[0].count > 0) {
              req.flash('error', 'Email already exists. Please try again with a different email address.');
              req.flash('username', username);
              req.flash('aadhar', aadhar);
              req.flash('mobile', mobile);
              return res.redirect('/register');
            } else {
              const saltRounds = 10;
              bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) throw err;
                connection.query('INSERT INTO users (username, email, mobile, aadhar, password) VALUES (?, ?, ?, ?, ?)', [username, email, mobile, aadhar, hashedPassword ], (err, result) => {
                  if (err) throw err;
                  const user = {
                    id: result.insertId,
                    username,
                    aadhar,
                    email,
                    mobile,
                  };
                  return res.redirect('/login');
                });
              });
            }
          });
    }
exports.getLogin = (req, res, next) => {

    if (req.session.user != undefined) {
       return res.render('user/login', { user: req.session.user });
    }
    else {
       return res.render('user/login', { user: "" });
    }
 }
 exports.postLogin = (req, res, next) => {
    const connection = require('../db-config');
    const passport = require('passport');
    const bcrypt = require('bcrypt');
    const { email, password } = req.body;
    
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        req.flash('error', info.message);
        return next(err);
      }
      if (!user) {
        req.flash('error', info.message);
        return res.redirect('/login');
      }
      // Compare the password entered with the hashed password in the database
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          req.flash('error', 'Error in bcrypt compare');
          return next(err);
        }
        if (!result) {
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login');
        }
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        req.session.isLoggedIn = true;
        return req.session.save((err) => {
          if (err) {
            req.flash('error', 'Error in saving session');
            return next(err);
          }
          return res.redirect('/profile');
        });
      });
    })(req, res, next);
  };
  exports.profile = (req, res, next) => {
    if (req.session.user != undefined) {
      // Retrieve user data from the database
      const connection = require('../db-config');
      connection.query('SELECT * FROM users WHERE id = ?', [req.session.user.id], (err, results) => {
        if (err) {
          req.flash('error', 'Error retrieving user data');
          return next(err);
        }
        // console.log(results);
         // Add this line to check if you're getting the user data
        const user = results[0];
        // console.log(user);
        return res.render('user/profile', { user: user });
        // return res.render('user/home', { user: user });
        
      });
    } else {
      return res.render('user/home', { user: "" });
    }
  }
  exports.updateProfile = (req, res, next) => {
    const connection = require('../db-config');
    const validator = require('validator');
  
    if (req.body.updateDetails) {
      // If the user wants to update their details
      const { username, email, mobile, aadhar } = req.body;
  
      // Validate input
      if (!username || !aadhar || !email || !mobile) {
        req.flash('error', 'All fields are required*');
        req.flash('username', username);
        req.flash('email', email);
        req.flash('mobile', mobile);
        req.flash('aadhar', aadhar);
        return res.redirect('/profile');
      }
  
      if (!validator.isAlpha(username, 'en-US', { ignore: ' ' })) {
        req.flash('error', 'Invalid UserName');
        req.flash('email', email);
        req.flash('mobile', mobile);
        req.flash('aadhar', aadhar);
        return res.redirect('/register');
      }
  
      if (!validator.isEmail(email)) {
        req.flash('error', 'Invalid Email');
        req.flash('username', username);
        req.flash('mobile', mobile);
        req.flash('aadhar', aadhar);
        return res.redirect('/profile');
      }
  
      if (!validator.isMobilePhone(mobile)) {
        req.flash('error', 'Mobile Number is incorrect');
        req.flash('username', username);
        req.flash('aadhar', aadhar);
        req.flash('email', email);
        return res.redirect('/profile');
      }
  
      if (!validator.isNumeric(aadhar) || !validator.isLength(aadhar, {min: 12, max: 12})) {
        req.flash('error', 'Invalid Aadhar Number (must be a 12-digit number)');
        req.flash('username', username);
        req.flash('email', email);
        req.flash('mobile', mobile);
        return res.redirect('/profile');
      }
  
      // Check if email already exists in the users table
      connection.query('SELECT * FROM users WHERE email = ? AND id <> ?', [email, req.session.user.id], (err, results) => {
        if (err) {
          req.flash('error', 'Error checking email');
          return next(err);
        }
  
        if (results.length > 0) {
          req.flash('error', 'Email already exists');
          req.flash('username', username);
          req.flash('mobile', mobile);
          req.flash('aadhar', aadhar);
          return res.redirect('/profile');
        }
  
        // Update user details
        connection.query('UPDATE users SET username = ?, email = ?, mobile = ?, aadhar = ? WHERE id = ?', [username, email, mobile, aadhar, req.session.user.id], (err, results) => {
          if (err) {
            req.flash('error', 'Error updating user details');
            return next(err);
          }
  
          req.flash('success', 'User details updated successfully');
          return res.redirect('/profile');
        });
      });
    } else {
      // Invalid update request
      req.flash('error', 'Invalid update request');
      return res.redirect('/profile');
    }
  };
  exports.updatePassword = (req, res, next) => {
    const connection = require('../db-config');
    const bcrypt = require('bcrypt');
    const validator = require('validator');
  
    // Check if the user wants to update their password
    if (req.body.updatePassword) {
      const { currentPassword, newPassword } = req.body;
  
      if (!currentPassword|| !newPassword) {
        req.flash('error', 'All fields are required*');
        return res.redirect('/profile');
      }
      // Validate the new password
      if (!validator.isStrongPassword(newPassword)) {
        req.flash('error', 'Password is weak. Try a strong password');
        return res.redirect('/profile');
      }
      // Check if the new password is same as the current password
      if (currentPassword === newPassword) {
        req.flash('error', 'New password should not be same as current password');
        return res.redirect('/profile');
    }
  
      // Retrieve the current user's password from the database
      connection.query('SELECT password FROM users WHERE id = ?', [req.session.user.id], (err, results) => {
        if (err) {
          req.flash('error', 'Error retrieving user data');
          return next(err);
        }
  
        const user = results[0];
  
        // Compare the user's input for the current password with the password in the database
        if (bcrypt.compareSync(currentPassword, user.password)) {
          // The current password matches, so update the user's password in the database
          const hash = bcrypt.hashSync(newPassword, 10);
          connection.query('UPDATE users SET password = ? WHERE id = ?', [hash, req.session.user.id], (err, results) => {
            if (err) {
              req.flash('error', 'Error updating password');
              return next(err);
            }
  
            // Log out the user after the password is updated
            req.session.destroy((err) => {
              if (err) {
                req.flash('error', 'Error logging out user');
                return next(err);
              }
  
              // Redirect the user to the login page with a success message
              return res.redirect('/login');
            });
          });
        } else {
          // The current password is incorrect, so redirect the user to the profile page with an error message
          req.flash('error', 'Current password is incorrect');
          return res.redirect('/profile');
        }
      });
    } else {
      // If the user did not submit an update request, redirect them to the profile page with an error message
      req.flash('error', 'Invalid update request');
      return res.redirect('/profile');
    }
  };
  exports.getRooms = (req, res, next) => {
    const connection = require('../db-config');
    connection.query('SELECT * FROM hotelrooms', (error, results) => {
      if (error) throw error;
      if (req.session.user) {
        return res.render('user/hotelrooms', { rooms: results, user: req.session.user });
      } else {
        return res.render('user/hotelrooms', { rooms: results, user: null });
      }
    });
  };
  exports.getBookRoom = (req, res, next) => {
    const connection = require('../db-config');
    const roomId = req.params.roomid;
    
    connection.query('SELECT * FROM hotelrooms WHERE roomid = ?', [roomId], (error, results) => {
      if (error) throw error;
      if (req.session.user) {
        connection.query('SELECT * FROM users WHERE id = ?', [req.session.user.id], (error, userResults) => {
          if (error) throw error;
          const user = {
            id: req.session.user.id,
            username: userResults[0].username,
            email: req.session.user.email
          };
          return res.render('user/book', { room: results[0], user });
        });
      } else {
        return res.render('user/book', { room: results[0], user: null });
      }
    });
  };
  exports.postBookRoom = (req, res, next) => {
    const roomId = req.params.roomid;
    const { username, email, roomtype, roomcost, checkin, checkout, guests, bookingstatus , payment} = req.body;
    const connection = require('../db-config');
  
    // Check if all required fields are present
    if (!username || !email || !checkin || !checkout || !guests) {
      req.flash('error', 'All fields are required');
      req.flash('username', username);
      req.flash('email', email);
      req.flash('checkin', checkin);
      req.flash('checkout', checkout);
      req.flash('guests', guests);
      return res.redirect('back');
    }
  
    // Check if checkin and checkout dates are valid
    const currentDate = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const maxStay = 10; // Maximum number of days allowed for a booking
    const timeDiff = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    const numDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Number of days between checkin and checkout
    if (checkinDate < currentDate || checkoutDate < currentDate || checkoutDate < checkinDate) {
      req.flash('error', 'Invalid checkin/checkout date');
      req.flash('username', username);
      req.flash('email', email);
      req.flash('checkin', checkin);
      req.flash('checkout', checkout);
      req.flash('guests', guests);
      return res.redirect('back');
    } else if (numDays > maxStay) {
      req.flash('error', `Maximum stay allowed is ${maxStay} days`);
      req.flash('username', username);
      req.flash('email', email);
      req.flash('checkin', checkin);
      req.flash('checkout', checkout);
      req.flash('guests', guests);
      return res.redirect('back');
    }
  
    connection.query('SELECT * FROM hotelrooms WHERE roomid = ?', [roomId], (error, results) => {
      if (error) throw error;
      const room = results[0];
  
      if (roomId === '4') {
        if (guests !== '2') {
          req.flash('error', 'Couple Room can only accommodate 2 guests');
          req.flash('guests', guests);
          return res.redirect('back');
        }
      } else {
        if (guests > room.capacity) {
          req.flash('error', `Number of guests cannot exceed ${room.capacity}`);
          req.flash('guests', guests);
          return res.redirect('back');
        }
    
        if (guests < 1) {
          req.flash('error', 'Number of guests must be at least 1');
          req.flash('guests', guests);
          return res.redirect('back');
        }
      }
  
      connection.query('INSERT INTO bookings (roomtype, roomcost, username, email, checkin, checkout, guests, roomid, bookingstatus,payment,roomnumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [roomtype, roomcost, username, email, checkin, checkout, guests, roomId, 'Pending',payment,'Not allotted'], (error, results) => {
        if (error) throw error;
        res.redirect('/mybooking');
      });
    });
  };
  
  exports.getmybooking = (req, res, next) => {
    const moment = require('moment');
    const connection = require('../db-config');
    const userEmail = req.session.user ? req.session.user.email : null; // get user email if session exists
  
    const query = `SELECT * FROM bookings WHERE email = ?`; // modify query to filter by email
    connection.query(query, [userEmail], (error, results) => {
      if (error) throw error;
  
      // Use moment to format checkin and checkout dates
      results.forEach((booking) => {
        booking.checkin = moment(booking.checkin).format('DD/MM/YYYY');
        booking.checkout = moment(booking.checkout).format('DD/MM/YYYY');
      });
  
      return res.render('user/mybooking', { bookings: results, user: req.session.user });
    });
  };
  exports.getpayment = (req, res, next) => {

    if (req.session.user != undefined) {
      return res.render('user/payment', { user: req.session.user });
    }
    else {
      return res.render('user/home', { user:""});
  }
}
exports.getreview = (req, res, next) => {

  if (req.session.user != undefined) {
    return res.render('user/review', { user: req.session.user });
  }
  else {
    return res.render('user/home', { user: "" });
  }
}
exports.postreview = async (req,res,next) =>{
  const connection = require('../db-config')
  const validator = require('validator');
  const { email, review, rating } = req.body;
  if (!email || !review || !rating) {
    req.flash('error', 'All fields are required*');
    req.flash('email', email);
    req.flash('review', review);
    req.flash('rating', rating);
    return res.redirect('/review');
  }
  if (!validator.isEmail(email)) {
    req.flash('error', 'Invalid Email');
    req.flash('review', review);
    req.flash('rating', rating);
    return res.redirect('/review');
  }
  if (review.length > 250) {
    req.flash('error', 'review should be within 250 characters');
    req.flash('email', email);
    req.flash('rating', rating);
    return res.redirect('/review');
  }
  if(review.length < 20){
    req.flash('error', 'review should have atleast 25 characters');
    req.flash('email', email);
    req.flash('rating', rating);
    return res.redirect('/review');
  }
  if (!validator.isInt(rating, {min: 1, max: 5})) {
    req.flash('error', 'Invalid Rating');
    req.flash('email', email);
    req.flash('review', review);
    return res.redirect('/review');
  }
  connection.query('INSERT INTO review (email, review, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE review = VALUES(review), rating = VALUES(rating)', [email, review, rating], (err, result) => {
    if (err) {
      req.flash('error', 'There was an error adding your review');
      return res.redirect('/review');
    } else {
      req.flash('success', 'Thank you for your review!');
      return res.redirect('/review');
    }
  });
}
exports.getdelete = (req, res, next) => {

  if (req.session.user != undefined) {
    return res.render('user/delete', { user: req.session.user });
  }
  else {
    return res.render('user/home', { user: "" });
  }
}
exports.postdelete = (req, res, next) => {
  const connection = require('../db-config');
  const userId = req.session.user.id;
  const userEmail = req.session.user.email;

  // Logout user
  req.session.destroy((err) => {
    if (err) throw err;

    // Delete user bookings from database
    connection.query('DELETE FROM bookings WHERE email = ?', [userEmail], (err, result) => {
      if (err) throw err;

      // Delete user from database
      connection.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) throw err;
        res.redirect('/'); // redirect to homepage or any other page you want
      });
    });
  });
}
exports.getcontact = (req, res, next) => {

  if (req.session.user != undefined) {
     return res.render('user/contact', { user: req.session.user });
  }
  else {
     return res.render('user/contact', { user: "" });
  }
}
exports.postcontact = (req,res,next) => {
  const connection = require('../db-config')
  const validator = require('validator');
  const { name, email, message } = req.body;

// Validate input fields
if (!name || !email || !message) {
  req.flash('error', 'All fields are required.');
  req.flash('name', name);
  req.flash('email', email);
  req.flash('message', message);
  return res.redirect('/contact');
}

if (!validator.isEmail(email)) {
  req.flash('error', 'Invalid email address.');
  req.flash('name', name);
  req.flash('message', message);
  return res.redirect('/contact');
}

if(!validator.isAlpha(name)){
  req.flash('error', 'Invalid Name');
  req.flash('email', email);
  req.flash('message', message);
  return res.redirect('/contact');
}

if (message.length > 250) {
  req.flash('error', 'message should be within 250 characters');
  req.flash('name', name);
  req.flash('email', email);
  return res.redirect('/contact');
}
if(message.length < 20){
  req.flash('error', 'message should have atleast 25 characters');
  req.flash('name', name);
  req.flash('email', email);
  return res.redirect('/contact');
}

// Save message to database
connection.query('INSERT INTO contact (name, email, message) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), message = VALUES(message)', [name, email, message], (err, result) => {
  if (err) throw err;
  req.flash('success', 'Your message has been sent.');
  return res.redirect('/contact');
  });
}
exports.getaboutus = (req, res, next) => {

  if (req.session.user != undefined) {
     return res.render('user/aboutus', { user: req.session.user });
  }
  else {
     return res.render('user/aboutus', { user: "" });
  }
}
exports.postRoomenquiry = (req, res, next) => {
  const connection = require('../db-config');
  const validator = require('validator');
  const { email, roomtype, enquiry } = req.body;

  // Check if all required fields are present
  if (!email || !roomtype || !enquiry) {
    req.flash('error', 'All fields are required');
    req.flash('email', email);
    req.flash('roomtype', roomtype);
    req.flash('enquiry', enquiry);
    return res.redirect('back');
  }

  // Validate enquiry message
  if (!validator.isLength(enquiry, { min: 20 })) {
    req.flash('error', 'Enter a proper enquiry message with at least 20 characters');
    req.flash('email', email);
    req.flash('roomtype', roomtype);
    req.flash('enquiry', enquiry);
    return res.redirect('back');
  }

  connection.query('INSERT INTO roomenquiry (email, roomtype, enquiry) VALUES (?, ?, ?)', [email, roomtype, enquiry], (error, results) => {
    if (error) throw error;
    req.flash('success', 'Enquiry sent successfully');
    return res.redirect('back');
  });
};
exports.getGallery = (req, res, next) => {
  const connection = require('../db-config');

  // Retrieve images from gallery table
  connection.query('SELECT * FROM gallery', (err, results) => {
    if (err) {
      req.flash('error', 'Error retrieving images from gallery');
      return next(err);
    }

    if (req.session.user) {
      return res.render('user/gallery', { gallery: results, user: req.session.user });
    } else {
      return res.render('user/gallery', { gallery: results, user: null });
    }
  });
};

  exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  };
  