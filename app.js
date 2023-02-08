const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const csp = require('express-csp-header');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1. GLOBAL MIDDLEWARES
// Implement CORS
app.use(cors());
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// app.use(
//     helmet({
//       crossOriginEmbedderPolicy: false
//     })
//   );
// app.use(
//     helmet({
//         crossOriginEmbedderPolicy: false,
//         crossOriginResourcePolicy: {
//             allowOrigins: ['*'],
//         },
//         contentSecurityPolicy: {
//             directives: {
//                 defaultSrc: ['*'],
//                 scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
//             },
//         },
//     })
// );
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
//             baseUri: ["'self'"],
//             fontSrc: ["'self'", 'https:', 'http:', 'data:'],
//             scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
//             styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
//         },
//     })
// );

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                scriptSrc: [
                    "'self'",
                    'https:',
                    'http:',
                    'blob:',
                    'https://*.mapbox.com',
                    'https://js.stripe.com',
                    'https://m.stripe.network',
                    'https://*.cloudflare.com',
                ],
                frameSrc: ["'self'", 'https://js.stripe.com'],
                objectSrc: ["'none'"],
                styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
                workerSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https://*.tiles.mapbox.com',
                    'https://api.mapbox.com',
                    'https://events.mapbox.com',
                    'https://m.stripe.network',
                ],
                childSrc: ["'self'", 'blob:'],
                imgSrc: ["'self'", 'data:', 'blob:'],
                formAction: ["'self'"],
                connectSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    'data:',
                    'blob:',
                    'https://*.stripe.com',
                    'https://*.mapbox.com',
                    'https://*.cloudflare.com/',
                    'https://bundle.js:*',
                    // 'ws://natours-camnguyen.herokuapp.com/',
                    'ws://127.0.0.1:*/',
                ],
                upgradeInsecureRequests: [],
            },
        },
    })
);

// app.use(helmet());
// csp.extend(app, {
//     policy: {
//         directives: {
//             'default-src': ['self'],
//             'style-src': ['self', 'unsafe-inline', 'https:'],
//             'font-src': ['self', 'https://fonts.gstatic.com'],
//             'script-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data',
//                 'blob',
//                 'https://js.stripe.com',
//                 'https://*.mapbox.com',
//                 'https://*.cloudflare.com/',
//                 'https://bundle.js:8828',
//                 'ws://localhost:56558/',
//             ],
//             'worker-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data:',
//                 'blob:',
//                 'https://*.stripe.com',
//                 'https://*.mapbox.com',
//                 'https://*.cloudflare.com/',
//                 'https://bundle.js:*',
//                 'ws://localhost:*/',
//             ],
//             'frame-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data:',
//                 'blob:',
//                 'https://*.stripe.com',
//                 'https://*.mapbox.com',
//                 'https://*.cloudflare.com/',
//                 'https://bundle.js:*',
//                 'ws://localhost:*/',
//             ],
//             'img-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data:',
//                 'blob:',
//                 'https://*.stripe.com',
//                 'https://*.mapbox.com',
//                 'https://*.cloudflare.com/',
//                 'https://bundle.js:*',
//                 'ws://localhost:*/',
//             ],
//             'connect-src': [
//                 'self',
//                 'unsafe-inline',
//                 'data:',
//                 'blob:',
//                 // 'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
//                 'https://*.stripe.com',
//                 'https://*.mapbox.com',
//                 'https://*.cloudflare.com/',
//                 'https://bundle.js:*',
//                 'ws://localhost:*/',
//             ],
//         },
//     },
// });

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    bookingController.webhookCheckout
);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

app.use(compression());

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(new AppError(err.message, err.statusCode));
});

app.use(globalErrorHandler);

module.exports = app;

// https://natours-camnguyen.herokuapp.com/webhook-checkout