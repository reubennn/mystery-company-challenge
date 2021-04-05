/* eslint-disable valid-jsdoc */
import styled, { css } from "styled-components";

import {
    color,
    handleColor,
    transparency,
} from "./colors";

/**
 * Simple Header Component with minimal styling.
 *
 * Setting props.as will convert the html tag to the appropriate
 * header type (h1, h2, h3.. etc.)
 *
 * @param {String} as sets the html tag, h1, h2 etc.
 * @param {String} color text color
 * @param {String} bgColor background color
 * @param {String} textAlign text align style
 * @param {String} fontSize the font-size of the text
 */
export const Header = styled.h1.attrs((props) => ({
    as: props.as || "h1",
    color: props.color || "inherit",
    bgColor: props.bgColor || "transparent",
    textAlign: props.textAlign || "center",
    fontSize: props.fontSize || undefined,
}))((props) => css`
    color: ${handleColor(props.color)};
    background-color: ${handleColor(props.bgColor)};
    text-align: ${props.textAlign};
    margin: 2rem auto;
    font-family: inherit;
    font-weight: 500;
    line-height: 1.2;
    font-size: ${() => {
        if (props.fontSize !== undefined) {
            return props.fontSize;
        } else {
            switch (props.as) {
                case ("h1"): return "2.25rem";
                case ("h2"): return "1.8rem";
                case ("h3"): return "1.5rem";
                case ("h4"): return "1.2rem";
                case ("h5"): return "1rem";
                case ("h6"): return "0.8rem";
                default: return "2.25rem";
            }
        }
    }};
    padding: ${props.bgColor !== "transparent" ? "0.5rem 1rem" : "0"};
    border-radius: ${props.bgColor !== "transparent" ? "0.2rem" : " 0"};

    &.form {
        margin-top: 0;
    }
`);

/**
 * Button Component.
 *
 * @param {String} $radius transient prop for the button radius
 */
export const Button = styled.button.attrs((props) => ({
    $radius: props.$radius || "0.2rem",
}))`
    color: ${color.white};
    background-color: ${color.blue.neutral};
    font-weight: 600;
    font-size: 1.2rem;
    white-space: nowrap;
    text-shadow: 0.03rem 0.03rem
    ${color.grey.shade.darkest + transparency.x25};
    box-shadow: 0.1rem 0.15rem 0.3rem
    ${color.grey.shade.darker + transparency.x50};
    padding: 0.6rem 1.7rem;
    display: block;
    margin: 1rem auto;
    border-radius: ${(props) => props.$radius};
    margin-left: auto;
    margin-right: auto;
    transition: ease-in-out 0.25s;

    &:hover {
        background-color: ${color.blue.dark};
        transition: ease-in-out 0.4s;
    }

    &:active {
        background-color: ${color.blue.darker};
        transition: linear 0.05s;
    }
`;
