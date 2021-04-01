/* eslint-disable valid-jsdoc */
import styled from "styled-components";

/**
 * Main page body component.
 */
export const MainPageBody = styled.main`
    text-align: left;
    width: 100%;
    margin: 0;

    /* Ensures our content remains in a logical order */
    display: flex;
    flex-direction: column;

    /** Ensure content is centred horizontally and vertically */
    justify-content: center;
    align-items: center;
`;
