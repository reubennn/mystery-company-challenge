/* eslint-disable valid-jsdoc */
import styled from "styled-components";

import { color } from "./colors";

/** ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * ~~~~~~~~~~~ App Container ~~~~~~~~~~~
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

/**
 * Main container for the React Application.
 */
export const Container = styled.div`
    color: ${color.grey.shade.dark};
    margin: 0;

    /** Ensure all overflow is hidden */
    overflow: hidden;

    /** Ensure the App covers entire viewport */
    min-height: 100vh;
    width: 100%;

    /* Ensures our content remains in a logical order */
    display: flex;
    flex-direction: column;
`;
