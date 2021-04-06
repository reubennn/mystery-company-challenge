/* eslint-disable valid-jsdoc */
import styled from "styled-components";

/**
 * Main page body component.
 */
export const MainPageBody = styled.main`
    text-align: left;
    width: 100%;
    min-height: 100vh;
    margin: 3rem auto;

    /* Ensures our content remains in a logical order */
    display: flex;
    flex-direction: column;

    /** Ensure content is centred vertically */
    align-items: center;
`;
