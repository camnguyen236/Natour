const router = require('express').Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

router.use(viewController.alerts);

router.get(
    '/',
    bookingController.createBookingCheckout,
    authController.isLoggedIn,
    viewController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
router.get('/my-reviews', authController.protect, viewController.getMyReviews);

router.post(
    '/submit-user-data',
    authController.protect,
    viewController.updateUserData
);

router.get('/manage-tours', authController.protect, authController.restrictTo('admin'), viewController.getManageTours);

module.exports = router;
