/**
 * @license Apache-2.0
*/

'use strict';

/**
 * import module
 */
import imagePreview from './utils/imagePreview.js';
import Snackbar from "./snackbar.js";
import config from './config.js';
import imageAsDataURL from './utils/imageAsDataUrl.js';

// Selectors for image field, image preview, and clear preview button
const $imageField = document.querySelector('[data-image-field]');
const $imagePreview = document.querySelector('[data-image-preview]');
const $imagePreviewClear = document.querySelector('[data-image-preview-clear]');

// Event listener for image field change to trigger image preview
$imageField.addEventListener('change', () => {
    imagePreview($imageField, $imagePreview);
});

/**
 * Clears the image preview by removing the 'show' class form the preview container.
 * @function clearImagePreview
 */
const clearImagePreview = function () {
    $imagePreview.classList.remove('show');
    $imagePreview.innerHTML = '';
}

$imagePreviewClear.addEventListener('click', clearImagePreview);

/**
 * Handle blog publish
 */
const $form = document.querySelector('[data-form]');
const $publishBtn = document.querySelector('[data-publish-btn]');

const handlePublishBlog = async function (event) {
    // Preventing default form submission behavior
    event.preventDefault();

    // Disabling publish button to prevent multiple submissions
    $publishBtn.setAttribute('disabled', '');

    // Creating FormData object to capture form data
    const formData = new FormData($form);

    // Handle case where user not selected any image for banner when creating blog
    if (!formData.get('banner').size) {
        // Enable publish button and show error message
        $publishBtn.removeAttribute('disabled');
        Snackbar({ type: 'error', message: 'You didn\'t select any image for blog banner !' });
        return;
    }

    // Handle case where selected image size large than 5MB
    if (formData.get('banner').size > config.blogBanner.maxByteSize) {
        $publishBtn.removeAttribute('disabled');
        Snackbar({ type: 'error', message: 'Image shoud be less than 5MB !' });
        return;
    }

    // Overwrite banner value (which is type of 'File') to base64
    formData.set('banner', await imageAsDataURL(formData.get('banner')));

    // Create request body from formData
    const body = Object.fromEntries(formData.entries());

    // Sending form data to the server for create blog
    const response = await fetch(`${window.location.origin}/createblog`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

$form.addEventListener('submit', handlePublishBlog);
