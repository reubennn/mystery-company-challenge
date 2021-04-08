/* eslint-disable valid-jsdoc */
import styled from "styled-components";

import {
    color,
    transparency,
} from "./colors";

/**
 * Modal Background Component used to place a
 * transparent background in front of all other components
 * behind the modal.
 * - Helps provide more focus to the modal.
 */
export const ModalBackground = styled.div`
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${color.black + transparency.x85};
    height: 100%;
    width: 100%;
`;

/**
 * Modal Component which pops up in the middle of the screen
 * in front of all other components.
 */
export const Modal = styled.div`
    z-index: 100;
    position: relative;
    top: 1rem;
    right: 1rem;
    overflow: hidden;
    border-radius: 0.5rem;
    color: ${color.grey.shade.dark};
    background-color: ${color.white};
    box-shadow: 0 1rem 2rem 0 ${color.black + transparency.x30};
    border: 0.05rem solid ${color.grey.tint.lightest};
    width: 50vw;
    padding: 3rem 8rem;
`;

/**
 * Close cross created using CSS.
 * - We can position this over a button to make a
 * close button.
 */
export const CloseCross = styled.span.attrs((props) => ({
    shift: props.shift || false,
}))`
    content: '';
    position: absolute;
    height: 1rem;
    border-left: solid 0.15rem ${color.white};
    transform: ${(props) => props.shift ? "rotate(-45deg)" : "rotate(45deg)"};
    transition: ease-in-out 0.3s;
`;
