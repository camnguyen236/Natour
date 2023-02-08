/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async (tourId, date) => {
    const stripe = require('stripe')(process.env.STRIPE_PUBLISHABLE_KEY);
    // console.log(tourId, date);
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}/${date}`
        );
        // console.log(sess`ion);

        // 2) Create checkout form + charge credit card
        // await stripe.redirectToCheckout({
        //     sessionId: session.data.session.id
        // });
        window.location.replace(session.data.session.url);
    } catch (err) {
        // console.log(err);
        showAlert('error', err.response.data.message);
    }
};