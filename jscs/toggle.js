/* global console */
(function () {

    'use strict';

    /**
     * @description Make sure the browser supports what we are about to do.
     * @returns {Boolean}
     */
    function isFeatureSupported() {
        return !!(document.querySelectorAll && document.body.classList);
    }

    /**
     * @description Finds correct error list element.
     * @param {Object.<HTMLElement>} targetElement
     * @returns {Object.<HTMLElement>} Error list element
     */
    function getParentElement(targetElement) {
        return targetElement.classList.contains('error') ? targetElement : getParentElement(targetElement.parentElement);
    }

    /**
     * @description Gets error container element.
     * @param {Object.<HTMLElement>} eventTarget Event target element
     * @returns {Object.<HTMLElement>} Error container element
     */
    function getErrorContainer(eventTarget) {
        var parentElement = getParentElement(eventTarget);

        if (parentElement) {
            return parentElement.querySelector('.error-message');
        }
    }

    /**
     * @description Toggles error container visibility.
     * @param {Object.<HTMLElement>} eventTarget
     */
    function toggleView(eventTarget) {
        var errorMessageContainer = getErrorContainer(eventTarget);

        if (errorMessageContainer) {
            errorMessageContainer.classList.toggle('hide');
        }
    }

    /**
     * @description Adds event listener to errors container element.
     */
    function attachListener(errorsContainer) {
        errorsContainer.addEventListener('click', function (event) {
            event.stopPropagation();

            if (event.target.className === 'error-header' || event.target.parentElement.className === 'error-header') {
                toggleView(event.target);
            }
        }, false);
    }

    /**
     * @description Initialises and checks for browser's feature support.
     */
    function initialise() {
        var errorsContainer;

        if (isFeatureSupported()) {
            errorsContainer = document.querySelector('.errors');
            if (errorsContainer) {
                attachListener(errorsContainer);
            }
        } else {
            console.log('Please use a modern browser to view this page!');
        }
    }

    initialise();
}());
