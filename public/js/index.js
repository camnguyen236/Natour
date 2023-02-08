/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { addReview, updateReview, deleteReview } from './reviewHandle';
import { getATour, addTour, updateTour, deleteTour } from './tourHandle';
import { likeTour } from './likeTour';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const startDate = document.getElementById('selectedDate');
const startDate1 = document.querySelector('input[name="date"]:checked');
const addReviewBtn = document.getElementById('add-review');
const addReviewForm = document.querySelector('.addReview');
const reviewForm = document.getElementById('form-review');
const heartBtn = document.querySelectorAll('.heart-icon');

const editIcon = document.querySelectorAll('.reviews__actions-icon--edit');
const editIconFirstChild = document.querySelectorAll('.reviews__actions-icon--edit:first-child');
const deleteIcon = document.querySelectorAll('.reviews__actions-icon--delete');
const deleteIconFirstChild = document.querySelectorAll('.reviews__actions-icon--delete:first-child');
const reviewText = document.querySelectorAll('.reviews__text-input');
const reviewRating = document.querySelectorAll('.reviews__star-edit');
const reviewSubmit = document.querySelectorAll('.reviews__submit-edit');

const editIconManageTour = document.querySelectorAll('.manage-tour__edit-btn');
const editIconManageTourFirstChild = document.querySelectorAll('.manage-tour__edit-btn:first-child');
const modal = document.querySelector('.modal');
const modalContainer = document.querySelector('.modal-container');
const closeIcon = document.querySelector('.edit-tour__close-btn');
const editTourForm = document.querySelector('.edit-tour__form');
const editTourSubmitBtn = document.querySelector('.edit-tour__submit-btn');
const deleteIconManageTour = document.querySelectorAll(
    '.manage-tour__delete-btn'
);const deleteIconManageTourFirstChild = document.querySelectorAll(
    '.manage-tour__delete-btn:first-child'
);

// DELEGATION
// if (mapBox) {
//     const locations = JSON.parse(mapBox.dataset.locations);
//     displayMap(locations);
// }
// "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js --public-url /js",

if (loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signupForm)
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('passwordConfirm').value;
        signup(name, email, password, passwordConfirm);
    });

if (userDataForm)
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        updateSettings(form, 'data');
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';

        const passwordCurrent =
            document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('password-confirm').value;
        await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
        );

        document.querySelector('.btn--save-password').textContent =
            'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });

if (bookBtn)
    bookBtn.addEventListener('click', (e) => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        // console.log(startDate1);
        const date = startDate.value;
        // console.log(tourId, date);
        bookTour(tourId, date);
    });

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

if (addReviewBtn)
    addReviewBtn.addEventListener('click', (e) => {
        if (
            addReviewForm.style.display === 'none' ||
            addReviewForm.style.display === ''
        ) {
            addReviewForm.style.display = 'block';
        } else {
            addReviewForm.style.display = 'none';
        }
    });

if (reviewForm)
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const tourId = document.getElementById('tourId').value;
        const rating = document.getElementById('rating').value;
        const review = document.getElementById('review').value;
        // console.log(tourId, rating, review);
        addReview(review, rating, tourId);
    });

if (heartBtn) {
    for (let i = 0; i < heartBtn.length; i++) {
        // console.log(heartBtn);
        heartBtn[i].addEventListener('click', (e) => {
            if (e.target.classList.contains('heart-icon--active')) {
                e.target.classList.remove('heart-icon--active');
                likeTour(e.target.dataset.tourId, 'unlike');
            } else {
                e.target.classList.add('heart-icon--active');
                likeTour(e.target.dataset.tourId, 'like');
            }
        });
    }
}

function addRemoveClass(e, classNameActive, classNameInactive, rating) {
    if (e.dataset.rating <= rating) {
        if (!e.classList.contains(classNameActive)) {
            e.classList.add(classNameActive);
            e.classList.remove(classNameInactive);
        }
    } else {
        if (!e.classList.contains(classNameInactive)) {
            e.classList.add(classNameInactive);
            e.classList.remove(classNameActive);
        }
    }
}

function handleReviewRating(e) {
    const rating = e.target.dataset.rating;
    for (let i = 0; i < reviewRating.length; i++) {
        addRemoveClass(
            reviewRating[i],
            'reviews__star--active',
            'reviews__star--inactive',
            rating
        );
    }
}

if (editIcon || editIconFirstChild) {
    for (let i = 0; i < editIcon.length; i++) {
        editIcon[i].addEventListener('click', (e) => {
            if (reviewText[i].disabled) {
                reviewText[i].disabled = false;
                for (let j = i * 5; j < i * 5 + 5; j++) {
                    reviewRating[j].addEventListener(
                        'click',
                        handleReviewRating
                    );
                }
                reviewSubmit[i].style.display = 'block';
            } else {
                reviewText[i].disabled = true;
                const rating = e.target.dataset.reviewRating;
                for (let j = i * 5; j < i * 5 + 5; j++) {
                    reviewRating[j].removeEventListener(
                        'click',
                        handleReviewRating
                    );
                    addRemoveClass(
                        reviewRating[j],
                        'reviews__star--active',
                        'reviews__star--inactive',
                        rating
                    );
                }
                reviewSubmit[i].style.display = 'none';
            }
        });
    }
}

