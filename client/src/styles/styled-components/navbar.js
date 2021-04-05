/* eslint-disable valid-jsdoc */
import styled from "styled-components";

import { color, transparency } from "./colors";

/**
 * Main navbar component for the app.
 */
export const Navbar = styled.nav`
    position: fixed;
    top: 1rem;
    right: 3rem;
`;

/**
 * Button Component for the navbar, which has slightly
 * different styling to the normal Button Component.
 */
export const NavButton = styled.button`
    display: block;
    text-transform: uppercase;
    white-space: nowrap;
    font-weight: 600;
    font-size: 1.2rem;
    color: ${color.white};
    background-color: ${color.grey.shade.neutral};
    padding: 0.5rem 1.5rem;
    margin: 1rem auto;
    border-radius: 0.5rem;
    text-shadow: 0.03rem 0.03rem
    ${color.grey.shade.darkest + transparency.x25};
    transition: ease-in-out 0.25s;

    &:hover {
        background-color: ${color.grey.shade.dark};
        border-radius: 0.7rem;
        transition: ease-in-out 0.25s;
    }

    &:active {
        background-color: ${color.grey.shade.darkest};
        transition: linear 0.05s;
    }
`;
