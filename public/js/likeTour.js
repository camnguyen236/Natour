/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const likeTour = async (tourId, status) => {
    try {
        const res = await axios({
            method: 'GET',
            url: `/api/v1/tours/${tourId}/${status}`,
        });

        if (res.data.status === 'success') {
            // location.assign('/');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}