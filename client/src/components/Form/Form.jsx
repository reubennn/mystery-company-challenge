import React, { useReducer, useEffect, useRef } from "react";
import useApi from "../../hooks/useApi";

import { initialState, formReducer } from "./formReducers";
import {
    updateInput,
    toggleValidInputFlag,
    setRequestFlags,
    setFormCompleteStatus,
    setShowErrorStatus,
    resetForm,
} from "./formActions";

import Input from "../Input";

import * as S from "../../styles/styled-components/styled.main";

/**
 * Form React Component used to collect data from the user and
 * on submission, send the data to the PostgreSQL database.
 *
 * - Uses useReducer React Hook to dispatch actions and modify/update
 * the Form state.
 * - This is beneficial as our state structure is quite complex, so
 *  having a reducer to perform actions on the state allows a
 * separation of concerns and keeps the code more organised.
 *
 * - useReducer implemented with reference to official React
 * documentation: https://reactjs.org/docs/hooks-reference.html
 *
 * @return {Component} a form to fill in details
 */
const Form = () => {
    /** useRef Mount status for cleanup and avoiding memory leaks  */
    const isMounted = useRef(true);

    /**
     * Set up the Form Reducer using useReducer React Hook.
     * - We can use actions to modify the form state using dispatch.
     * */
    const [state, dispatch] = useReducer(formReducer, initialState);

    /** Store the input names in an object for easy access/reference */
    const inputs = {
        NAME: "name",
        EMAIL: "email",
        PIN: "pin",
        MESSAGE: "message",
    };

    const SERVER_URL =
        process.env.REACT_APP_SERVER_URL || "http://localhost:9000";

    /** URL and options for useApi Hook */
    const REQUEST_URL = `${SERVER_URL}/api/add-entry`;
    const REQUEST_OPTIONS = { method: "POST" };

    /** Custom Hook to handle API HTTP request for getting the listings */
    const { state: apiRequestState, apiRequestWithOptions } = useApi(
        REQUEST_URL,
        REQUEST_OPTIONS,
    );

    /**
     * useEffect which performs cleanup, setting isMounted to false.
     *
     * - This ensures subscriptions and async tasks are cancelled
     * while the component is unmounted.
     */
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * useEffect which is triggered when the listApiRequestState has changed,
     * either if we receive a response from the server,
     * or an error has occurred.
     */
    useEffect(() => {
        if (apiRequestState.data !== null) {
            const { response, body } = apiRequestState.data;
            if (response.status !== 200 && isMounted.current) {
                dispatch(setRequestFlags({ success: false, failure: true }));
            } else if (isMounted.current) {
                console.log(body);
                dispatch(setRequestFlags({ success: true, failure: false }));
            }
        } else if (apiRequestState.error !== null && isMounted.current) {
            dispatch(setRequestFlags({ success: false, failure: true }));
        }
    }, [apiRequestState]);

    /**
     * useEffect triggered if PIN number isValid flag or input value changes.
     *
     * - If the PIN already has four digits and a user tries to enter another
     * digit, an error helper message will be displayed as a form of feedback
     * to the user.
     * - We can use a timeout to reset the invalid status so the message
     * disappears after a short time.
     * - We must account for the edge case where a user tries to enter a fifth
     * digit, the error message shows and then they backspace so there is less
     * than four digits. In this instance, we do not want the timeout to reset
     * the invalid status (does not meet four digit criteria).
     *      - We account for this by triggering this useEffect when the value
     *      changes.
     *      - We perform a check to ensure the PIN number is valid.
     *      - If it isn't, the timeout we were waiting on is essentially
     *      cancelled out and the error message remains until rectified.
     */
    useEffect(() => {
        let timeout;
        /** The timeout is only ever created if the PIN is invalid */
        if (isMounted.current && !state.pin.isValid) {
            /**
             * Function which is called when the timeout has occurred.
             * - Checks the PIN state is invalid and if the isValid flag
             * indicates it is also invalid.
             * - If checks pass, we can reset the isValid flag.
             */
            const resetInvalidFlag = () => {
                if (
                    !state.pin.isValid &&
                    isValid(inputs.PIN, state.pin.value)
                ) {
                    dispatch(toggleValidInputFlag(inputs.PIN));
                }
            };
            if (state.pin.value.length === 4) {
                /** Create the timeout if the number of digits is four */
                timeout = setTimeout(() => resetInvalidFlag(), 2000);
            }
        }
        /**
         * Cleanup function to avoid memory leaks.
         */
        return () => {
            clearTimeout(timeout); // Clear the timeout.
        };
    }, [state.pin.isValid, state.pin.value]);

    /**
     * useEffect triggered if message isValid flag or input value changes.
     *
     * - Similar logic as the PIN number useEffect.
     * - Provide user feedback if the user tries to enter more than 48
     * characters.
     * - We only want to display the error message for a short time, since
     * 48 characters is a valid input.
     */
    useEffect(() => {
        let timeout;
        if (isMounted.current && !state.message.isValid) {
            /**
             * Function which is called when the timeout has occurred.
             * - Checks the message state is invalid and if the isValid flag
             * indicates it is also invalid.
             * - If checks pass, we can reset the isValid flag.
             */
            const resetInvalidFlag = () => {
                if (
                    !state.message.isValid &&
                    isValid(inputs.MESSAGE, state.message.value)
                ) {
                    dispatch(toggleValidInputFlag(inputs.MESSAGE));
                }
            };
            if (state.message.value.length === 48) {
                /** Create the timeout if the character length is 48 */
                timeout = setTimeout(() => resetInvalidFlag(), 2000);
            }
        }
        /**
         * Cleanup function to avoid memory leaks.
         */
        return () => {
            clearTimeout(timeout); // Clear the timeout.
        };
    }, [state.message.isValid, state.message.value]);

    /**
     * useEffect which is called when any input field valid status changes.
     *
     * - Checks if all input fields in the form
     * are valid and updates the isComplete flag accordingly.
     * - If all inputs are valid and an error message is being shown, it will
     * be hidden immediately regardless of the timeout to hide it.
     */
    useEffect(() => {
        if (isMounted.current) {
            if (checkFormIsComplete()) {
                /** All inputs are valid so the form is complete */
                dispatch(setFormCompleteStatus(true));
                dispatch(setShowErrorStatus(false));
            } else if (state.complete === true) {
                /**
                 * One of the inputs is invalid.
                 * - We only need to update the state if current
                 * completion state is true.
                 */
                dispatch(setFormCompleteStatus(false));
            }
        }
    }, [
        state.name.isValid,
        state.email.isValid,
        state.pin.isValid,
        state.message.isValid,
    ]);

    /**
     * Handler which prevents the default event from occurring when
     * submitting the form.
     *
     * @param {Event} event event object
     */
    const handleSubmitEvent = (event) => {
        event.preventDefault();
    };

    /**
     * Helper function to check if an input value is valid.
     *
     * - RegExp found from Andrew: https://stackoverflow.com/a/32686261
     *
     * @param {String} input the input property name
     * @param {String} value the new value to set
     * @return {Boolean} is valid or not
     */
    const isValid = (input, value) => {
        /** Check if the input value is empty */
        if (value.trim() === "") return false;
        /** RegExp test to see if the email looks like it could be valid. */
        if (input === inputs.EMAIL) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        } else if (input === inputs.PIN) {
            /** The PIN must be 4 digits */
            return value.length === 4;
        } else if (input === inputs.MESSAGE) {
            /** The PIN must be 4 digits */
            return value.length <= 48;
        }
        return true;
    };

    /**
     * Function which is called to update the form state
     * dynamically depending on the input property supplied.
     *
     * - Checks if the input is valid for the field and updates
     * the isValid flag accordingly.
     *
     * @param {String} input the input property name
     * @param {String} value the new value to set
     */
    const updateFormState = (input, value) => {
        if (input === inputs.MESSAGE) {
            /**
             * Ensure the message is not greater than 48 characters.
             * - This check ensures the user is unable to enter
             * any more than 48 characters.
             */
            if (value.length <= 48) {
                dispatch(updateInput(input, value));
            }
        } else if (input === inputs.PIN) {
            /**
             * Ensure the PIN is not greater than 4 digits.
             * - This check ensures the user is unable to enter
             * any more than four digits.
             */
            if (value.length <= 4) {
                dispatch(updateInput(input, value));
            }
        } else {
            /** Update the value with the desired value */
            dispatch(updateInput(input, value));
        }
        /** Flag the input field as invalid, or not */
        if (state[input].isValid && !isValid(input, value)) {
            dispatch(toggleValidInputFlag(input));
        } else if (!state[input].isValid && isValid(input, value)) {
            dispatch(toggleValidInputFlag(input));
        }
    };

    /**
     * Function which checks if the message contains whitespace only
     * (spaces, line-breaks or tabs) or is an empty string.
     *
     * @param {String} value the input value to check
     * @return {Boolean} true if the input is empty, otherwise false
     */
    const isEmpty = (value) => {
        return value.trim() === "" ? true : false;
    };

    /**
     * Function which checks if all input fields in the form
     * have valid input.
     *
     * @return {Boolean} true if form has valid inputs, false otherwise
     */
    const checkFormIsComplete = () => {
        for (const key in inputs) {
            if (Object.prototype.hasOwnProperty.call(inputs, key)) {
                /** Check if the input field is valid */
                const KEY_LOWER = key.toLowerCase();
                if (state[KEY_LOWER].isValid === false) {
                    return false;
                }
                /**
                 * Edge case, at the beginning, all flags are true
                 * so we don't see an error straight away.
                 * So we need to check the input fields are not empty.
                 */
                if (isEmpty(state[KEY_LOWER].value)) {
                    return false;
                }
            }
        }
        return true;
    };

    /**
     * Function used to flag any remaining inputs as invalid if
     * they are not valid.
     * - This is called when a user submits but the form is incomplete.
     *
     * @return {Boolean} true if form has valid inputs, false otherwise
     */
    const flagIncompleteInputs = () => {
        for (const key in inputs) {
            if (Object.prototype.hasOwnProperty.call(inputs, key)) {
                /** Check if the input field is valid */
                const KEY_LOWER = key.toLowerCase();
                if (
                    state[KEY_LOWER].isValid === true &&
                    !isValid(key, state[KEY_LOWER].value)
                ) {
                    /** Set isValid input flag is false */
                    dispatch(toggleValidInputFlag(KEY_LOWER));
                }
            }
        }
        return true;
    };

    /**
     * Function handler for the button click event.
     *
     * - Call the corresponding handler functions depending if the
     * form is complete or not.
     */
    const handleSubmitClick = () => {
        if (state.complete) {
            handleCompleteSubmit();
        } else {
            handleIncompleteSubmit();
            /** Warn the user which inputs are still invalid */
            flagIncompleteInputs();
        }
    };

    /**
     * Handler function if the submit button was pressed,
     * but the form is incomplete.
     *
     * - Sets showError and buttonClicked flags to true.
     */
    const handleIncompleteSubmit = () => {
        dispatch(setShowErrorStatus(true));
    };

    /**
     * Handler function if the submit button was pressed and
     * the form is complete and valid.
     *
     * - If the form is complete, set the submitted flag to true,
     * which triggers the form thank you message to display and the
     * form to collapse.
     * - It is here that we perform an API call to the server with the
     * message parameters to be processed.
     */
    const handleCompleteSubmit = () => {
        // Update submitted flag state
        dispatch(setShowErrorStatus(false));
        const OPTIONS = {
            method: "POST",
            headers: {
                /** Tell the server we are passing JSON */
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: state.name.value.replace(" ", "+"),
                email: state.email.value,
                pin: parseInt(state.pin.value),
                message: state.message.value,
            }),
        };
        /** Now send the message request to the server API */
        apiRequestWithOptions(OPTIONS);
    };

    return (
        <S.Form onSubmit={(e) => handleSubmitEvent(e)}>
            <S.Header as="h2" fontSize="1.4rem" className="no-margin-top">
                Please enter your details
            </S.Header>
            <S.Label className="uppercase">Name:</S.Label>
            <Input
                input={state.name}
                inputName="name"
                type="text"
                placeholder="Julien Greenfold"
                onChangeHandler={updateFormState}
                invalidTextHelper="Please provide a name."
            />
            <S.Label className="uppercase">Email:</S.Label>
            <Input
                input={state.email}
                inputName="email"
                type="email"
                placeholder="some_email@example.com"
                onChangeHandler={updateFormState}
                invalidTextHelper="Please provide a valid email address."
            />
            <S.Label className="uppercase">PIN:</S.Label>
            <Input
                input={state.pin}
                inputName="pin"
                type="number"
                placeholder="1234"
                onChangeHandler={updateFormState}
                onBlur={updateFormState}
                invalidTextHelper="The PIN must be four digits."
            />
            <S.Label className="uppercase">Message:</S.Label>
            <Input
                textarea
                input={state.message}
                inputName="message"
                type="text"
                placeholder="A very important message..."
                onChangeHandler={updateFormState}
                invalidTextHelper="Please provide a message.
                (Maximum 48 characters)"
            />
            {state.request.success ? (
                <S.Button
                    className="red uppercase"
                    onClick={() => dispatch(resetForm())}>
                    Reset
                </S.Button>
            ) : (
                <S.Button
                    className="uppercase"
                    onClick={() => handleSubmitClick()}>
                    Submit
                </S.Button>
            )}
            <S.Helper className={state.showError ? "show" : ""}>
                Please complete the form before submitting.
            </S.Helper>
            <S.Helper className={state.request.failure ? "show" : ""}>
                An error occurred while adding the entry to the server. Please
                try again later.
            </S.Helper>
            <S.Helper
                className={state.request.success ? "show green" : ""}>
                Entry successfully added to the database.
            </S.Helper>
        </S.Form>
    );
};

export default Form;
