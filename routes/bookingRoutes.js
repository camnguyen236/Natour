const router = require('express').Router({ mergeParams: true });
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.get('/checkout-session/:tourId/:date', bookingController.getCheckoutSession);

router.route('/:tourId/bookings').get(bookingController.getBookingsByTour);
router.route('/:userId/bookings').get(bookingController.getBookingsByUser);

router.use(authController.restrictTo('admin', 'lead-guide'));
router
    .route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

router
    .route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;
