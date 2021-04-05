/**
 * Form Component React Hook Reducers.
 * - Modify/manipulate the Form state depending on the Action received.
 */

import {
    UPDATE_INPUT,
    TOGGLE_VALID_INPUT_FLAG,
} from "./formActions";

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
         * @param {String} value the new value to set
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
    }
};
