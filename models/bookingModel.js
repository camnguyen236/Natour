const mongoose = require('mongoose');
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour.']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user.']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price.']
    },
    startDate: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour.startDates',
        required: [true, 'Booking must have a start date.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

bookingSchema.pre('save', async function(next) {
    const tour = await Tour.findById(this.tour);
    const startDate = tour.startDates.id(this.startDate);

    if (startDate.participants >= tour.maxGroupSize) {
        return next(new AppError('This tour has a maximum number of participants already! Please book another tour.', 400));
    }

    if(startDate.date < Date.now()) {
        return next(new AppError('This tour has already started! Please book another tour.', 400));
    }
    
    startDate.participants++;
    await tour.save();
    next();
});

bookingSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
