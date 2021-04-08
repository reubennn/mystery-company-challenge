import React from "react";
import PropTypes from "prop-types";

import * as S from "../styles/styled-components/styled.main";

/**
 * Form Input React Component used as a container for all
 * input related elements.
 *
 * - Will render either HTML input or textarea, depending on textarea flag.
 * - The onChange handler which always take precedence.
 * - However, we still want to perform our checks on the value
 * when we lose focus, so we will trigger it for the onBlur event too.
 *
 * @return {Component} an input field for a form
 */
const Input = ({
    className = "",
    input,
    inputName,
    type,
    placeholder,
    onChangeHandler,
    invalidTextHelper,
    textarea = false,
}) => (
    <>
        {textarea ? (
            <S.TextArea
                className={input.isValid ? className : className + " invalid"}
                type={type}
                placeholder={placeholder}
                value={input.value}
                onChange={(e) => onChangeHandler(inputName, e.target.value)}
                onBlur={(e) => onChangeHandler(inputName, e.target.value)}
            />
        ) : (
            <S.Input
                className={input.isValid ? className : className + " invalid"}
                type={type}
                placeholder={placeholder}
                value={input.value}
                onChange={(e) => onChangeHandler(inputName, e.target.value)}
                onBlur={(e) => onChangeHandler(inputName, e.target.value)}
            />
        )}

        <S.InputLine />
        <S.InputFocusLine />
        <S.InvalidInputHelper
            className={!input.isValid ? className + " show" : className}>
            {invalidTextHelper}
        </S.InvalidInputHelper>
    </>
);

Input.propTypes = {
    /**
     * The HTML class name to pass to the components for CSS styling.
     */
    className: PropTypes.string,
    /**
     * The input object which contains information about the input field.
     *
     * @property {String} value input value
     * @property {Boolean} isValid flag indicating if input value is valid
     */
    input: PropTypes.object,
    /**
     * Name of the input.
     */
    inputName: PropTypes.string,
    /**
     * Type of input field.
     */
    type: PropTypes.string,
    /**
     * Placeholder text for the input field.
     */
    placeholder: PropTypes.string,
    /**
     * Handler function triggered when the input field changes.
     */
    onChangeHandler: PropTypes.func,
    /**
     * Text to display when the input has been flagged as invalid.
     */
    invalidTextHelper: PropTypes.string,
    /**
     * Flag indicating if the input is a textarea HTML element.
     */
    textarea: PropTypes.bool,
};

export default Input;
