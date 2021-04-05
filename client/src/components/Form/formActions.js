/**
 * Form Component React Hook Reducer Actions.
 * - Contains payloads of information to send data to the reducer.
 */

/**
 * Dynamic action that will deliver the corresponding
 * input and it's corresponding value to get updated
 * by the reducer.
 *
 * @param {String} input the input property name
 * @param {String} value the new value to set
 */
export const UPDATE_INPUT = "UPDATE_INPUT";
export const updateInput = (input, value) => ({
    type: UPDATE_INPUT,
    payload: { input, value },
});

/**
 * Dynamic action that will trigger an input
 * to have its isValid flag toggled.
 *
 * @param {String} input the input property name
 */
export const TOGGLE_VALID_INPUT_FLAG = "TOGGLE_VALID_INPUT_FLAG";
export const toggleValidInputFlag = (input) => ({
    type: TOGGLE_VALID_INPUT_FLAG,
    payload: { input },
});
