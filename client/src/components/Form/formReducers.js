/**
 * Form Component React Hook Reducers.
 * - Modify/manipulate the Form state depending on the Action received.
 */

import {
    UPDATE_INPUT,
    TOGGLE_VALID_INPUT_FLAG,
    SET_REQUEST_FLAGS,
    SET_FORM_COMPLETE_STATUS,
    SET_SHOW_ERROR_STATUS,
    RESET_FORM,
} from "./formActions";

/** Default reusable values for the reducer initial state */
const defaults = {
    value: "",
    isValid: true,
};

/** Initial state of the Form */
export const initialState = {
    /** Input values and valid flags */
    name: { ...defaults },
    email: { ...defaults },
    pin: { ...defaults },
    message: { ...defaults },
    /** Request result flags */
    request: { success: null, failure: null },
    /** Form complete flag */
    complete: false,
    /** Flag triggered when user tries to submit incomplete form */
    showError: false,
};

/**
 * Reducer functions for the Form Component reducers.
 *
 * @param {*} state current Form state
 * @param {String} action to determine what to do to the state
 * @return {*} new state of the Form
 */
export const formReducer = (state, action) => {
    /** Destructor the action type and payload */
    const { type, payload } = action;

    switch (type) {
        /**
         * Reducer function that dynamically updates an
         * input's value.
         *
         * @param {String} input the input property name
         * @param {String} value the new value to set
         */
        case UPDATE_INPUT: {
            const { input, value } = payload;
            return {
                ...state,
                [input]: {
                    ...state[input],
                    value,
                },
            };
        }
        /**
         * Reducer function that dynamically toggles an
         * input's isValid flag.
         *
         * @param {String} input the input property name
         */
        case TOGGLE_VALID_INPUT_FLAG: {
            const { input } = payload;
            return {
                ...state,
                [input]: {
                    ...state[input],
                    isValid: !state[input].isValid,
                },
            };
        }
        /**
         * Reducer function that updates the request flag
         * states depending on the API request result.
         *
         * @param {Boolean} success request success flag
         * @param {Boolean} failure failure request flag
         */
        case SET_REQUEST_FLAGS: {
            const { success, failure } = payload;
            return {
                ...state,
                request: {
                    success,
                    failure,
                },
            };
        }
        /**
         * Reducer function that updates the state of the
         * form completion.
         * - If all results are valid, then the form is complete.
         *
         * @param {Boolean} complete form completion status
         */
        case SET_FORM_COMPLETE_STATUS: {
            const { complete } = payload;
            return {
                ...state,
                complete,
            };
        }
        /**
         * Reducer function that updates the state of the
         * form completion.
         * - If all results are valid, then the form is complete.
         *
         * @param {Boolean} showError error flag for helper message
         */
        case SET_SHOW_ERROR_STATUS: {
            const { showError } = payload;
            return {
                ...state,
                showError,
            };
        }
        /**
         * Reducer function which resets the reducer back to
         * the initial state
         *
         * - Reset useReducer state from: https://mtm.dev/reset-usereducer-state#:~:text=If%20you%20want%20to%20reset,the%20reset%20action%20is%20triggered.&text=According%20to%20React's%20docs%20for,create%20the%20initial%20state%20lazily.
         *
         * @param {Boolean} showError error flag for helper message
         */
        case RESET_FORM: {
            return initialState;
        }
    }
};
