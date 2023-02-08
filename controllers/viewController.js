const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    if (alert === 'booking') {
        res.locals.alert =
            "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
    }
    next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
    // 1) Get tour data from collection
    const tours = await Tour.find();

    let likeTour = [];
    if (res.locals.user) {
        const user = await User.findById(res.locals.user.id);
        likeTour = user.likeTour.map((el) => el.toString());
    }

    // 2) Build template
    // 3) Render that template using tour data from 1)
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
        likeTour,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }

    let startDate= [];
    let isAddedReview;
    let isBooked;

    let likeTour = [];
    if (res.locals.user) {
        const user = await User.findById(res.locals.user.id);
        likeTour = user.likeTour.map((el) => el.toString());

        const bookings = await Booking.find({ user: res.locals.user.id });
        startDate = bookings.map((el) => el.startDate);              
        for (let i = 0; i < bookings.length; i++) {
            const el = bookings[i];
            if (el.tour._id.toString() === tour.id) {
                isBooked = true;
                const isReview =
                    (await Review.findOne({
                        user: res.locals.user.id,
                        tour: tour.id,
                    })) === null
                        ? false
                        : true;
                isAddedReview =
                    tour.startDates.id(el.startDate).date <= Date.now() &&
                    !isReview;
            }
        }
    }

    // 2) Build template
    // 3) Render template using data from 1)
    res.status(200)
        // .set(
        //     'Content-Security-Policy',
        //     'connect-src https://*.tiles.mapbox.com https://api.mapbox.com https://events.mapbox.com'
        // )
        // .set(
        //     'Content-Security-Policy',
        //     "default-src 'self' https://*.mapbox.com https://*.stripe.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com https://js.stripe.com/v3/ 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        // )
        .render('tour', {
            title: `${tour.name} Tour`,
            tour,
            startDate,
            isAddedReview,
            isBooked,
            likeTour,
        });
});

exports.getLoginForm = (req, res) => {
    res.status(200)
        // .set(
        //     'Content-Security-Policy',
        //     "connect-src 'self' http://127.0.0.1:3000/"
        // )
        .render('login', {
            title: 'Log into your account',
        });
};

exports.getSignupForm = (req, res) => {
    res.status(200)
        // .set(
        //     'Content-Security-Policy',
        //     "connect-src 'self' http://127.0.0.1:3000/"
        // )
        .render('signup', {
            title: 'Sign up',
        });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
    });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
    // 1) Find all reviews
    const reviews = await Review.find({ user: req.user.id });

    res.status(200).render('myReview', {
        title: 'My Reviews',
        reviews,
    });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser,
    });
});

exports.getManageTours = catchAsync(async (req, res, next) => {
    // 1) Find all tours
    const tours = await Tour.find();
    
    res.status(200).render('manageTours', {
        title: 'Manage Tours',
        tours,
    });
});