if (deleteIcon || deleteIconFirstChild) {
    for (let i = 0; i < deleteIcon.length; i++) {
        deleteIcon[i].addEventListener('click', (e) => {
            const reviewId = e.target.dataset.reviewId;
            // console.log(reviewId);
            if (confirm('Are you sure you want to delete this review?') == true)
                deleteReview(reviewId);
        });
    }
}

if (reviewSubmit) {
    for (let i = 0; i < reviewSubmit.length; i++) {
        reviewSubmit[i].addEventListener('click', (e) => {
            const reviewId = e.target.dataset.reviewId;
            const review = reviewText[i].value;
            const rating = document.querySelectorAll(
                `.reviews__rating--review-${reviewId} > .reviews__star--active`
            ).length;
            // console.log(reviewId, review, rating);
            updateReview(review, rating, reviewId);
        });
    }
}

const tourName = document.querySelector('.tour-name');
const tourDuration = document.querySelector('.tour-duration');
const tourMaxGroupSize = document.querySelector('.tour-maxGroupSize');
const TourDifficulty = document.querySelector('.tour-difficulty');
const tourPrice = document.querySelector('.tour-price');
const tourSummary = document.querySelector('.tour-summary');
const tourDescription = document.querySelector('.tour-description');
const imageCoverPhoto = document.querySelector('.tour-imageCover-photo');
const imageCoverUpload = document.querySelector('.tour-imageCover-upload');
// const = document.querySelector('.tour-startLocation');
// const = document.querySelector('.tour-locations');
// const = document.querySelector('.tour-guides');
// const = document.querySelector('.tour-startDates');

function showManageModal(el) {
    console.log('el '+Object.assign({}, el.target) +' el '+JSON.parse(JSON.stringify(el.target)));
    modal.classList.add('open');
    const tourId = el.target.dataset.tourId;
    const tour = getATour(tourId);
    tour.then((tour) => {
        tour = tour.data.data.data;
        tourName.value = tour.name;
        tourDuration.value = tour.duration;
        tourMaxGroupSize.value = tour.maxGroupSize;
        TourDifficulty.value = tour.difficulty;
        tourPrice.value = tour.price;
        tourSummary.value = tour.summary;
        tourDescription.value = tour.description;
        imageCoverPhoto.src = `/img/tours/${tour.imageCover}`;
        editTourSubmitBtn.dataset.tourId = tour._id;
        // // value = tour.imageCover;
        // value = tour.images;
        // value = tour.startLocation;
        // value = tour.locations;
        // value = tour.guides;
        // value = tour.startDates;
    })
}

// Hàm ẩn modal mua vé (gỡ bỏ class open của modal)
function hideManageModal() {
    modal.classList.remove('open');
}

if (editIconManageTour || editIconManageTourFirstChild) {
    editIconManageTour.forEach((el) => {
        el.addEventListener('click', showManageModal);
    });
}

if (closeIcon) {
    closeIcon.addEventListener('click', hideManageModal);
}

if (modal) {
    modal.addEventListener('click', hideManageModal);
}

if (modalContainer) {
    modalContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

if (editTourSubmitBtn) {
    editTourSubmitBtn.addEventListener('click', (e) => {
        const tourId = e.target.dataset.tourId;
        const formData = new FormData();
        formData.append('name', tourName.value);
        formData.append('duration', tourDuration.value);
        formData.append('maxGroupSize', tourMaxGroupSize.value);
        formData.append('difficulty', TourDifficulty.value);
        formData.append('price', tourPrice.value);
        formData.append('summary', tourSummary.value);
        formData.append('description', tourDescription.value);
        formData.append('imageCover', imageCoverUpload.files[0]);
        updateTour(tourId, formData);

        // const name = document.getElementById('name').value;
        // const duration = document.getElementById('duration').value;
        // const maxGroupSize = document.getElementById('maxGroupSize').value;
        // const difficulty = document.getElementById('difficulty').value;
        // const price = document.getElementById('price').value;
        // const summary = document.getElementById('summary').value;
        // const description = document.getElementById('description').value;
        // const imageCover = document.getElementById('imageCover').value;
        // const images = document.getElementById('images').value;
        // const startDates = document.getElementById('startDates').value;
        // const locations = document.getElementById('locations').value;
        // const guides = document.getElementById('guides').value;
        // const secretTour = document.getElementById('secret Tour').checked;
    });
}

if (deleteIconManageTour || deleteIconManageTourFirstChild) {
    deleteIconManageTour.forEach((el) => {
        el.addEventListener('click', (e) => {
            const tourId = e.target.dataset.tourId;
            if (confirm('Are you sure you want to delete this tour?') == true)
                deleteTour(tourId);
        });
    });
}
