/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const getATour = async (tourId) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/tours/${tourId}`
        });

        if (res.data.status === 'success') {
            return res;
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
}

export const addTour = async (tourId, data) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/api/v1/tours`,
            data: {
                data
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Add tour successfully!');
            window.setTimeout(() => {
                location.assign(`manage-tours`);
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
};

export const updateTour = async (tourId, data) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/tours/${tourId}`,
            data: {
                data
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Update tour successfully!');
            window.setTimeout(() => {
                location.assign(`/manage-tours`);
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
}

export const deleteTour = async (TourId) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `/api/v1/tours/${TourId}`
        });
        // console.log(res);
        if (res.status === 204) {
            showAlert('success', 'Delete tour successfully!');
            window.setTimeout(() => {
                location.assign(`manage-tours`);
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        showAlert('error', err.response.data.message);
    }
}