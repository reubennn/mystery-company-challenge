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

/**
 * Dynamic action that will send the success and failure
 * request flag status to get updated from the reducer.
 *
 * @param {Boolean} success request success flag
 * @param {Boolean} failure failure request flag
 */
export const SET_REQUEST_FLAGS = "SET_REQUEST_FLAGS";
export const setRequestFlags = ({ success, failure }) => ({
    type: SET_REQUEST_FLAGS,
    payload: { success, failure },
});

/**
 * Action to update the form completion status, if
 * all the inputs are valid or not.
 *
 * @param {Boolean} complete form completion status
 */
export const SET_FORM_COMPLETE_STATUS = "SET_FORM_COMPLETE_STATUS";
export const setFormCompleteStatus = (complete) => ({
    type: SET_FORM_COMPLETE_STATUS,
    payload: { complete },
});

/**
 * Updates the show error flag if a user tries to
 * submit an incomplete form.
 *
 * @param {Boolean} showError error flag for helper message
 */
export const SET_SHOW_ERROR_STATUS = "SET_SHOW_ERROR_STATUS";
export const setShowErrorStatus = (showError) => ({
    type: SET_SHOW_ERROR_STATUS,
    payload: { showError },
});

/**
 * Resets the entire form state.
 */
export const RESET_FORM = "RESET_FORM";
export const resetForm = () => ({
    type: RESET_FORM,
});
