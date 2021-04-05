/* eslint-disable valid-jsdoc */
import styled, { css } from "styled-components";

import {
    color,
    transparency,
} from "./colors";

/**
 * Label Component.
 */
export const Label = styled.label`
    margin-bottom: 0.4rem;
    margin-top: 0;

    &:not(:first-of-type) {
        margin-top: 1rem;
    }
`;

/**
 * Component which acts as an underline for the input field.
 *
 * - We need to create a span element since input elements are
 * unable to have child elements.
 */
export const InputLine = styled.span`
    /** Make the bottom-border sit nicely under the input field */
    margin-top: -3px;
    /** Hide the bottom-border, but keep to the left */
    width: 100%;
    height: 100%;
    border-bottom: 0.05rem solid ${color.grey.tint.darker};
    transition: width 0.2s ease-in-out 0.2s;
`;

/**
 * Component which acts as an underline for the input field when focused.
 *
 * - Separate component so we can create an expanding/shrinking effect.
 */
export const InputFocusLine = styled.span`
    /** Make the bottom-border sit over the other input line*/
    margin-top: -0.05rem;
    /** Hide the bottom-border, but keep to the left */
    width: 0;
    height: 100%;
    border-bottom: 0.09rem solid ${color.blue.neutral};
    transition: width 0.2s ease-in-out 0s;
`;

/**
 * Input Component.
 *
 * - When the input is in focus, it displays a blue underline
 * to help the user know which input they are writing into.
 * - When an input is invalid, we should flag it using the
 * invalid class name, so that it will display a red underline.
 */
export const Input = styled.input.attrs((props) => ({
    width: props.width || "100%",
}))`
    width: ${(props) => props.width};
    outline: 0;
    border: none;
    box-shadow: none;
    padding: 0.5rem 0.7rem;
    margin-bottom: 0.2rem;
    line-height: 1.4;

    &:focus {
        & + ${InputLine} {
            /** Make the bottom-border expand on input focus */
            width: 0;
            border-bottom: 0.05rem solid ${color.grey.tint.darker};
            transition: width 0.2s ease-in-out 0s;
        }

        & + ${InputLine} + ${InputFocusLine} {
            /** Make the bottom-border expand on input focus */
            width: 100%;
            border-bottom: 0.09rem solid ${color.blue.neutral};
            transition: width 0.2s ease-in-out 0.2s;
        }
    }

    /** Class used to flag that the input has an invalid value */
    &.invalid {
        & + ${InputLine} {
            /** Make the bottom-border shrink */
            width: 100%;
            border-bottom: 0.09rem solid ${color.red.neutral};
            transition: width 0.2s ease-in-out 0.2s;
        }

        & + ${InputLine} + ${InputFocusLine} {
            /** Make the bottom-border expand on input focus */
            width: 0;
            border-bottom: 0.09rem solid ${color.red.neutral};
            transition: width 0.2s ease-in-out 0s;
        }

        &:focus {
            & + ${InputLine} {
                /** Make the bottom-border shrink */
                width: 0;
                border-bottom: 0.09rem solid ${color.red.darker};
                transition: width 0.2s ease-in-out 0s;
            }

            & + ${InputLine} + ${InputFocusLine} {
                /** Make the bottom-border expand on input focus */
                width: 100%;
                border-bottom: 0.09rem solid ${color.red.darker};
                transition: width 0.2s ease-in-out 0.2s;
            }
        }
    }
`;

/**
 * Text Area Component.
 *
 * - When the textarea is in focus, it displays a blue underline
 * to help the user know which input they are writing into.
 * - When the textarea input is invalid, we should flag it using the
 * invalid class name, so that it will display a red underline.
 */
export const TextArea = styled.textarea`
    cursor: auto;
    resize: none;
    outline: 0;
    border: none;
    box-shadow: none;
    padding: 0.5rem 0.7rem;
    margin-bottom: 0.2rem;
    overflow: auto;
    height: 4rem;
    line-height: 1.2;

    &:focus {
        & + ${InputLine} {
            width: 0;
            border-bottom: 0.05rem solid ${color.grey.tint.darker};
            transition: width 0.2s ease-in-out 0s;
        }

        & + ${InputLine} + ${InputFocusLine} {
            width: 100%;
            border-bottom: 0.09rem solid ${color.blue.neutral};
            transition: width 0.2s ease-in-out 0.2s;
        }
    }

    &.invalid {
        & + ${InputLine} {
            width: 100%;
            border-bottom: 0.09rem solid ${color.red.neutral};
            transition: width 0.2s ease-in-out 0.2s;
        }

        & + ${InputLine} + ${InputFocusLine} {
            width: 0;
            border-bottom: 0.09rem solid ${color.red.neutral};
            transition: width 0.2s ease-in-out 0s;
        }

        &:focus {
            & + ${InputLine} {
                width: 0;
                border-bottom: 0.09rem solid ${color.red.darker};
                transition: width 0.2s ease-in-out 0s;
            }

            & + ${InputLine} + ${InputFocusLine} {
                width: 100%;
                border-bottom: 0.09rem solid ${color.red.darker};
                transition: width 0.2s ease-in-out 0.2s;
            }
        }
    }
`;

/**
 * Invalid input helper text which displays red helper text
 * under the input field when the form detects that the input is invalid.
 *
 * @param {Boolean} after label for after the form submit button
 */
export const InvalidInputHelper = styled.label.attrs((props) => ({
    after: props.after || false,
}))((props) => css`
    color: transparent;
    display: block;
    font-size: 0.8rem;
    max-height: 0;
    transition: all 0.5s ease-in-out 0s,
                max-height 0.8s ease-in-out 0s;
    text-align: ${props.after ? "center" : ""};

    &.show {
        max-height: 10rem;
        color: ${color.red.neutral};
        margin-top: ${props.after ? "1.5rem" : ""};
        transition: all 0.5s ease-in-out 0s,
                    max-height 0.8s ease-in-out 0s;
    }
`);

/**
 * General Form Component.
 */
export const Form = styled.form`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    margin: 2rem auto 7rem auto;
    border-radius: 0.4rem;
    color: ${color.grey.shade.dark};
    background-color: ${color.white};
    box-shadow: 0 1rem 2rem 0 ${color.black + transparency.x30};
    border: 0.05rem solid ${color.grey.tint.lightest};
    width: 60%;
    padding: 3rem 8rem;
`;
