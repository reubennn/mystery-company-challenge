import React from "react";

import * as S from "../styles/styled-components/styled.main";

/** Temporarily use mock data to assist with styling and functionality */
import { MOCK_DATA } from "../data/MOCK_DATA";

/**
 * React Component which fetches data from the PostgreSQL database, and
 * displays it inside a table.
 *
 * - Table reference from: https://www.w3schools.com/html/html_tables.asp
 * - colgroup column width found from: https://stackoverflow.com/a/928859
 * - Date in ISO 8601 format: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 * @return {Component} the home page
 */
const ListingsTable = () => (
    <>
        <S.TableContainer>
            <S.ExportButton>Export</S.ExportButton>
            <S.Table>
                {/* Set the width for each column */}
                <colgroup>
                    <S.Column span="1" width="30%" />
                    <S.Column span="1" width="20%" />
                    <S.Column span="1" width="50%" />
                </colgroup>
                <thead>
                    <tr>
                        <S.TableHeader>Date / Time</S.TableHeader>
                        <S.TableHeader>Name</S.TableHeader>
                        <S.TableHeader>Message</S.TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_DATA.map((row) => (
                        <S.TableRow key={row.id}>
                            <S.TableData>{row.created}</S.TableData>
                            <S.TableData>{row.name}</S.TableData>
                            <S.TableData>{row.message}</S.TableData>
                        </S.TableRow>
                    ))}
                </tbody>
            </S.Table>
            <S.Button className="uppercase">Export</S.Button>
        </S.TableContainer>
    </>
);

export default ListingsTable;
