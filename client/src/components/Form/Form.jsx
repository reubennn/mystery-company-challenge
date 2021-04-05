import React, { useReducer, useEffect } from "react";

import { formReducer } from "./formReducers";
import { updateInput, toggleValidInputFlag } from "./formActions";

import Input from "../Input";

import * as S from "../../styles/styled-components/styled.main";

/**
 * Form React Component used to collect data from the user and
 * on submission, send the data to the PostgreSQL database.
 *
 * - Uses useReducer React Hook to dispatch actions and modify/update
 * the Form state.
 * - This will become especially useful once we bring in a more complex
 * state structure when we need to perform API calls to the server.
 * - useReducer implemented with reference to official React
 * documentation: https://reactjs.org/docs/hooks-reference.html
 *
 * @return {Component} a form to fill in details
 */
const Form = () => {
    /** Default reusable values for the reducer initial state */
    const defaults = {
        value: "",
        isValid: true,
    };

    /** Initial state of the Form */
    const initialState = {
        name: { ...defaults },
        email: { ...defaults },
        pin: { ...defaults },
        message: { ...defaults },
    };

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
        let isMounted = true;
        let timeout;
        /** The timeout is only ever created if the PIN is invalid */
        if (isMounted && !state.pin.isValid) {
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
            isMounted = false; // Reset mounted status.
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
        let isMounted = true;
        let timeout;
        if (isMounted && !state.message.isValid) {
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
            isMounted = false; // Reset mounted status.
            clearTimeout(timeout); // Clear the timeout.
        };
    }, [state.message.isValid, state.message.value]);

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

    return (
        <S.Form onSubmit={(e) => handleSubmitEvent(e)}>
            <S.Header as="h2" fontSize="1.4rem" className="form">
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
            <S.Button>Submit</S.Button>
        </S.Form>
    );
};

export default Form;
