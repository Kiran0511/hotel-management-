const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');
const guest = require('../middleware/guest');

// Home page
router.get('/', userController.getHome);

// Register
router.route('/register')
  .get(userController.getRegister)
  .post(userController.postRegister);

// Login
router.route('/login')
  .get(userController.getLogin)
  .post(userController.postLogin);


// Logout
router.get('/logout', userController.logout);

// Profile
router.get('/profile', userController.profile);
router.post('/profile/update-details', userController.updateProfile);
router.post('/profile/update-password', userController.updatePassword);

router.get('/hotelrooms', userController.getRooms);
router.get('/book/:roomid', userController.getBookRoom);
router.post('/book/:roomid', userController.postBookRoom);
router.post('/enquiry/:roomid', userController.postRoomenquiry);
router.get('/mybooking', userController.getmybooking);
router.get('/payment', userController.getpayment);
router.get('/review', userController.getreview);
router.post('/review', userController.postreview);
router.get('/delete', userController.getdelete);
router.post('/delete', userController.postdelete);
router.get('/aboutus', userController.getaboutus);
router.get('/contact', userController.getcontact);
router.get('/gallery', userController.getGallery);
router.post('/contact', userController.postcontact);

module.exports = router;