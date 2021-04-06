/* eslint-disable valid-jsdoc */
import styled from "styled-components";

import {
    color,
    transparency,
} from "./colors";

/**
 * Table Container Component to house the HTML table.
 *
 * - This allows us to have padding around the table even
 * when we use `border-collapse: collapse`.
 */
export const TableContainer = styled.div`
    margin: 1rem 8vw;
    padding: 2rem 3rem;
    background-color: ${color.white};
    box-shadow: 0 1rem 2rem 0 ${color.black + transparency.x30};
    border-radius: 0.4rem;
`;

/**
 * Table Component.
 *
 * - Reference for border-collapse: https://www.w3schools.com/cssref/pr_border-collapse.asp
 */
export const Table = styled.table`
    border-collapse: collapse; // Collapse the table borders into single border.
    text-align: center;
`;

/**
 * Table Header Component used to style the headers of the table.
 */
export const TableHeader = styled.th`
    text-transform: uppercase;
    font-size: 1.3rem;
    padding: 1rem;
    border-bottom: 0.05rem solid ${color.grey.shade.lightest};
`;

/**
 * Table Data Component for each data cell in the table.
 */
export const TableData = styled.td`
    margin: auto;
    padding: 1rem 3rem;
`;

/**
 * Table Row Component for each row of the table.
 */
export const TableRow = styled.tr`
    margin: auto 1rem;

    /** Put a separator between each row */
    &:not(:last-of-type) {
        border-bottom: 0.05rem solid ${color.grey.tint.light};
    }
`;

/**
 * Column Component to be used as a child of `colgroup`.
 *
 * - This allows us to set the width of each column in the table.
 *
 * @param {String} width the width of the column
 *
 * @example
 * // Two column table: set the first column to consume 70%
 * of the space, and the remaining 30% to the second column:
 * <table>
 *     <colgroup>
 *         <S.Column span="1" width="70%" />
 *         <S.Column span="1" width="30%" />
 *     </colgroup>
 * ...
 */
export const Column = styled.col`
    width: ${(props) => props.width};
`;

/**
 * Export Button Component to export the data as a CSV.
 */
export const ExportButton = styled.button`
    /** Keep the export button in the top left */
    position: absolute;
    top: 1rem;
    left: 3rem;
    display: block;
    text-transform: uppercase;
    white-space: nowrap;
    font-weight: 600;
    font-size: 1.2rem;
    color: ${color.white};
    background-color: ${color.blue.neutral};
    padding: 0.5rem 1.5rem;
    margin: 1rem auto;
    border-radius: 0.5rem;
    text-shadow: 0.03rem 0.03rem
    ${color.grey.shade.darkest + transparency.x25};
    transition: ease-in-out 0.25s;

    &:hover {
        background-color: ${color.blue.dark};
        border-radius: 0.7rem;
        transition: ease-in-out 0.25s;
    }

    &:active {
        background-color: ${color.blue.darker};
        transition: linear 0.05s;
    }
`;
