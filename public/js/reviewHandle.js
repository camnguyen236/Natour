/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const addReview = async (review, rating, tourId) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/api/v1/tours/${tourId}/reviews`,
            data: {
                review,
                rating
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Add review successfully!');
            window.setTimeout(() => {
                location.assign(`/tour/${tourId}`);
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
};

export const updateReview = async (review, rating, reviewId) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/reviews/${reviewId}`,
            data: {
                review,
                rating
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Update review successfully!');
            window.setTimeout(() => {
                // location.assign(`/reviews`);
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
}

export const deleteReview = async (reviewId) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/reviews/${reviewId}`
        });
        // console.log(res);
        if (res.status === 204) {
            showAlert('success', 'Delete review successfully!');
            window.setTimeout(() => {
                location.assign(`/my-reviews`);
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
}